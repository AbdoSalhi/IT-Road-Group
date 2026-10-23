import { type Route } from '../lib/router';
import { useT } from '../lib/useT';

export function Logo({ onClick, light = false }: { onClick: (r: Route) => void; light?: boolean }) {
  const t = useT();
  return (
    <button
      onClick={() => onClick('home')}
      aria-label={t.logo.ariaHome}
      className="flex items-center gap-2 group"
    >
      <span
        className={`font-display font-extrabold text-xl tracking-tight transition-colors ${
          light ? 'text-white' : 'text-navy-900 group-hover:text-brand-600'
        }`}
      >
        ITROAD
        <span className={light ? 'text-brand-400' : 'text-brand-600'}>.</span>
      </span>
    </button>
  );
}
