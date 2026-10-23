import { ArrowRight, Sparkles } from 'lucide-react';
import { Reveal } from '../Reveal';
import { Button } from '../Button';
import { type BrandContent } from '../../lib/brandContent';

export function BrandHero({ content, onPrimaryCta, onSecondaryCta }: {
  content: BrandContent;
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}) {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-electric-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-60" />
      </div>

      <div className="container-px max-w-5xl mx-auto w-full">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass shadow-soft mb-8">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-navy-700">{content.name}</span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900 max-w-4xl">
            {content.heroTitle}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-lg sm:text-xl text-navy-500 mt-6 max-w-2xl leading-relaxed">
            {content.heroSubtitle}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button size="lg" onClick={onPrimaryCta} className="group">
              {content.ctaPrimary}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={onSecondaryCta}>
              {content.ctaSecondary}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <p className="text-sm text-navy-400 mt-8 max-w-xl">{content.tagline}</p>
        </Reveal>
      </div>
    </section>
  );
}
