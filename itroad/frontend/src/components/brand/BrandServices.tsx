import {
  Layers, Database, Rocket, Brain, Globe2, ShieldCheck,
  Compass, Server, Cloud, Network, Headphones, FlaskConical,
} from 'lucide-react';
import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';
import { type ServiceItem } from '../../lib/brandContent';

const SERVICE_ICONS = [Layers, Database, Rocket, Brain, Globe2, ShieldCheck, Compass, Server, Cloud, Network, Headphones, FlaskConical];

export function BrandServices({ services }: { services: ServiceItem[] }) {
  return (
    <section className="section-py bg-navy-50/50">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Nos services" title="Ce que nous faisons" center />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <Reveal key={service.title} delay={i * 70}>
                <div
                  data-track-service={service.title}
                  className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft card-hover h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-navy-700 flex items-center justify-center text-white mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy-900">{service.title}</h3>
                  <p className="text-sm text-navy-500 mt-2.5 leading-relaxed">{service.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
