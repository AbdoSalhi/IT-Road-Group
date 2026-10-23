import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { type FAQ } from '../lib/data';
import { Reveal } from './Reveal';

export function FAQAccordion({ faqs, light = false }: { faqs: FAQ[]; light?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <Reveal key={i} delay={i * 80}>
          <div
            className={`rounded-2xl border transition-all duration-300 ${
              open === i
                ? light
                  ? 'bg-white/5 border-white/20'
                  : 'bg-brand-50/50 border-brand-200'
                : light
                  ? 'bg-transparent border-white/10'
                  : 'bg-white border-navy-100'
            }`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-center justify-between w-full p-5 text-left"
            >
              <span className={`font-semibold text-base ${light ? 'text-white' : 'text-navy-900'}`}>
                {faq.question}
              </span>
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                open === i ? 'bg-brand-600 text-white' : light ? 'bg-white/10 text-white' : 'bg-navy-100 text-navy-600'
              }`}>
                {open === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48' : 'max-h-0'}`}>
              <p className={`px-5 pb-5 text-sm leading-relaxed ${light ? 'text-white/60' : 'text-navy-500'}`}>
                {faq.answer}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
