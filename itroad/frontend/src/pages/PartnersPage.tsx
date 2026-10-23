import { ShieldCheck, Award, Cloud, Cpu } from 'lucide-react';
import { type Route } from '../lib/router';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { useT } from '../lib/useT';
import { partners } from '../lib/data';

function PartnersHero() {
  const t = useT();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white" />
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
      </div>
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-brand-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{t.partnersPage.eyebrow}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900">
              {t.partnersPage.title1} <span className="text-gradient">{t.partnersPage.title2}</span>
            </h1>
            <p className="text-lg text-navy-500 mt-6 leading-relaxed max-w-2xl">
              {t.partnersPage.subtitle}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PartnerLogos() {
  // Split partners into rows of 4
  const rows = [];
  for (let i = 0; i < partners.length; i += 4) {
    rows.push(partners.slice(i, i + 4));
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container-px max-w-7xl mx-auto">
        <div className="space-y-5">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid gap-5 ${row.length === 4
                  ? "grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-2 lg:grid-cols-3 lg:max-w-[75%] mx-auto"
                }`}
            >
              {row.map((p, i) => (
                <Reveal
                  key={p.name}
                  delay={(rowIndex * 4 + i) * 60}
                >
                  <div className="group flex items-center justify-center h-32 px-8 py-6 rounded-3xl bg-white border border-navy-100 shadow-soft hover:shadow-card hover:border-brand-200 transition-all duration-300">
                    <img
                      src={p.src}
                      alt={`${p.name} logo`}
                      className="max-h-16 max-w-[150px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerTiers() {
  const t = useT();
  const ICONS = [Award, Cloud, ShieldCheck, Cpu];
  return (
    <section className="section-py bg-navy-50/50">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow={t.partnersPage.certEyebrow} title={t.partnersPage.certTitle} center />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {t.partnersPage.tiers.map((tier, i) => {
            const Icon = ICONS[i] ?? Award;
            return (
              <Reveal key={i} delay={i * 80}>
                <div className="p-7 rounded-3xl bg-white border border-navy-100 shadow-soft card-hover h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <h3 className="font-display font-bold text-base text-navy-900">{tier.title}</h3>
                  <p className="text-sm text-navy-500 mt-2 leading-relaxed">{tier.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PartnersPage({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  return (
    <>
      <PartnersHero />
      <PartnerLogos />
      <PartnerTiers />
      <CTASection navigate={navigate} title={t.partnersPage.ctaTitle} />
    </>
  );
}
