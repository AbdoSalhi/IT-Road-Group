"""
Build the website-knowledge vector index used by the chatbot's RAG pipeline.

    Existing Website Content (knowledge/*.md, transcribed from the site)
            -> Knowledge Extraction (this file reads the .md files)
            -> Chunking (split on "## " headings)
            -> Embeddings (local Ollama embedding model)
            -> kb_index.json (flat list of {id, lang, source, heading, text, embedding})

Run this manually whenever a knowledge/*.md file changes:

    cd backend
    source .venv/bin/activate
    python -m app.rag.build_kb

Requires Ollama running locally with OLLAMA_EMBEDDING_MODEL pulled (see
backend/.env). This never runs automatically at server startup - retrieval
(app/rag/retrieve.py) just loads whatever kb_index.json already exists, so a
missing/stale index degrades the chatbot's RAG grounding without breaking
the API (see app/rag/retrieve.py for the fallback behaviour).

Maintaining the knowledge base: the website's real source of truth for
content is frontend/src/lib/data.ts and frontend/src/lib/translations.ts.
There is no automated sync from those TypeScript files into this Python
backend (a prototype-scope decision - see README). When you change the
site's public content, update the matching knowledge/*.md file by hand and
re-run this script.
"""

import asyncio
import json
import re
import sys
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).resolve().parent / "knowledge"
INDEX_PATH = Path(__file__).resolve().parent / "kb_index.json"

# "## Heading\ncontent..." -> one chunk per heading, up to the next "## ".
CHUNK_PATTERN = re.compile(r"^##\s+(.+?)\s*\n(.*?)(?=\n##\s+|\Z)", re.DOTALL | re.MULTILINE)


def _lang_from_filename(path: Path) -> str:
    stem = path.stem  # e.g. "services_fr"
    return "fr" if stem.endswith("_fr") else "en"


def chunk_markdown_file(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    lang = _lang_from_filename(path)
    chunks = []
    for match in CHUNK_PATTERN.finditer(text):
        heading = match.group(1).strip()
        body = match.group(2).strip()
        if not body:
            continue
        chunks.append(
            {
                "source": path.stem,
                "lang": lang,
                "heading": heading,
                # Prepend the heading so the embedding captures the topic,
                # not just the body sentences.
                "text": f"{heading}\n{body}",
            }
        )
    return chunks


async def build_index() -> None:
    # Imported lazily so `python -m app.rag.build_kb --help`-style usage
    # doesn't require Ollama to be importable/reachable just to print help.
    from ..ollama_client import OllamaUnavailable, ollama_embed

    if not KNOWLEDGE_DIR.exists():
        print(f"No knowledge directory at {KNOWLEDGE_DIR}", file=sys.stderr)
        sys.exit(1)

    md_files = sorted(KNOWLEDGE_DIR.glob("*.md"))
    if not md_files:
        print(f"No .md files found in {KNOWLEDGE_DIR}", file=sys.stderr)
        sys.exit(1)

    all_chunks: list[dict] = []
    for path in md_files:
        all_chunks.extend(chunk_markdown_file(path))

    print(f"Chunked {len(md_files)} files into {len(all_chunks)} chunks. Embedding...")

    indexed = []
    for i, chunk in enumerate(all_chunks, start=1):
        try:
            embedding = await ollama_embed(chunk["text"])
        except OllamaUnavailable as exc:
            print(f"Failed to embed chunk {i}/{len(all_chunks)} ({chunk['heading']}): {exc}", file=sys.stderr)
            print("Is Ollama running with OLLAMA_EMBEDDING_MODEL pulled? Aborting.", file=sys.stderr)
            sys.exit(1)
        indexed.append({"id": i, **chunk, "embedding": embedding})
        print(f"  [{i}/{len(all_chunks)}] {chunk['source']} :: {chunk['heading']}")

    INDEX_PATH.write_text(json.dumps(indexed, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(indexed)} embedded chunks to {INDEX_PATH}")


if __name__ == "__main__":
    asyncio.run(build_index())
