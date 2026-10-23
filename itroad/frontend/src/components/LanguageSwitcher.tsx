import { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLang } from '../lib/i18n';
import type { Lang } from '../lib/i18n';

const LANG_LABELS: Record<Lang, string> = {
  en: 'EN',
  fr: 'FR',
};

const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  fr: 'Français',
};

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (l: Lang) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 transition-colors"
      >
        <Globe className="w-4 h-4 opacity-60" />
        <span className="font-semibold">{LANG_LABELS[lang]}</span>
        <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-2xl glass shadow-elevated p-1.5 z-50 animate-fade-in"
        >
          {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
            <button
              key={l}
              role="option"
              aria-selected={lang === l}
              onClick={() => pick(l)}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                lang === l
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-navy-700 hover:bg-navy-50'
              }`}
            >
              <span className="text-base leading-none">{l === 'en' ? '🇬🇧' : '🇫🇷'}</span>
              {LANG_NAMES[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
