import { useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CTASection } from '../components/CTASection';
import { LeadQualificationForm } from '../components/LeadQualificationForm';
import { BrandHero } from '../components/brand/BrandHero';
import { BrandKeyNumbers } from '../components/brand/BrandKeyNumbers';
import { BrandAbout } from '../components/brand/BrandAbout';
import { BrandServices } from '../components/brand/BrandServices';
import { BrandProcess } from '../components/brand/BrandProcess';
import { BrandSectors } from '../components/brand/BrandSectors';
import { BrandClientsPartners } from '../components/brand/BrandClientsPartners';
import { type BrandContent } from '../lib/brandContent';
import { type Route } from '../lib/router';
import { useSEO } from '../lib/useSEO';
import { sendTrackingEvent } from '../lib/tracking';

export function BrandPage({ content, navigate }: { content: BrandContent; navigate: (r: Route) => void }) {
  const contactRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: content.name,
    description: content.tagline,
    path: `/${content.id}`,
  });

  const scrollToContact = () => {
    sendTrackingEvent('cta_click', { meta: `${content.id}-hero-primary-cta` });
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToServices = () => {
    sendTrackingEvent('cta_click', { meta: `${content.id}-hero-secondary-cta` });
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar route={'home' as Route} navigate={navigate} />

      <main>
        <BrandHero content={content} onPrimaryCta={scrollToContact} onSecondaryCta={scrollToServices} />

        <BrandKeyNumbers keyNumbers={content.keyNumbers} />

        <BrandAbout content={content} />

        <div ref={servicesRef}>
          <BrandServices services={content.services} />
        </div>

        <BrandProcess steps={content.process} />

        <BrandSectors sectors={content.sectors} />

        <BrandClientsPartners
          clients={content.clients}
          partners={content.partners}
          techStack={content.techStack}
          testimonial={content.testimonial}
        />

        <CTASection
          navigate={navigate}
          title={`Prêt à démarrer avec ${content.name} ?`}
          subtitle={content.tagline}
          onPrimaryClick={scrollToContact}
          onSecondaryClick={scrollToServices}
          primaryLabel={content.ctaPrimary}
          secondaryLabel={content.ctaSecondary}
        />

        <section className="section-py" ref={contactRef}>
          <div className="container-px max-w-3xl mx-auto">
            <LeadQualificationForm brand={content.id} source={`${content.id}_contact_form`} />
          </div>
        </section>
      </main>

      <Footer
        navigate={navigate}
        addressOverride={content.footerAddressLines.join(', ')}
        emailOverride={content.footerEmail}
        phoneOverride={content.footerPhone}
      />
    </div>
  );
}
