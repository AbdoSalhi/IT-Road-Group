import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship

from .database import Base


def now():
    return datetime.datetime.utcnow()


class TrackingProfile(Base):
    """Aggregated behavioural profile for one anonymous visitor (visitor_id).

    `client_id` is the persistent, cross-session **visitor_id** generated on
    the frontend (localStorage-backed). It stays stable across many browsing
    sessions until the visitor clears their browser storage - each of those
    sessions is a separate `VisitorSession` row linked to this profile.
    """

    __tablename__ = "tracking_profiles"

    client_id = Column(String, primary_key=True, index=True)
    pages_visited = Column(JSON, default=list)
    sections_visited = Column(JSON, default=list)
    max_scroll_depth = Column(Integer, default=0)
    cta_clicks = Column(Integer, default=0)
    service_interactions = Column(Integer, default=0)
    total_time_spent_ms = Column(Integer, default=0)
    last_path = Column(String, default="/")

    # --- Visitor-level identity & lifecycle (anonymous analytics) ---
    first_seen_at = Column(DateTime, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)
    session_count = Column(Integer, default=0)
    is_converted = Column(Boolean, default=False, index=True)
    first_referrer = Column(String, nullable=True)
    brands = Column(JSON, default=list)  # every brand/subsidiary site this visitor has touched

    # --- Non-sensitive device/technical info (last known) ---
    browser = Column(String, nullable=True)
    os = Column(String, nullable=True)
    device_type = Column(String, nullable=True)
    screen_size = Column(String, nullable=True)
    language = Column(String, nullable=True)

    created_at = Column(DateTime, default=now)
    updated_at = Column(DateTime, default=now, onupdate=now)

    events = relationship("TrackingEvent", back_populates="profile", cascade="all, delete-orphan")
    sessions = relationship("VisitorSession", back_populates="profile", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="tracking_profile")

    def as_dict(self):
        return {
            "clientId": self.client_id,
            "visitorId": self.client_id,
            "pagesVisited": self.pages_visited or [],
            "sectionsVisited": self.sections_visited or [],
            "maxScrollDepth": self.max_scroll_depth or 0,
            "ctaClicks": self.cta_clicks or 0,
            "serviceInteractions": self.service_interactions or 0,
            "totalTimeSpentMs": self.total_time_spent_ms or 0,
            "lastPath": self.last_path or "/",
            "firstSeenAt": self.first_seen_at.isoformat() if self.first_seen_at else None,
            "lastSeenAt": self.last_seen_at.isoformat() if self.last_seen_at else None,
            "sessionCount": self.session_count or 0,
            "isConverted": bool(self.is_converted),
            "firstReferrer": self.first_referrer,
            "brands": self.brands or [],
            "browser": self.browser,
            "os": self.os,
            "deviceType": self.device_type,
            "screenSize": self.screen_size,
            "language": self.language,
        }


class VisitorSession(Base):
    """One browsing session for an anonymous (or since-identified) visitor.

    A returning visitor keeps the same `client_id` (visitor_id) across many
    of these rows, each with its own `session_id`.
    """

    __tablename__ = "visitor_sessions"

    session_id = Column(String, primary_key=True, index=True)
    client_id = Column(String, ForeignKey("tracking_profiles.client_id"), index=True)
    brand = Column(String, nullable=True, index=True)

    entry_path = Column(String, nullable=True)
    exit_path = Column(String, nullable=True)
    referrer = Column(String, nullable=True)
    pages_viewed = Column(Integer, default=0)
    is_returning = Column(Boolean, default=False)

    browser = Column(String, nullable=True)
    os = Column(String, nullable=True)
    device_type = Column(String, nullable=True)
    screen_size = Column(String, nullable=True)
    language = Column(String, nullable=True)

    started_at = Column(DateTime, default=now, index=True)
    last_activity_at = Column(DateTime, default=now)
    ended_at = Column(DateTime, nullable=True)
    duration_ms = Column(Integer, default=0)

    profile = relationship("TrackingProfile", back_populates="sessions")

    def as_dict(self):
        return {
            "sessionId": self.session_id,
            "visitorId": self.client_id,
            "brand": self.brand,
            "entryPath": self.entry_path,
            "exitPath": self.exit_path,
            "referrer": self.referrer,
            "pagesViewed": self.pages_viewed or 0,
            "isReturning": bool(self.is_returning),
            "browser": self.browser,
            "os": self.os,
            "deviceType": self.device_type,
            "screenSize": self.screen_size,
            "language": self.language,
            "startedAt": self.started_at.isoformat() if self.started_at else None,
            "lastActivityAt": self.last_activity_at.isoformat() if self.last_activity_at else None,
            "endedAt": self.ended_at.isoformat() if self.ended_at else None,
            "durationMs": self.duration_ms or 0,
        }


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, ForeignKey("tracking_profiles.client_id"), index=True)
    session_id = Column(String, nullable=True, index=True)
    brand = Column(String, nullable=True, index=True)
    event_type = Column(String, index=True)
    path = Column(String, nullable=True)
    page_title = Column(String, nullable=True)
    referrer = Column(String, nullable=True)
    section = Column(String, nullable=True)
    depth = Column(Integer, nullable=True)
    meta = Column(String, nullable=True)
    time_spent_ms = Column(Integer, nullable=True)
    client_timestamp = Column(String, nullable=True)
    created_at = Column(DateTime, default=now, index=True)

    profile = relationship("TrackingProfile", back_populates="events")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, ForeignKey("tracking_profiles.client_id"), nullable=True, index=True)
    name = Column(String)
    email = Column(String, index=True)
    phone = Column(String)
    challenge = Column(String)
    challenge_key = Column(String, nullable=True)
    company_size = Column(String)
    source = Column(String, default="contact_form")
    brand = Column(String, nullable=True, index=True)  # subsidiary id, e.g. "btech", "smartway" - null for the main ITROAD Group site
    score = Column(Integer, default=0)
    level = Column(String, default="Low Intent")
    challenge_score = Column(Integer, default=0)
    size_score = Column(Integer, default=0)
    completeness_score = Column(Integer, default=0)
    behavior_score = Column(Integer, default=0)
    # Legacy column name for behavior_score, kept so any existing rows /
    # readers that still refer to "tracking_score" keep working.
    tracking_score = Column(Integer, default=0)
    # --- AI chat qualification signal (additive - does not replace the
    # scoring above, see app/scoring.py score_ai_qualification()) ---
    ai_score = Column(Integer, nullable=True)
    ai_score_breakdown = Column(JSON, nullable=True)
    ai_summary = Column(Text, nullable=True)
    status = Column(String, default="new", index=True)  # new, contacted, qualified, won, lost
    notes = Column(Text, default="")
    tracking_snapshot = Column(JSON, default=dict)
    created_at = Column(DateTime, default=now, index=True)
    updated_at = Column(DateTime, default=now, onupdate=now)

    tracking_profile = relationship("TrackingProfile", back_populates="leads")

    def as_dict(self):
        return {
            "id": self.id,
            "clientId": self.client_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "challenge": self.challenge,
            "challengeKey": self.challenge_key,
            "companySize": self.company_size,
            "source": self.source,
            "brand": self.brand,
            "score": self.score,
            "level": self.level,
            "challengeScore": self.challenge_score,
            "sizeScore": self.size_score,
            "completenessScore": self.completeness_score,
            "behaviorScore": self.behavior_score,
            "trackingScore": self.tracking_score,
            "aiScore": self.ai_score,
            "aiScoreBreakdown": self.ai_score_breakdown,
            "aiSummary": self.ai_summary,
            "status": self.status,
            "notes": self.notes,
            "trackingSnapshot": self.tracking_snapshot or {},
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    client_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=now)


class ChatSession(Base):
    """One chatbot conversation. Reuses the visitor's existing `client_id`
    (TASK §7) so chat activity joins the same anonymous tracking profile as
    every other behavioural signal, instead of a separate identity system."""

    __tablename__ = "chat_sessions"

    session_id = Column(String, primary_key=True, index=True)
    client_id = Column(String, ForeignKey("tracking_profiles.client_id"), index=True)
    brand = Column(String, nullable=True, index=True)
    lang = Column(String, nullable=True)
    started_at = Column(DateTime, default=now, index=True)
    last_message_at = Column(DateTime, default=now)
    ended_at = Column(DateTime, nullable=True)
    message_count = Column(Integer, default=0)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

    def as_dict(self):
        return {
            "sessionId": self.session_id,
            "clientId": self.client_id,
            "brand": self.brand,
            "lang": self.lang,
            "startedAt": self.started_at.isoformat() if self.started_at else None,
            "lastMessageAt": self.last_message_at.isoformat() if self.last_message_at else None,
            "endedAt": self.ended_at.isoformat() if self.ended_at else None,
            "messageCount": self.message_count or 0,
        }


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.session_id"), index=True)
    role = Column(String)  # "user" | "assistant"
    content = Column(Text)
    created_at = Column(DateTime, default=now, index=True)

    session = relationship("ChatSession", back_populates="messages")

    def as_dict(self):
        return {
            "role": self.role,
            "content": self.content,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class ChatQualification(Base):
    """Structured lead-qualification data extracted from a chat conversation
    by Ollama (TASK §10/§11). One row per client_id - re-extracted and
    overwritten as the conversation progresses, so it always reflects the
    visitor's latest, fullest known qualification state."""

    __tablename__ = "chat_qualifications"

    client_id = Column(String, ForeignKey("tracking_profiles.client_id"), primary_key=True)
    session_id = Column(String, nullable=True, index=True)
    challenge = Column(Text, nullable=True)
    service_interest = Column(String, nullable=True)  # one of scoring.CHALLENGE_WEIGHTS keys, or null
    industry = Column(String, nullable=True)
    company_size = Column(String, nullable=True)
    timeline = Column(String, nullable=True)
    budget_signal = Column(String, nullable=True)
    decision_maker = Column(Boolean, default=False)
    contact_role = Column(String, nullable=True)  # e.g. "IT Manager" - only if the visitor stated it
    purchase_intent = Column(String, nullable=True)
    contact_intent = Column(Boolean, default=False)
    qualification_confidence = Column(Integer, default=0)  # 0-100
    summary = Column(Text, nullable=True)
    ai_score = Column(Integer, default=0)
    ai_score_breakdown = Column(JSON, default=list)
    updated_at = Column(DateTime, default=now, onupdate=now)

    def as_dict(self):
        return {
            "clientId": self.client_id,
            "sessionId": self.session_id,
            "challenge": self.challenge,
            "serviceInterest": self.service_interest,
            "industry": self.industry,
            "companySize": self.company_size,
            "timeline": self.timeline,
            "budgetSignal": self.budget_signal,
            "decisionMaker": bool(self.decision_maker),
            "contactRole": self.contact_role,
            "purchaseIntent": self.purchase_intent,
            "contactIntent": bool(self.contact_intent),
            "qualificationConfidence": self.qualification_confidence or 0,
            "summary": self.summary,
            "aiScore": self.ai_score or 0,
            "aiScoreBreakdown": self.ai_score_breakdown or [],
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
