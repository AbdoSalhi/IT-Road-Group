import { Check } from 'lucide-react';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { type BrandContent } from '../../lib/brandContent';

export function BrandAbout({ content }: { content: BrandContent }) {
  if (!content.about && !content.whyUs) return null;

  return (
    <section className="section-py">
      <div className="container-px max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {content.about && (
          <Reveal>
            <SectionHeading eyebrow="À propos" title={content.about.title} />
            <div className="mt-6 space-y-4">
              {content.about.paragraphs.map((p, i) => (
                <p key={i} className="text-navy-500 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        )}

        {content.whyUs && (
          <Reveal delay={120}>
            <div className="p-6 sm:p-8 rounded-3xl bg-navy-50/60 border border-navy-100">
              <h3 className="font-display font-bold text-xl text-navy-900 mb-5">{content.whyUs.title}</h3>
              <ul className="space-y-3.5">
                {content.whyUs.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-brand-600" />
                    </div>
                    <span className="text-sm text-navy-700 leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
