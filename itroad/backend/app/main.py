import logging
import os
import time
from collections import defaultdict, deque

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from . import chat_service, models, sales_intelligence, schemas
from .auth import require_admin
from .database import Base, engine, get_db, run_sqlite_autopatch
from .models import now
from .ollama_client import ollama_health
from .scoring import HOT_LEAD_THRESHOLD, score_lead

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("itroad.main")

Base.metadata.create_all(bind=engine)
run_sqlite_autopatch(Base, engine)

app = FastAPI(title="ITROAD Group API", version="1.1.0")

_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
allowed_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", _default_origins).split(",") if o.strip()]

# Vite falls back to another port (5174, 5175, ...) whenever 5173 is already
# taken, silently, with no error. If that happened, requests would be blocked
# by CORS and fail with a generic "network error" in the browser - exactly
# the bug this regex fixes. Any localhost/127.0.0.1 port is allowed in
# addition to the explicit CORS_ORIGINS list above (which still governs any
# real/non-local deployment origin).
LOCAL_DEV_ORIGIN_REGEX = r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=LOCAL_DEV_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Event types that represent a full page view - kept as a set because the
# frontend historically used the bare "pageview" name (no underscore) and
# the upgraded tracker uses "page_view"; both are counted identically so no
# historical data collected before this upgrade is lost.
PAGE_VIEW_EVENT_TYPES = {"page_view", "pageview"}
CTA_EVENT_TYPES = {"cta_click"}
SERVICE_EVENT_TYPES = {"service_interaction", "service_click"}


def get_or_create_profile(db: Session, client_id: str) -> models.TrackingProfile:
    profile = db.get(models.TrackingProfile, client_id)
    if profile is None:
        profile = models.TrackingProfile(client_id=client_id)
        db.add(profile)
        db.flush()
    return profile


def merge_tracking_into_profile(profile: models.TrackingProfile, incoming: dict | None):
    incoming = incoming or {}

    pages = list(dict.fromkeys((profile.pages_visited or []) + (incoming.get("pagesVisited") or [])))
    sections = list(dict.fromkeys((profile.sections_visited or []) + (incoming.get("sectionsVisited") or [])))

    profile.pages_visited = pages
    profile.sections_visited = sections
    profile.max_scroll_depth = max(int(profile.max_scroll_depth or 0), int(incoming.get("maxScrollDepth", 0) or 0))
    profile.cta_clicks = int(profile.cta_clicks or 0) + int(incoming.get("ctaClicks", 0) or 0)
    profile.service_interactions = int(profile.service_interactions or 0) + int(incoming.get("serviceInteractions", 0) or 0)
    profile.total_time_spent_ms = int(profile.total_time_spent_ms or 0) + int(incoming.get("totalTimeSpentMs", 0) or 0)
    profile.last_path = incoming.get("lastPath") or profile.last_path or "/"
    return profile


def apply_device_info(profile: models.TrackingProfile, device: schemas.DeviceInfo | None):
    """Non-sensitive technical info only; last-known values are kept."""
    if not device:
        return
    if device.browser:
        profile.browser = device.browser
    if device.os:
        profile.os = device.os
    if device.deviceType:
        profile.device_type = device.deviceType
    if device.screenSize:
        profile.screen_size = device.screenSize
    if device.language:
        profile.language = device.language


def touch_profile_visit(profile: models.TrackingProfile, brand: str | None, referrer: str | None = None):
    """Update visitor-level lifecycle fields shared by session/event ingestion."""
    moment = now()
    if profile.first_seen_at is None:
        profile.first_seen_at = moment
        if referrer:
            profile.first_referrer = referrer
    profile.last_seen_at = moment
    if brand:
        brands = list(profile.brands or [])
        if brand not in brands:
            brands.append(brand)
        profile.brands = brands


def _ingest_event(db: Session, payload: schemas.TrackingEventIn) -> models.TrackingEvent:
    """Shared logic for single and batched tracking-event ingestion."""
    profile = get_or_create_profile(db, payload.clientId)
    merge_tracking_into_profile(profile, payload.tracking)
    apply_device_info(profile, payload.device)
    touch_profile_visit(profile, payload.brand)

    event = models.TrackingEvent(
        client_id=payload.clientId,
        session_id=payload.sessionId,
        brand=payload.brand,
        event_type=payload.eventType,
        path=payload.path,
        page_title=payload.pageTitle,
        referrer=payload.referrer,
        section=payload.section,
        depth=payload.depth,
        meta=payload.meta,
        time_spent_ms=payload.timeSpentMs,
        client_timestamp=payload.timestamp,
    )
    db.add(event)

    if payload.sessionId:
        session = db.get(models.VisitorSession, payload.sessionId)
        if session is not None:
            session.last_activity_at = now()
            if payload.eventType in PAGE_VIEW_EVENT_TYPES:
                session.pages_viewed = (session.pages_viewed or 0) + 1
            if payload.path:
                session.exit_path = payload.path

    return event


# ---------------------------------------------------------------------------
# Chat rate limiting (TASK §17 - protect against malformed/abusive request
# bursts without needing external infra; in-memory is fine for a
# single-process prototype deployment)
# ---------------------------------------------------------------------------

CHAT_RATE_LIMIT_MESSAGES = 20
CHAT_RATE_LIMIT_WINDOW_SECONDS = 300
_chat_rate_state: dict[str, deque] = defaultdict(deque)


def _check_chat_rate_limit(session_id: str):
    window = _chat_rate_state[session_id]
    now_ts = time.monotonic()
    while window and now_ts - window[0] > CHAT_RATE_LIMIT_WINDOW_SECONDS:
        window.popleft()
    if len(window) >= CHAT_RATE_LIMIT_MESSAGES:
        raise HTTPException(status_code=429, detail="Too many chat messages, please slow down.")
    window.append(now_ts)


# ---------------------------------------------------------------------------
# Public endpoints
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/session/start")
def start_session(payload: schemas.SessionStartIn, db: Session = Depends(get_db)):
    """Called once per browsing session, immediately on page load.

    Increments the visitor's session_count and reports back whether this is
    a returning visitor, before the visitor has identified themselves in any
    way.
    """
    profile = get_or_create_profile(db, payload.clientId)
    is_returning = (profile.session_count or 0) > 0

    apply_device_info(profile, payload.device)
    touch_profile_visit(profile, payload.brand, referrer=payload.referrer)
    profile.session_count = (profile.session_count or 0) + 1

    existing = db.get(models.VisitorSession, payload.sessionId)
    if existing is None:
        session = models.VisitorSession(
            session_id=payload.sessionId,
            client_id=payload.clientId,
            brand=payload.brand,
            entry_path=payload.entryPath,
            exit_path=payload.entryPath,
            referrer=payload.referrer,
            is_returning=is_returning,
            browser=payload.device.browser if payload.device else None,
            os=payload.device.os if payload.device else None,
            device_type=payload.device.deviceType if payload.device else None,
            screen_size=payload.device.screenSize if payload.device else None,
            language=payload.device.language if payload.device else None,
        )
        db.add(session)

    db.commit()
    return {
        "ok": True,
        "isReturningVisitor": is_returning,
        "sessionCount": profile.session_count,
    }


@app.post("/api/session/heartbeat")
def session_heartbeat(payload: schemas.SessionHeartbeatIn, db: Session = Depends(get_db)):
    session = db.get(models.VisitorSession, payload.sessionId)
    if session is not None:
        session.last_activity_at = now()
        if payload.durationMs is not None:
            session.duration_ms = payload.durationMs
        if payload.path:
            session.exit_path = payload.path
    profile = db.get(models.TrackingProfile, payload.clientId)
    if profile is not None:
        profile.last_seen_at = now()
    db.commit()
    return {"ok": True}


@app.post("/api/session/end")
def end_session(payload: schemas.SessionEndIn, db: Session = Depends(get_db)):
    session = db.get(models.VisitorSession, payload.sessionId)
    if session is not None:
        session.ended_at = now()
        if payload.durationMs is not None:
            session.duration_ms = payload.durationMs
        if payload.exitPath:
            session.exit_path = payload.exitPath
    profile = db.get(models.TrackingProfile, payload.clientId)
    if profile is not None:
        profile.last_seen_at = now()
    db.commit()
    return {"ok": True}


@app.post("/api/track-event")
def track_event(payload: schemas.TrackingEventIn, db: Session = Depends(get_db)):
    _ingest_event(db, payload)
    db.commit()
    return {"ok": True}


@app.post("/api/track-events/batch")
def track_events_batch(payload: schemas.BatchTrackingEventsIn, db: Session = Depends(get_db)):
    """Batched ingestion so the frontend can queue several interactions
    (scrolls, section views, clicks...) and flush them together every few
    seconds instead of firing one HTTP request per interaction."""
    for event_payload in payload.events:
        _ingest_event(db, event_payload)
    db.commit()
    return {"ok": True, "count": len(payload.events)}


@app.post("/api/leads")
def create_lead(payload: schemas.LeadIn, db: Session = Depends(get_db)):
    client_id = payload.clientId or f"ITROAD-{os.urandom(3).hex().upper()}"
    profile = get_or_create_profile(db, client_id)
    merge_tracking_into_profile(profile, payload.tracking)
    touch_profile_visit(profile, payload.brand)
    profile.is_converted = True
    db.flush()

    tracking_dict = profile.as_dict()

    # If this visitor had a chatbot conversation before submitting the form,
    # fold that AI qualification signal into the score as one additional
    # input - the existing challenge/size/completeness/behavior scoring
    # below is untouched (TASK §11).
    chat_qualification = db.get(models.ChatQualification, client_id) if client_id else None
    ai_qualification_dict = (
        {
            "challenge": chat_qualification.challenge,
            "service_interest": chat_qualification.service_interest,
            "timeline": chat_qualification.timeline,
            "decision_maker": chat_qualification.decision_maker,
            "purchase_intent": chat_qualification.purchase_intent,
            "contact_intent": chat_qualification.contact_intent,
        }
        if chat_qualification
        else None
    )

    result = score_lead(
        challenge=payload.challenge,
        company_size=payload.size,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        tracking=tracking_dict,
        ai_qualification=ai_qualification_dict,
    )

    lead = models.Lead(
        client_id=client_id,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        challenge=payload.challengeLabel or payload.challenge,
        challenge_key=payload.challenge,
        company_size=payload.size,
        source=payload.source,
        brand=payload.brand,
        score=result["score"],
        level=result["level"],
        challenge_score=result["challengeScore"],
        size_score=result["sizeScore"],
        completeness_score=result["completenessScore"],
        behavior_score=result["behaviorScore"],
        tracking_score=result["trackingScore"],
        ai_score=result["aiScore"],
        ai_score_breakdown=result["aiScoreBreakdown"],
        ai_summary=chat_qualification.summary if chat_qualification else None,
        status="new",
        tracking_snapshot=tracking_dict,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    logger.info(
        "[LEAD] lead_id=%s client_id=%s final score=%d (challenge=%d size=%d completeness=%d behavior=%d ai=%d) level=%s hot=%s",
        lead.id, client_id, lead.score, result["challengeScore"], result["sizeScore"],
        result["completenessScore"], result["behaviorScore"], result["aiScore"], lead.level, result["hot"],
    )

    return {
        "ok": True,
        "clientId": client_id,
        "score": lead.score,
        "level": lead.level,
        "hot": result["hot"],
        "recommendation": result["recommendation"],
        "challengeScore": lead.challenge_score,
        "sizeScore": lead.size_score,
        "completenessScore": lead.completeness_score,
        "behaviorScore": lead.behavior_score,
        "aiScore": lead.ai_score,
    }


@app.post("/api/newsletter")
def subscribe_newsletter(payload: schemas.NewsletterIn, db: Session = Depends(get_db)):
    existing = db.query(models.NewsletterSubscriber).filter_by(email=payload.email).first()
    if existing:
        return {"ok": True, "alreadySubscribed": True}

    subscriber = models.NewsletterSubscriber(email=payload.email, client_id=payload.clientId)
    db.add(subscriber)

    if payload.clientId:
        profile = get_or_create_profile(db, payload.clientId)
        profile.is_converted = True

    db.commit()
    return {"ok": True, "alreadySubscribed": False}


# ---------------------------------------------------------------------------
# AI chatbot endpoints (Ollama-backed, see ollama_client.py / chat_service.py)
# ---------------------------------------------------------------------------

@app.get("/api/chat/status")
async def chat_status():
    """AI system health for the widget and for troubleshooting (TASK §22).
    Never exposes secrets - only model names (not sensitive) and timing."""
    from .rag.retrieve import index_chunk_count

    health = await ollama_health()
    return {
        "available": health["online"] and health["chatModelAvailable"],
        "ollamaOnline": health["online"],
        "chatModelAvailable": health["chatModelAvailable"],
        "embeddingModelAvailable": health["embeddingModelAvailable"],
        "chatModel": health["chatModel"],
        "embeddingModel": health["embeddingModel"],
        "responseTimeMs": health["responseTimeMs"],
        "ragChunkCount": index_chunk_count(),
        "lastErrorAt": health["last_error_at"],
        "lastError": health["last_error"],
        "lastSuccessAt": health["last_success_at"],
    }


@app.post("/api/chat/message", response_model=schemas.ChatMessageOut)
async def chat_message(
    payload: schemas.ChatMessageIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    _check_chat_rate_limit(payload.sessionId)

    # The chatbot is another source of behavioural information about the
    # same anonymous visitor (TASK §7/§10/§11) - reuse the existing
    # profile/visit bookkeeping instead of a separate tracking system.
    profile = get_or_create_profile(db, payload.clientId)
    touch_profile_visit(profile, payload.brand)
    db.commit()  # short transaction - released before any Ollama call (TASK §15)

    # Fast path: exactly one Ollama call, the visitor-facing reply. Never
    # waits on qualification extraction (TASK §13).
    result = await chat_service.handle_chat_message(
        db,
        client_id=payload.clientId,
        session_id=payload.sessionId,
        brand=payload.brand,
        lang=payload.lang,
        message=payload.message,
    )

    # AI qualification runs after the response is already on its way to the
    # visitor, using its own short-lived DB session (never the request's
    # `db`, which may be closed by the time this runs) - TASK §14.
    background_tasks.add_task(
        chat_service.run_background_qualification, payload.clientId, payload.sessionId
    )

    return result


# ---------------------------------------------------------------------------
# Admin endpoints (require X-Admin-Token header, see app/auth.py)
# ---------------------------------------------------------------------------

@app.get("/api/admin/leads", dependencies=[Depends(require_admin)])
def list_leads(
    status: str | None = None,
    brand: str | None = None,
    sort: str | None = None,
    db: Session = Depends(get_db),
):
    from .scoring import classify_lead

    query = db.query(models.Lead)
    if status:
        query = query.filter(models.Lead.status == status)
    if brand:
        query = query.filter(models.Lead.brand == brand)
    leads = query.order_by(models.Lead.score.desc(), models.Lead.created_at.desc()).all()

    if sort == "priority":
        # Part 11 - Lead Priority Queue. Composite ranking (score, purchase
        # intent, timeline urgency, decision maker, contact intent,
        # confidence) rather than score alone - see sales_intelligence.py.
        client_ids = [lead.client_id for lead in leads if lead.client_id]
        qualifications = {
            q.client_id: q
            for q in db.query(models.ChatQualification).filter(models.ChatQualification.client_id.in_(client_ids)).all()
        } if client_ids else {}
        leads = sorted(
            leads,
            key=lambda lead: sales_intelligence.compute_priority(lead, qualifications.get(lead.client_id)),
            reverse=True,
        )
        result = []
        for rank, lead in enumerate(leads, start=1):
            result.append({**lead.as_dict(), **classify_lead(lead.score), "priorityRank": rank})
        return {"count": len(leads), "leads": result}

    return {
        "count": len(leads),
        "leads": [{**lead.as_dict(), **classify_lead(lead.score)} for lead in leads],
    }


@app.get("/api/admin/leads/{lead_id}", dependencies=[Depends(require_admin)])
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    from .scoring import classify_lead

    lead = db.get(models.Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    events = (
        db.query(models.TrackingEvent)
        .filter(models.TrackingEvent.client_id == lead.client_id)
        .order_by(models.TrackingEvent.created_at.desc())
        .limit(200)
        .all()
    )
    profile = db.get(models.TrackingProfile, lead.client_id) if lead.client_id else None
    sessions = (
        db.query(models.VisitorSession)
        .filter(models.VisitorSession.client_id == lead.client_id)
        .order_by(models.VisitorSession.started_at.asc())
        .all()
        if lead.client_id
        else []
    )

    ai_qualification = db.get(models.ChatQualification, lead.client_id) if lead.client_id else None
    chat_messages = []
    if ai_qualification and ai_qualification.session_id:
        chat_messages = (
            db.query(models.ChatMessage)
            .filter(models.ChatMessage.session_id == ai_qualification.session_id)
            .order_by(models.ChatMessage.created_at.asc())
            .all()
        )

    user_messages = [m.content for m in chat_messages if m.role == "user"]
    sales_intel = sales_intelligence.build_full_sales_intelligence(
        lead, ai_qualification, user_messages, events, chat_messages
    )

    return {
        "lead": {**lead.as_dict(), **classify_lead(lead.score)},
        "profile": profile.as_dict() if profile else None,
        "sessions": [s.as_dict() for s in sessions],
        "aiQualification": ai_qualification.as_dict() if ai_qualification else None,
        "chatMessages": [m.as_dict() for m in chat_messages],
        "salesIntelligence": sales_intel,
        # Oldest first, so the admin UI can render it as a chronological
        # "visitor journey" leading up to and including lead creation.
        "events": [
            {
                "eventType": e.event_type,
                "path": e.path,
                "pageTitle": e.page_title,
                "section": e.section,
                "depth": e.depth,
                "meta": e.meta,
                "brand": e.brand,
                "sessionId": e.session_id,
                "timeSpentMs": e.time_spent_ms,
                "createdAt": e.created_at.isoformat() if e.created_at else None,
            }
            for e in reversed(events)
        ],
    }


@app.patch("/api/admin/leads/{lead_id}", dependencies=[Depends(require_admin)])
def update_lead(lead_id: int, payload: schemas.LeadStatusUpdate, db: Session = Depends(get_db)):
    lead = db.get(models.Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if payload.status is not None:
        lead.status = payload.status
    if payload.notes is not None:
        lead.notes = payload.notes

    db.commit()
    db.refresh(lead)
    return {"ok": True, "lead": lead.as_dict()}


@app.get("/api/admin/tracking-events", dependencies=[Depends(require_admin)])
def list_tracking_events(client_id: str | None = None, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.TrackingEvent)
    if client_id:
        query = query.filter(models.TrackingEvent.client_id == client_id)
    events = query.order_by(models.TrackingEvent.created_at.desc()).limit(min(max(limit, 1), 500)).all()
    return {
        "count": len(events),
        "events": [
            {
                "clientId": e.client_id,
                "eventType": e.event_type,
                "path": e.path,
                "section": e.section,
                "depth": e.depth,
                "meta": e.meta,
                "brand": e.brand,
                "createdAt": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
    }


@app.get("/api/admin/stats", dependencies=[Depends(require_admin)])
def admin_stats(db: Session = Depends(get_db)):
    total_leads = db.query(func.count(models.Lead.id)).scalar()
    high_intent = db.query(func.count(models.Lead.id)).filter(models.Lead.level == "High Intent").scalar()
    total_events = db.query(func.count(models.TrackingEvent.id)).scalar()
    total_subscribers = db.query(func.count(models.NewsletterSubscriber.id)).scalar()
    by_status = dict(
        db.query(models.Lead.status, func.count(models.Lead.id)).group_by(models.Lead.status).all()
    )
    by_brand = dict(
        db.query(models.Lead.brand, func.count(models.Lead.id)).group_by(models.Lead.brand).all()
    )

    # --- AI Lead Intelligence analytics (TASK §27) - additive, reuses the
    # same Lead/ChatQualification/ChatSession tables, no separate system. ---
    ai_qualified_leads = (
        db.query(func.count(models.Lead.id)).filter(models.Lead.ai_score > 0).scalar() or 0
    )
    hot_leads = (
        db.query(func.count(models.Lead.id)).filter(models.Lead.score >= HOT_LEAD_THRESHOLD).scalar() or 0
    )
    chat_conversations = db.query(func.count(models.ChatSession.session_id)).scalar() or 0
    contact_requests = (
        db.query(func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.contact_intent.is_(True))
        .scalar()
        or 0
    )
    avg_ai_score = db.query(func.avg(models.Lead.ai_score)).filter(models.Lead.ai_score > 0).scalar()
    avg_final_score = db.query(func.avg(models.Lead.score)).scalar()
    avg_conversation_length = db.query(func.avg(models.ChatSession.message_count)).scalar()
    most_requested_services = dict(
        db.query(models.Lead.challenge_key, func.count(models.Lead.id))
        .filter(models.Lead.challenge_key.isnot(None))
        .group_by(models.Lead.challenge_key)
        .order_by(func.count(models.Lead.id).desc())
        .all()
    )
    most_common_industries = dict(
        db.query(models.ChatQualification.industry, func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.industry.isnot(None))
        .group_by(models.ChatQualification.industry)
        .order_by(func.count(models.ChatQualification.client_id).desc())
        .all()
    )
    qualification_rate = (
        round((ai_qualified_leads / total_leads) * 100, 1) if total_leads else 0.0
    )

    # --- Part 9 remainder: full lead-level breakdown + confidence/signals ---
    medium_intent = db.query(func.count(models.Lead.id)).filter(models.Lead.level == "Medium Intent").scalar() or 0
    low_intent = db.query(func.count(models.Lead.id)).filter(models.Lead.level == "Low Intent").scalar() or 0
    avg_confidence = db.query(func.avg(models.ChatQualification.qualification_confidence)).scalar()
    most_common_challenges = dict(
        db.query(models.ChatQualification.challenge, func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.challenge.isnot(None))
        .group_by(models.ChatQualification.challenge)
        .order_by(func.count(models.ChatQualification.client_id).desc())
        .limit(10)
        .all()
    )
    # Buying signals reuse the exact same rules as sales_intelligence's
    # per-lead conversation insights (Part 6), aggregated with cheap counts
    # instead of re-deriving a separate definition.
    most_common_buying_signals = {
        "Requested consultant": db.query(func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.contact_intent.is_(True)).scalar() or 0,
        "Clear timeline": db.query(func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.timeline.isnot(None)).scalar() or 0,
        "Decision maker engaged": db.query(func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.decision_maker.is_(True)).scalar() or 0,
        "High purchase intent": db.query(func.count(models.ChatQualification.client_id))
        .filter(models.ChatQualification.purchase_intent == "high").scalar() or 0,
    }

    # --- Part 10: trend detection, current vs previous calendar month.
    # Guarded: with too few leads in either period a % change is noise, not
    # a trend - report insufficientData instead of a fabricated number
    # (TASK Part 10 "Do NOT invent numbers").
    from datetime import datetime, timedelta, timezone

    today = datetime.now(timezone.utc)
    this_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    prev_month_end = this_month_start
    prev_month_start = (this_month_start - timedelta(days=1)).replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )

    leads_this_month = db.query(func.count(models.Lead.id)).filter(models.Lead.created_at >= this_month_start).scalar() or 0
    leads_prev_month = (
        db.query(func.count(models.Lead.id))
        .filter(models.Lead.created_at >= prev_month_start, models.Lead.created_at < prev_month_end)
        .scalar()
        or 0
    )
    avg_score_this_month = db.query(func.avg(models.Lead.score)).filter(models.Lead.created_at >= this_month_start).scalar()
    avg_score_prev_month = (
        db.query(func.avg(models.Lead.score))
        .filter(models.Lead.created_at >= prev_month_start, models.Lead.created_at < prev_month_end)
        .scalar()
    )
    top_service_this_month = (
        db.query(models.Lead.challenge_key, func.count(models.Lead.id))
        .filter(models.Lead.created_at >= this_month_start, models.Lead.challenge_key.isnot(None))
        .group_by(models.Lead.challenge_key)
        .order_by(func.count(models.Lead.id).desc())
        .first()
    )

    MIN_SAMPLE_FOR_TREND = 3
    trends_insufficient = leads_this_month < MIN_SAMPLE_FOR_TREND or leads_prev_month < MIN_SAMPLE_FOR_TREND
    trends = {
        "insufficientData": trends_insufficient,
        "leadsThisMonth": leads_this_month,
        "leadsPrevMonth": leads_prev_month,
        "leadsChangePct": (
            round(((leads_this_month - leads_prev_month) / leads_prev_month) * 100, 1)
            if not trends_insufficient and leads_prev_month
            else None
        ),
        "avgScoreThisMonth": round(avg_score_this_month, 1) if avg_score_this_month else None,
        "avgScorePrevMonth": round(avg_score_prev_month, 1) if avg_score_prev_month else None,
        "topServiceThisMonth": (
            sales_intelligence.SERVICE_LABELS.get(top_service_this_month[0]) if top_service_this_month else None
        ),
    }

    return {
        "totalLeads": total_leads or 0,
        "highIntentLeads": high_intent or 0,
        "mediumIntentLeads": medium_intent,
        "lowIntentLeads": low_intent,
        "totalTrackingEvents": total_events or 0,
        "newsletterSubscribers": total_subscribers or 0,
        "leadsByStatus": by_status,
        "leadsByBrand": {(k or "itroad-group"): v for k, v in by_brand.items()},
        "aiQualifiedLeads": ai_qualified_leads,
        "hotLeads": hot_leads,
        "chatConversations": chat_conversations,
        "contactRequests": contact_requests,
        "avgAiScore": round(avg_ai_score, 1) if avg_ai_score else 0,
        "avgFinalScore": round(avg_final_score, 1) if avg_final_score else 0,
        "avgConversationLength": round(avg_conversation_length, 1) if avg_conversation_length else 0,
        "avgQualificationConfidence": round(avg_confidence, 1) if avg_confidence else 0,
        "mostRequestedServices": most_requested_services,
        "mostCommonIndustries": most_common_industries,
        "mostCommonChallenges": most_common_challenges,
        "mostCommonBuyingSignals": most_common_buying_signals,
        "chatbotQualificationRate": qualification_rate,
        "trends": trends,
    }


@app.get("/api/admin/visitor-analytics", dependencies=[Depends(require_admin)])
def visitor_analytics(db: Session = Depends(get_db)):
    """Powers the Admin Dashboard's 'Visitor Analytics' section: anonymous
    visitor volume, engagement and conversion metrics, aggregated across
    every brand/site."""

    total_visitors = db.query(func.count(models.TrackingProfile.client_id)).scalar() or 0
    converted_visitors = (
        db.query(func.count(models.TrackingProfile.client_id))
        .filter(models.TrackingProfile.is_converted.is_(True))
        .scalar()
        or 0
    )
    returning_visitors = (
        db.query(func.count(models.TrackingProfile.client_id))
        .filter(models.TrackingProfile.session_count > 1)
        .scalar()
        or 0
    )
    anonymous_visitors = max(total_visitors - converted_visitors, 0)
    conversion_rate = round((converted_visitors / total_visitors) * 100, 1) if total_visitors else 0.0

    avg_session_duration_ms = (
        db.query(func.avg(models.VisitorSession.duration_ms))
        .filter(models.VisitorSession.duration_ms > 0)
        .scalar()
        or 0
    )

    avg_scroll_depth = db.query(func.avg(models.TrackingProfile.max_scroll_depth)).scalar() or 0

    most_visited_pages = (
        db.query(models.TrackingEvent.path, func.count(models.TrackingEvent.id).label("c"))
        .filter(models.TrackingEvent.event_type.in_(PAGE_VIEW_EVENT_TYPES))
        .filter(models.TrackingEvent.path.isnot(None))
        .group_by(models.TrackingEvent.path)
        .order_by(func.count(models.TrackingEvent.id).desc())
        .limit(10)
        .all()
    )

    most_viewed_services = (
        db.query(models.TrackingEvent.meta, func.count(models.TrackingEvent.id).label("c"))
        .filter(models.TrackingEvent.event_type.in_(SERVICE_EVENT_TYPES))
        .filter(models.TrackingEvent.meta.isnot(None))
        .group_by(models.TrackingEvent.meta)
        .order_by(func.count(models.TrackingEvent.id).desc())
        .limit(10)
        .all()
    )

    most_clicked_ctas = (
        db.query(models.TrackingEvent.meta, func.count(models.TrackingEvent.id).label("c"))
        .filter(models.TrackingEvent.event_type.in_(CTA_EVENT_TYPES))
        .filter(models.TrackingEvent.meta.isnot(None))
        .group_by(models.TrackingEvent.meta)
        .order_by(func.count(models.TrackingEvent.id).desc())
        .limit(10)
        .all()
    )

    acquisition_rows = (
        db.query(models.TrackingProfile.first_referrer, func.count(models.TrackingProfile.client_id).label("c"))
        .group_by(models.TrackingProfile.first_referrer)
        .order_by(func.count(models.TrackingProfile.client_id).desc())
        .limit(10)
        .all()
    )
    top_acquisition_sources = [
        {"source": (ref or "Direct"), "count": count} for ref, count in acquisition_rows
    ]

    recent_sessions = (
        db.query(models.VisitorSession)
        .order_by(models.VisitorSession.started_at.desc())
        .limit(25)
        .all()
    )

    return {
        "totalVisitors": total_visitors,
        "anonymousVisitors": anonymous_visitors,
        "returningVisitors": returning_visitors,
        "convertedVisitors": converted_visitors,
        "conversionRate": conversion_rate,
        "avgSessionDurationMs": int(avg_session_duration_ms),
        "avgScrollDepth": round(avg_scroll_depth, 1),
        "mostVisitedPages": [{"path": p, "count": c} for p, c in most_visited_pages],
        "mostViewedServices": [{"service": s, "count": c} for s, c in most_viewed_services],
        "mostClickedCtas": [{"cta": cta, "count": c} for cta, c in most_clicked_ctas],
        "topAcquisitionSources": top_acquisition_sources,
        "visitorTimeline": [s.as_dict() for s in recent_sessions],
    }
