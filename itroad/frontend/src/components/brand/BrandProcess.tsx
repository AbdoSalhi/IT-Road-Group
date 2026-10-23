import { ArrowRight } from 'lucide-react';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function BrandProcess({ steps }: { steps?: string[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="section-py">
      <div className="container-px max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Notre approche" title="Approche 360°" center />
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {steps.map((step, i) => (
            <Reveal key={step} delay={i * 60} className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-full bg-white border border-navy-100 shadow-soft font-semibold text-sm text-navy-800">
                {step}
              </div>
              {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-brand-400 flex-shrink-0" />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
