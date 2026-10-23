import { Reveal } from '../Reveal';
import { SectionHeading } from '../SectionHeading';

export function BrandSectors({ sectors }: { sectors?: string[] }) {
  if (!sectors || sectors.length === 0) return null;

  return (
    <section className="section-py bg-navy-50/50">
      <div className="container-px max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow="Secteurs adressés" title="Nous intervenons dans ces secteurs" center />
        </Reveal>
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {sectors.map((sector, i) => (
            <Reveal key={sector} delay={i * 50}>
              <span className="px-5 py-2.5 rounded-full bg-white border border-navy-100 shadow-soft text-sm font-medium text-navy-700">
                {sector}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
