import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus, Loader2, WifiOff } from 'lucide-react';
import { useT } from '../lib/useT';
import { useLang } from '../lib/i18n';
import { sendTrackingEvent } from '../lib/tracking';
import { checkChatAvailable, getOrCreateChatSessionId, sendChatMessage, type ChatMessage } from '../lib/chat';

/**
 * Floating chatbot widget, added alongside the existing site - it never
 * touches existing layouts, routes, or components (TASK §3/§21). Rendered
 * once from App.tsx on customer-facing pages only (not /admin).
 */
export function ChatWidget({ brand }: { brand?: string | null }) {
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkChatAvailable().then(setAvailable);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  useEffect(() => {
    // End-of-conversation tracking event (TASK §8), mirrors the pattern in
    // lib/tracking.ts's own pagehide handler.
    const handlePageHide = () => {
      if (hasStarted) {
        void sendTrackingEvent('chat_session_ended', { meta: getOrCreateChatSessionId() });
      }
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [hasStarted]);

  const openChat = () => {
    setOpen(true);
    if (!hasOpenedOnce) {
      setHasOpenedOnce(true);
      void sendTrackingEvent('chat_opened', {});
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const isFirstMessage = !hasStarted;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setSending(true);
    void sendTrackingEvent('chat_message_sent', { meta: getOrCreateChatSessionId() });
    if (isFirstMessage) {
      setHasStarted(true);
      void sendTrackingEvent('chat_started', {});
    }

    try {
      const result = await sendChatMessage(text, { brand, lang });
      setAvailable(result.available);
      setMessages((prev) => [...prev, { role: 'assistant', content: result.reply }]);
      if (result.available) {
        void sendTrackingEvent('chat_message_received', { meta: getOrCreateChatSessionId() });
      }
      if (result.detectedService) {
        void sendTrackingEvent('chat_service_discussed', { meta: result.detectedService });
      }
      if (result.qualificationCompleted) {
        void sendTrackingEvent('chat_qualification_completed', { meta: getOrCreateChatSessionId() });
      }
      if (result.contactRequested) {
        void sendTrackingEvent('chat_contact_requested', { meta: getOrCreateChatSessionId() });
      }
    } catch {
      setAvailable(false);
      setMessages((prev) => [...prev, { role: 'assistant', content: t.chat.unavailable }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end">
      {open && (
        <div
          className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm h-[32rem] max-h-[75vh] rounded-3xl bg-white border border-navy-100 shadow-elevated flex flex-col overflow-hidden animate-fade-up"
          role="dialog"
          aria-label={t.chat.title}
        >
          <div className="px-5 py-4 bg-gradient-to-r from-navy-900 to-brand-700 text-white flex items-center justify-between flex-shrink-0">
            <div>
              <p className="font-display font-bold text-sm">{t.chat.title}</p>
              <p className="text-xs text-white/70 mt-0.5">{t.chat.subtitle}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setOpen(false)}
                aria-label={t.chat.minimizeLabel}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.chat.closeLabel}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-navy-50/40">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-navy-100 px-3.5 py-2.5 text-sm text-navy-800 shadow-soft">
                {t.chat.greeting}
              </div>
            </div>

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap shadow-soft ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-sm'
                      : 'bg-white border border-navy-100 text-navy-800 rounded-tl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-navy-100 px-3.5 py-2.5 text-sm text-navy-400 shadow-soft flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.chat.typing}
                </div>
              </div>
            )}

            {available === false && (
              <div className="flex items-center gap-1.5 text-xs text-navy-400 justify-center pt-1">
                <WifiOff className="w-3.5 h-3.5" />
                {t.chat.unavailable}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-navy-100 flex-shrink-0 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.chat.placeholder}
                rows={1}
                maxLength={2000}
                className="flex-1 resize-none rounded-2xl border border-navy-200 px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-brand-500 max-h-24"
              />
              <button
                onClick={() => void send()}
                disabled={!input.trim() || sending}
                aria-label={t.chat.send}
                className="w-10 h-10 flex-shrink-0 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-navy-300 mt-1.5 text-center">{t.chat.disclaimer}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={open ? t.chat.closeLabel : t.chat.openLabel}
        data-track-cta="chat-widget-toggle"
        className="w-14 h-14 rounded-full bg-brand-600 text-white shadow-elevated flex items-center justify-center hover:bg-brand-700 hover:shadow-glow transition-all duration-300 active:scale-95"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
