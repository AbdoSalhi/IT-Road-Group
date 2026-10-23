import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Reveal } from './Reveal';
import { useT } from '../lib/useT';
import { useLang } from '../lib/i18n';
import { getOrCreateClientId, getTrackingSnapshot, sendTrackingEvent } from '../lib/tracking';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Canonical, language-independent identifiers for the challenge options.
// Index-matched against t.contact.challenges (same order in every language file) -
// this is what gets sent to the backend for scoring, instead of the display
// label, so an English vs French visitor picking the "same" option always
// scores identically. Keep in sync with CHALLENGE_WEIGHTS in backend/app/scoring.py.
const CHALLENGE_KEYS = [
  'ai_data',
  'cybersecurity',
  'cloud_migration',
  'digital_transformation',
  'software_development',
  'other',
];

// Simple, permissive email regex: local@domain.tld
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string) {
  return EMAIL_REGEX.test(value.trim());
}

// Validated via libphonenumber-js (through react-phone-number-input), which
// checks the number against the real numbering plan of its selected country
// rather than a generic digit-count regex. `value` is the E.164 string
// produced by the phone field (e.g. "+212612345678").
function isValidPhone(value: string) {
  return isValidPhoneNumber(value);
}

export function LeadQualificationForm({
  brand,
  source,
}: {
  /** Subsidiary id (e.g. "btech", "smartway") - omit for the main ITROAD Group site. */
  brand?: string;
  /** Lead source tag stored on the backend, e.g. "btech_contact_form". Defaults to "contact_form". */
  source?: string;
}) {
  const t = useT();
  const { lang } = useLang();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const hasStarted = useRef(false);

  const nameError = nameTouched && !name.trim() ? t.contact.nameRequiredError : null;
  const emailError = emailTouched && email.trim() && !isValidEmail(email) ? t.contact.emailInvalidError : null;
  // Phone is optional - only validate the format once something has been typed.
  const phoneError = phoneTouched && phone.trim() && !isValidPhone(phone) ? t.contact.phoneInvalidError : null;

  const isNameValid = name.trim().length > 0;
  const isEmailValid = email.trim().length > 0 && isValidEmail(email);
  const isPhoneValid = phone.trim().length === 0 || isValidPhone(phone);
  const isStep3Valid = useMemo(
    () => isNameValid && isEmailValid && isPhoneValid,
    [isNameValid, isEmailValid, isPhoneValid],
  );

  const trackingSection = brand ? `${brand}-contact-form` : 'contact-qualification-form';

  useEffect(() => {
    sendTrackingEvent('contact_form_opened', { section: trackingSection });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markStarted = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      sendTrackingEvent('contact_form_started', { section: trackingSection });
    }
  };

  const handleSubmit = async () => {
    setNameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    if (!isStep3Valid) return;

    setSubmitError(null);
    setIsSubmitting(true);
    const challengeIndex = t.contact.challenges.indexOf(challenge);
    const challengeKey = CHALLENGE_KEYS[challengeIndex] || 'other';
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: getOrCreateClientId(),
          challenge: challengeKey,
          challengeLabel: challenge,
          size: companySize,
          name,
          email,
          phone,
          tracking: getTrackingSnapshot(),
          source: source || 'contact_form',
          brand: brand || null,
        }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        // eslint-disable-next-line no-console
        console.error(`Lead submission failed: HTTP ${response.status}`, detail);
        throw new Error(`HTTP ${response.status}`);
      }
      await sendTrackingEvent('contact_form_submitted', { section: trackingSection });
      setSubmitted(true);
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      // eslint-disable-next-line no-console
      console.error('Contact form submission error:', err, `apiUrl=${API_URL}`);
      setSubmitError(
        isNetworkError
          ? (lang === 'fr'
              ? `Impossible de contacter le serveur (${API_URL}). Vérifiez qu'il est bien démarré, ou réessayez plus tard.`
              : `Couldn't reach the server (${API_URL}). Please check it's running, or try again later.`)
          : (lang === 'fr'
              ? "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement par email."
              : 'Something went wrong while sending your request. Please try again or reach us directly by email.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = 3;

  return (
    <Reveal>
      {submitted ? (
        <div className="text-center p-8 lg:p-10 rounded-3xl bg-white border border-navy-100 shadow-soft">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-brand-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-navy-900">{t.contact.successTitle}</h2>
          <p className="text-navy-500 mt-3 leading-relaxed text-sm">{t.contact.successText}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setChallenge('');
              setCompanySize('');
              setName('');
              setEmail('');
              setPhone('');
              setSubmitError(null);
              setNameTouched(false);
              setEmailTouched(false);
              setPhoneTouched(false);
              hasStarted.current = false;
            }}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors"
          >
            {t.contact.newRequest}
          </button>
        </div>
      ) : (
        <div className="p-6 sm:p-7 lg:p-8 rounded-3xl bg-white border border-navy-100 shadow-soft">
          <div className="flex items-center justify-between mb-7">
            <span className="text-sm font-semibold text-brand-600">{t.contact.step(step, total)}</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${s <= step ? 'bg-brand-500 w-7' : 'bg-navy-100 w-5'}`}
                />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-900 mb-6">{t.contact.step1Title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.contact.challenges.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      markStarted();
                      setChallenge(c);
                    }}
                    className={`p-4 rounded-xl border text-left font-medium text-sm transition-all ${
                      challenge === c
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-navy-100 text-navy-700 hover:border-brand-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!challenge}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 text-white text-sm font-semibold disabled:opacity-40 hover:bg-navy-800 transition-colors"
                >
                  {t.contact.next}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-900 mb-6">{t.contact.step2Title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {t.contact.companySizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setCompanySize(s)}
                    className={`p-4 rounded-xl border text-center font-semibold text-sm transition-all ${
                      companySize === s
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-navy-100 text-navy-700 hover:border-brand-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy-200 text-navy-700 text-sm font-semibold hover:bg-navy-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.contact.prev}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!companySize}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 text-white text-sm font-semibold disabled:opacity-40 hover:bg-navy-800 transition-colors"
                >
                  {t.contact.next}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-900 mb-6">{t.contact.step3Title}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">{t.contact.fullName}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    aria-invalid={!!nameError}
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      nameError ? 'border-red-300 focus:ring-red-400' : 'border-navy-200 focus:ring-brand-500'
                    }`}
                  />
                  <div className={`text-xs text-red-600 mt-1.5 transition-opacity ${nameError ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {nameError || '\u00A0'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">{t.contact.workEmail}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    aria-invalid={!!emailError}
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      emailError ? 'border-red-300 focus:ring-red-400' : 'border-navy-200 focus:ring-brand-500'
                    }`}
                  />
                  <div className={`text-xs text-red-600 mt-1.5 transition-opacity ${emailError ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {emailError || '\u00A0'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">{t.contact.phone}</label>
                  <div className={`phone-field ${phoneError ? 'phone-field--error' : ''}`}>
                    <PhoneInput
                      international
                      defaultCountry="MA"
                      value={phone}
                      onChange={(value) => setPhone(value || '')}
                      onBlur={() => setPhoneTouched(true)}
                      numberInputProps={{
                        'aria-invalid': !!phoneError,
                        'aria-label': t.contact.phone,
                      }}
                    />
                  </div>
                  <div className={`text-xs text-red-600 mt-1.5 transition-opacity ${phoneError ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {phoneError || '\u00A0'}
                  </div>
                </div>
              </div>
              {submitError && (
                <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy-200 text-navy-700 text-sm font-semibold hover:bg-navy-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.contact.prev}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isStep3Valid || isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-white text-sm font-semibold disabled:opacity-40 hover:bg-brand-700 transition-colors"
                >
                  {isSubmitting ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : t.contact.submit}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Reveal>
  );
}
