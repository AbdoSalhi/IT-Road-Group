import { ArrowRight } from 'lucide-react';
import { type Route } from '../lib/router';
import { Reveal } from './Reveal';
import { useT } from '../lib/useT';

export function CTASection({
  navigate,
  title,
  subtitle,
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel,
  secondaryLabel,
}: {
  navigate: (r: Route) => void;
  title?: string;
  subtitle?: string;
  /** Override the default navigate('contact') / navigate('services') behavior - used by filiale pages to scroll within the page instead of leaving it. */
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const t = useT();
  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-5xl bg-gradient-to-br from-navy-900 via-brand-900 to-navy-950 px-6 py-16 sm:px-12 sm:py-20 lg:py-24">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-electric-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
                {title || t.cta.defaultTitle}
              </h2>
              <p className="text-white/60 text-lg mt-5">
                {subtitle || t.cta.defaultSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                  onClick={onPrimaryClick || (() => navigate('contact'))}
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-navy-900 font-semibold hover:bg-brand-50 transition-all active:scale-95"
                >
                  {primaryLabel || t.cta.bookFree}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={onSecondaryClick || (() => navigate('services'))}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-all active:scale-95"
                >
                  {secondaryLabel || t.cta.exploreServices}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
