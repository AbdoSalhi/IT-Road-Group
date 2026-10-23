"""
Retrieval half of the RAG pipeline: given a visitor question, return the
most relevant chunks of real website content (see build_kb.py for how the
index is produced).

No vector database dependency is introduced - the index is small (a few
dozen chunks of static company content) so a flat in-memory cosine-similarity
scan, loaded once from kb_index.json, is simpler and just as fast here than
standing up pgvector/SQLite-vec/etc for this prototype (TASK §5).
"""

import json
import logging
import math
import time
from pathlib import Path
from typing import Optional

from .build_kb import INDEX_PATH

logger = logging.getLogger("itroad.rag")

_cache: Optional[list[dict]] = None
_cache_mtime: Optional[float] = None


def _load_index() -> list[dict]:
    """Load kb_index.json into memory, reloading if the file changed since
    the last call (so re-running build_kb.py is picked up without a
    server restart)."""
    global _cache, _cache_mtime

    if not INDEX_PATH.exists():
        return []

    mtime = INDEX_PATH.stat().st_mtime
    if _cache is not None and _cache_mtime == mtime:
        return _cache

    try:
        data = json.loads(INDEX_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return _cache or []

    _cache = data
    _cache_mtime = mtime
    return data


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def index_is_ready() -> bool:
    return bool(_load_index())


def index_chunk_count() -> int:
    return len(_load_index())


async def retrieve(query: str, lang: str = "en", top_k: int = 4) -> list[dict]:
    """Return the top_k most relevant knowledge chunks for `query`.

    Prefers chunks in the visitor's language but falls back to the other
    language if that leaves too few results (better a decent English answer
    than none at all). Returns [] - never raises - if the index doesn't
    exist yet or Ollama can't embed the query; callers must treat that as
    "no grounding available" rather than a hard error (TASK §4/§19).
    """
    from ..ollama_client import OllamaUnavailable, ollama_embed

    chunks = _load_index()
    if not chunks:
        logger.info("[RAG] index empty or not built yet (run `python -m app.rag.build_kb`) - skipping retrieval")
        return []

    started = time.monotonic()
    try:
        query_embedding = await ollama_embed(query)
    except OllamaUnavailable:
        logger.info("[RAG] query embedding failed (Ollama unavailable) - answering without grounding")
        return []

    scored = [
        {**chunk, "score": _cosine_similarity(query_embedding, chunk["embedding"])}
        for chunk in chunks
    ]
    scored.sort(key=lambda c: c["score"], reverse=True)

    preferred = [c for c in scored if c.get("lang") == lang]
    pool = preferred if len(preferred) >= top_k else scored

    top = pool[:top_k]
    elapsed_ms = int((time.monotonic() - started) * 1000)
    logger.info(
        "[RAG] %d chunks retrieved (of %d indexed, lang=%s) in %d ms", len(top), len(chunks), lang, elapsed_ms
    )
    # Strip the embedding vectors before returning - callers only need text.
    return [{k: v for k, v in c.items() if k != "embedding"} for c in top]
