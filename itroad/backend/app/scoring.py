"""
Lead-scoring rules.

v3 - scoring model replaced per updated spec:

1. Challenge, company-size and completeness scores are now driven by plain
   dict/map lookups (CHALLENGE_WEIGHTS / SIZE_WEIGHTS) instead of chained
   if/elif statements, so adding or re-weighting an option is a one-line
   change.

2. The "tracking score" concept is renamed Behavioral Score to match the
   product spec. It is built from the visitor's full tracking profile
   (pagesVisited, sectionsVisited, ctaClicks, serviceInteractions,
   maxScrollDepth, totalTimeSpentMs, sessionCount) - now including a
   return-visits component, so returning anonymous visitors score higher
   than single-session ones.

3. Lead Completeness Bonus is now three independent +1s (name / email /
   phone present) instead of a single all-or-nothing +2 bonus.

4. Intent thresholds are fixed, spec-defined values (High >= 10,
   Medium >= 6, else Low) rather than being derived from the maximum
   possible score.
"""

from typing import Optional

# Canonical challenge identifiers (language-independent) -> weight.
# Keep in sync with CHALLENGE_KEYS in frontend/src/components/LeadQualificationForm.tsx.
CHALLENGE_WEIGHTS = {
    "ai_data": 4,
    "cybersecurity": 4,
    "cloud_migration": 3,
    "digital_transformation": 3,
    "software_development": 2,
    "other": 1,
}
DEFAULT_CHALLENGE_SCORE = CHALLENGE_WEIGHTS["other"]

# Company size bracket -> weight. Sent as-is from the frontend (identical
# strings in every language), so no key-mapping layer is needed here.
SIZE_WEIGHTS = {
    "1-10": 1,
    "11-50": 2,
    "51-250": 3,
    "251-1000": 4,
    "1000+": 5,
}
DEFAULT_SIZE_SCORE = SIZE_WEIGHTS["1-10"]

# Lead level thresholds (spec-defined, fixed).
HIGH_INTENT_THRESHOLD = 10
MEDIUM_INTENT_THRESHOLD = 6

# "Hot Lead" is an additional flag layered ON TOP of the existing
# High/Medium/Low Intent levels (TASK §13) - it never replaces them. A
# score at or above this threshold is still "High Intent" (existing
# behaviour, unchanged) AND also gets hot=True in the response so the
# admin/sales team can spot the most urgent leads at a glance. Configurable
# in one place, not hardcoded into the admin UI.
HOT_LEAD_THRESHOLD = 16


def _completeness_score(name: str, email: str, phone: str) -> int:
    """+1 for each of name / email / phone that is present. Max +3."""
    score = 0
    if name:
        score += 1
    if email:
        score += 1
    if phone:
        score += 1
    return score


def _bracket(value, brackets: list[tuple[float, int]]) -> int:
    """Return the point value for the highest bracket `value` reaches.

    `brackets` is a list of (threshold, points) pairs.
    """
    result = 0
    for threshold, points in sorted(brackets, key=lambda b: b[0]):
        if value >= threshold:
            result = points
    return result


def _behavior_score(tracking: dict) -> int:
    """Behavioral score, derived from the visitor's full anonymous tracking
    profile (accumulated before and after identification)."""
    pages = len(tracking.get("pagesVisited", []) or [])
    sections = len(tracking.get("sectionsVisited", []) or [])
    pages_and_sections = pages + sections

    ctas = int(tracking.get("ctaClicks", 0) or 0)
    services = int(tracking.get("serviceInteractions", 0) or 0)
    scroll = int(tracking.get("maxScrollDepth", 0) or 0)
    time_spent_ms = int(tracking.get("totalTimeSpentMs", 0) or 0)
    time_spent_sec = time_spent_ms / 1000
    # Sessions beyond the first one = actual "return visits".
    session_count = int(tracking.get("sessionCount", 0) or 0)
    return_visits = max(session_count - 1, 0)

    # Pages / sections viewed: 0-2 -> 0, 3-5 -> +1, 6+ -> +2
    pages_score = _bracket(pages_and_sections, [(0, 0), (3, 1), (6, 2)])

    # CTA clicks: 0 -> 0, 1-2 -> +1, 3+ -> +2
    cta_score = _bracket(ctas, [(0, 0), (1, 1), (3, 2)])

    # Service card interactions: 0 -> 0, 1-2 -> +1, 3+ -> +2
    service_score = _bracket(services, [(0, 0), (1, 1), (3, 2)])

    # Scroll depth: >= 75% -> +2, otherwise 0
    scroll_score = 2 if scroll >= 75 else 0

    # Time spent: 30s -> +1, 2min -> +2, 5min+ -> +3
    time_score = _bracket(time_spent_sec, [(0, 0), (30, 1), (120, 2), (300, 3)])

    # Return visits (sessions after the first): 0 -> 0, 1-2 -> +1, 3+ -> +2
    return_score = _bracket(return_visits, [(0, 0), (1, 1), (3, 2)])

    return pages_score + cta_score + service_score + scroll_score + time_score + return_score


def score_lead(
    challenge: str,
    company_size: str,
    name: str,
    email: str,
    phone: str,
    tracking: Optional[dict] = None,
    ai_qualification: Optional[dict] = None,
) -> dict:
    challenge_score = CHALLENGE_WEIGHTS.get(challenge, DEFAULT_CHALLENGE_SCORE)
    size_score = SIZE_WEIGHTS.get(company_size, DEFAULT_SIZE_SCORE)
    completeness_score = _completeness_score(name, email, phone)

    tracking = tracking or {}
    behavior_score = _behavior_score(tracking)

    # AI conversation qualification is one additional, optional signal on
    # top of the existing formula (TASK §11) - it is never allowed to
    # replace or override the deterministic scoring above.
    ai_result = score_ai_qualification(ai_qualification) if ai_qualification else None
    ai_score = ai_result["aiScore"] if ai_result else 0

    total = challenge_score + size_score + completeness_score + behavior_score + ai_score

    if total >= HIGH_INTENT_THRESHOLD:
        level = "High Intent"
    elif total >= MEDIUM_INTENT_THRESHOLD:
        level = "Medium Intent"
    else:
        level = "Low Intent"

    hot = total >= HOT_LEAD_THRESHOLD

    return {
        "score": total,
        "level": level,
        "hot": hot,
        "recommendation": get_recommendation(level, hot),
        "challengeScore": challenge_score,
        "sizeScore": size_score,
        "completenessScore": completeness_score,
        "behaviorScore": behavior_score,
        # Kept for backward compatibility with any existing readers of
        # "trackingScore" (e.g. cached frontend responses) - identical
        # value to behaviorScore, just the old key name.
        "trackingScore": behavior_score,
        "aiScore": ai_score,
        "aiScoreBreakdown": ai_result["breakdown"] if ai_result else [],
    }


def classify_lead(score: int) -> dict:
    """Re-derive level/hot/recommendation from a stored final score alone -
    used by admin endpoints reading leads back out of the DB, so the
    classification logic lives in exactly one place (TASK §33)."""
    if score >= HIGH_INTENT_THRESHOLD:
        level = "High Intent"
    elif score >= MEDIUM_INTENT_THRESHOLD:
        level = "Medium Intent"
    else:
        level = "Low Intent"
    hot = score >= HOT_LEAD_THRESHOLD
    return {"level": level, "hot": hot, "recommendation": get_recommendation(level, hot)}


def get_recommendation(level: str, hot: bool) -> str:
    """Deterministic, rule-based sales recommendation (TASK §26). The AI
    never invents business policy here - this is a fixed lookup table."""
    if hot:
        return "Contact within 24 hours."
    if level == "High Intent":
        return "Prioritize for sales follow-up."
    if level == "Medium Intent":
        return "Continue nurturing."
    return "Monitor engagement."


# ---------------------------------------------------------------------------
# AI chat qualification score (TASK §9-§12)
#
# One additional, explainable signal derived from the chatbot conversation.
# Each rule below contributes an independently-listed point value so the
# admin dashboard can show *why* the AI score is what it is - never just a
# bare number. The AI model itself never assigns points directly: it only
# extracts structured facts (see chat_service.py), and these fixed,
# deterministic rules turn those facts into points - exactly like the
# rest of this file. This keeps the AI as an additional signal rather than
# letting it arbitrarily override deterministic scoring.
# ---------------------------------------------------------------------------

MAX_AI_SCORE = 8


def score_ai_qualification(qualification: dict) -> dict:
    breakdown = []

    if (qualification.get("challenge") or "").strip():
        breakdown.append({"label": "Clear service requirement", "points": 3})
    if qualification.get("purchase_intent") in ("high", "medium"):
        points = 3 if qualification["purchase_intent"] == "high" else 1
        label = "Strong purchase intent" if points == 3 else "Some purchase intent"
        breakdown.append({"label": label, "points": points})
    if (qualification.get("timeline") or "").strip() and qualification.get("timeline") not in ("unknown", None):
        breakdown.append({"label": "Specific timeline", "points": 2})
    if qualification.get("decision_maker"):
        breakdown.append({"label": "Decision-maker identified", "points": 1})
    if qualification.get("contact_intent"):
        breakdown.append({"label": "Requested contact with a consultant", "points": 2})

    ai_score = min(sum(item["points"] for item in breakdown), MAX_AI_SCORE)
    return {"aiScore": ai_score, "breakdown": breakdown}
