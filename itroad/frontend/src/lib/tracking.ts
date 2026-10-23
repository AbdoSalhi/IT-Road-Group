/**
 * Anonymous visitor tracking & behavioral analytics.
 *
 * Tracking starts immediately on page load (see initTracking(), called once
 * from App.tsx) and keeps running for every visitor whether or not they
 * ever identify themselves. Two identifiers are involved:
 *
 *  - visitor_id: persistent, cross-session, stored in localStorage. Stable
 *    until the visitor clears their browser data. Every event and the
 *    eventual lead record reference this id, which is how a lead
 *    automatically inherits its visitor's full anonymous history.
 *  - session_id: one per browsing session (stored in sessionStorage),
 *    rotated after 30 minutes of inactivity. Used for session-level
 *    analytics (duration, entry/exit page, returning-visitor detection).
 *
 * Privacy: only anonymous, non-sensitive data is collected here (pages,
 * clicks, scroll depth, coarse device info). No passwords, keystrokes,
 * unsubmitted form content, or payment data are ever read or sent.
 */

export interface TrackingSnapshot {
  clientId: string;
  pagesVisited: string[];
  sectionsVisited: string[];
  maxScrollDepth: number;
  ctaClicks: number;
  serviceInteractions: number;
  totalTimeSpentMs: number;
  startedAt: number;
  lastPath: string;
  sessionCount: number;
}

interface DeviceInfo {
  browser: string;
  os: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenSize: string;
  language: string;
}

const STORAGE_KEY = 'itroad_tracking_state';
const CLIENT_ID_KEY = 'itroad_client_id';
const SESSION_ID_KEY = 'itroad_session_id';
const LAST_ACTIVITY_KEY = 'itroad_last_activity';
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// A browsing session ends after this many milliseconds of inactivity; the
// next interaction starts a brand-new session_id (same visitor_id).
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const FLUSH_INTERVAL_MS = 5000;
const FLUSH_BATCH_SIZE = 10;

// Some events matter enough (form submissions, session lifecycle) to send
// immediately rather than sit in the batched queue for up to 5s.
const IMMEDIATE_EVENT_TYPES = new Set([
  'contact_form_submitted',
  'form_submit',
  'newsletter_submit',
  'chatbot_open',
]);

let currentBrand: string | null = null;

export function setTrackingBrand(brand: string | null) {
  currentBrand = brand;
}

// ---------------------------------------------------------------------------
// IDs
// ---------------------------------------------------------------------------

function generateUUID(): string {
  const cryptoObj = (typeof crypto !== 'undefined' ? crypto : undefined) as
    | (Crypto & { randomUUID?: () => string })
    | undefined;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }
  // Fallback for older browsers without crypto.randomUUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateClientId(): string {
  const existing = window.localStorage.getItem(CLIENT_ID_KEY);
  if (existing) return existing;
  const generated = generateUUID();
  window.localStorage.setItem(CLIENT_ID_KEY, generated);
  return generated;
}

/** Returns the current session id, rotating it after 30 minutes idle. */
function getOrCreateSessionId(): { sessionId: string; isNewSession: boolean } {
  const now = Date.now();
  const lastActivityRaw = window.localStorage.getItem(LAST_ACTIVITY_KEY);
  const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : 0;
  const inactiveTooLong = lastActivity > 0 && now - lastActivity > SESSION_TIMEOUT_MS;

  let sessionId = window.sessionStorage.getItem(SESSION_ID_KEY);
  let isNewSession = false;
  if (!sessionId || inactiveTooLong) {
    sessionId = generateUUID();
    window.sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    isNewSession = true;
  }
  window.localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  return { sessionId, isNewSession };
}

function touchActivity() {
  window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

// ---------------------------------------------------------------------------
// Device info (non-sensitive only)
// ---------------------------------------------------------------------------

function detectBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari';
  return 'Other';
}

function detectOS(ua: string): string {
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) return 'macOS';
  if (/Android/.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Other';
}

function detectDeviceType(ua: string): 'mobile' | 'tablet' | 'desktop' {
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}

function getDeviceInfo(): DeviceInfo {
  const ua = window.navigator.userAgent || '';
  return {
    browser: detectBrowser(ua),
    os: detectOS(ua),
    deviceType: detectDeviceType(ua),
    screenSize: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: window.navigator.language || 'en',
  };
}

// ---------------------------------------------------------------------------
// Local snapshot (aggregated behavioral counters, used for lead scoring)
// ---------------------------------------------------------------------------

function readStoredState(): TrackingSnapshot | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TrackingSnapshot;
  } catch {
    return null;
  }
}

function persistState(state: TrackingSnapshot) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getTrackingSnapshot(): TrackingSnapshot {
  const existing = readStoredState();
  if (existing) return existing;

  const state: TrackingSnapshot = {
    clientId: getOrCreateClientId(),
    pagesVisited: [],
    sectionsVisited: [],
    maxScrollDepth: 0,
    ctaClicks: 0,
    serviceInteractions: 0,
    totalTimeSpentMs: 0,
    startedAt: Date.now(),
    lastPath: '/',
    sessionCount: 0,
  };
  persistState(state);
  return state;
}

function updateStateWithEvent(
  state: TrackingSnapshot,
  eventType: string,
  payload: Record<string, unknown> = {},
): TrackingSnapshot {
  const next: TrackingSnapshot = { ...state };

  if (!next.clientId) next.clientId = getOrCreateClientId();
  if (!next.pagesVisited) next.pagesVisited = [];
  if (!next.sectionsVisited) next.sectionsVisited = [];

  if (eventType === 'pageview' || eventType === 'page_view') {
    const path = (payload.path as string) || '/';
    if (!next.pagesVisited.includes(path)) next.pagesVisited.push(path);
    next.lastPath = path;
  }

  if (eventType === 'section_view') {
    const section = (payload.section as string) || 'unknown';
    if (!next.sectionsVisited.includes(section)) next.sectionsVisited.push(section);
  }

  if (eventType === 'scroll') {
    next.maxScrollDepth = Math.max(next.maxScrollDepth || 0, (payload.depth as number) || 0);
  }

  if (eventType === 'cta_click') {
    next.ctaClicks = (next.ctaClicks || 0) + 1;
  }

  if (eventType === 'service_interaction' || eventType === 'service_click') {
    next.serviceInteractions = (next.serviceInteractions || 0) + 1;
  }

  if (eventType === 'session_end' || eventType === 'heartbeat') {
    next.totalTimeSpentMs = (next.totalTimeSpentMs || 0) + ((payload.durationMs as number) || 0);
  }

  if (eventType === 'session_start') {
    next.sessionCount = (next.sessionCount || 0) + 1;
  }

  if (!next.startedAt) next.startedAt = Date.now();

  return next;
}

// ---------------------------------------------------------------------------
// Batched event queue
// ---------------------------------------------------------------------------

interface QueuedEvent extends Record<string, unknown> {
  clientId: string;
  sessionId: string;
  brand: string | null;
  eventType: string;
  timestamp: string;
}

let eventQueue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let apiUrlForFlush = DEFAULT_API_URL;

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushQueue();
  }, FLUSH_INTERVAL_MS);
}

async function flushQueue(useBeacon = false) {
  if (eventQueue.length === 0) return;
  const batch = eventQueue;
  eventQueue = [];
  const body = JSON.stringify({ events: batch });

  if (useBeacon && 'sendBeacon' in navigator) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(`${apiUrlForFlush}/api/track-events/batch`, blob);
    return;
  }

  try {
    await fetch(`${apiUrlForFlush}/api/track-events/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // Tracking must never break the site - fail silently.
  }
}

async function sendSingleEventImmediately(payload: QueuedEvent, useBeacon = false) {
  if (useBeacon && 'sendBeacon' in navigator) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(`${apiUrlForFlush}/api/track-event`, blob);
    return;
  }
  try {
    await fetch(`${apiUrlForFlush}/api/track-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Tracking must never break the site - fail silently.
  }
}

// ---------------------------------------------------------------------------
// Public event API
// ---------------------------------------------------------------------------

export async function sendTrackingEvent(
  eventType: string,
  payload: Record<string, unknown> = {},
  apiUrl: string = DEFAULT_API_URL,
) {
  apiUrlForFlush = apiUrl;
  touchActivity();

  const state = getTrackingSnapshot();
  const enriched = updateStateWithEvent(state, eventType, payload);
  persistState(enriched);

  const sessionId = window.sessionStorage.getItem(SESSION_ID_KEY) || getOrCreateSessionId().sessionId;

  const eventPayload: QueuedEvent = {
    clientId: enriched.clientId,
    sessionId,
    brand: currentBrand,
    eventType,
    path: (payload.path as string) || window.location.pathname + window.location.hash,
    pageTitle: (payload.pageTitle as string) || document.title || null,
    referrer: (payload.referrer as string) ?? null,
    section: (payload.section as string) || null,
    depth: (payload.depth as number) ?? null,
    meta: (payload.meta as string) || null,
    timeSpentMs: (payload.timeSpentMs as number) ?? null,
    timestamp: new Date().toISOString(),
    tracking: {
      pagesVisited: enriched.pagesVisited,
      sectionsVisited: enriched.sectionsVisited,
      maxScrollDepth: enriched.maxScrollDepth,
      ctaClicks: enriched.ctaClicks,
      serviceInteractions: enriched.serviceInteractions,
      totalTimeSpentMs: enriched.totalTimeSpentMs,
      lastPath: enriched.lastPath,
      sessionCount: enriched.sessionCount,
    },
  };

  if (IMMEDIATE_EVENT_TYPES.has(eventType)) {
    await sendSingleEventImmediately(eventPayload);
  } else {
    eventQueue.push(eventPayload);
    if (eventQueue.length >= FLUSH_BATCH_SIZE) {
      await flushQueue();
    } else {
      scheduleFlush();
    }
  }

  return eventPayload;
}

// ---------------------------------------------------------------------------
// Session lifecycle
// ---------------------------------------------------------------------------

async function startSessionOnServer(apiUrl: string, entryPath: string) {
  const clientId = getOrCreateClientId();
  const { sessionId, isNewSession } = getOrCreateSessionId();
  if (!isNewSession) return;

  const device = getDeviceInfo();
  const snapshot = updateStateWithEvent(getTrackingSnapshot(), 'session_start');
  persistState(snapshot);

  try {
    await fetch(`${apiUrl}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        sessionId,
        brand: currentBrand,
        referrer: document.referrer || null,
        entryPath,
        device,
      }),
      keepalive: true,
    });
  } catch {
    // Tracking must never break the site - fail silently.
  }
}

// ---------------------------------------------------------------------------
// Page view / exit tracking
// ---------------------------------------------------------------------------

let currentPagePath: string | null = null;
let currentPageStart = Date.now();

export function trackPageView(path: string) {
  const now = Date.now();
  if (currentPagePath && currentPagePath !== path) {
    const timeSpentMs = now - currentPageStart;
    void sendTrackingEvent('page_exit', { path: currentPagePath, timeSpentMs });
  }
  currentPagePath = path;
  currentPageStart = now;
  void sendTrackingEvent('page_view', { path, referrer: document.referrer || null });
}

// ---------------------------------------------------------------------------
// Init - wires up all passive tracking (scroll, sections, clicks, heartbeat)
// ---------------------------------------------------------------------------

let initialized = false;
let lastHeartbeat = Date.now();
let sessionStartedAt = Date.now();

export function initTracking(apiUrl: string = DEFAULT_API_URL) {
  if (initialized) return;
  initialized = true;
  apiUrlForFlush = apiUrl;
  sessionStartedAt = Date.now();

  const initialPath = window.location.pathname + window.location.hash;
  currentPagePath = initialPath;
  currentPageStart = Date.now();

  void startSessionOnServer(apiUrl, initialPath);

  const trackScroll = () => {
    const scrollTop = window.scrollY || 0;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const depth = height > 0 ? Math.round((scrollTop / height) * 100) : 0;
    void sendTrackingEvent('scroll', { depth }, apiUrl);
  };
  // Throttle scroll handling to animation frames so it never blocks rendering.
  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      trackScroll();
      scrollTicking = false;
    });
  };

  const trackSections = () => {
    const sections = Array.from(document.querySelectorAll('section, [data-track-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const sectionName = el.getAttribute('data-track-section') || el.id || 'section';
            void sendTrackingEvent('section_view', { section: sectionName }, apiUrl);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );
    sections.forEach((section) => observer.observe(section));
  };

  const trackClicks = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const ctaEl = target.closest('[data-track-cta]');
    if (ctaEl) {
      const label = ctaEl.getAttribute('data-track-cta') || ctaEl.textContent?.trim() || 'cta';
      void sendTrackingEvent('cta_click', { meta: label }, apiUrl);
    }
    const serviceEl = target.closest('[data-track-service]');
    if (serviceEl) {
      const label = serviceEl.getAttribute('data-track-service') || 'service-card';
      void sendTrackingEvent('service_interaction', { meta: label }, apiUrl);
    }
  };

  const sendHeartbeat = () => {
    const now = Date.now();
    const durationMs = now - lastHeartbeat;
    lastHeartbeat = now;
    void sendTrackingEvent('heartbeat', { durationMs }, apiUrl);
    const sessionId = window.sessionStorage.getItem(SESSION_ID_KEY);
    const clientId = getOrCreateClientId();
    if (sessionId) {
      fetch(`${apiUrl}/api/session/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, sessionId, path: window.location.hash, durationMs: now - sessionStartedAt }),
        keepalive: true,
      }).catch(() => undefined);
    }
  };

  const endSession = () => {
    const sessionId = window.sessionStorage.getItem(SESSION_ID_KEY);
    const clientId = getOrCreateClientId();
    const durationMs = Date.now() - sessionStartedAt;

    if (currentPagePath) {
      const timeSpentMs = Date.now() - currentPageStart;
      eventQueue.push({
        clientId,
        sessionId: sessionId || '',
        brand: currentBrand,
        eventType: 'page_exit',
        path: currentPagePath,
        timeSpentMs,
        timestamp: new Date().toISOString(),
      });
    }
    void flushQueue(true);

    if (sessionId) {
      const blob = new Blob(
        [JSON.stringify({ clientId, sessionId, durationMs, exitPath: window.location.hash })],
        { type: 'application/json' },
      );
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(`${apiUrl}/api/session/end`, blob);
      }
    }
  };

  trackSections();
  trackScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('click', trackClicks);
  window.addEventListener('mousemove', touchActivity, { passive: true, once: false });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      endSession();
    } else if (document.visibilityState === 'visible') {
      // Coming back to the tab: if we were away long enough, this starts a
      // fresh session (same visitor_id, new session_id) automatically.
      void startSessionOnServer(apiUrl, window.location.pathname + window.location.hash);
      lastHeartbeat = Date.now();
      sessionStartedAt = Date.now();
    }
  });
  window.addEventListener('pagehide', endSession);
  window.setInterval(sendHeartbeat, 15000);
}
