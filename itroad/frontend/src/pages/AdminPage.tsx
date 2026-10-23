import { useEffect, useState } from 'react';
import { LogOut, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'itroad_admin_token';

interface Lead {
  id: number;
  clientId: string | null;
  name: string;
  email: string;
  phone: string;
  challenge: string;
  companySize: string;
  source: string;
  brand: string | null;
  score: number;
  level: string;
  challengeScore: number;
  sizeScore: number;
  completenessScore: number;
  behaviorScore: number;
  trackingScore: number;
  aiScore?: number | null;
  aiSummary?: string | null;
  hot?: boolean;
  recommendation?: string;
  status: string;
  notes: string;
  createdAt: string;
}

interface AiQualification {
  serviceInterest: string | null;
  challenge: string | null;
  industry: string | null;
  companySize: string | null;
  timeline: string | null;
  budgetSignal: string | null;
  decisionMaker: boolean;
  purchaseIntent: string | null;
  contactIntent: boolean;
  qualificationConfidence: number;
  summary: string | null;
  aiScore: number;
  aiScoreBreakdown: { label: string; points: number }[];
  updatedAt: string | null;
}

interface SalesIntelligence {
  profile: {
    leadQuality: string;
    hot: boolean;
    overallScore: number;
    maxPossibleScore: number;
    confidence: number;
    businessValue: string;
    urgency: string;
    conversionProbabilityPct: number;
    decisionMaker: boolean;
    requestedContact: boolean;
    industry: string;
    companySize: string;
    recommendedService: string | null;
    projectTimeline: string;
    mainChallenge: string;
  };
  reasoning: string[];
  nextBestAction: string;
  recommendedServices: string[];
  conversationInsights: {
    painPoints: string[];
    buyingSignals: string[];
    risks: string[];
    opportunities: string[];
  };
  timeline: { at: string; label: string }[];
  leadHealth: string;
  salesPreparation: { targetRole: string; timeline: string; talkingPoints: string[] };
  summary: string | null;
}

interface ChatMessageRow {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface TrackingEventRow {
  eventType: string;
  path: string | null;
  pageTitle?: string | null;
  section: string | null;
  depth: number | null;
  meta: string | null;
  brand?: string | null;
  sessionId?: string | null;
  timeSpentMs?: number | null;
  createdAt: string;
}

interface VisitorProfile {
  visitorId: string;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  sessionCount: number;
  isConverted: boolean;
  firstReferrer: string | null;
  brands: string[];
  browser: string | null;
  os: string | null;
  deviceType: string | null;
  screenSize: string | null;
  language: string | null;
}

interface Stats {
  totalLeads: number;
  highIntentLeads: number;
  totalTrackingEvents: number;
  newsletterSubscribers: number;
  leadsByStatus: Record<string, number>;
  leadsByBrand: Record<string, number>;
}

interface VisitorAnalytics {
  totalVisitors: number;
  anonymousVisitors: number;
  returningVisitors: number;
  convertedVisitors: number;
  conversionRate: number;
  avgSessionDurationMs: number;
  avgScrollDepth: number;
  mostVisitedPages: { path: string; count: number }[];
  mostViewedServices: { service: string; count: number }[];
  mostClickedCtas: { cta: string; count: number }[];
  topAcquisitionSources: { source: string; count: number }[];
  visitorTimeline: {
    sessionId: string;
    visitorId: string;
    brand: string | null;
    entryPath: string | null;
    exitPath: string | null;
    isReturning: boolean;
    deviceType: string | null;
    startedAt: string | null;
    durationMs: number;
  }[];
}

function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function journeyLabel(ev: TrackingEventRow): string | null {
  switch (ev.eventType) {
    case 'session_start':
      return 'Session started';
    case 'page_view':
    case 'pageview':
      return `Viewed ${ev.path || 'page'}`;
    case 'page_exit':
      return `Left ${ev.path || 'page'}`;
    case 'cta_click':
      return `Clicked CTA: ${ev.meta || '—'}`;
    case 'service_interaction':
    case 'service_click':
      return `Interested in service: ${ev.meta || '—'}`;
    case 'section_view':
      return `Viewed section: ${ev.section || '—'}`;
    case 'scroll':
      return `Scrolled to ${ev.depth ?? 0}%`;
    case 'contact_form_opened':
      return 'Opened contact form';
    case 'contact_form_started':
      return 'Started filling contact form';
    case 'contact_form_submitted':
    case 'form_submit':
      return 'Submitted contact form — Lead created';
    case 'newsletter_subscription':
    case 'newsletter_submit':
      return 'Subscribed to newsletter';
    case 'chatbot_open':
      return 'Opened chatbot';
    case 'chatbot_message':
      return 'Sent chatbot message';
    case 'heartbeat':
    case 'session_end':
      return null; // internal/noisy events, filtered out of the journey view
    default:
      return ev.eventType;
  }
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'won', 'lost'];

const BRAND_LABELS: Record<string, string> = {
  'itroad-group': 'ITROAD Group (HQ)',
  'itroad-consulting': 'ITROAD Consulting (Maroc)',
  'btech': 'B Tech Consulting (France)',
  'smartway': 'Smartway',
  'itroad-technology': 'ITROAD Technology',
};

const LEVEL_COLORS: Record<string, string> = {
  'High Intent': 'bg-red-50 text-red-700 border-red-200',
  'Medium Intent': 'bg-amber-50 text-amber-700 border-amber-200',
  'Low Intent': 'bg-navy-50 text-navy-600 border-navy-200',
};

async function apiFetch(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(response.status === 401 ? 'unauthorized' : `HTTP ${response.status}`);
  }
  return response.json();
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      await apiFetch('/api/admin/stats', token);
      window.sessionStorage.setItem(TOKEN_KEY, token);
      onLogin(token);
    } catch {
      setError('Token invalide, ou API backend inaccessible.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 rounded-3xl bg-white border border-navy-100 shadow-soft">
        <h1 className="font-display font-bold text-xl text-navy-900">ITROAD — Admin</h1>
        <p className="text-sm text-navy-500 mt-2">Entrez le token admin (ADMIN_TOKEN du backend) pour accéder aux leads.</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin token"
          className="w-full mt-6 px-4 py-3 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={checking || !token}
          className="w-full mt-4 px-4 py-3 rounded-xl bg-navy-900 text-white text-sm font-semibold disabled:opacity-40"
        >
          {checking ? 'Vérification...' : 'Se connecter'}
        </button>
        <a href="#/" className="flex items-center justify-center gap-1.5 mt-6 text-xs text-navy-400 hover:text-navy-600">
          <ArrowLeft className="w-3 h-3" /> Retour au site
        </a>
      </form>
    </div>
  );
}

function LeadDetail({ token, leadId, onBack, onStatusChange }: { token: string; leadId: number; onBack: () => void; onStatusChange: () => void }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [events, setEvents] = useState<TrackingEventRow[]>([]);
  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [aiQualification, setAiQualification] = useState<AiQualification | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessageRow[]>([]);
  const [salesIntelligence, setSalesIntelligence] = useState<SalesIntelligence | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiFetch(`/api/admin/leads/${leadId}`, token).then((data) => {
      setLead(data.lead);
      setEvents(data.events);
      setProfile(data.profile);
      setAiQualification(data.aiQualification || null);
      setChatMessages(data.chatMessages || []);
      setSalesIntelligence(data.salesIntelligence || null);
      setNotes(data.lead.notes || '');
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const updateStatus = async (status: string) => {
    setSaving(true);
    await apiFetch(`/api/admin/leads/${leadId}`, token, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
    onStatusChange();
    setSaving(false);
  };

  const saveNotes = async () => {
    setSaving(true);
    await apiFetch(`/api/admin/leads/${leadId}`, token, { method: 'PATCH', body: JSON.stringify({ notes }) });
    setSaving(false);
  };

  if (!lead) return <div className="p-8 text-navy-400 text-sm">Chargement...</div>;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour à la liste
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-navy-900">{lead.name}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${LEVEL_COLORS[lead.level] || ''}`}>
                {lead.level} · {lead.score} pts
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div><span className="text-navy-400">Email</span><div className="text-navy-900">{lead.email}</div></div>
              <div><span className="text-navy-400">Téléphone</span><div className="text-navy-900">{lead.phone || '—'}</div></div>
              <div><span className="text-navy-400">Besoin</span><div className="text-navy-900">{lead.challenge}</div></div>
              <div><span className="text-navy-400">Taille entreprise</span><div className="text-navy-900">{lead.companySize}</div></div>
              <div><span className="text-navy-400">Source</span><div className="text-navy-900">{lead.source}</div></div>
              <div><span className="text-navy-400">Site</span><div className="text-navy-900">{BRAND_LABELS[lead.brand || 'itroad-group'] || lead.brand}</div></div>
              <div><span className="text-navy-400">Créé le</span><div className="text-navy-900">{new Date(lead.createdAt).toLocaleString()}</div></div>
            </div>
          </div>

          {profile && (
            <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
              <h3 className="font-semibold text-navy-900 mb-3">Profil visiteur anonyme</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-navy-400">Sessions</span><div className="text-navy-900">{profile.sessionCount}</div></div>
                <div><span className="text-navy-400">Premier contact</span><div className="text-navy-900">{profile.firstSeenAt ? new Date(profile.firstSeenAt).toLocaleString() : '—'}</div></div>
                <div><span className="text-navy-400">Source d'acquisition</span><div className="text-navy-900">{profile.firstReferrer || 'Direct'}</div></div>
                <div><span className="text-navy-400">Appareil</span><div className="text-navy-900">{[profile.deviceType, profile.os, profile.browser].filter(Boolean).join(' · ') || '—'}</div></div>
              </div>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
            <h3 className="font-semibold text-navy-900 mb-3">Parcours du visiteur ({events.length})</h3>
            <div className="max-h-96 overflow-y-auto">
              {events.length === 0 && <p className="text-sm text-navy-400">Aucun événement enregistré pour ce visiteur.</p>}
              <ol className="relative border-l border-navy-100 ml-2 space-y-4">
                {events
                  .map((ev, i) => ({ ev, label: journeyLabel(ev), i }))
                  .filter((row) => row.label)
                  .map(({ ev, label, i }) => (
                    <li key={i} className="ml-4">
                      <div className="absolute w-2 h-2 rounded-full bg-brand-500 -ml-[21px] mt-1.5" />
                      <p className="text-sm font-medium text-navy-800">{label}</p>
                      <span className="text-xs text-navy-400">{ev.createdAt ? new Date(ev.createdAt).toLocaleString() : ''}</span>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
            <h3 className="font-semibold text-navy-900 mb-3">Score de qualification</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-navy-400">Intent Level</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${LEVEL_COLORS[lead.level] || ''}`}>
                {lead.level}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-navy-500">Challenge Score</span>
                <span className="font-semibold text-navy-900">{lead.challengeScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-500">Company Size Score</span>
                <span className="font-semibold text-navy-900">{lead.sizeScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-500">Completeness Bonus</span>
                <span className="font-semibold text-navy-900">{lead.completenessScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-500">Behavioral Score</span>
                <span className="font-semibold text-navy-900">{lead.behaviorScore}</span>
              </div>
              {!!lead.aiScore && (
                <div className="flex items-center justify-between">
                  <span className="text-navy-500">Score IA (chat)</span>
                  <span className="font-semibold text-navy-900">{lead.aiScore}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-navy-50">
                <span className="text-navy-700 font-medium">Total Score</span>
                <span className="font-bold text-navy-900 flex items-center gap-1.5">
                  {lead.hot && <span title="Hot Lead">🔥</span>}
                  {lead.score}
                </span>
              </div>
              {lead.recommendation && (
                <div className="pt-2 border-t border-navy-50 text-xs text-navy-500">
                  <span className="font-medium text-navy-700">Recommandation : </span>
                  {lead.recommendation}
                </div>
              )}
            </div>
          </div>

          {aiQualification && (
            <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
              <h3 className="font-semibold text-navy-900 mb-3">Qualification IA</h3>
              <div className="space-y-2 text-sm mb-4">
                {aiQualification.serviceInterest && (
                  <div><span className="text-navy-400">Service</span><div className="text-navy-900">{aiQualification.serviceInterest}</div></div>
                )}
                {aiQualification.industry && (
                  <div><span className="text-navy-400">Secteur</span><div className="text-navy-900">{aiQualification.industry}</div></div>
                )}
                {aiQualification.challenge && (
                  <div><span className="text-navy-400">Besoin exprimé</span><div className="text-navy-900">{aiQualification.challenge}</div></div>
                )}
                {aiQualification.companySize && (
                  <div><span className="text-navy-400">Taille entreprise</span><div className="text-navy-900">{aiQualification.companySize}</div></div>
                )}
                {aiQualification.timeline && (
                  <div><span className="text-navy-400">Timing</span><div className="text-navy-900">{aiQualification.timeline}</div></div>
                )}
                {aiQualification.purchaseIntent && (
                  <div className="flex items-center justify-between">
                    <span className="text-navy-400">Intention d'achat</span>
                    <span className="text-navy-900 capitalize">{aiQualification.purchaseIntent}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Décideur</span>
                  <span className="text-navy-900">{aiQualification.decisionMaker ? 'Oui' : 'Non'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Intention de contact</span>
                  <span className="text-navy-900">{aiQualification.contactIntent ? 'Oui' : 'Non'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-navy-400">Confiance IA</span>
                  <span className="text-navy-900">{aiQualification.qualificationConfidence}%</span>
                </div>
              </div>
              {aiQualification.aiScoreBreakdown.length > 0 && (
                <div className="space-y-1.5 text-xs border-t border-navy-50 pt-3">
                  {aiQualification.aiScoreBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-navy-500">
                      <span>{item.label}</span>
                      <span className="font-semibold text-navy-800">+{item.points}</span>
                    </div>
                  ))}
                </div>
              )}
              {aiQualification.summary && (
                <p className="text-xs text-navy-500 mt-3 pt-3 border-t border-navy-50 italic">{aiQualification.summary}</p>
              )}
            </div>
          )}

          {chatMessages.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
              <h3 className="font-semibold text-navy-900 mb-3">Conversation chatbot</h3>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`text-sm px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-navy-50 text-navy-800' : 'bg-brand-50 text-navy-700'}`}>
                    <span className="text-xs text-navy-400 block mb-0.5">{m.role === 'user' ? 'Visiteur' : 'Assistant'}</span>
                    {m.content}
                  </div>
                ))}
              </div>
            </div>
          )}

          {salesIntelligence && (
            <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy-900">Intelligence commerciale IA</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-navy-50 text-navy-600 font-medium">
                  Santé du lead : {salesIntelligence.leadHealth}
                </span>
              </div>

              {/* Sales Profile */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><span className="text-navy-400">Valeur commerciale</span><div className="text-navy-900">{salesIntelligence.profile.businessValue}</div></div>
                <div><span className="text-navy-400">Urgence</span><div className="text-navy-900">{salesIntelligence.profile.urgency}</div></div>
                <div><span className="text-navy-400">Probabilité de conversion</span><div className="text-navy-900">{salesIntelligence.profile.conversionProbabilityPct}%</div></div>
                <div><span className="text-navy-400">Score</span><div className="text-navy-900">{salesIntelligence.profile.overallScore} / {salesIntelligence.profile.maxPossibleScore}</div></div>
              </div>

              {/* Next Best Action */}
              <div className="p-3 rounded-xl bg-brand-50 text-sm">
                <span className="text-navy-500 font-medium">Prochaine action recommandée : </span>
                <span className="text-navy-900">{salesIntelligence.nextBestAction}</span>
              </div>

              {/* Reasoning */}
              {salesIntelligence.reasoning.length > 0 && (
                <div>
                  <p className="text-xs text-navy-400 font-medium mb-1.5">Pourquoi ce score ?</p>
                  <ul className="space-y-1 text-sm text-navy-700 list-disc list-inside">
                    {salesIntelligence.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {/* Recommended services */}
              {salesIntelligence.recommendedServices.length > 0 && (
                <div>
                  <p className="text-xs text-navy-400 font-medium mb-1.5">Services recommandés</p>
                  <div className="flex flex-wrap gap-1.5">
                    {salesIntelligence.recommendedServices.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-navy-50 text-navy-700">✓ {s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation insights */}
              {(salesIntelligence.conversationInsights.painPoints.length > 0 ||
                salesIntelligence.conversationInsights.buyingSignals.length > 0 ||
                salesIntelligence.conversationInsights.risks.length > 0 ||
                salesIntelligence.conversationInsights.opportunities.length > 0) && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {salesIntelligence.conversationInsights.painPoints.length > 0 && (
                    <div><p className="text-navy-400 font-medium mb-1">Points de douleur</p>{salesIntelligence.conversationInsights.painPoints.map((p, i) => <div key={i} className="text-navy-700">✓ {p}</div>)}</div>
                  )}
                  {salesIntelligence.conversationInsights.buyingSignals.length > 0 && (
                    <div><p className="text-navy-400 font-medium mb-1">Signaux d'achat</p>{salesIntelligence.conversationInsights.buyingSignals.map((p, i) => <div key={i} className="text-navy-700">✓ {p}</div>)}</div>
                  )}
                  {salesIntelligence.conversationInsights.risks.length > 0 && (
                    <div><p className="text-navy-400 font-medium mb-1">Risques</p>{salesIntelligence.conversationInsights.risks.map((p, i) => <div key={i} className="text-navy-700">⚠ {p}</div>)}</div>
                  )}
                  {salesIntelligence.conversationInsights.opportunities.length > 0 && (
                    <div><p className="text-navy-400 font-medium mb-1">Opportunités</p>{salesIntelligence.conversationInsights.opportunities.map((p, i) => <div key={i} className="text-navy-700">✓ {p}</div>)}</div>
                  )}
                </div>
              )}

              {/* Sales preparation */}
              {salesIntelligence.salesPreparation.talkingPoints.length > 0 && (
                <div className="pt-3 border-t border-navy-50">
                  <p className="text-xs text-navy-400 font-medium mb-1.5">
                    Avant d'appeler ({salesIntelligence.salesPreparation.targetRole})
                  </p>
                  <ul className="space-y-1 text-sm text-navy-700 list-disc list-inside">
                    {salesIntelligence.salesPreparation.talkingPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}

              {/* Timeline */}
              {salesIntelligence.timeline.length > 0 && (
                <div className="pt-3 border-t border-navy-50">
                  <p className="text-xs text-navy-400 font-medium mb-1.5">Parcours du lead</p>
                  <div className="space-y-1.5 text-xs text-navy-600">
                    {salesIntelligence.timeline.map((e, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-navy-300 flex-shrink-0">{new Date(e.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{e.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
            <h3 className="font-semibold text-navy-900 mb-3">Statut</h3>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  disabled={saving}
                  onClick={() => updateStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    lead.status === s ? 'bg-navy-900 text-white border-navy-900' : 'border-navy-200 text-navy-600 hover:border-navy-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
            <h3 className="font-semibold text-navy-900 mb-3">Notes internes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={saveNotes}
              disabled={saving}
              className="w-full mt-2 px-4 py-2 rounded-xl bg-navy-100 text-navy-900 text-sm font-semibold hover:bg-navy-200"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitorAnalyticsSection({ token }: { token: string }) {
  const [data, setData] = useState<VisitorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/visitor-analytics', token)
      .then(setData)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="text-sm text-navy-400 mb-8">Chargement des analytics visiteurs...</div>;
  if (!data) return null;

  const metricCards = [
    { label: 'Visiteurs totaux', value: data.totalVisitors },
    { label: 'Visiteurs anonymes', value: data.anonymousVisitors },
    { label: 'Visiteurs récurrents', value: data.returningVisitors },
    { label: 'Visiteurs convertis', value: data.convertedVisitors },
    { label: 'Taux de conversion', value: `${data.conversionRate}%` },
    { label: 'Durée moy. de session', value: formatDuration(data.avgSessionDurationMs) },
    { label: 'Scroll moyen', value: `${data.avgScrollDepth}%` },
  ];

  return (
    <div className="mb-10">
      <h2 className="font-display font-bold text-lg text-navy-900 mb-4">Analytics Visiteurs (comportement anonyme)</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {metricCards.map((m) => (
          <div key={m.label} className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
            <div className="text-2xl font-bold text-navy-900">{m.value}</div>
            <div className="text-xs text-navy-400 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
          <h4 className="text-sm font-semibold text-navy-900 mb-3">Pages les plus visitées</h4>
          <div className="space-y-1.5 text-xs">
            {data.mostVisitedPages.length === 0 && <p className="text-navy-400">—</p>}
            {data.mostVisitedPages.map((p) => (
              <div key={p.path} className="flex justify-between"><span className="text-navy-600 truncate">{p.path}</span><span className="font-semibold text-navy-900">{p.count}</span></div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
          <h4 className="text-sm font-semibold text-navy-900 mb-3">Services les plus consultés</h4>
          <div className="space-y-1.5 text-xs">
            {data.mostViewedServices.length === 0 && <p className="text-navy-400">—</p>}
            {data.mostViewedServices.map((s) => (
              <div key={s.service} className="flex justify-between"><span className="text-navy-600 truncate">{s.service}</span><span className="font-semibold text-navy-900">{s.count}</span></div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
          <h4 className="text-sm font-semibold text-navy-900 mb-3">CTA les plus cliqués</h4>
          <div className="space-y-1.5 text-xs">
            {data.mostClickedCtas.length === 0 && <p className="text-navy-400">—</p>}
            {data.mostClickedCtas.map((c) => (
              <div key={c.cta} className="flex justify-between"><span className="text-navy-600 truncate">{c.cta}</span><span className="font-semibold text-navy-900">{c.count}</span></div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
          <h4 className="text-sm font-semibold text-navy-900 mb-3">Sources d'acquisition</h4>
          <div className="space-y-1.5 text-xs">
            {data.topAcquisitionSources.length === 0 && <p className="text-navy-400">—</p>}
            {data.topAcquisitionSources.map((s) => (
              <div key={s.source} className="flex justify-between"><span className="text-navy-600 truncate">{s.source}</span><span className="font-semibold text-navy-900">{s.count}</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-navy-100 shadow-soft overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-navy-50"><h4 className="text-sm font-semibold text-navy-900">Timeline des sessions récentes</h4></div>
        <table className="w-full text-xs">
          <thead className="bg-navy-50 text-navy-500 uppercase">
            <tr>
              <th className="text-left px-4 py-2">Visiteur</th>
              <th className="text-left px-4 py-2">Site</th>
              <th className="text-left px-4 py-2">Entrée</th>
              <th className="text-left px-4 py-2">Sortie</th>
              <th className="text-left px-4 py-2">Durée</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">Début</th>
            </tr>
          </thead>
          <tbody>
            {data.visitorTimeline.map((s) => (
              <tr key={s.sessionId} className="border-t border-navy-50">
                <td className="px-4 py-2 text-navy-500 font-mono">{s.visitorId.slice(0, 8)}…</td>
                <td className="px-4 py-2 text-navy-600">{BRAND_LABELS[s.brand || 'itroad-group'] || s.brand || '—'}</td>
                <td className="px-4 py-2 text-navy-600">{s.entryPath || '—'}</td>
                <td className="px-4 py-2 text-navy-600">{s.exitPath || '—'}</td>
                <td className="px-4 py-2 text-navy-600">{formatDuration(s.durationMs)}</td>
                <td className="px-4 py-2 text-navy-600">{s.isReturning ? 'Récurrent' : 'Nouveau'}</td>
                <td className="px-4 py-2 text-navy-400">{s.startedAt ? new Date(s.startedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
            {data.visitorTimeline.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-navy-400">Aucune session enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (brandFilter) params.set('brand', brandFilter);
    const qs = params.toString();
    Promise.all([
      apiFetch('/api/admin/stats', token),
      apiFetch(`/api/admin/leads${qs ? `?${qs}` : ''}`, token),
    ])
      .then(([statsData, leadsData]) => {
        setStats(statsData);
        setLeads(leadsData.leads);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, brandFilter]);

  if (selectedLead) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <LeadDetail token={token} leadId={selectedLead} onBack={() => setSelectedLead(null)} onStatusChange={load} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl text-navy-900">ITROAD — Admin / CRM léger</h1>
        <div className="flex items-center gap-3">
          <button onClick={load} className="p-2 rounded-full hover:bg-navy-100" title="Rafraîchir">
            <RefreshCw className="w-4 h-4 text-navy-500" />
          </button>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Leads totaux', value: stats.totalLeads },
            { label: 'Leads High Intent', value: stats.highIntentLeads },
            { label: 'Événements tracking', value: stats.totalTrackingEvents },
            { label: 'Newsletter', value: stats.newsletterSubscribers },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
              <div className="text-2xl font-bold text-navy-900">{s.value}</div>
              <div className="text-xs text-navy-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <VisitorAnalyticsSection token={token} />

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-sm text-navy-500">Filtrer par statut :</span>
        {['', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              statusFilter === s ? 'bg-navy-900 text-white border-navy-900' : 'border-navy-200 text-navy-600'
            }`}
          >
            {s || 'Tous'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm text-navy-500">Filtrer par site :</span>
        {['', ...Object.keys(BRAND_LABELS)].map((b) => (
          <button
            key={b || 'all-brands'}
            onClick={() => setBrandFilter(b)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              brandFilter === b ? 'bg-navy-900 text-white border-navy-900' : 'border-navy-200 text-navy-600'
            }`}
          >
            {b ? BRAND_LABELS[b] : 'Tous'}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-navy-100 shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-navy-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Site</th>
              <th className="text-left px-4 py-3">Besoin</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3">Créé le</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-navy-400">Chargement...</td></tr>
            )}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-navy-400">Aucun lead pour ce filtre.</td></tr>
            )}
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-navy-50 hover:bg-navy-50/50 cursor-pointer" onClick={() => setSelectedLead(lead.id)}>
                <td className="px-4 py-3 font-medium text-navy-900">{lead.name}</td>
                <td className="px-4 py-3 text-navy-600">{lead.email}</td>
                <td className="px-4 py-3 text-navy-600 text-xs">{BRAND_LABELS[lead.brand || 'itroad-group'] || lead.brand}</td>
                <td className="px-4 py-3 text-navy-600">{lead.challenge}</td>
                <td className="px-4 py-3">
                  <span
                    title={`Challenge ${lead.challengeScore} · Size ${lead.sizeScore} · Completeness ${lead.completenessScore} · Behavioral ${lead.behaviorScore}`}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${LEVEL_COLORS[lead.level] || ''}`}
                  >
                    {lead.score}
                  </span>
                </td>
                <td className="px-4 py-3 text-navy-600">{lead.status}</td>
                <td className="px-4 py-3 text-navy-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3"><ExternalLink className="w-4 h-4 text-navy-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPage() {
  const [token, setToken] = useState<string | null>(() => window.sessionStorage.getItem(TOKEN_KEY));

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-navy-50/60">
      <Dashboard
        token={token}
        onLogout={() => {
          window.sessionStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }}
      />
    </div>
  );
}
