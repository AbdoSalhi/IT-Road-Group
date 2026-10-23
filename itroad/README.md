# ITROAD Group — Final merged project

This project merges:

- **Frontend**: your new ITROAD frontend (`frontend/`) — Vite + React + TypeScript, unchanged in look, layout, navigation and content. Only additions: real API calls for the contact form and newsletter form, a client-side tracking script, and a new `/admin` page.
- **Backend**: a rebuilt version of the backend from your older project (`backend/`) — FastAPI, now backed by a real SQLite database via SQLAlchemy, keeping the same lead-scoring formula.

## Important: what was actually reused vs. newly built

Being upfront about this so there are no surprises later:

The older project's backend was a single FastAPI file with 4 endpoints that appended events to a JSON-lines log file and kept scores in memory — there was **no database, no ORM, no models, no authentication, and no admin dashboard/CRM** in it. So those pieces couldn't be "preserved" — they didn't exist yet.

What I did:
- **Reused as-is**: the lead-scoring formula (challenge weight + company size + form completion + behavioural score) and the overall tracking event model (pageviews, sections, scroll depth, CTA clicks, service interactions, session time).
- **Rebuilt from scratch, in the same spirit**: persistent storage (SQLite + SQLAlchemy models for leads, tracking events/profiles, newsletter subscribers), and a minimal admin API + `/admin` page protected by a single shared token (there was no login system to reuse, so this is intentionally simple — not a full user-management system).
- **Not included** because neither project had it: file/CV upload, a real user-authentication system (multiple admin accounts, roles, password reset), and Alembic migrations (tables are auto-created on startup — fine for a prototype, but if this goes to production you'll want real migrations before your schema evolves further).

## 1. Required software

- Node.js 18+ and npm
- Python 3.10+
- (Optional) PostgreSQL, if you don't want to stay on SQLite

## 2. Install dependencies

```bash
# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend (in a new terminal)
cd frontend
npm install
```

## 3. Configure `.env`

```bash
# Backend
cd backend
cp .env.example .env
```
Open `backend/.env` and set a real `ADMIN_TOKEN` (a random string — the admin page will ask for this). Generate one with:
```bash
python -c "import secrets; print(secrets.token_hex(24))"
```
Leave `DATABASE_URL` as-is for SQLite, or point it at Postgres (see the comment in the file).

```bash
# Frontend
cd frontend
cp .env.example .env
```
`VITE_API_URL` defaults to `http://127.0.0.1:8000`, which matches the command below.

## 4. Configure the database / 5. Run migrations

There's no separate migration step: on first startup, the backend automatically creates all required SQLite tables (`itroad.db`, inside `backend/`). If you switch `DATABASE_URL` to Postgres, create an empty database first — the tables will still be created automatically on first run.

## 6. Start the backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
Check it's up: `http://127.0.0.1:8000/api/health` → `{"status":"ok"}`. Interactive API docs: `http://127.0.0.1:8000/docs`.

## 7. Start the frontend

```bash
cd frontend
npm run dev
```
Visit `http://localhost:5173`.

## 8. Test the contact form

Go to the Contact page, fill in the 3-step form and submit. You should see the existing success screen. Behind the scenes this sends a `POST /api/leads` to the backend. Verify it landed:
```bash
curl http://127.0.0.1:8000/api/admin/leads -H "X-Admin-Token: YOUR_TOKEN"
```
The newsletter form on the Blog page works the same way, against `POST /api/newsletter`.

## 9. Verify tracking

Tracking starts automatically on page load (no cookie banner/consent flow was in either original project, so none was added — only anonymous, non-identifying behavioural data is collected: pages/sections visited, scroll depth, CTA clicks, time on site). Browse the site for a bit, then check:
```bash
curl "http://127.0.0.1:8000/api/admin/tracking-events?limit=20" -H "X-Admin-Token: YOUR_TOKEN"
```
You should see `pageview`, `scroll`, `section_view`, `cta_click`, `service_page_view`, `industry_page_view`, `contact_form_opened/started/submitted`, `newsletter_subscription`, and `career_application_click` events as you interact with the corresponding pages.

## 10. Verify lead scoring

Every lead created via the contact form gets a `score` and `level` (`Low / Medium / High Intent`), computed from the challenge/company size chosen plus the visitor's tracking history up to that point (more pages/sections/CTA clicks/time on site → higher score). This is visible in the admin dashboard and in the `/api/admin/leads` response.

## 11. Access the admin/CRM

Go to `http://localhost:5173/#/admin`, enter the `ADMIN_TOKEN` you set in `backend/.env`. From there you can see all leads sorted by score, filter by status, open a lead to see its full tracking history, change its status (new/contacted/qualified/won/lost), add internal notes, and view aggregate stats.

⚠️ This admin page has no user accounts — anyone with the token has full access. Keep the token private, and don't deploy this as-is to a public server without adding proper authentication first.

## Update: lead-scoring fixes (v2)

After the first round of testing, two real issues were found and fixed in `backend/app/scoring.py`:

1. **EN/FR mismatch** — the challenge weights used to key off the display label (e.g. `"Data/IA"`), which differs by language (`"Data/AI"` in English). English-site leads were silently scoring the fallback weight regardless of what they picked. The frontend now sends a stable, language-independent key (`data_ai`, `is_audit`, `cloud_migration`, `cybersecurity`) alongside the human-readable label — scoring uses the key, the admin dashboard displays the label.
2. **Score clustering** — the old tracking-score caps were so low (2-3 pts per signal) that almost every test lead landed at 15-17 points regardless of actual engagement. Caps were raised, the scale widened, and the Low/Medium/High thresholds adjusted to match, so a fast/incomplete submission now scores clearly Low, a normal fill scores Medium, and real sustained browsing before submitting scores High.

## Update: contact form "Something went wrong" error (v3)

Root cause found and fixed: if port `5173` was already taken on your machine, Vite silently starts the dev server on the next free port (`5174`, `5175`, ...) — but the backend's CORS allowlist only had `5173` in it, so the browser silently blocked every request and the form showed the generic error above. Reproduced it directly (a preflight request from `localhost:5174` came back `400 Bad Request`) and fixed it in `backend/app/main.py`: any `localhost`/`127.0.0.1` port is now allowed automatically in addition to your explicit `CORS_ORIGINS` list (which still governs real, non-local deployment origins).

Also improved: both the contact form and the newsletter form now log the actual failure to the browser console (`F12` → Console) and distinguish "can't reach the server" (backend down / wrong `VITE_API_URL` / CORS) from "server rejected the request" in the message shown to the user — so if this ever happens again, the console will tell you exactly why instead of just the generic message.

## Update: 4 filiale showcase sites (v4)

Added one-page "vitrine" sites for the 4 subsidiaries already listed in `src/lib/data.ts` (`subsidiaries` array): **IT Road Consulting Maroc** (`#/itroad-consulting`), **B Tech Consulting France** (`#/btech`), **Smartway** (`#/smartway`), and **IT Road Technology** (`#/itroad-technology`). Reachable from the homepage's subsidiaries map (each filiale card is now clickable) or directly via URL.

**What was reused, not duplicated:**
- All content sections (`src/components/brand/*`) are built from the same shared atoms already used across the main site — `Reveal`, `Button`, `SectionHeading`, `CTASection` (now accepts optional click overrides so it can scroll within the page instead of navigating away — old behavior is unchanged when those props are omitted), `Footer` (now accepts optional address/email/phone overrides — same fallback).
- The contact form itself was extracted from `ContactPage.tsx` into `src/components/LeadQualificationForm.tsx`, parameterized by `brand`/`source`. Every filiale site uses the exact same submit/tracking/scoring pipeline as the main site — nothing was rebuilt.
- Backend: added `brand` to the `Lead` model/schema so every lead is tagged with which site it came from. The admin dashboard now has a "Site" column and filter, and `/api/admin/stats` returns a `leadsByBrand` breakdown.
- Content (hero copy, key numbers, services, process, sectors, clients, testimonial, tech stack, footer info) was transcribed **verbatim** from the provided PDF into `src/lib/brandContent.ts` — nothing rewritten.

**SEO — an honest caveat:** a lightweight `useSEO` hook (`src/lib/useSEO.ts`) sets the page title, meta description, OpenGraph, Twitter Card, and a schema.org JSON-LD block per filiale page, and a `sitemap.xml`/`robots.txt` were added. But this is a client-rendered Vite SPA using hash-based routes (`#/btech`), not Next.js — there's no server-side rendering. That means: real browsers and JS-executing crawlers see the tags fine, but hash fragments aren't sent to the server, so this is meaningfully weaker for SEO than a true Next.js SSR/SSG setup, and social-preview unfurlers that don't execute JS won't see the per-page OG tags at all. If the 95+ Lighthouse / perfect-SEO requirement is a hard one, the real fix is a prerendering step (e.g. a build-time static-HTML generation pass) or migrating these pages to a framework with SSR — flagging this now rather than quietly under-delivering on it.

## Update: AI chatbot + AI lead qualification, Ollama-powered (v5)

Added a floating AI chatbot to the existing site, backed entirely by a **local** Ollama server — no OpenAI/Anthropic/Gemini or any paid API involved, and nothing about Ollama is ever exposed to the browser (the frontend only ever calls our own `/api/chat/*` endpoints).

**Nothing about the existing site changed.** Before/after is identical except: `+` the chat button (bottom-right, all customer-facing pages, not `/admin`), `+` a new "Qualification IA" panel + conversation transcript in the existing lead-detail admin page (shown only for leads that had a chat).

### How it works

```
React chat widget → FastAPI (/api/chat/message) → Ollama (local)
```

1. **RAG grounding** (`backend/app/rag/`) — the chatbot never answers from a giant system prompt or free memory. `knowledge/*.md` files (EN + FR, transcribed from the real content in `frontend/src/lib/data.ts` / `translations.ts` — company info, services, industries, partners, contact/subsidiary locations) are chunked by heading, embedded with a local Ollama embedding model, and stored in `backend/app/rag/kb_index.json`. Every visitor message is embedded and matched against this index (plain cosine similarity — no vector DB dependency needed for a few dozen static chunks) and the top matches are injected into the model's system prompt as the only facts it's allowed to state. If nothing relevant is found, the assistant is instructed to say so and point to the contact form instead of inventing an answer.
2. **Conversation memory** — each chat has a `sessionId` (new SQLAlchemy tables: `chat_sessions`, `chat_messages`). The last ~16 turns are replayed to the model on every request so follow-ups like "which one for a 200-person company?" resolve correctly.
3. **Existing tracking, reused** — the widget calls the same `getOrCreateClientId()`/`sendTrackingEvent()` used everywhere else in `lib/tracking.ts`. New event types (`chat_opened`, `chat_started`, `chat_message_sent`, `chat_message_received`, `chat_service_discussed`, `chat_qualification_completed`, `chat_contact_requested`, `chat_session_ended`) flow through the existing `/api/track-event` pipeline unchanged — no second tracking system.
4. **AI qualification extraction** (`backend/app/chat_service.py`) — after each reply, a second (structured-JSON) Ollama call extracts `challenge`, `service_interest` (mapped to the *same* `CHALLENGE_WEIGHTS` keys already used by the existing scoring), `company_size`, `timeline`, `decision_maker`, `purchase_intent`, `contact_intent`, `qualification_confidence` into a new `chat_qualifications` table, keyed by the visitor's existing `client_id`.
5. **Scoring, extended not replaced** (`backend/app/scoring.py`) — `score_ai_qualification()` turns those extracted facts into a small, fully explainable point breakdown (e.g. "+3 Clear service requirement", "+2 Requested contact with a consultant") via fixed deterministic rules — the AI extracts facts, it never assigns points itself. `score_lead()` now takes an optional `ai_qualification` argument and simply adds this on top of the existing challenge/size/completeness/behavior total; the existing High/Medium/Low thresholds and every existing score field are untouched. If a visitor chatted before submitting the contact form, their AI score is folded in automatically when the lead is created.
6. **Admin dashboard** — `GET /api/admin/leads/{id}` now also returns `aiQualification` and `chatMessages` (null/empty when there was no chat, so existing leads render exactly as before). The lead-detail page shows this as one extra card + the raw transcript, using the same components/styling as the rest of the page.
7. **Fails soft, everywhere** — `ollama_client.py` wraps every Ollama call and raises a single `OllamaUnavailable` on any failure (down, not installed, slow, bad response). `/api/chat/message` catches it and returns a normal `200` with a localized "assistant temporarily unavailable" reply and `available: false` — the rest of the site (tracking, forms, admin) is completely unaffected, verified by killing Ollama mid-conversation. Message length is capped (2000 chars), each session is capped at 200 stored messages, and a simple in-memory rate limit (20 messages / 5 min per session) protects the endpoint from bursts.

### Setup

```bash
# 1. Install Ollama: https://ollama.com/download
# 2. Pull the models (names are fully configurable, see backend/.env)
ollama pull llama3.1:8b        # chat model
ollama pull nomic-embed-text   # embedding model

# 3. Configure backend/.env (already has sensible local defaults):
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3.1:8b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# 4. Build the website-knowledge index (needs Ollama running)
cd backend && source .venv/bin/activate
python -m app.rag.build_kb

# 5. Run as usual — frontend (`npm run dev`), backend (`uvicorn app.main:app --reload`), Ollama (`ollama serve`, or it's already running as a service on most installs)
```

**Updating the knowledge base**: the real source of truth for site content is still `frontend/src/lib/data.ts` / `translations.ts`. When that content changes, update the matching `backend/app/rag/knowledge/*.md` file by hand and re-run `python -m app.rag.build_kb` (no build step runs this automatically — it's a deliberate, reviewable step since it costs an Ollama call per chunk).

**Testing without Ollama installed**: the chatbot endpoint (`/api/chat/message`) will return the graceful fallback message and `available: false` — everything else (existing pages, forms, tracking, admin, lead scoring) works exactly as before, since AI is an enhancement layer, never a dependency.

### Files added
`backend/app/ollama_client.py`, `backend/app/chat_service.py`, `backend/app/rag/` (`build_kb.py`, `retrieve.py`, `knowledge/*.md` × 10, `kb_index.json` generated), `frontend/src/lib/chat.ts`, `frontend/src/components/ChatWidget.tsx`

### Files modified
`backend/app/models.py` (+`ChatSession`, `ChatMessage`, `ChatQualification` tables; +`ai_score`/`ai_score_breakdown`/`ai_summary` nullable columns on `Lead` — all additive, existing columns untouched), `backend/app/schemas.py` (+chat schemas), `backend/app/scoring.py` (+`score_ai_qualification()`, `score_lead()` gained an optional `ai_qualification` kwarg), `backend/app/main.py` (+`/api/chat/message`, `/api/chat/status`; lead creation now folds in AI qualification if present; admin lead-detail now returns `aiQualification`/`chatMessages`), `backend/requirements.txt` (+`httpx`), `backend/.env` / `.env.example` (+`OLLAMA_*` vars), `frontend/src/App.tsx` (renders `<ChatWidget/>` on customer-facing routes), `frontend/src/lib/translations.ts` (+`chat` block, EN/FR), `frontend/src/pages/AdminPage.tsx` (+AI qualification panel + transcript in lead detail).

## Project structure

```
backend/
  app/
    main.py            # FastAPI app, all routes (+ /api/chat/*)
    models.py           # SQLAlchemy models (Lead, TrackingProfile, TrackingEvent, NewsletterSubscriber, ChatSession, ChatMessage, ChatQualification)
    schemas.py           # Pydantic request/response schemas
    scoring.py           # Lead-scoring formula (+ AI chat qualification scoring)
    chat_service.py       # Chatbot orchestration: RAG + memory + qualification extraction
    ollama_client.py       # Local Ollama HTTP client (chat + embeddings), never reaches the browser
    rag/
      build_kb.py           # Chunk knowledge/*.md, embed, write kb_index.json
      retrieve.py            # Cosine-similarity search over kb_index.json
      knowledge/*.md          # Website content, transcribed from data.ts/translations.ts
    auth.py             # Shared-token admin auth
    database.py         # SQLAlchemy engine/session setup
  requirements.txt
  .env.example

frontend/
  src/
    lib/tracking.ts        # Client-side tracking (TS port of the original tracking.js)
    lib/chat.ts             # Chatbot client (talks only to our backend, never Ollama)
    components/ChatWidget.tsx  # Floating chat button + panel
    pages/AdminPage.tsx     # Admin dashboard (+ AI qualification panel)
    pages/ContactPage.tsx   # Existing form, wired to POST /api/leads
    pages/BlogPage.tsx      # Existing newsletter form, wired to POST /api/newsletter
    ... (rest unchanged from your ZIP 1 frontend)
  .env.example
```

## Update: chatbot reliability + background qualification (v6)

Audit of the v5 chatbot under the failure modes it's most likely to hit in practice: slow/occasional-timeout Ollama responses, and SQLite lock contention when chat, tracking heartbeats, and lead reads land close together. Three concrete, additive changes - nothing about RAG, scoring, tracking, or the UI was redesigned.

**1. The visitor no longer waits for AI qualification.** `POST /api/chat/message` used to make *two* sequential Ollama calls before responding: the chat reply, then the structured-extraction call. The second call now runs via a FastAPI `BackgroundTasks` job (`chat_service.run_background_qualification`) scheduled *after* the reply is already returned - the visitor only ever waits on one Ollama call. The background job opens its own DB session (`database.session_scope()`), never the request's session, since the request may already be closed by the time it runs; any failure in it is caught, logged (`logger.exception(...)`), and never affects the reply the visitor already received.

  *Trade-off, stated plainly:* `detectedService` / `qualificationCompleted` / `contactRequested` in the chat response now reflect the qualification state as of the *previous* turn (a cheap synchronous DB read, no Ollama call), and get refreshed by the background job in time for the *next* turn. First message in a conversation always returns these as empty/false, by design - there's nothing to know yet. This is the correct trade-off for a fast, reliable widget; a fully synchronous "reflects this exact message" version would put the slow call back in the visitor's path.

**2. SQLite concurrency.** `database.py` now sets `PRAGMA journal_mode=WAL` and `PRAGMA busy_timeout=5000` on every connection - the standard fix for "database is locked" under concurrent SQLite access (readers no longer block the writer; a genuine simultaneous write retries for up to 5s instead of failing immediately). Still SQLite, still no migration. Additionally, every write path (`handle_chat_message`, `run_background_qualification`) now commits and releases its transaction *before* any `await ollama_*(...)` call, instead of holding a transaction open across the network call - re-verified by direct inspection of `chat_service.py`.

**3. Kept exactly as specified:** `OLLAMA_CHAT_TIMEOUT=90`, `OLLAMA_EMBED_TIMEOUT=30` in `.env`/`.env.example`; `HISTORY_TURNS=16`; the `score_ai_qualification()` deterministic rules (unchanged - no bug found); the existing `rag/kb_index.json` build/retrieve flow (unchanged, still built once via `build_kb.py`, never rebuilt per-request).

### Testing performed

- **Reliability**: 10 consecutive chat messages in the same session, plus a 15-parallel-chat + 15-parallel-heartbeat + 5-parallel-tracking-event concurrent burst. All requests returned `200`; `grep -i "locked\|Traceback"` on the server log came back empty both times.
- **Full happy-path pipeline**, run against a temporary mock Ollama server (real Ollama isn't installed in this sandbox) implementing `/api/tags`, `/api/embed`, `/api/chat`: built the real `kb_index.json` via `build_kb.py`, then replayed the exact conversation from the task's test scenario -
  > "Nous sommes une entreprise de 250 employés." / "...audit de cybersécurité." / "...dans les trois prochains mois." / "Je suis le responsable informatique." / "Je voudrais parler à un consultant."

  Extracted qualification matched expectations exactly: `service_interest=cybersecurity`, `company_size=250 employees`, `timeline=within 3 months`, `decision_maker=true`, `contact_intent=true`, `purchase_intent=high`. Resulting `aiScore=8` with a full breakdown (`+3 Clear service requirement, +3 Strong purchase intent, +2 Specific timeline, +1 Decision-maker identified, +2 Requested contact with a consultant`), correctly folded into a subsequent `/api/leads` call: `challengeScore 4 + sizeScore 3 + completenessScore 3 + behaviorScore 0 + aiScore 8 = 18, High Intent`. Admin lead detail correctly returned the qualification + all 12 stored messages.
  (The mock server and the test-only `itroad.db`/`kb_index.json` it produced were deleted before packaging - **you need to run `python -m app.rag.build_kb` yourself against real Ollama** before the chatbot has real grounding; see Setup above.)
- **Old-lead / no-chat compatibility**: created a lead for a `client_id` that never chatted - `aiScore: 0`, `aiQualification: null`, `chatMessages: []`, existing scoring fields unaffected.
- Confirmed `PRAGMA journal_mode` reports `wal` and `PRAGMA busy_timeout` reports `5000` on a fresh `itroad.db`.
- `python -m py_compile` on every changed backend module; existing frontend (`tsc --noEmit`, `npm run build`, `eslint`) re-verified clean (untouched by this round, since v6 is backend-only).

### Files modified in this round
`backend/app/database.py` (+WAL/busy_timeout pragma, +`session_scope()` helper for background tasks), `backend/app/chat_service.py` (split into fast-path `handle_chat_message` + background `run_background_qualification`, added logging), `backend/app/main.py` (`/api/chat/message` now takes `BackgroundTasks`, schedules qualification after responding, commits promptly before/after Ollama calls; added `logging.basicConfig`), `backend/.env` / `.env.example` (`OLLAMA_CHAT_TIMEOUT=90`, `OLLAMA_EMBED_TIMEOUT=30`).

### Remaining limitations
- In-memory chat rate limiting and the background-task queue are per-process; a multi-worker deployment (e.g. `uvicorn --workers 4`) would need a shared store (Redis) for both to work correctly across workers - fine for the current single-process prototype deployment.
- The "one-turn-behind" qualification flags (point 1 above) mean a visitor who states everything and immediately closes the tab after one message won't have qualification data captured for that single turn - acceptable for a prototype, worth revisiting (e.g. `await` the background task with a short timeout before responding) if that specific scenario matters for the business.
- SQLite WAL mode still means a single writer at a time; under meaningfully higher concurrent write volume than tested here, a real queue (or Postgres) would be the next step - explicitly out of scope per this task's constraints.

## Update: AI Lead Intelligence Platform audit (v7)

A full audit against a 39-section spec covering error diagnostics, AI system health, structured logging, hot-lead classification, sales recommendations, and analytics. **Most of the architecture already satisfied the spec** (fast-path/background split, RAG, memory, additive scoring, WAL mode - see v5/v6 above); this round closed the remaining gaps without touching anything that already worked.

### STEP 1-2: Audit findings
`ollama_client.py`, `chat_service.py`, `main.py`, `scoring.py`, `database.py`, `rag/` already implemented: local-only Ollama, RAG grounding, bounded conversation memory (`HISTORY_TURNS=16`), background qualification via `BackgroundTasks` with its own DB session, WAL mode, and additive AI scoring. Genuinely missing: precise error diagnostics, a real health endpoint, structured/timed logs, a hot-lead tier, deterministic sales recommendations, and admin-facing analytics. Implemented below, extending existing files - no duplicate systems created.

### STEP 3-7: What was added

**1. Root-cause diagnostics for "temporarily unavailable" (§16)** - `ollama_client.py` now classifies every Ollama failure (`_classify_error`) into a specific, human-readable reason - connection refused vs timeout vs HTTP error vs malformed response vs model not pulled - and logs it as `[OLLAMA ERROR] <reason>`. The visitor still only ever sees the generic localized fallback; the backend log always shows the real cause. **In this sandbox, Ollama is not installed**, so every test run correctly logged `[OLLAMA ERROR] Connection refused/unreachable at http://localhost:11434 - is 'ollama serve' running?` - this is the expected, correct behavior of a healthy fallback path, not a bug. When you run this locally with Ollama actually running, that log line simply won't appear.

**2. Real AI system health (§22)** - `GET /api/chat/status` now calls `/api/tags` once and reports `ollamaOnline`, `chatModelAvailable`, `embeddingModelAvailable` (checked by name against what's actually pulled), `ragChunkCount` (from the live index), `responseTimeMs`, and the last recorded error/success timestamps from real traffic (`ollama_client._health_state`, process-local). No secrets exposed - only model names and timing.

**3. Structured, timed logging end-to-end (§32)** - `[CHAT]`, `[RAG]`, `[OLLAMA]`, `[QUALIFICATION]`, `[LEAD]` tags with millisecond timings at every stage, added to `chat_service.py`, `rag/retrieve.py`, `ollama_client.py`, and `main.py`. `logging.basicConfig` added to `main.py` so these are visible by default with `uvicorn`.

**4. Hot Lead + deterministic sales recommendation (§13/§26)** - `scoring.py` gained `HOT_LEAD_THRESHOLD = 16` (a flag layered on top of the existing High/Medium/Low levels, which are completely unchanged) and `get_recommendation(level, hot)`, a fixed lookup table (`hot → "Contact within 24 hours."`, High → "Prioritize for sales follow-up.", Medium → "Continue nurturing.", Low → "Monitor engagement."). The AI never invents this - it's a plain function. `classify_lead(score)` re-derives level/hot/recommendation from a stored score alone, so admin endpoints reading leads back out of the DB use the exact same, single source of truth.

**5. AI Lead Intelligence analytics (§27)** - extended the *existing* `GET /api/admin/stats` endpoint (no new duplicate endpoint) with `aiQualifiedLeads`, `hotLeads`, `chatConversations`, `contactRequests`, `avgAiScore`, `avgFinalScore`, `avgConversationLength`, `mostRequestedServices`, `mostCommonIndustries`, `chatbotQualificationRate`.

**6. Admin UI** - `AdminPage.tsx`'s existing AI Qualification panel now also shows industry, purchase intent, decision-maker status, and AI confidence %; the score card shows a 🔥 badge and the recommendation line when a lead is hot. No redesign - same cards, same styling, additive fields only.

### Testing performed this round

Ran the complete pipeline against a temporary mock Ollama server (`/api/tags`, `/api/embed`, `/api/chat` - real Ollama isn't installed in this sandbox), all in a single process so background tasks could complete before assertions:

- `GET /api/chat/status` → `{"available": true, "ollamaOnline": true, "chatModelAvailable": true, "embeddingModelAvailable": true, "ragChunkCount": 66, "responseTimeMs": 60, ...}`
- One message ("financial company, 250 employees, cybersecurity audit, 3 months, IT manager, wants a consultant") → grounded reply returned in **86ms total** (RAG embed 29ms + retrieval 29ms + chat 37ms), logged as `[CHAT] ... total response time 86 ms`.
- Background qualification completed in **30ms** (logged `[QUALIFICATION] ... AI score = 8 (confidence=90) in 30 ms`), extracting `industry=finance, service_interest=cybersecurity, company_size=250 employees, timeline=within 3 months, decision_maker=true, purchase_intent=high, contact_intent=true` - exact match to the spec's worked example.
- `POST /api/leads` for the same `client_id`, company size `1000+` → **`score=20, level="High Intent", hot=true, recommendation="Contact within 24 hours.", aiScore=8`** - correctly crossed `HOT_LEAD_THRESHOLD=16`, logged as `[LEAD] lead_id=1 ... final score=20 ... hot=True`.
- `GET /api/admin/leads/1` → full `aiQualification` object (industry, purchase intent, decision maker, confidence 90%, score breakdown, summary) plus the 2 stored chat messages, `lead.hot=true`, `lead.recommendation` present.
- Log scan: zero `sqlite3.OperationalError`, zero unhandled tracebacks, across this whole run.
- `python -m py_compile` on every changed/added backend module; `npx tsc --noEmit` on the frontend after the `AdminPage.tsx`/type changes - both clean.

### What was NOT tested (be aware)
- **Real Ollama** (llama3.1:8b / nomic-embed-text) - not installed in this sandbox. The mock server proves the *pipeline* is wired correctly (RAG → chat → extraction → scoring → lead → admin), but real model output quality, real timing under `llama3.1:8b`'s actual latency, and real embedding semantic quality were not verified here - test locally with `ollama serve` running and compare to the numbers above.
- Multi-worker / high-concurrency production load beyond the bursts already tested in v6 (15 parallel chats + 15 heartbeats).
- The 10-consecutive-message and concurrent-burst reliability tests from v6 were not re-run this round (no code path they exercise changed) - re-run them locally if you want fresh numbers with the new logging.

### Files modified in this round
`backend/app/ollama_client.py` (error classification, timing, `_health_state`, richer `ollama_health()`), `backend/app/chat_service.py` (structured `[CHAT]`/`[QUALIFICATION]` logs with timing), `backend/app/rag/retrieve.py` (`[RAG]` logs, `index_chunk_count()`), `backend/app/main.py` (`/api/chat/status` rewritten to use the new health payload, `[LEAD]` logging, `hot`/`recommendation` on `/api/leads`, `/api/admin/leads`, `/api/admin/leads/{id}` responses, `/api/admin/stats` extended with AI analytics), `backend/app/scoring.py` (`HOT_LEAD_THRESHOLD`, `get_recommendation()`, `classify_lead()`), `frontend/src/pages/AdminPage.tsx` (industry/purchase-intent/decision-maker/confidence fields, hot badge, recommendation line - additive only).

### Files unchanged
Everything from v5/v6 not listed above: `backend/app/database.py` (WAL mode/`session_scope` already correct), `backend/app/models.py` (schema already covers everything §19 asks for), `rag/build_kb.py`, `rag/knowledge/*.md`, all frontend files besides `AdminPage.tsx`, all existing site pages/components/translations.

## Update: AI Sales Intelligence Platform (v8)

Extended the chatbot's output from "a qualified lead" into business intelligence the sales team can act on directly - a Sales Profile, explainable reasoning, a next-best-action, concrete service recommendations, conversation insights, a lead timeline, a priority queue, lead health, and a call-prep card. **Everything new is a deterministic derivation of data already captured** - zero additional Ollama calls, nothing invented (see the module docstring in `sales_intelligence.py` for the exact rules this follows).

### New module: `backend/app/sales_intelligence.py`
One function per part of the spec, all pure/deterministic, all reusing existing data:
- **Part 1 - Sales Profile**: `build_sales_profile()` - passes through stored fields (industry, company size, timeline, decision maker, contact intent) and computes three clearly-labelled *derived metrics*: `businessValue` (from the same `SIZE_WEIGHTS` bracket the existing scoring already uses - not re-parsed a second way), `urgency` (keyword-matched from the stated timeline), and `conversionProbabilityPct` (the lead's score as a % of `MAX_POSSIBLE_SCORE`, itself computed from the real weight tables in `scoring.py`, not a hardcoded "20"). None of these are AI-generated - they're formulas.
- **Part 2 - Reasoning**: `build_reasoning()` reuses the *existing* `ai_score_breakdown` verbatim (never re-derives new reasons) and adds at most two extra rule-based lines (enterprise size, hot threshold) so nothing is explained twice.
- **Part 3 - Next Best Action**: `get_next_best_action()` - a fixed lookup table (`hot → "Contact within 24 hours.", High → "Schedule a discovery meeting.", Medium → "Send {service} brochure.", Low → "Continue nurturing."`). This is a *new, additive* field (`nextBestAction`) - the original `recommendation` field from v7 is untouched, so nothing that already worked was replaced.
- **Part 4 - Service Recommendation**: `get_recommended_services()` looks up `SERVICE_SUB_OFFERINGS`, a table transcribed **verbatim** from the "Includes: ..." lines already published in `rag/knowledge/services_en.md` (e.g. cybersecurity → Security Audits, SOC & Monitoring, Zero-Trust, Compliance) - never an invented service.
- **Part 5 - Sales Summary**: no new code - reuses the existing deterministic `ChatQualification.summary` (already built in `chat_service._build_summary()` since v5/v6), just exposed under `salesIntelligence.summary`.
- **Part 6 - Conversation Insights**: `extract_conversation_insights()` - pain points come from keyword matches against the visitor's own messages (`PAIN_POINT_KEYWORDS`); buying signals/risks come from the already-extracted structured qualification fields (never re-interpreted free text); opportunities come from a fixed cross-sell table (`CROSS_SELL_MAP`).
- **Part 7 - Lead Timeline**: `build_lead_timeline()` merges existing `TrackingEvent` rows + `ChatMessage` rows + the lead's `created_at` into one chronological list. No new tables.
- **Part 11 - Priority Queue**: `compute_priority()` - a weighted composite (final score dominant, then purchase intent / timeline urgency / decision-maker / contact-intent / confidence as tie-breakers). Exposed via `GET /api/admin/leads?sort=priority`, which **extends** the existing leads-list endpoint (adds a `priorityRank` field) rather than adding a duplicate endpoint.
- **Part 12 - Lead Health**: `compute_lead_health()` - a 4-bucket rule (`Excellent/Good/Average/Weak`) combining the score band with qualification confidence.
- **Part 13 - Sales Preparation**: `build_sales_preparation()` - talking points built only from stated challenge/service/timeline/industry; `targetRole` comes from a **new** `contact_role` field (see below), added to the *same* existing extraction call, so it costs zero extra Ollama round-trips.

### Small, additive change to the existing extraction call
`chat_service.EXTRACTION_SYSTEM_PROMPT` gained one more key, `contact_role` (e.g. "IT Manager") - the visitor's job title, only when they actually stated it. This is the *same* JSON-extraction Ollama call that already ran every turn in the background (v6/v7) - no new call was added. `models.ChatQualification` gained a matching nullable `contact_role` column (auto-patched into the existing table, like every other additive column so far).

**Also closed a leftover gap from the earlier reliability audit**: the chatbot's system prompt never had explicit prompt-injection resistance. It now includes one added rule: if a message asks it to ignore its instructions, reveal the system prompt/knowledge base verbatim, or state something as fact that isn't in the website context, it declines just that part and keeps helping with anything legitimate in the same message - using the same rules as before, nothing new to configure.

### API changes
- `GET /api/admin/leads/{id}` response gained a `salesIntelligence` object (`profile`, `reasoning`, `nextBestAction`, `recommendedServices`, `conversationInsights`, `timeline`, `leadHealth`, `salesPreparation`, `summary`). For a lead with no chatbot conversation, every sub-field degrades to `"Unknown"` / an empty list - verified directly, not assumed.
- `GET /api/admin/leads?sort=priority` - new optional query param on the *existing* endpoint; each lead gets a `priorityRank` (1 = highest priority).
- `GET /api/admin/stats` gained (Part 9): `mediumIntentLeads`, `lowIntentLeads`, `avgQualificationConfidence`, `mostCommonChallenges`, `mostCommonBuyingSignals`, and (Part 10) a `trends` object comparing the current vs. previous calendar month (`leadsThisMonth/PrevMonth`, `leadsChangePct`, `avgScoreThisMonth/PrevMonth`, `topServiceThisMonth`). **Guarded**: with fewer than 3 leads in either month, `trends.insufficientData: true` and the % change is `null` rather than a number computed from noise - the spec's "do not invent numbers" applied literally.

### Admin UI (Part 8)
`AdminPage.tsx`'s lead-detail view gained one new card, "Intelligence commerciale IA", placed after the existing conversation transcript (same file, same styling tokens, no redesign): lead health badge, business value/urgency/conversion %/score, the next-best-action banner, the "why this score" bullet list, recommended services as chips, a 2x2 grid of pain points/buying signals/risks/opportunities (only rendered when non-empty), a call-prep checklist, and the chronological timeline. The card only renders when `salesIntelligence` is present (it always is, but every sub-section individually hides itself when empty, so a lead with no chat still renders a sensible, mostly-empty card instead of a wall of "Unknown").

### Testing performed

- **Deterministic parts (no Ollama needed at all)**: created a lead with **no** prior chat conversation, fetched its `salesIntelligence` - confirmed every field gracefully reports `"Unknown"` / `[]`, `leadHealth: "Weak"`, `nextBestAction: "Continue nurturing."` - no crash, no invented data.
- **Full pipeline** against a temporary mock Ollama server (`/api/tags`, `/api/embed`, `/api/chat` - real Ollama isn't installed in this sandbox, see the "what was NOT tested" note from v7, still true here): replayed "financial company, 250 employees, cybersecurity audit, 3 months, IT manager, wants a consultant", then created the matching lead (`size=1000+`). Result: `hot=true, score=20/33 (66%), leadHealth="Excellent", nextBestAction="Contact within 24 hours.", recommendedServices=["Security Audits","SOC & Monitoring","Zero-Trust","Compliance"], conversationInsights.buyingSignals=["Requested consultant","Clear timeline","Enterprise company","Decision maker engaged","High purchase intent"], salesPreparation.targetRole="IT Manager"` - matches the spec's worked example field-for-field.
- `GET /api/admin/leads?sort=priority` - confirmed `priorityRank` present and leads correctly ordered.
- `GET /api/admin/stats` - confirmed `trends.insufficientData: true` with only 1-2 leads in the DB (correctly refusing to compute a % change from an insufficient sample).
- Regression: `/api/health`, `/api/chat/status` (Ollama absent → precise `[OLLAMA ERROR] Connection refused...` in logs, generic fallback to the visitor), `/api/chat/message` fallback, `/api/leads` for a lead with no chat - all still behave exactly as in v5-v7, log scan clean (no tracebacks, no `database is locked`).
- `python -m py_compile` on every backend module (`sales_intelligence.py`, `models.py`, `chat_service.py`, `main.py`, and all prior modules); `npx tsc --noEmit` and `npm run build` on the frontend after the `AdminPage.tsx` changes - both clean; `eslint` - 0 errors (1 pre-existing, unrelated warning in `App.tsx` from before this round).

### What was NOT tested (be aware)
Same limitation as v7: **real Ollama** (`llama3.1:8b` / `nomic-embed-text`) is not installed in this sandbox, so this round's pipeline test used the same mock server as before. The mock proves the Sales Intelligence *wiring* is correct end-to-end; run the scenario above locally with real Ollama running to see real numbers (timing, and to confirm `llama3.1:8b`'s actual extraction quality for `contact_role` and the other fields).

### Files created
`backend/app/sales_intelligence.py`

### Files modified
`backend/app/chat_service.py` (`contact_role` in extraction schema + storage, prompt-injection resistance line), `backend/app/models.py` (`ChatQualification.contact_role` column + `as_dict()`), `backend/app/main.py` (`salesIntelligence` in lead detail, `sort=priority` on lead listing, Part 9/10 stats additions), `frontend/src/pages/AdminPage.tsx` (`SalesIntelligence` interface + new admin card, additive only).

## Update: real-world diagnostic bugfix + edge-case hardening (v9)

Testing against a **real** local Ollama server (`llama3.1:8b` + `nomic-embed-text`, both pulled and confirmed working) surfaced one genuine logging bug, and confirmed the actual root cause of "The AI assistant is temporarily unavailable" on real hardware.

### Bug found and fixed: wrong timeout reported in logs
`ollama_client._classify_error()` tried to guess whether a timeout came from the chat call or the embedding call by searching for the word `"chat"` inside httpx's exception text - which never contains it, so the guess was always wrong. A real chat call that correctly waited the full configured `OLLAMA_CHAT_TIMEOUT=90` seconds before failing was logged as `[OLLAMA ERROR] Timeout after 30.0s` (the *embedding* timeout value) - actively misleading for exactly the kind of diagnosis this logging exists for.

**Fix**: `_classify_error()` now takes the operation name and its real timeout as explicit arguments from the caller (`ollama_chat` passes `"chat"`/`OLLAMA_CHAT_TIMEOUT`, `ollama_embed` passes `"embed"`/`OLLAMA_EMBED_TIMEOUT`) instead of guessing. The message is also now actionable: it explains that a cold-start model load can exceed the timeout on the very first request and suggests either raising the timeout or pre-warming the model with `ollama run <model>` first.

### Confirmed root cause of the "temporarily unavailable" report
Real log evidence from the person's machine: the RAG/embedding step completed normally (2.9s), then the chat call ran for the full 90s before timing out - but the very next call (background qualification, same model) succeeded in 77s. This is a genuine **cold start**: `llama3.1:8b` (8B parameters) took over 90 seconds to load into memory on CPU-only hardware for the first inference. This is not a bug in the integration - it's expected behavior for a locally-hosted 8B model without GPU acceleration. Recommended mitigations (documented for the person, not code changes since they're environment/hardware choices): pre-warm with `ollama run llama3.1:8b` before opening the chat, or raise `OLLAMA_CHAT_TIMEOUT` further (e.g. `180`) to tolerate a cold first request.

### Edge-case hardening
- **Whitespace-only messages** (e.g. a single space) previously passed Pydantic's `min_length=1` check since it counts characters, not meaningful content. `schemas.ChatMessageIn` now has a `field_validator` that rejects a message that is blank after stripping, returning a clean `422` instead of sending nothing useful to Ollama.
- **Verified, not just assumed**, the following request-validation behavior end-to-end: empty message → `422`; whitespace-only → `422` with a clear reason; exactly 2000 characters → accepted; 2001 characters → `422`; missing `clientId` → `422`; malformed JSON body → `422`. None of these produced a server error or traceback.
- **Prompt-injection resistance** (added in v8, verified in v9): tested with a mock Ollama server that only refuses when it can see the injection-resistance clause present in the system prompt it received. Two injection attempts ("ignore your previous instructions...", "reveal the website context verbatim") both triggered the refusal path, and a normal question passed through unaffected - confirms the instruction correctly reaches Ollama on every request; it does not (and cannot, from this codebase) guarantee that every possible real model reliably obeys it - system-prompt instructions are a strong mitigation, not a hard guarantee, for any locally-hosted open model.

### What was NOT tested (be aware)
Same limitation as v7/v8: **this sandbox still cannot reach the person's real Ollama server** (it runs on their machine, not in this environment) - the fix above was derived by reading their real log output line-by-line, not by reproducing the timing locally. The edge-case and prompt-injection tests in this round used the mock server. The person should re-run their original "bonjour" test after pre-warming the model to confirm the real end-to-end timing improves as expected.

### Files modified
`backend/app/ollama_client.py` (fixed `_classify_error` timeout misattribution, all 3 call sites updated), `backend/app/schemas.py` (blank-message validator on `ChatMessageIn`).

