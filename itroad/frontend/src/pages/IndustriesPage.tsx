import {
  ArrowRight,
  HeartPulse,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Building2,
  Factory,
} from 'lucide-react';

import { type Route } from '../lib/router';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { useT } from '../lib/useT';

/* =========================================================
   INDUSTRY ICONS
   ========================================================= */

const INDUSTRY_ICONS = [
  HeartPulse,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Building2,
  Factory,
];

/* =========================================================
   HERO
   ========================================================= */

function IndustriesHero() {

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

              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                {t.industriesPage.eyebrow}
              </span>

            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900">

              {t.industriesPage.title1}{' '}

              <span className="text-gradient">
                {t.industriesPage.title2}
              </span>

            </h1>

            <p className="text-lg text-navy-500 mt-6 leading-relaxed max-w-2xl">
              {t.industriesPage.subtitle}
            </p>

          </div>

        </Reveal>

      </div>

    </section>
  );
}

/* =========================================================
   INDUSTRIES GRID
   ========================================================= */

function IndustriesGrid({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  const t = useT();

  const accentMap: Record<
    string,
    {
      bg: string;
      text: string;
    }
  > = {

    healthcare: {
      bg: 'from-rose-500 to-pink-600',
      text: 'text-rose-600',
    },

    finance: {
      bg: 'from-emerald-500 to-teal-600',
      text: 'text-emerald-600',
    },

    retail: {
      bg: 'from-amber-500 to-orange-600',
      text: 'text-amber-600',
    },

    education: {
      bg: 'from-violet-500 to-purple-600',
      text: 'text-violet-600',
    },

    government: {
      bg: 'from-brand-500 to-navy-700',
      text: 'text-brand-600',
    },

    manufacturing: {
      bg: 'from-cyan-500 to-electric-600',
      text: 'text-cyan-600',
    },

  };

  return (
    <section className="py-16 lg:py-20">

      <div className="container-px max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {t.industriesPage.items.map((ind, i) => {

            const accent =
              accentMap[ind.id] ?? {
                bg: 'from-brand-500 to-navy-700',
                text: 'text-brand-600',
              };

            const Icon =
              INDUSTRY_ICONS[i] ?? Building2;

            return (

              <Reveal
                key={ind.id}
                delay={i * 80}
              >

                <div className="group p-7 rounded-3xl bg-white border border-navy-100 shadow-soft card-hover h-full">

                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent.bg} flex items-center justify-center text-white mb-5`}
                  >

                    <Icon className="w-7 h-7" />

                  </div>

                  <h3 className="font-display font-bold text-xl text-navy-900 group-hover:text-brand-600 transition-colors">

                    {ind.name}

                  </h3>

                  <p className="text-navy-500 text-sm mt-2 leading-relaxed">

                    {ind.description}

                  </p>

                  <button
                    onClick={() => navigate('contact')}
                    className="flex items-center gap-1.5 mt-5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 transition-all"
                  >

                    {t.industriesPage.talkExpert}

                    <ArrowRight className="w-3.5 h-3.5" />

                  </button>

                </div>

              </Reveal>

            );

          })}

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   AI SHOWCASE
   ========================================================= */

function AIShowcase({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  const t = useT();

  return (
    <section className="section-py">

      <div className="container-px max-w-7xl mx-auto">

        <Reveal>

          <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-navy-950 via-brand-900 to-navy-950 px-6 py-16 sm:px-12 sm:py-20 lg:py-24">

            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />

            <div className="absolute bottom-0 left-0 w-80 h-80 bg-electric-500/15 rounded-full blur-3xl" />

            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="relative max-w-2xl">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-6">

                <span className="text-sm font-medium text-electric-400">
                  {t.industriesPage.aiBadge}
                </span>

              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">

                {t.industriesPage.aiTitle1}

                <br />

                <span className="text-gradient-light">
                  {t.industriesPage.aiTitle2}
                </span>

              </h2>

              <p className="text-white/60 text-lg mt-5">
                {t.industriesPage.aiText}
              </p>

              <button
                onClick={() => navigate('contact')}
                className="group inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-full bg-white text-navy-900 font-semibold hover:bg-brand-50 transition-all active:scale-95"
              >

                {t.industriesPage.aiButton}

                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

              </button>

            </div>

          </div>

        </Reveal>

      </div>

    </section>
  );
}

/* =========================================================
   INDUSTRIES PAGE
   ========================================================= */

export function IndustriesPage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  const t = useT();

  return (
    <>

      <IndustriesHero />

      <IndustriesGrid
        navigate={navigate}
      />

      <AIShowcase
        navigate={navigate}
      />

      <CTASection
        navigate={navigate}
        title={t.industriesPage.ctaTitle}
      />

    </>
  );
}