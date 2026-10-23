import {
  ArrowRight,
  ShieldCheck,
  Rocket,
  Network,
  Radar,
  Sparkles,
  Star,
  Building2,
  Landmark,
  Factory,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
} from 'lucide-react';

import { type Route } from '../lib/router';
import { Button } from '../components/Button';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { ClientLogosCarousel } from '../components/ClientLogosCarousel';
import { SubsidiariesGrid } from '../components/SubsidiariesGrid';
import PremiumLogo from '../components/PremiumLogo';
import { useCountUp, useReveal } from '../lib/hooks';
import { useT } from '../lib/useT';

import {
  partners,
  subsidiaries,
} from '../lib/data';


/* =========================================================
   ICONS
   ========================================================= */

const EXPERTISE_ICONS = [
  ShieldCheck,
  Rocket,
  Network,
  Radar,
  Sparkles,
];

const INDUSTRY_ICONS = [
  Building2,
  Landmark,
  Factory,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
];


/* =========================================================
   HERO
   ========================================================= */

function Hero({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  const t = useT();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-200/30 rounded-full blur-3xl" />

        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-electric-200/20 rounded-full blur-3xl" />

        <div className="absolute inset-0 grid-pattern opacity-60" />

      </div>


      <div className="container-px max-w-7xl mx-auto w-full">

        {/* Main Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT */}
          <div className="max-w-3xl">

            <Reveal>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-soft mb-8">

                <Sparkles className="w-4 h-4 text-brand-500" />

                <span className="text-sm font-medium text-navy-700">
                  {t.hero.badge}
                </span>

              </div>

            </Reveal>


            <Reveal delay={100}>

              <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-navy-900">

                {t.hero.title1}

                <br />

                <span className="text-gradient">
                  {t.hero.title2}
                </span>

              </h1>

            </Reveal>


            <Reveal delay={200}>

              <p className="text-lg sm:text-xl text-navy-500 mt-6 max-w-2xl leading-relaxed">
                {t.hero.subtitle}
              </p>

            </Reveal>


            <Reveal delay={300}>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <Button
                  size="lg"
                  onClick={() => navigate('contact')}
                  className="group"
                >

                  {t.hero.bookConsultation}

                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

                </Button>


                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('services')}
                >

                  {t.hero.exploreServices}

                </Button>

              </div>

            </Reveal>

          </div>


          {/* RIGHT - PREMIUM LOGO */}
          <Reveal delay={300}>

            <div className="relative flex items-center justify-center lg:justify-end">

              {/* Logo glow */}
              <div className="absolute w-[420px] h-[420px] bg-brand-100/30 rounded-full blur-3xl" />


              {/* Premium animated logo */}
              <div className="relative w-full max-w-[460px] lg:max-w-[500px]">

                <PremiumLogo className="w-full h-auto" />

              </div>

            </div>

          </Reveal>

        </div>


        {/* Floating Preview Cards */}
        <Reveal delay={500}>

          <div className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">

            {t.hero.cards.map((item, i) => (

              <div
                key={i}
                className="glass rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-0.5"
              >

                <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {item.label}
                </div>

                <div className="text-sm font-medium text-navy-700 mt-1.5">
                  {item.value}
                </div>

              </div>

            ))}

          </div>

        </Reveal>

      </div>

    </section>
  );
}


/* =========================================================
   STATS
   ========================================================= */

function StatsSection() {

  const {
    ref,
    visible,
  } = useReveal();

  const t = useT();

  return (
    <section className="py-16 lg:py-20 border-y border-navy-100">

      <div
        className="container-px max-w-7xl mx-auto"
        ref={ref}
      >

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {t.stats.map((stat, i) => (

            <StatItem
              key={i}
              stat={stat}
              start={visible}
              delay={i * 100}
            />

          ))}

        </div>

      </div>

    </section>
  );
}


function StatItem({
  stat,
  start,
  delay,
}: {
  stat: {
    value: number;
    suffix: string;
    label: string;
  };
  start: boolean;
  delay: number;
}) {

  const value = useCountUp(
    stat.value,
    2000,
    start
  );

  return (
    <div
      className="text-center"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >

      <div
        className="font-display font-extrabold text-4xl lg:text-5xl"
        style={{ color: '#13B4EB' }}
      >

        {Math.round(value)}

        {stat.suffix}

      </div>

      <div className="text-sm text-navy-500 mt-2 font-medium">
        {stat.label}
      </div>

    </div>
  );
}


/* =========================================================
   INTEGRATED EXPERTISE
   ========================================================= */

function IntegratedExpertise({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  const t = useT();

  return (
    <section className="section-py">

      <div className="container-px max-w-7xl mx-auto">

        <Reveal>

          <SectionHeading
            eyebrow={t.expertise.eyebrow}
            title={t.expertise.title}
            subtitle={t.expertise.subtitle}
          />

        </Reveal>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">

          {t.expertise.items.map((item, i) => {

            const Icon =
              EXPERTISE_ICONS[i] ?? ShieldCheck;

            return (

              <Reveal
                key={item.n}
                delay={i * 80}
                className={
                  i === 0
                    ? 'md:col-span-2 lg:col-span-2'
                    : ''
                }
              >

                <button
                  onClick={() => navigate('services')}
                  className={`
                    group
                    relative
                    block
                    w-full
                    text-left
                    p-7
                    rounded-3xl
                    border
                    shadow-soft
                    card-hover
                    h-full
                    overflow-hidden
                    transition-all
                    duration-300
                    ${
                      item.accent
                        ? 'bg-gradient-to-br from-brand-600 to-brand-700 border-brand-500'
                        : 'bg-white border-navy-100'
                    }
                  `}
                >

                  <div className="flex items-start justify-between mb-5">

                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        transition-transform
                        group-hover:scale-110
                        ${
                          item.accent
                            ? 'bg-white/20 text-white'
                            : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                        }
                      `}
                    >

                      <Icon className="w-6 h-6" />

                    </div>


                    <span
                      className={`
                        font-display
                        font-extrabold
                        text-2xl
                        ${
                          item.accent
                            ? 'text-white/30'
                            : 'text-navy-200'
                        }
                      `}
                    >
                      {item.n}
                    </span>

                  </div>


                  <h3
                    className={`
                      font-display
                      font-bold
                      text-xl
                      transition-colors
                      ${
                        item.accent
                          ? 'text-white'
                          : 'text-navy-900 group-hover:text-brand-600'
                      }
                    `}
                  >
                    {item.title}
                  </h3>


                  <p
                    className={`
                      text-sm
                      mt-2
                      leading-relaxed
                      ${
                        item.accent
                          ? 'text-white/80'
                          : 'text-navy-500'
                      }
                    `}
                  >
                    {item.body}
                  </p>


                  <div className="mt-5 flex flex-wrap gap-1.5">

                    {item.tags.map((tag) => (

                      <span
                        key={tag}
                        className={`
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            item.accent
                              ? 'bg-white/15 text-white/90'
                              : 'bg-navy-50 text-navy-600'
                          }
                        `}
                      >
                        {tag}
                      </span>

                    ))}

                  </div>


                  <div
                    className={`
                      flex
                      items-center
                      gap-1.5
                      mt-5
                      text-sm
                      font-semibold
                      ${
                        item.accent
                          ? 'text-white'
                          : 'text-brand-600'
                      }
                    `}
                  >

                    {t.expertise.learnMore}

                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />

                  </div>

                </button>

              </Reveal>

            );
          })}

        </div>


        <Reveal delay={120}>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-navy-50/60 border border-navy-100">

            <p className="text-navy-700 text-sm sm:text-base font-medium text-center sm:text-left">
              {t.expertise.bannerText}
            </p>

            <Button
              variant="outline"
              onClick={() => navigate('services')}
              className="group flex-shrink-0"
            >

              {t.expertise.exploreAll}

              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

            </Button>

          </div>

        </Reveal>

      </div>

    </section>
  );
}


/* =========================================================
   INDUSTRIES
   ========================================================= */

function IndustriesPreview({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  const t = useT();

  return (
    <section className="section-py bg-navy-50/50">

      <div className="container-px max-w-7xl mx-auto">

        <Reveal>

          <SectionHeading
            eyebrow={t.homeIndustries.eyebrow}
            title={t.homeIndustries.title}
            subtitle={t.homeIndustries.subtitle}
          />

        </Reveal>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">

          {t.industriesPage.items.map((ind, i) => {

            const Icon =
              INDUSTRY_ICONS[i] ?? Building2;

            return (

              <Reveal
                key={ind.id}
                delay={i * 70}
              >

                <button
                  onClick={() => navigate('industries')}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    p-6
                    rounded-2xl
                    bg-white
                    border
                    border-navy-100
                    shadow-soft
                    card-hover
                    w-full
                    text-left
                    min-h-[110px]
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-gradient-to-br
                      from-brand-500
                      to-navy-700
                      flex
                      items-center
                      justify-center
                      text-white
                      flex-shrink-0
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  >

                    <Icon className="w-6 h-6" />

                  </div>


                  <div className="min-w-0">

                    <div className="font-semibold text-navy-900 group-hover:text-brand-600 transition-colors">
                      {ind.name}
                    </div>

                    <div className="text-xs text-navy-400 mt-1 line-clamp-2">
                      {ind.description}
                    </div>

                  </div>

                </button>

              </Reveal>

            );
          })}

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   TECHNOLOGY PARTNERS
   12 LOGOS - 2 ROWS - SMOOTH INFINITE ANIMATION
   ========================================================= */

function PartnersSection() {

  const t = useT();

  const firstRow = partners.slice(0, 6);

  const secondRow = partners.slice(6, 12);


  const PartnerRow = ({
    row,
    reverse = false,
  }: {
    row: typeof partners;
    reverse?: boolean;
  }) => {

    const duplicatedRow = [
      ...row,
      ...row,
      ...row,
    ];

    return (

      <div className="relative overflow-hidden">

        <div
          className={`
            flex
            w-max
            gap-6
            ${
              reverse
                ? 'animate-partners-right'
                : 'animate-partners-left'
            }
          `}
        >

          {duplicatedRow.map((partner, index) => (

            <div
              key={`${partner.name}-${index}`}
              className="
                group
                flex
                items-center
                justify-center
                flex-shrink-0
                w-[180px]
                sm:w-[200px]
                h-32
                px-8
                py-6
                rounded-3xl
                bg-white
                border
                border-navy-100
                shadow-soft
                hover:shadow-card
                hover:border-brand-200
                transition-all
                duration-300
              "
            >

              <img
                src={partner.src}
                alt={`${partner.name} logo`}
                className="
                  max-h-16
                  max-w-[150px]
                  w-auto
                  h-auto
                  object-contain
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
                loading="lazy"
              />

            </div>

          ))}

        </div>

      </div>
    );
  };


  return (
    <section className="py-16 lg:py-20 overflow-hidden">

      <div className="container-px max-w-7xl mx-auto">

        <Reveal>

          <p className="text-center text-sm font-semibold uppercase tracking-widest text-navy-400 mb-10">
            {t.homePartners.label}
          </p>

        </Reveal>


        {/* Row 1 */}
        <div className="mb-6">

          <PartnerRow
            row={firstRow}
          />

        </div>


        {/* Row 2 - Opposite direction */}
        <PartnerRow
          row={secondRow}
          reverse
        />

      </div>

    </section>
  );
}


/* =========================================================
   TESTIMONIALS
   ========================================================= */

function TestimonialsSection() {

  const t = useT();

  return (
    <section className="section-py bg-navy-950 relative overflow-hidden">

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-electric-500/15 rounded-full blur-3xl" />


      <div className="container-px max-w-7xl mx-auto relative">

        <Reveal>

          <SectionHeading
            eyebrow={t.testimonials.eyebrow}
            title={
              <span className="text-white">
                {t.testimonials.title}
              </span>
            }
            subtitle={t.testimonials.subtitle}
            light
          />

        </Reveal>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-14">

          {t.testimonials.items.map((item, i) => (

            <Reveal
              key={i}
              delay={i * 100}
            >

              <div className="glass-dark rounded-3xl p-7 h-full flex flex-col">

                <div className="flex gap-0.5 mb-4">

                  {[...Array(5)].map((_, j) => (

                    <Star
                      key={j}
                      className="w-4 h-4 fill-electric-400 text-electric-400"
                    />

                  ))}

                </div>


                <p className="text-white/80 text-base leading-relaxed flex-1">
                  "{item.quote}"
                </p>


                <div className="mt-6 pt-6 border-t border-white/10">

                  <div className="font-semibold text-white text-sm">
                    {item.author}
                  </div>

                  <div className="text-white/40 text-sm mt-0.5">
                    {item.role}, {item.company}
                  </div>

                </div>

              </div>

            </Reveal>

          ))}

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   TRUSTED CLIENTS — THEY TRUST US
   ========================================================= */

function TrustedByClientsSection() {
  const t = useT();

  return (
    <section className="section-py bg-white overflow-hidden">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow={t.trusted.eyebrow}
            title={t.trusted.title}
            subtitle={t.trusted.subtitle}
            center
          />
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-14">
            <ClientLogosCarousel />
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* =========================================================
   SUBSIDIARIES
   ========================================================= */

function SubsidiariesSection({ navigate }: { navigate: (r: Route) => void }) {

  const t = useT();

  return (
    <section className="section-py">

      <div className="container-px max-w-7xl mx-auto">

        <Reveal>

          <div className="mb-8">

            <h2
              className="
                font-display
                font-extrabold
                text-2xl
                sm:text-3xl
                uppercase
                tracking-tight
              "
              style={{
                color: '#1a2c8f',
              }}
            >
              {t.subsidiaries.title}
            </h2>


            <div
              className="mt-2 h-1 w-16 rounded-full"
              style={{
                backgroundColor: '#29abe2',
              }}
            />

          </div>

        </Reveal>


        <Reveal delay={80}>

          <p className="text-navy-400 text-base leading-relaxed max-w-2xl mb-12">
            {t.subsidiaries.description}
          </p>

        </Reveal>


        <SubsidiariesGrid
          subsidiaries={subsidiaries}
          navigate={navigate}
        />

      </div>

    </section>
  );
}


/* =========================================================
   HOME PAGE
   ========================================================= */

export function HomePage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {

  return (
    <>

      <Hero
        navigate={navigate}
      />

      <StatsSection />

      <IntegratedExpertise
        navigate={navigate}
      />

      <IndustriesPreview
        navigate={navigate}
      />

      <PartnersSection />

      <SubsidiariesSection navigate={navigate} />

      <TestimonialsSection />

      <TrustedByClientsSection />

      <CTASection
        navigate={navigate}
      />

    </>
  );
}