/**
 * Chatbot client. Mirrors the conventions of lib/tracking.ts: reuses the
 * same persistent visitor `clientId`, talks only to our own FastAPI backend
 * (never Ollama directly - the browser has no idea Ollama exists), and
 * fails soft everywhere so a chatbot hiccup can never break the rest of
 * the site.
 */

import { getOrCreateClientId } from './tracking';

const CHAT_SESSION_KEY = 'itroad_chat_session_id';
const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatReply {
  ok: boolean;
  sessionId: string;
  reply: string;
  available: boolean;
  detectedService: string | null;
  qualificationCompleted: boolean;
  contactRequested: boolean;
}

function generateUUID(): string {
  const cryptoObj = (typeof crypto !== 'undefined' ? crypto : undefined) as
    | (Crypto & { randomUUID?: () => string })
    | undefined;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** One chat conversation per browser tab session - separate from (but
 * alongside) the visitor-tracking session id in lib/tracking.ts. */
export function getOrCreateChatSessionId(): string {
  const existing = window.sessionStorage.getItem(CHAT_SESSION_KEY);
  if (existing) return existing;
  const generated = generateUUID();
  window.sessionStorage.setItem(CHAT_SESSION_KEY, generated);
  return generated;
}

export async function checkChatAvailable(apiUrl: string = DEFAULT_API_URL): Promise<boolean> {
  try {
    const res = await fetch(`${apiUrl}/api/chat/status`);
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.available);
  } catch {
    return false;
  }
}

export async function sendChatMessage(
  message: string,
  options: { brand?: string | null; lang: 'en' | 'fr'; apiUrl?: string } = { lang: 'en' },
): Promise<ChatReply> {
  const apiUrl = options.apiUrl || DEFAULT_API_URL;
  const clientId = getOrCreateClientId();
  const sessionId = getOrCreateChatSessionId();

  const res = await fetch(`${apiUrl}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId,
      sessionId,
      brand: options.brand || null,
      lang: options.lang,
      message,
    }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed with status ${res.status}`);
  }
  return res.json();
}
