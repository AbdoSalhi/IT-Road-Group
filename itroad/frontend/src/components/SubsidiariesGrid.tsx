import { ArrowUpRight } from 'lucide-react';
import { type Subsidiary } from '../lib/data';
import { type Route } from '../lib/router';
import { Reveal } from './Reveal';

const NAVY = '#1a2c8f';
const BLUE = '#29abe2';

// Subsidiary ids that have their own dedicated internal page (see
// src/lib/brandContent.ts and src/lib/router.ts). "itroad-group" is the HQ -
// that's this main site itself. "btech" and "smartway" are handled separately
// below since they redirect to their official external websites instead.
const BRAND_ROUTE_IDS = ['itroad-consulting', 'itroad-technology'];

// Subsidiaries that redirect to their own official external website instead
// of opening an internal page.
const EXTERNAL_SUBSIDIARY_URLS: Record<string, string> = {
  btech: 'https://btech-consulting.com/',
  smartway: 'https://smartways.ma/',
};

function SubsidiariesMap() {
  return (
    <div className="rounded-2xl border border-navy-100 shadow-soft overflow-hidden">
      <img
        src="/Gemini_Generated_Image_gowcdmgowcdmgowc.jpg"
        alt="Global network reach map showing offices in France, Morocco, Tunisia and UAE"
        className="w-full h-auto object-cover"
      />
    </div>
  );
}

function SubsidiariesLegend({ subsidiaries, navigate }: { subsidiaries: Subsidiary[]; navigate?: (r: Route) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subsidiaries.map((s) => {
        const externalUrl = EXTERNAL_SUBSIDIARY_URLS[s.id];
        const hasOwnPage = navigate && BRAND_ROUTE_IDS.includes(s.id);
        const isClickable = Boolean(externalUrl) || hasOwnPage;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Wrapper: any = externalUrl ? 'a' : hasOwnPage ? 'button' : 'div';
        const wrapperProps = externalUrl
          ? { href: externalUrl, target: '_blank', rel: 'noopener noreferrer' }
          : hasOwnPage
          ? { onClick: () => navigate!(s.id as Route) }
          : {};

        return (
          <Wrapper
            key={s.id}
            {...wrapperProps}
            className={`rounded-2xl border border-navy-100 shadow-soft card-hover p-4 flex items-start gap-3 text-left w-full ${
              isClickable ? 'cursor-pointer hover:border-brand-300' : ''
            }`}
          >
            <span
              className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: s.isHQ ? NAVY : BLUE }}
              aria-hidden="true"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className="font-display font-extrabold text-sm uppercase tracking-wide leading-snug"
                  style={{ color: NAVY }}
                >
                  {s.name}
                </h3>
                {isClickable && <ArrowUpRight className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />}
              </div>
              <p className="text-xs font-medium text-navy-900 mt-0.5">{s.city}</p>
              <p className="text-xs text-navy-400 leading-relaxed mt-1">
                {s.addressLines.join(', ')}
              </p>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}

export function SubsidiariesGrid({ subsidiaries, navigate }: { subsidiaries: Subsidiary[]; navigate?: (r: Route) => void }) {
  return (
    <div className="space-y-10">
      <Reveal delay={120}>
        <SubsidiariesMap />
      </Reveal>
      <Reveal delay={200}>
        <SubsidiariesLegend subsidiaries={subsidiaries} navigate={navigate} />
      </Reveal>
    </div>
  );
}