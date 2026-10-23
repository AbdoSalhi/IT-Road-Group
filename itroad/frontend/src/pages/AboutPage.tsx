import { Target, Eye, Award, ShieldCheck, Brain, HeartPulse, LineChart } from 'lucide-react';
import { type Route } from '../lib/router';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { useT } from '../lib/useT';

const VALUE_ICONS = [ShieldCheck, Brain, HeartPulse, LineChart];

function AboutHero() {
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
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{t.about.eyebrow}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900">
              {t.about.title1} <span className="text-gradient">{t.about.title2}</span>
            </h1>
            <p className="text-lg text-navy-500 mt-6 leading-relaxed max-w-2xl">
              {t.about.subtitle}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MissionVision() {
  const t = useT();
  return (
    <section className="py-16 lg:py-20">
      <div className="container-px max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Reveal>
            <div className="p-8 lg:p-10 rounded-4xl bg-gradient-to-br from-brand-600 to-brand-800 text-white h-full">
              <Target className="w-10 h-10 mb-5 text-white/80" />
              <h3 className="font-display font-bold text-2xl">{t.about.missionTitle}</h3>
              <p className="text-white/70 mt-4 leading-relaxed">{t.about.missionText}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="p-8 lg:p-10 rounded-4xl bg-navy-900 text-white h-full">
              <Eye className="w-10 h-10 mb-5 text-electric-400" />
              <h3 className="font-display font-bold text-2xl">{t.about.visionTitle}</h3>
              <p className="text-white/70 mt-4 leading-relaxed">{t.about.visionText}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  const t = useT();
  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow={t.about.journeyEyebrow}
            title={t.about.journeyTitle}
            subtitle={t.about.journeySubtitle}
          />
        </Reveal>

        <div className="mt-14 relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-navy-200 lg:-translate-x-px" />
          <div className="space-y-8 lg:space-y-12">
            {t.about.timeline.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className={`relative flex items-start gap-6 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-brand-100 -translate-x-1.5 lg:-translate-x-1.5 mt-6 z-10" />
                  <div className={`pl-12 lg:pl-0 lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                    <div className="inline-block p-5 rounded-2xl bg-white border border-navy-100 shadow-soft">
                      <div className="font-display font-extrabold text-2xl text-gradient">{item.year}</div>
                      <div className="font-semibold text-navy-900 mt-2">{item.title}</div>
                      <p className="text-sm text-navy-500 mt-1.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const t = useT();
  return (
    <section className="section-py bg-navy-50/50">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow={t.about.valuesEyebrow} title={t.about.valuesTitle} center />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {t.about.values.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? ShieldCheck;
            return (
              <Reveal key={i} delay={i * 80}>
                <div className="p-7 rounded-3xl bg-white border border-navy-100 shadow-soft card-hover h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-7 h-7 text-brand-600" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy-900">{v.title}</h3>
                  <p className="text-sm text-navy-500 mt-2 leading-relaxed">{v.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  const t = useT();
  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow={t.about.leadershipEyebrow}
            title={t.about.leadershipTitle}
            subtitle={t.about.leadershipSubtitle}
          />
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {t.about.leaders.map((l, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group p-6 rounded-3xl bg-white border border-navy-100 shadow-soft card-hover text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-electric-500 flex items-center justify-center mx-auto mb-4 text-white font-display font-bold text-xl">
                  {l.initials}
                </div>
                <h3 className="font-semibold text-navy-900">{l.name}</h3>
                <p className="text-sm text-brand-600 mt-1">{l.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardsSection() {
  const t = useT();
  return (
    <section className="py-16 lg:py-20 bg-navy-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
      <div className="container-px max-w-7xl mx-auto relative">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <Award className="w-10 h-10 text-electric-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white">{t.about.awardsTitle}</h2>
            <p className="text-white/50 mt-4">{t.about.awardsText}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {t.about.awards.map((a, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="glass-dark rounded-2xl p-6 text-center">
                <div className="text-electric-400 font-display font-bold text-sm uppercase tracking-wider">{a}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutPage({ navigate }: { navigate: (r: Route) => void }) {
  const t = useT();
  return (
    <>
      <AboutHero />
      <MissionVision />
      <Timeline />
      <ValuesSection />
      <LeadershipSection />
      <AwardsSection />
      <CTASection navigate={navigate} title={t.about.ctaTitle} />
    </>
  );
}
