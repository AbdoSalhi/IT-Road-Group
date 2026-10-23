from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class DeviceInfo(BaseModel):
    """Non-sensitive technical info only - never personal data."""

    browser: Optional[str] = None
    os: Optional[str] = None
    deviceType: Optional[str] = None
    screenSize: Optional[str] = None
    language: Optional[str] = None


class TrackingSnapshot(BaseModel):
    pagesVisited: list[str] = []
    sectionsVisited: list[str] = []
    maxScrollDepth: int = 0
    ctaClicks: int = 0
    serviceInteractions: int = 0
    totalTimeSpentMs: int = 0
    lastPath: str = "/"


class TrackingEventIn(BaseModel):
    clientId: str
    sessionId: Optional[str] = None
    brand: Optional[str] = None
    eventType: str
    path: Optional[str] = None
    pageTitle: Optional[str] = None
    referrer: Optional[str] = None
    section: Optional[str] = None
    depth: Optional[int] = None
    meta: Optional[str] = None
    timeSpentMs: Optional[int] = None
    timestamp: Optional[str] = None
    tracking: Optional[dict[str, Any]] = None
    device: Optional[DeviceInfo] = None


class BatchTrackingEventsIn(BaseModel):
    events: list[TrackingEventIn] = []


class SessionStartIn(BaseModel):
    clientId: str
    sessionId: str
    brand: Optional[str] = None
    referrer: Optional[str] = None
    entryPath: Optional[str] = None
    device: Optional[DeviceInfo] = None


class SessionHeartbeatIn(BaseModel):
    clientId: str
    sessionId: str
    path: Optional[str] = None
    durationMs: Optional[int] = None


class SessionEndIn(BaseModel):
    clientId: str
    sessionId: str
    durationMs: Optional[int] = None
    exitPath: Optional[str] = None


class LeadIn(BaseModel):
    clientId: Optional[str] = None
    challenge: str
    challengeLabel: Optional[str] = None
    size: str
    name: str
    email: EmailStr
    phone: str
    tracking: Optional[dict[str, Any]] = None
    source: str = "contact_form"
    brand: Optional[str] = None


class LeadStatusUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class NewsletterIn(BaseModel):
    email: EmailStr
    clientId: Optional[str] = None


# ---------------------------------------------------------------------------
# AI chatbot (Ollama-backed, see app/ollama_client.py and app/chat_service.py)
# ---------------------------------------------------------------------------

MAX_CHAT_MESSAGE_LENGTH = 2000


class ChatMessageIn(BaseModel):
    clientId: str
    sessionId: str
    brand: Optional[str] = None
    lang: str = "en"
    message: str = Field(min_length=1, max_length=MAX_CHAT_MESSAGE_LENGTH)

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, v: str) -> str:
        # min_length=1 alone lets a single space or "\n\n\n" through -
        # reject anything that's only whitespace once stripped, but keep
        # the original (unstripped) text otherwise so intentional
        # formatting in a real message isn't altered.
        if not v.strip():
            raise ValueError("message must not be blank")
        return v


class ChatMessageOut(BaseModel):
    ok: bool
    sessionId: str
    reply: str
    available: bool
    detectedService: Optional[str] = None
    qualificationCompleted: bool = False
    contactRequested: bool = False
