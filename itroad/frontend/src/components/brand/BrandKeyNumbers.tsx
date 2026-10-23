import { useReveal, useCountUp } from '../../lib/hooks';
import { type KeyNumber } from '../../lib/brandContent';

function StatCell({ stat, start, delay }: { stat: Extract<KeyNumber, { type: 'stat' }>; start: boolean; delay: number }) {
  const value = useCountUp(stat.value, 2000, start);
  return (
    <div className="text-center" style={{ animationDelay: `${delay}ms` }}>
      <div className="font-display font-extrabold text-4xl lg:text-5xl" style={{ color: '#13B4EB' }}>
        {Math.round(value)}
        {stat.suffix}
      </div>
      <div className="text-sm text-navy-500 mt-2 font-medium">{stat.label}</div>
    </div>
  );
}

function HighlightCell({ text }: { text: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-navy-100 shadow-soft text-center">
      <p className="text-sm font-semibold text-navy-800 leading-snug">{text}</p>
    </div>
  );
}

export function BrandKeyNumbers({ keyNumbers }: { keyNumbers: KeyNumber[] }) {
  const { ref, visible } = useReveal();
  if (keyNumbers.length === 0) return null;

  const allStats = keyNumbers.every((k) => k.type === 'stat');

  return (
    <section className="py-16 lg:py-20 border-y border-navy-100">
      <div className="container-px max-w-7xl mx-auto" ref={ref}>
        <div className={`grid grid-cols-2 ${allStats ? 'lg:grid-cols-4' : 'lg:grid-cols-4'} gap-6`}>
          {keyNumbers.map((k, i) =>
            k.type === 'stat' ? (
              <StatCell key={i} stat={k} start={visible} delay={i * 100} />
            ) : (
              <HighlightCell key={i} text={k.text} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
