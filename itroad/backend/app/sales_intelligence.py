"""
AI Sales Intelligence layer.

Turns the data already captured by tracking + chat + lead form + AI
qualification into business-readable output for the sales team - a "Sales
Profile", reasoning, next-best-action, recommended services, conversation
insights, a timeline, a priority ranking, and lead health.

Hard rules this module follows throughout (TASK Part 14 / Part 15):
- Never invents a fact about the customer. Every field is either a direct
  passthrough of stored data, or a clearly-labelled *derived metric*
  (a score, a percentage, a bucket name) computed by a fixed formula from
  that stored data - never a new free-text claim from an LLM.
- Makes ZERO additional Ollama calls. Everything here runs synchronously,
  cheaply, at read time (when an admin opens a lead) or in the *same*
  background qualification pass that already exists in chat_service.py.
- Missing information is reported as "Unknown" / an empty list, never
  guessed or filled in with a plausible-sounding default.
"""

from typing import Optional

from . import models
from .scoring import CHALLENGE_WEIGHTS, HOT_LEAD_THRESHOLD, SIZE_WEIGHTS, classify_lead

# ---------------------------------------------------------------------------
# Service recommendations (Part 4) - sourced verbatim from the "Includes..."
# sub-items already published in rag/knowledge/services_en.md, never invented.
# ---------------------------------------------------------------------------
SERVICE_SUB_OFFERINGS = {
    "ai_data": ["Machine Learning", "Generative AI", "Data Engineering", "MLOps"],
    "cybersecurity": ["Security Audits", "SOC & Monitoring", "Zero-Trust", "Compliance"],
    "cloud_migration": ["Cloud Migration", "Multi-Cloud Strategy", "DevOps & CI/CD", "Cost Optimization"],
    "digital_transformation": ["Strategy & Roadmap", "Process Automation", "Change Management", "Digital Operations"],
    "software_development": ["Web Platforms", "Mobile Apps", "API & Microservices", "Legacy Modernization"],
    "other": [],
}
SERVICE_LABELS = {
    "ai_data": "AI & Data",
    "cybersecurity": "Cybersecurity",
    "cloud_migration": "Cloud Solutions",
    "digital_transformation": "Digital Transformation",
    "software_development": "Custom Software",
    "other": None,
}
# Deterministic cross-sell map (Part 6 "Opportunities") - adjacent ITROAD
# service categories, not invented products.
CROSS_SELL_MAP = {
    "cybersecurity": ["Managed Security", "Cloud Solutions"],
    "cloud_migration": ["Cybersecurity", "AI & Data"],
    "ai_data": ["Cloud Solutions", "Custom Software"],
    "digital_transformation": ["AI & Data", "Custom Software"],
    "software_development": ["Cloud Solutions", "Digital Transformation"],
}

# The theoretical max of each scoring component, derived directly from the
# same weight tables scoring.py uses - not a magic number (Part 1
# "Overall Score" display uses this as the denominator, e.g. "18 / 33").
_MAX_BEHAVIOR_SCORE = 2 + 2 + 2 + 2 + 3 + 2  # pages+cta+service+scroll+time+return brackets, see scoring._behavior_score
MAX_POSSIBLE_SCORE = (
    max(CHALLENGE_WEIGHTS.values())
    + max(SIZE_WEIGHTS.values())
    + 3  # completeness (name/email/phone)
    + _MAX_BEHAVIOR_SCORE
    + 8  # scoring.MAX_AI_SCORE
)

TIMELINE_URGENT_KEYWORDS = ["immediat", "asap", "1 month", "1 mois", "urgent", "now", "maintenant"]
TIMELINE_SOON_KEYWORDS = ["3 month", "3 mois", "quarter", "trimestre"]
TIMELINE_LATER_KEYWORDS = ["explor", "later", "6 month", "6 mois", "eventually", "plus tard"]


def _urgency_from_timeline(timeline: Optional[str]) -> str:
    if not timeline:
        return "Unknown"
    t = timeline.lower()
    if any(k in t for k in TIMELINE_URGENT_KEYWORDS):
        return "High"
    if any(k in t for k in TIMELINE_SOON_KEYWORDS):
        return "Medium"
    if any(k in t for k in TIMELINE_LATER_KEYWORDS):
        return "Low"
    return "Medium"  # a timeline was stated but doesn't match a known bucket - treat as moderate rather than unknown


def _business_value_from_size(company_size: Optional[str], size_score: int) -> str:
    """Derived from the same SIZE_WEIGHTS bracket the existing scoring
    already uses for `sizeScore` - reuses the single source of truth
    instead of re-parsing company_size text a second way."""
    if size_score >= 4:
        return "Very High"
    if size_score >= 3:
        return "High"
    if size_score >= 2:
        return "Medium"
    if size_score >= 1:
        return "Low"
    return "Unknown" if not company_size else "Low"


def build_sales_profile(lead: models.Lead, qualification: Optional[models.ChatQualification]) -> dict:
    """Part 1 - AI Sales Profile: aggregates existing fields, computes a
    small set of clearly-derived (never invented) business metrics."""
    classification = classify_lead(lead.score)
    q = qualification.as_dict() if qualification else {}

    conversion_probability = round(min(95, max(5, (lead.score / MAX_POSSIBLE_SCORE) * 100))) if lead.score else 0
    business_value = _business_value_from_size(lead.company_size, lead.size_score or 0)
    urgency = _urgency_from_timeline(q.get("timeline"))
    service_key = q.get("serviceInterest") or lead.challenge_key

    return {
        "leadQuality": "HOT LEAD" if classification["hot"] else classification["level"],
        "hot": classification["hot"],
        "overallScore": lead.score,
        "maxPossibleScore": MAX_POSSIBLE_SCORE,
        "confidence": q.get("qualificationConfidence", 0),
        "businessValue": business_value,
        "urgency": urgency,
        "conversionProbabilityPct": conversion_probability,
        "decisionMaker": q.get("decisionMaker", False),
        "requestedContact": q.get("contactIntent", False),
        "industry": q.get("industry") or "Unknown",
        "companySize": q.get("companySize") or lead.company_size or "Unknown",
        "recommendedService": SERVICE_LABELS.get(service_key) if service_key else "Unknown",
        "projectTimeline": q.get("timeline") or "Unknown",
        "mainChallenge": q.get("challenge") or lead.challenge or "Unknown",
    }


def build_reasoning(lead: models.Lead, qualification: Optional[models.ChatQualification]) -> list[str]:
    """Part 2 - reuses the existing, already-explainable ai_score_breakdown
    (never re-derives new reasons) and adds a couple of rule-based lines
    for signals the breakdown doesn't already cover, so nothing is stated
    twice."""
    reasons: list[str] = []
    if qualification and qualification.ai_score_breakdown:
        for item in qualification.ai_score_breakdown:
            reasons.append(f"{item['label']} (+{item['points']}).")
    if (lead.size_score or 0) >= 4:
        reasons.append("Company size indicates an enterprise customer.")
    if classify_lead(lead.score)["hot"]:
        reasons.append(f"Overall score ({lead.score}) exceeds the Hot Lead threshold ({HOT_LEAD_THRESHOLD}).")
    if not reasons:
        reasons.append("Not enough information gathered yet to explain the score in detail.")
    return reasons


def get_next_best_action(lead: models.Lead, qualification: Optional[models.ChatQualification]) -> str:
    """Part 3 - deterministic lookup table, never left to the AI to decide."""
    classification = classify_lead(lead.score)
    if classification["hot"]:
        return "Contact within 24 hours."
    if classification["level"] == "High Intent":
        return "Schedule a discovery meeting."
    if classification["level"] == "Medium Intent":
        service_key = qualification.service_interest if qualification else lead.challenge_key
        label = SERVICE_LABELS.get(service_key) if service_key else None
        return f"Send {label} brochure." if label else "Send relevant information."
    return "Continue nurturing."


def get_recommended_services(service_interest: Optional[str]) -> list[str]:
    """Part 4 - concrete ITROAD sub-services for the detected interest,
    sourced from the real services knowledge base (SERVICE_SUB_OFFERINGS
    above), never invented."""
    if not service_interest:
        return []
    return SERVICE_SUB_OFFERINGS.get(service_interest, [])


# ---------------------------------------------------------------------------
# Part 6 - Conversation Insights
# ---------------------------------------------------------------------------

PAIN_POINT_KEYWORDS = {
    "Security": ["security", "sécurité", "cyber"],
    "Compliance": ["compliance", "conformité", "audit", "regulation", "réglementation"],
    "Infrastructure Modernization": ["legacy", "infrastructure", "modernization", "modernisation"],
    "Data & Analytics": ["data", "données", "analytics", "analytique"],
    "Cost": ["cost", "coût", "budget"],
    "Scalability": ["scale", "scaling", "croissance", "growth"],
}


def extract_conversation_insights(user_messages: list[str], qualification: Optional[models.ChatQualification]) -> dict:
    """Rule-based only - no additional Ollama call. Pain points come from
    keyword matches against what the visitor actually typed; buying
    signals and risks come from the already-extracted structured
    qualification fields (never re-interpreted text)."""
    text = " ".join(user_messages).lower()

    pain_points = [label for label, keywords in PAIN_POINT_KEYWORDS.items() if any(k in text for k in keywords)]

    buying_signals = []
    risks = []
    opportunities = []
    if qualification:
        if qualification.contact_intent:
            buying_signals.append("Requested consultant")
        if qualification.timeline:
            buying_signals.append("Clear timeline")
        if (qualification.company_size or "") and any(ch.isdigit() for ch in qualification.company_size):
            digits = "".join(ch for ch in qualification.company_size if ch.isdigit())
            if digits and int(digits) >= 250:
                buying_signals.append("Enterprise company")
        if qualification.decision_maker:
            buying_signals.append("Decision maker engaged")
        if qualification.purchase_intent == "high":
            buying_signals.append("High purchase intent")

        if not qualification.budget_signal:
            risks.append("Budget unknown")
        if not qualification.timeline:
            risks.append("Timeline unclear")
        if (qualification.qualification_confidence or 0) < 40:
            risks.append("Limited information gathered so far")

        opportunities = CROSS_SELL_MAP.get(qualification.service_interest or "", [])
    else:
        risks.append("No chatbot conversation on record")

    return {
        "painPoints": pain_points,
        "buyingSignals": buying_signals,
        "risks": risks,
        "opportunities": opportunities,
    }


# ---------------------------------------------------------------------------
# Part 7 - Lead Timeline
# ---------------------------------------------------------------------------

_EVENT_LABELS = {
    "page_view": "Visited {path}",
    "cta_click": "Clicked a call-to-action",
    "service_view": "Viewed a service",
    "section_view": "Viewed a page section",
    "scroll_depth": "Scrolled through a page",
    "form_started": "Started the contact form",
    "form_submitted": "Submitted the contact form",
    "chat_opened": "Opened the chatbot",
    "chat_started": "Started a chatbot conversation",
    "chat_message_sent": "Sent a chatbot message",
    "chat_contact_requested": "Requested contact via chatbot",
}


def build_lead_timeline(
    tracking_events: list[models.TrackingEvent],
    chat_messages: list[models.ChatMessage],
    lead: models.Lead,
) -> list[dict]:
    """Part 7 - combines existing tracking + chat rows into one
    chronological timeline. No new tables; purely a read-time merge."""
    entries = []
    for event in tracking_events:
        label = _EVENT_LABELS.get(event.event_type, event.event_type.replace("_", " ").capitalize())
        if "{path}" in label:
            label = label.format(path=event.path or "a page")
        entries.append({"at": event.created_at.isoformat() if event.created_at else None, "label": label})

    for msg in chat_messages:
        if msg.role != "user":
            continue
        preview = msg.content[:60] + ("…" if len(msg.content) > 60 else "")
        entries.append({"at": msg.created_at.isoformat() if msg.created_at else None, "label": f'Chatbot: "{preview}"'})

    if lead.created_at:
        entries.append({"at": lead.created_at.isoformat(), "label": "Submitted contact form"})

    entries = [e for e in entries if e["at"]]
    entries.sort(key=lambda e: e["at"])
    return entries


# ---------------------------------------------------------------------------
# Part 11 - Lead Priority Queue
# ---------------------------------------------------------------------------

_INTENT_TIER = {"high": 3, "medium": 2, "low": 1, "unknown": 0, None: 0}
_URGENCY_TIER = {"High": 3, "Medium": 2, "Low": 1, "Unknown": 0}


def compute_priority(lead: models.Lead, qualification: Optional[models.ChatQualification]) -> float:
    """Part 11 - composite, deterministic ranking key. Weighted so the
    final score dominates (it already encodes most signals), with
    qualification-specific tie-breakers layered on top."""
    q = qualification
    score_component = (lead.score or 0) * 10
    intent_component = _INTENT_TIER.get(q.purchase_intent if q else None, 0) * 3
    urgency_component = _URGENCY_TIER[_urgency_from_timeline(q.timeline if q else None)] * 2
    decision_maker_component = 2 if (q and q.decision_maker) else 0
    contact_component = 2 if (q and q.contact_intent) else 0
    confidence_component = ((q.qualification_confidence or 0) if q else 0) / 100
    return (
        score_component
        + intent_component
        + urgency_component
        + decision_maker_component
        + contact_component
        + confidence_component
    )


# ---------------------------------------------------------------------------
# Part 12 - Lead Health
# ---------------------------------------------------------------------------


def compute_lead_health(lead: models.Lead, qualification: Optional[models.ChatQualification]) -> str:
    """Part 12 - deterministic bucket combining the final score band with
    AI qualification confidence (when available)."""
    classification = classify_lead(lead.score)
    confidence = (qualification.qualification_confidence or 0) if qualification else 0

    if classification["hot"] and confidence >= 70:
        return "Excellent"
    if classification["level"] == "High Intent" or confidence >= 50:
        return "Good"
    if classification["level"] == "Medium Intent":
        return "Average"
    return "Weak"


# ---------------------------------------------------------------------------
# Part 13 - Sales Preparation
# ---------------------------------------------------------------------------


def build_sales_preparation(qualification: Optional[models.ChatQualification]) -> dict:
    """Part 13 - a short prep card built only from what the visitor
    actually stated (challenge, service, timeline, role) - no invented
    talking points."""
    if not qualification:
        return {"targetRole": "Unknown", "timeline": "Unknown", "talkingPoints": []}

    points = []
    if qualification.challenge:
        points.append(f"Reference their stated challenge: {qualification.challenge}.")
    service_label = SERVICE_LABELS.get(qualification.service_interest) if qualification.service_interest else None
    if service_label:
        points.append(f"Focus the conversation on {service_label}.")
    if qualification.timeline:
        points.append(f"Confirm their timeline: {qualification.timeline}.")
    if qualification.industry:
        points.append(f"Tailor examples to the {qualification.industry} industry.")

    return {
        "targetRole": qualification.contact_role or ("Decision maker" if qualification.decision_maker else "Unknown"),
        "timeline": qualification.timeline or "Unknown",
        "talkingPoints": points,
    }


def build_full_sales_intelligence(
    lead: models.Lead,
    qualification: Optional[models.ChatQualification],
    user_messages: list[str],
    tracking_events: list[models.TrackingEvent],
    chat_messages: list[models.ChatMessage],
) -> dict:
    """Single entry point main.py calls to assemble everything above for
    one lead's admin detail view (TASK Part 8)."""
    service_key = qualification.service_interest if qualification else lead.challenge_key
    return {
        "profile": build_sales_profile(lead, qualification),
        "reasoning": build_reasoning(lead, qualification),
        "nextBestAction": get_next_best_action(lead, qualification),
        "recommendedServices": get_recommended_services(service_key),
        "conversationInsights": extract_conversation_insights(user_messages, qualification),
        "timeline": build_lead_timeline(tracking_events, chat_messages, lead),
        "leadHealth": compute_lead_health(lead, qualification),
        "salesPreparation": build_sales_preparation(qualification),
        "summary": qualification.summary if qualification else None,
    }
