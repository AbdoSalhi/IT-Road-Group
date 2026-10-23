import { Quote } from 'lucide-react';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { type PartnerItem, type TechStackGroup } from '../../lib/brandContent';

export function BrandClientsPartners({
  clients,
  partners,
  techStack,
  testimonial,
}: {
  clients?: string[];
  partners?: PartnerItem[];
  techStack?: TechStackGroup[];
  testimonial?: { quote: string; author: string; role: string };
}) {
  const hasAnything = (clients?.length || partners?.length || techStack?.length || testimonial);
  if (!hasAnything) return null;

  return (
    <section className="section-py">
      <div className="container-px max-w-6xl mx-auto space-y-16">
        {clients && clients.length > 0 && (
          <Reveal>
            <SectionHeading eyebrow="Clients de référence" title="Ils nous font confiance" center />
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {clients.map((c) => (
                <span key={c} className="px-4 py-2 rounded-full bg-navy-50 border border-navy-100 text-sm font-medium text-navy-700">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {partners && partners.length > 0 && (
          <Reveal delay={100}>
            <SectionHeading eyebrow="Partenaires technologiques" title="Nos partenaires" center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              {partners.map((p) => (
                <div key={p.name} className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft text-center">
                  <div className="font-display font-bold text-lg text-navy-900">{p.name}</div>
                  {p.description && <div className="text-xs text-navy-400 mt-1.5">{p.description}</div>}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {techStack && techStack.length > 0 && (
          <Reveal delay={150}>
            <SectionHeading eyebrow="Notre stack technique" title="Les technologies que nous utilisons" center />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              {techStack.map((group) => (
                <div key={group.category} className="p-5 rounded-2xl bg-navy-50/60 border border-navy-100">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-3">{group.category}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="px-3 py-1 rounded-full bg-white border border-navy-100 text-xs font-medium text-navy-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {testimonial && (
          <Reveal delay={200}>
            <div className="relative p-8 sm:p-10 rounded-3xl bg-navy-950 text-white max-w-3xl mx-auto text-center">
              <Quote className="w-8 h-8 text-brand-400 mx-auto mb-5" />
              <p className="text-lg leading-relaxed text-white/90">{testimonial.quote}</p>
              <div className="mt-6 font-semibold">{testimonial.author}</div>
              <div className="text-sm text-white/50">{testimonial.role}</div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
