import { type ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 mb-4 ${center ? 'justify-center' : ''}`}>
          <span className="w-8 h-px bg-brand-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{eyebrow}</span>
        </div>
      )}
      <h2 className={`font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] ${light ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-lg leading-relaxed ${light ? 'text-white/60' : 'text-navy-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
