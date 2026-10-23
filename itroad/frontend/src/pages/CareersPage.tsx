import { ArrowRight, LineChart, HeartPulse, Brain, Database } from 'lucide-react';
import { type Route } from '../lib/router';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { useT } from '../lib/useT';
import { sendTrackingEvent } from '../lib/tracking';

function CareersHero() {
  const t = useT();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-electric-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
      </div>
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-brand-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{t.careers.eyebrow}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900">
              {t.careers.title1} <span className="text-gradient">{t.careers.title2}</span>
            </h1>
            <p className="text-lg text-navy-500 mt-6 leading-relaxed max-w-2xl">
              {t.careers.subtitle}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CultureSection() {
  const t = useT();
  const ICONS = [LineChart, HeartPulse, Brain, Database];
  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow={t.careers.cultureEyebrow}
            title={t.careers.cultureTitle}
            subtitle={t.careers.cultureSubtitle}
          />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {t.careers.benefits.map((b, i) => {
            const Icon = ICONS[i] ?? LineChart;
            return (
              <Reveal key={i} delay={i * 80}>
                <div className="p-7 rounded-3xl bg-white border border-navy-100 shadow-soft card-hover h-full">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-brand-600" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy-900">{b.title}</h3>
                  <p className="text-sm text-navy-500 mt-2 leading-relaxed">{b.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function OpenPositions({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  return (
    <section className="section-py bg-navy-50/50">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow={t.careers.openEyebrow}
            title={t.careers.openTitle}
            subtitle={t.careers.openSubtitle}
          />
        </Reveal>
        <div className="mt-12 space-y-3">
          {t.careers.jobs.map((job, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-navy-100 shadow-soft hover:border-brand-300 transition-all">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-navy-400">
                    <span>{job.department}</span>
                    <span className="w-1 h-1 rounded-full bg-navy-300" />
                    <span>{job.location}</span>
                    <span className="w-1 h-1 rounded-full bg-navy-300" />
                    <span>{job.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sendTrackingEvent('career_application_click', { meta: job.title });
                    navigate('contact');
                  }}
                  data-track-cta={`careers-apply-${job.title}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-navy-900 text-white text-sm font-semibold hover:bg-brand-600 transition-colors self-start sm:self-center"
                >
                  {t.careers.apply}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CareersPage({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  return (
    <>
      <CareersHero />
      <CultureSection />
      <OpenPositions navigate={navigate} />
      <CTASection navigate={navigate} title={t.careers.ctaTitle} />
    </>
  );
}
