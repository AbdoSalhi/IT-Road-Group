import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import {
  Check,
  ArrowRight,
  ChevronDown,
  Layers,
  ShieldCheck,
  Rocket,
  Network,
  Radar,
  Sparkles,
  Workflow,
  PackageCheck,
  Users,
  BadgeCheck,
  AlertTriangle,
  Target,
  Database,
  Cpu,
  BarChart3,
} from 'lucide-react';

import { type Route } from '../lib/router';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { FAQAccordion } from '../components/FAQAccordion';
import { Button } from '../components/Button';
import { useT } from '../lib/useT';

/* =========================================================
   SERVICE ICONS
   Same icon set & order as the Home "Expertise intégrée"
   section (EXPERTISE_ICONS), so the two sections visually match.
   01 Conseil & Audit · 02 Transformation & Delivery
   03 Architecture & Données · 04 Cybersécurité & Run
   05 IA & Data Science
   ========================================================= */

const SERVICE_ICONS = [ShieldCheck, Rocket, Network, Radar, Sparkles];

const TAG_ICONS = [Target, ShieldCheck, Database, Layers, Workflow, Cpu, BarChart3, Radar, Sparkles];

const ACCENT_MAP: Record<string, string> = {
  'conseil-audit': 'from-brand-500 to-brand-700',
  'transformation-delivery': 'from-electric-500 to-cyan-500',
  'architecture-data': 'from-brand-600 to-electric-500',
  'cybersecurite-run': 'from-navy-700 to-brand-700',
  'ia-data-science': 'from-brand-500 to-navy-600',
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* =========================================================
   SECTION DIVIDER
   Decorative curved band used between sections that switch
   background color, so the page reads as a continuous
   storytelling flow instead of hard-stacked blocks.
   ========================================================= */

function SectionDivider({ flip = false, fill }: { flip?: boolean; fill: string }) {
  return (
    <div aria-hidden="true" className="relative h-12 sm:h-16 lg:h-24 overflow-hidden">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`absolute inset-0 w-full h-full ${flip ? 'rotate-180' : ''}`}
      >
        <path d="M0,32 C320,110 1120,-10 1440,68 L1440,120 L0,120 Z" fill={fill} />
      </svg>
    </div>
  );
}

/* =========================================================
   HERO
   Big, editorial, ServiceNow-style split hero with a
   floating decorative constellation of the 5 service icons,
   giant ghost typography, and a subtle mouse-parallax field.
   ========================================================= */

function ServicesHero({
  active,
  setActive,
  total,
  navigate,
}: {
  active: number;
  setActive: (i: number) => void;
  total: number;
  navigate: (r: Route) => void;
}) {
  const t = useT();
  const current = t.services.items[active];
  const accent = ACCENT_MAP[current.id] ?? 'from-brand-500 to-brand-700';
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <section
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative pb-40 lg:pb-48 bg-navy-950"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />
        <div className="absolute inset-0 grid-pattern opacity-[0.15]" />

        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: `translate3d(${tilt.x * -24}px, ${tilt.y * -24}px, 0)` }}
          className="absolute -top-24 left-[-10%] w-[560px] h-[560px] bg-brand-500/25 rounded-full blur-[120px] transition-transform duration-700 ease-out"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: `translate3d(${tilt.x * 28}px, ${tilt.y * 28}px, 0)` }}
          className="absolute bottom-[-25%] right-[-5%] w-[520px] h-[520px] bg-electric-500/20 rounded-full blur-[120px] transition-transform duration-700 ease-out"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-brand-400/10 rounded-full blur-[100px]"
        />

        {/* Giant ghost editorial typography */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.8, ease: EASE }}
              aria-hidden="true"
              className="select-none pointer-events-none"
            >
              <div className="font-display font-extrabold text-[22vw] leading-none text-center text-white/[0.035] whitespace-nowrap tracking-tight">
                {current.title}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Sticky service tabs — first element inside the hero */}
      <StickyServiceNav active={active} setActive={setActive} />

      <div className="container-px max-w-7xl mx-auto pt-8 lg:pt-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          {/* Text column */}
          <div className="relative lg:flex lg:flex-col lg:min-h-[460px]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex self-start items-center gap-2.5 mb-8 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                {t.services.eyebrow}
              </span>
            </motion.div>

            {/* Faint oversized index numeral, editorial-style */}
            <span
              aria-hidden="true"
              className="hidden sm:block absolute -top-6 -left-2 font-display font-extrabold text-[7rem] leading-none text-white/[0.05] select-none pointer-events-none"
            >
              {`0${active + 1}`}
            </span>

            <AnimatePresence mode="wait">
              <motion.h1
                key={active}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="relative font-display font-extrabold text-5xl sm:text-6xl lg:text-8xl tracking-tight leading-[0.98] text-white"
              >
                {current.tagline}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
                className="text-lg text-white/55 mt-8 leading-relaxed max-w-xl"
              >
                {current.context}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
              className="flex items-center gap-4 mt-11"
            >
              <div className="flex -space-x-2">
                {t.services.items.map((s, i) => {
                  const I = SERVICE_ICONS[i] ?? ShieldCheck;
                  return (
                    <span
                      key={s.id}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${i === active
                        ? 'border-electric-400 bg-navy-800 text-electric-300 z-10 scale-110'
                        : 'border-navy-950 bg-navy-800/80 text-white/40'
                        } transition-all duration-300`}
                    >
                      <I className="w-3.5 h-3.5" />
                    </span>
                  );
                })}
              </div>
              <span className="text-xs font-mono text-white/40 tracking-wide">
                {`0${active + 1} / 0${total}`}
              </span>
            </motion.div>

            {/* CTA button group — anchored bottom-right of the text column */}
            <div className="flex flex-wrap gap-3 mt-9 lg:mt-auto lg:pt-8 lg:justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('contact')}
                data-track-cta={t.services.requestQuote}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-navy-900 font-semibold text-sm hover:bg-brand-50 transition-colors"
              >
                {t.services.requestQuote}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollToSection('services-methodology')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                {t.services.methodologyLabel}
              </motion.button>
            </div>
          </div>

          {/* Decorative visual column */}
          <div className="relative hidden lg:block h-[460px]">
            <motion.div
              animate={{ rotate: [0, 4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: `translate3d(${tilt.x * 16}px, ${tilt.y * 16}px, 0)` }}
              className="absolute inset-0 transition-transform duration-700 ease-out"
            >
              {t.services.items.map((s, i) => {
                const I = SERVICE_ICONS[i] ?? ShieldCheck;
                const isActive = i === active;
                const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
                const radius = 150;
                const cx = 210 + Math.cos(angle) * radius;
                const cy = 210 + Math.sin(angle) * radius;
                return (
                  <motion.div
                    key={s.id}
                    animate={{
                      y: isActive ? [0, -10, 0] : [0, -6, 0],
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{
                      y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' },
                      scale: { duration: 0.4, ease: EASE },
                    }}
                    className="absolute"
                    style={{ left: cx - 32, top: cy - 32 }}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 ${isActive
                        ? `bg-gradient-to-br ${accent} border-white/20 shadow-glow text-white`
                        : 'bg-white/[0.04] border-white/10 text-white/50'
                        }`}
                    >
                      <I className="w-6 h-6" />
                    </div>
                  </motion.div>
                );
              })}
              {/* Orbit rings */}
              <div
                className="absolute rounded-full border border-dashed border-white/10"
                style={{ left: 210 - 150, top: 210 - 150, width: 300, height: 300 }}
              />
              <div
                className="absolute rounded-full border border-white/[0.06]"
                style={{ left: 210 - 190, top: 210 - 190, width: 380, height: 380 }}
              />
              {/* Center hub */}
              <div
                className={`absolute w-28 h-28 rounded-3xl bg-gradient-to-br ${accent} opacity-90 blur-[2px]`}
                style={{ left: 210 - 56, top: 210 - 56 }}
              />
              <div
                className="absolute w-28 h-28 rounded-3xl bg-navy-900/60 backdrop-blur-sm border border-white/10 flex items-center justify-center"
                style={{ left: 210 - 56, top: 210 - 56 }}
              >
                {(() => {
                  const I = SERVICE_ICONS[active] ?? ShieldCheck;
                  return <I className="w-9 h-9 text-white" />;
                })()}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="hidden sm:flex justify-center mt-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1.5 text-white/30"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em]">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   STICKY SERVICE SWITCHER
   ServiceNow-style segmented pill nav, rendered as a
   floating glass capsule overlapping the hero/content seam.
   ========================================================= */

function StickyServiceNav({
  active,
  setActive,
}: {
  active: number;
  setActive: (i: number) => void;
}) {
  const t = useT();

  return (
    <div className="sticky top-16 lg:top-20 z-30">
      <div className="container-px max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
          className="mt-24 lg:mt-28 mb-8 rounded-full bg-white/90 backdrop-blur-xl border border-navy-100 shadow-elevated"
        >
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-2">
            {t.services.items.map((service, i) => {
              const TabIcon = SERVICE_ICONS[i] ?? ShieldCheck;
              const isActive = active === i;
              return (
                <motion.button
                  key={service.id}
                  onClick={() => setActive(i)}
                  data-track-service={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200"
                >
                  {isActive && (
                    <motion.span
                      layoutId="services-pill-bg"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-navy-900 shadow-soft"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : 'text-navy-600 hover:text-brand-600'}`}>
                    <TabIcon className="w-4 h-4" />
                    <span className={`font-mono text-[11px] ${isActive ? 'text-electric-400' : 'text-navy-400'}`}>
                      {`0${i + 1}`}
                    </span>
                    {service.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================
   SIDE RAIL (in-page scroll-spy navigation)
   ========================================================= */

function SideRail({
  labels,
  activeSection,
  onJump,
}: {
  labels: { id: string; label: string }[];
  activeSection: string;
  onJump: (id: string) => void;
}) {
  return (
    <div className="hidden xl:block sticky top-[110px] w-52 flex-shrink-0">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-navy-400 mb-4 pl-4">
        On this page
      </div>
      <div className="relative flex flex-col gap-1 border-l border-navy-100">
        {labels.map((l) => {
          const isActive = activeSection === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onJump(l.id)}
              className="relative text-left pl-4 py-2 text-sm transition-colors duration-200"
            >
              {isActive && (
                <motion.span
                  layoutId="rail-indicator"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-brand-600 rounded-full"
                />
              )}
              <span className={isActive ? 'text-navy-900 font-semibold' : 'text-navy-400 hover:text-navy-600'}>
                {l.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   Motion helpers for staggered grids
   ========================================================= */

const gridParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const gridItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* =========================================================
   Scroll helper — used by the hero's "How We Work" CTA and
   the in-page side rail to jump to the methodology section.
   ========================================================= */

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* =========================================================
   SERVICE DETAIL
   ========================================================= */

function ServiceDetail({
  navigate,
  active,
}: {
  navigate: (r: Route) => void;
  active: number;
}) {
  const t = useT();
  const current = t.services.items[active];
  const accent = ACCENT_MAP[current.id] ?? 'from-brand-500 to-brand-700';

  const [activeSection, setActiveSection] = useState('services-challenges');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const railLabels = [
    { id: 'services-challenges', label: t.services.challengesLabel },
    { id: 'services-methodology', label: t.services.methodologyLabel },
    { id: 'services-scope', label: t.services.scopeLabel },
    { id: 'services-deliverables', label: t.services.deliverablesLabel },
    { id: 'services-team', label: t.services.teamLabel },
    { id: 'services-whyus', label: t.services.whyUsLabel },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 }
    );

    railLabels.forEach((l) => {
      const el = sectionRefs.current[l.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <section className="pt-6 lg:pt-8 pb-16 lg:pb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="xl:grid xl:grid-cols-[16rem_1fr_16rem]"
        >
          {/* SIDE RAIL — its own far-left column, offset from the viewport edge */}
          <div className="hidden xl:block pl-8">
            <SideRail labels={railLabels} activeSection={activeSection} onJump={jump} />
          </div>

          {/* MAIN CONTENT — keeps its existing max-width, centered independently of the rail */}
          <div className="container-px max-w-7xl mx-auto">
            <div className="min-w-0">
              {/* CHALLENGES — asymmetric bento grid */}
                <div id="services-challenges" ref={setRef('services-challenges')} className="py-8 scroll-mt-40">
                  <div className="flex items-center gap-2 mb-10">
                    <span className="w-8 h-px bg-brand-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                      {t.services.challengesLabel}
                    </span>
                  </div>

                  <motion.div
                    variants={gridParent}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {current.challenges.map((item, i) => {
                      const TagIcon = TAG_ICONS[i % TAG_ICONS.length];
                      const featured = i === 0;
                      return (
                        <motion.div
                          key={item.title}
                          variants={gridItem}
                          whileHover={{ y: -6 }}
                          className={`group relative p-6 rounded-3xl bg-white border border-navy-100 overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-brand-200 ${featured ? 'sm:col-span-2 lg:col-span-2' : ''
                            }`}
                        >
                          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                          <div className="relative flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                              <TagIcon className="w-4.5 h-4.5 text-brand-600" />
                            </div>
                            <div>
                              <div className={`font-semibold text-navy-800 leading-snug ${featured ? 'text-base' : 'text-sm'}`}>
                                {item.title}
                              </div>
                              <div className="text-xs text-navy-500 mt-2 leading-relaxed">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* METHODOLOGY — alternating vertical timeline */}
                <div id="services-methodology" ref={setRef('services-methodology')} className="py-16 scroll-mt-40">
                  <div className="flex items-center gap-2 mb-12">
                    <span className="w-8 h-px bg-brand-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                      {t.services.methodologyLabel}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-navy-100" />
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 1.1, ease: EASE }}
                      style={{ transformOrigin: 'top' }}
                      className={`hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b ${accent}`}
                    />

                    <motion.div
                      variants={gridParent}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.1 }}
                      className="relative space-y-10 lg:space-y-4"
                    >
                      {current.methodology.map((step, i) => {
                        const isEven = i % 2 === 0;
                        return (
                          <motion.div
                            key={step.title}
                            variants={gridItem}
                            className="relative lg:grid lg:grid-cols-2 lg:gap-16 lg:py-8"
                          >
                            <span
                              className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center font-mono text-xs font-bold border-4 border-white shadow-soft bg-gradient-to-br ${accent} text-white`}
                            >
                              {`0${i + 1}`}
                            </span>

                            <div className={isEven ? 'lg:pr-16 lg:text-right' : 'lg:col-start-2 lg:pl-16'}>
                              <div
                                className={`lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-xs font-bold mb-3 bg-gradient-to-br ${accent} text-white`}
                              >
                                {`0${i + 1}`}
                              </div>
                              <h4 className="font-display font-bold text-lg lg:text-xl text-navy-900">
                                {step.title}
                              </h4>
                              <p className="text-sm text-navy-500 mt-2 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>

                {/* EXPERTISE / SCOPE — dark masonry panel */}
                <div id="services-scope" ref={setRef('services-scope')} className="py-16 scroll-mt-40">
                  <div className="relative rounded-4xl bg-navy-950 p-8 lg:p-14 overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-[0.08]" />
                    <div className={`absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-3xl`} />
                    <div className={`absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-3xl`} />

                    <div className="relative flex items-center gap-2 mb-10">
                      <span className="w-8 h-px bg-electric-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-electric-300">
                        {t.services.scopeLabel}
                      </span>
                    </div>

                    <div className="relative columns-1 sm:columns-2 lg:columns-3 gap-4">
                      {current.scope.map((item, i) => {
                        const TagIcon = TAG_ICONS[(i + 3) % TAG_ICONS.length];
                        return (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, ease: EASE, delay: (i % 6) * 0.06 }}
                            whileHover={{ y: -5, rotate: i % 2 === 0 ? -1 : 1 }}
                            className="mb-4 break-inside-avoid p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-colors duration-300"
                          >
                            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3.5">
                              <TagIcon className="w-4 h-4 text-electric-300" />
                            </div>
                            <div className="text-sm font-semibold text-white leading-snug">
                              {item.title}
                            </div>
                            <div className="text-xs text-white/50 mt-1.5 leading-snug">
                              {item.description}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* DELIVERABLES — staggered offset cards */}
                <div id="services-deliverables" ref={setRef('services-deliverables')} className="py-16 scroll-mt-40">
                  <div className="flex items-center gap-2 mb-10">
                    <span className="w-8 h-px bg-brand-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                      {t.services.deliverablesLabel}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {current.deliverables.map((d, i) => (
                      <motion.div
                        key={d.title}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
                        whileHover={{ y: -8 }}
                        className={`group relative p-7 rounded-3xl bg-white border border-navy-100 overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-brand-200 ${i % 2 === 1 ? 'sm:mt-10' : ''
                          }`}
                      >
                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="flex items-start justify-between mb-5">
                          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <PackageCheck className="w-5 h-5 text-brand-600" />
                          </div>
                          <span className="font-mono text-xs text-navy-300">{`0${i + 1}`}</span>
                        </div>

                        <div className="font-display font-bold text-lg text-navy-900">
                          {d.title}
                        </div>

                        <p className="text-sm text-navy-500 mt-2.5 leading-relaxed">
                          {d.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* TEAM & CERTIFICATIONS — split glass panels */}
                <div id="services-team" ref={setRef('services-team')} className="py-16 scroll-mt-40">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-navy-100 bg-navy-50/40 p-7 lg:p-8">
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-soft">
                          <Users className="w-4 h-4 text-brand-600" />
                        </div>
                        <h3 className="font-display font-bold text-base text-navy-900">
                          {t.services.teamLabel}
                        </h3>
                      </div>

                      <motion.div
                        variants={gridParent}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="space-y-2.5"
                      >
                        {current.team.map((member) => (
                          <motion.div
                            key={member}
                            variants={gridItem}
                            className="flex items-start gap-3 p-3.5 rounded-xl bg-white/60 transition-colors duration-300 hover:bg-white"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
                            <span className="text-sm text-navy-700 leading-relaxed">
                              {member}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    <div className="rounded-3xl border border-navy-100 bg-white p-7 lg:p-8 shadow-soft">
                      <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                          <BadgeCheck className="w-4 h-4 text-brand-600" />
                        </div>
                        <h3 className="font-display font-bold text-base text-navy-900">
                          {t.services.proofLabel}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2.5">
                        {current.proof.map((p, i) => (
                          <span
                            key={p}
                            style={{ transform: `rotate(${((i % 3) - 1) * 2}deg)` }}
                            className="px-3.5 py-2 rounded-full bg-white border border-navy-100 text-navy-700 text-xs font-mono font-medium hover:border-brand-300 hover:text-brand-600 hover:-translate-y-0.5 hover:rotate-0 transition-all duration-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-navy-100">
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-brand-600" />
                          </div>
                          <h3 className="font-display font-bold text-base text-navy-900">
                            {t.services.prerequisitesLabel}
                          </h3>
                        </div>

                        <ul className="space-y-2.5">
                          {current.prerequisites.map((p) => (
                            <li key={p} className="flex items-start gap-2.5">
                              <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </span>
                              <span className="text-sm text-navy-600 leading-relaxed">
                                {p}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WHY IT ROAD — showcase gradient panel */}
                <div id="services-whyus" ref={setRef('services-whyus')} className="py-16 scroll-mt-40">
                  <div className={`relative rounded-4xl bg-gradient-to-br ${accent} p-8 lg:p-14 overflow-hidden`}>
                    <div className="absolute inset-0 grid-pattern opacity-[0.12]" />
                    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
                    <Sparkles className="hidden lg:block absolute -bottom-8 -right-8 w-56 h-56 text-white/[0.06]" />

                    <div className="relative flex items-center gap-2.5 mb-10">
                      <Sparkles className="w-4 h-4 text-white" />
                      <h3 className="font-display font-bold text-base text-white">
                        {t.services.whyUsLabel}
                      </h3>
                    </div>

                    <motion.div
                      variants={gridParent}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      className="relative grid sm:grid-cols-2 gap-4"
                    >
                      {current.whyUs.map((reason, i) => (
                        <motion.div
                          key={reason}
                          variants={gridItem}
                          whileHover={{ y: -4 }}
                          className={`flex items-start gap-3.5 p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 ${i === 0 ? 'sm:col-span-2' : ''
                            }`}
                        >
                          <span className="font-mono text-xs text-white/70 mt-0.5 flex-shrink-0">
                            {`0${i + 1}`}
                          </span>
                          <span className={`text-white leading-relaxed ${i === 0 ? 'text-base font-medium' : 'text-sm'}`}>
                            {reason}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={() => navigate('contact')} className="group" size="lg">
                    {t.services.requestQuote}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          {/* balancing spacer column so the content column stays truly centered */}
          <div className="hidden xl:block" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* =========================================================
   PROCESS
   Horizontal connected timeline with a scroll-driven
   progress line, plus hover lift + tilt for a dynamic,
   enterprise feel.
   ========================================================= */

function ProcessSection() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.3'],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="section-py bg-navy-50 overflow-hidden">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <SectionHeading
            eyebrow={t.services.processEyebrow}
            title={t.services.processTitle}
            subtitle={t.services.processSubtitle}
            center
          />
        </Reveal>

        <div ref={ref} className="relative mt-16">
          <div className="hidden lg:block absolute top-9 left-0 right-0 h-px bg-navy-200" />
          <motion.div
            style={{ width: lineWidth }}
            className="hidden lg:block absolute top-9 left-0 h-px bg-gradient-to-r from-brand-500 to-electric-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.services.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{ y: -10, rotate: i % 2 === 0 ? -1 : 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                className="relative"
              >
                <div className="relative p-7 rounded-3xl bg-white border border-navy-100 shadow-soft transition-shadow duration-500 hover:shadow-elevated h-full">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-brand-500 flex-shrink-0 lg:absolute lg:-top-[52px] lg:left-[6px]" />
                  </div>

                  <div className="font-display font-extrabold text-5xl text-navy-100">
                    {step.num}
                  </div>

                  <h3 className="font-display font-bold text-lg text-navy-900 mt-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-navy-500 mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
   Split layout — sticky title on the left, accordion in a
   soft glass panel on the right with a decorative oversized
   glyph, echoing ServiceNow's FAQ modules.
   ========================================================= */

function FAQSection() {
  const t = useT();

  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-12 lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow={t.services.faqEyebrow}
                title={t.services.faqTitle}
              />
            </div>
          </Reveal>

          <div className="relative">
            <span
              aria-hidden="true"
              className="hidden lg:block absolute -top-16 -right-4 font-display font-extrabold text-[10rem] leading-none text-brand-50 select-none pointer-events-none"
            >
              ?
            </span>
            <div className="relative">
              <FAQAccordion faqs={t.services.faqs} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SERVICES PAGE
   ========================================================= */

export function ServicesPage({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
  const t = useT();

  const [active, setActive] = useState(0);

  return (
    <>
      <ServicesHero active={active} setActive={setActive} total={t.services.items.length} navigate={navigate} />

      <ServiceDetail navigate={navigate} active={active} />

      <SectionDivider fill="#f2f5fb" />

      <ProcessSection />

      <SectionDivider fill="#ffffff" flip />

      <FAQSection />

      <CTASection navigate={navigate} title={t.services.ctaTitle} />
    </>
  );
}