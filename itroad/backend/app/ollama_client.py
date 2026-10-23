"""
Thin client for a locally running Ollama server.

This is the ONLY place in the backend that talks to Ollama. Nothing here is
ever exposed to the frontend - the browser only ever calls our own
/api/chat/* endpoints, never Ollama directly (see TASK section 2).

Design goals:
- Never crash the rest of the API if Ollama is not installed / not running /
  slow. Every public function raises `OllamaUnavailable` on any failure and
  callers are expected to catch it and degrade gracefully.
- Model names are fully configurable via .env - never hardcoded.
- The VISITOR only ever sees the generic localized fallback message, but
  the BACKEND LOG always shows the real, specific cause (connection
  refused vs timeout vs model missing vs malformed response) - TASK §16.
"""

import json
import logging
import os
import time
from pathlib import Path
from typing import Any, Optional

import httpx
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

logger = logging.getLogger("itroad.ollama")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
OLLAMA_CHAT_MODEL = os.getenv("OLLAMA_CHAT_MODEL", "llama3.1:8b")
OLLAMA_EMBEDDING_MODEL = os.getenv("OLLAMA_EMBEDDING_MODEL", "nomic-embed-text")
OLLAMA_CHAT_TIMEOUT = float(os.getenv("OLLAMA_CHAT_TIMEOUT", "90"))
OLLAMA_EMBED_TIMEOUT = float(os.getenv("OLLAMA_EMBED_TIMEOUT", "30"))

# In-memory AI-system-health state, read by GET /api/chat/status (TASK §22).
# Best-effort/process-local by design (see README "Remaining limitations" -
# a multi-worker deployment would need a shared store for this).
_health_state: dict[str, Any] = {
    "last_success_at": None,
    "last_error_at": None,
    "last_error": None,
}


def _classify_error(exc: Exception, *, operation: str, timeout: float) -> str:
    """Turn an httpx exception into a specific, loggable reason instead of
    a generic 'request failed' - this is what makes backend logs actually
    useful when the visitor is seeing '...temporarily unavailable' (TASK §16).

    `operation`/`timeout` are passed explicitly by the caller (ollama_chat
    vs ollama_embed) rather than guessed from the exception text - httpx's
    TimeoutException message doesn't contain the word "chat" or "embed",
    so string-sniffing it always picked the wrong timeout value."""
    if isinstance(exc, httpx.ConnectError):
        return f"Connection refused/unreachable at {OLLAMA_BASE_URL} - is `ollama serve` running?"
    if isinstance(exc, httpx.TimeoutException):
        return (
            f"{operation} timed out after {timeout:g}s - the model may still be loading into memory "
            f"(a 'cold start' on CPU-only hardware can take longer than this on the first request; "
            f"subsequent requests are normally much faster once it's warm). "
            f"Increase OLLAMA_{operation.upper()}_TIMEOUT in .env if this keeps happening, "
            f"or pre-warm the model with `ollama run {OLLAMA_CHAT_MODEL if operation == 'chat' else OLLAMA_EMBEDDING_MODEL}` "
            f"before opening the chat."
        )
    if isinstance(exc, httpx.HTTPStatusError):
        status = exc.response.status_code
        if status == 404:
            return f"Model not found (HTTP 404) - did you run `ollama pull`?"
        return f"Ollama returned HTTP {status}: {exc.response.text[:200]}"
    if isinstance(exc, json.JSONDecodeError):
        return "Ollama returned a non-JSON / malformed response"
    return f"{type(exc).__name__}: {exc}"


def _record_success():
    _health_state["last_success_at"] = time.time()


def _record_error(reason: str):
    _health_state["last_error_at"] = time.time()
    _health_state["last_error"] = reason
    logger.warning("[OLLAMA ERROR] %s", reason)


def get_health_state() -> dict:
    return dict(_health_state)


class OllamaUnavailable(Exception):
    """Raised whenever Ollama can't be reached or returns something unusable.

    Callers must catch this and fall back to a graceful in-app message -
    the website itself must keep working even if Ollama is down (TASK §2/§19).
    The exception message is for backend logs only and is never shown to
    the visitor (see chat_service.FALLBACK_MESSAGE for what they see).
    """


async def ollama_chat(
    messages: list[dict[str, str]],
    *,
    json_mode: bool = False,
    temperature: float = 0.4,
) -> str:
    """Send a chat completion request to the local Ollama server.

    `messages` follows the standard [{"role": "system"|"user"|"assistant",
    "content": str}] shape. When `json_mode` is True, Ollama is asked to
    constrain output to valid JSON (used for structured lead-info
    extraction, see chat_service.py).
    """
    payload: dict[str, Any] = {
        "model": OLLAMA_CHAT_MODEL,
        "messages": messages,
        "stream": False,
        "options": {"temperature": temperature},
    }
    if json_mode:
        payload["format"] = "json"

    started = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=OLLAMA_CHAT_TIMEOUT) as client:
            resp = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, json.JSONDecodeError) as exc:
        reason = _classify_error(exc, operation="chat", timeout=OLLAMA_CHAT_TIMEOUT)
        _record_error(reason)
        raise OllamaUnavailable(reason) from exc

    elapsed_ms = int((time.monotonic() - started) * 1000)
    content = (data.get("message") or {}).get("content")
    if not content:
        reason = "Ollama returned an empty chat response (message.content missing)"
        _record_error(reason)
        raise OllamaUnavailable(reason)

    _record_success()
    logger.info("[OLLAMA] chat response received in %d ms (model=%s, json_mode=%s)", elapsed_ms, OLLAMA_CHAT_MODEL, json_mode)
    return content


async def ollama_embed(text: str) -> list[float]:
    """Return the embedding vector for `text` using the configured local
    embedding model. Used both to build the website-knowledge index offline
    (see rag/build_kb.py) and to embed each visitor query at request time."""
    payload = {"model": OLLAMA_EMBEDDING_MODEL, "input": text}
    started = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=OLLAMA_EMBED_TIMEOUT) as client:
            resp = await client.post(f"{OLLAMA_BASE_URL}/api/embed", json=payload)
            resp.raise_for_status()
            data = resp.json()
    except (httpx.HTTPError, json.JSONDecodeError) as exc:
        reason = _classify_error(exc, operation="embed", timeout=OLLAMA_EMBED_TIMEOUT)
        _record_error(reason)
        raise OllamaUnavailable(reason) from exc

    elapsed_ms = int((time.monotonic() - started) * 1000)
    embeddings = data.get("embeddings")
    if not embeddings or not embeddings[0]:
        reason = "Ollama returned an empty embedding response"
        _record_error(reason)
        raise OllamaUnavailable(reason)

    _record_success()
    logger.info("[OLLAMA] embedding computed in %d ms (model=%s)", elapsed_ms, OLLAMA_EMBEDDING_MODEL)
    return embeddings[0]


async def ollama_health() -> dict:
    """Full AI-system-health check used by GET /api/chat/status (TASK §22).

    Never raises. Reports, in one round trip to /api/tags:
    - whether Ollama is reachable at all
    - whether the configured chat model is pulled
    - whether the configured embedding model is pulled
    plus the last recorded success/error from real traffic (see
    _health_state above), so a transient failure from 5 minutes ago is
    visible to the admin even if this specific health check succeeds.
    """
    online = False
    chat_model_available = False
    embedding_model_available = False
    response_time_ms = None

    started = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            response_time_ms = int((time.monotonic() - started) * 1000)
            if resp.status_code == 200:
                online = True
                installed = {m.get("name") for m in resp.json().get("models", [])}
                # Ollama model names may or may not include the ":tag" suffix
                # depending on version, so match on the base name too.
                chat_model_available = any(
                    m == OLLAMA_CHAT_MODEL or m.split(":")[0] == OLLAMA_CHAT_MODEL.split(":")[0] for m in installed
                )
                embedding_model_available = any(
                    m == OLLAMA_EMBEDDING_MODEL or m.split(":")[0] == OLLAMA_EMBEDDING_MODEL.split(":")[0]
                    for m in installed
                )
    except httpx.HTTPError as exc:
        _record_error(_classify_error(exc, operation="health check", timeout=3.0))

    return {
        "online": online,
        "chatModelAvailable": chat_model_available,
        "embeddingModelAvailable": embedding_model_available,
        "responseTimeMs": response_time_ms,
        "chatModel": OLLAMA_CHAT_MODEL,
        "embeddingModel": OLLAMA_EMBEDDING_MODEL,
        **_health_state,
    }


def parse_json_object(raw: str) -> Optional[dict]:
    """Best-effort parse of a JSON object out of a model response.

    Small local models sometimes wrap JSON in markdown fences or add a
    trailing sentence even when format="json" is requested - this tries the
    direct parse first, then falls back to extracting the outermost {...}
    block, and returns None (never raises) if nothing usable is found so
    callers can fall back to the previous known-good extraction instead of
    parsing unreliable free-form AI text (TASK §10).
    """
    raw = raw.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    start = raw.find("{")
    end = raw.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(raw[start : end + 1])
        except json.JSONDecodeError:
            return None
    return None
