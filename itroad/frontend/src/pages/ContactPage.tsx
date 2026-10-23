import { Mail, MapPin } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { FAQAccordion } from '../components/FAQAccordion';
import { LeadQualificationForm } from '../components/LeadQualificationForm';
import { useT } from '../lib/useT';

function ContactHero() {
  const t = useT();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white" />
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 dot-pattern opacity-50" />
      </div>
      <div className="container-px max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-8 h-px bg-brand-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">{t.contact.eyebrow}</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-navy-900">
              {t.contact.title1}
              {t.contact.title2 && (
                <>
                  {' '}
                  <span className="text-gradient">{t.contact.title2}</span>
                </>
              )}
            </h1>
            <p className="text-lg text-navy-500 mt-6 leading-relaxed max-w-2xl">
              {t.contact.subtitle}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Small vertical contact card used in the right-hand rail
 * next to the qualification form.
 */
function ContactRail() {
  const t = useT();
  return (
    <div className="flex flex-col gap-4">
      <Reveal>
        <a
          href="mailto:contact@itroadgroup.com"
          data-track-cta="contact-email-link"
          className="p-6 rounded-2xl bg-navy-950 text-white block hover:-translate-y-1 transition-transform"
        >
          <Mail className="w-5 h-5 mb-4" />
          <div className="text-xs text-white/40 uppercase tracking-wider font-medium">{t.contact.emailLabel}</div>
          <div className="font-semibold text-sm mt-1.5">contact@itroadgroup.com</div>
        </a>
      </Reveal>

      <Reveal delay={100}>
        <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-soft">
          <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-xs text-navy-400 font-medium">{t.contact.officeLabel}</div>
          <div className="text-navy-900 font-semibold text-sm mt-1">{t.contact.officeValue1}</div>
          <div className="text-navy-500 text-sm mt-2 leading-relaxed">
            {t.contact.officeAddressLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < t.contact.officeAddressLines.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function QualificationForm() {
  return (
    <section className="section-py">
      <div className="container-px max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

          {/* FORM — smaller, on the left */}
          <div className="lg:col-span-2">
            <LeadQualificationForm />
          </div>

          {/* CONTACT INFO — vertical rail on the right */}
          <div className="lg:col-span-1">
            <ContactRail />
          </div>

        </div>
      </div>
    </section>
  );
}


function FAQSection() {
  const t = useT();
  return (
    <section className="section-py bg-navy-50/50">
      <div className="container-px max-w-3xl mx-auto">
        <Reveal>
          <SectionHeading eyebrow={t.contact.faqEyebrow} title={t.contact.faqTitle} center />
        </Reveal>
        <div className="mt-12">
          <FAQAccordion faqs={t.contact.faqs} />
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="section-py">
      <div className="container-px max-w-7xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-navy-100 shadow-soft">
          <iframe
            title="ITRoad Group - Compass Building, Ras Al Khaimah"
            src="https://maps.google.com/maps?q=Compass+Building,+Al+Shohada+Road,+Al+Hamra+Industrial+Zone-FZ,+Ras+Al+Khaimah,+United+Arab+Emirates&z=14&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <>
      <ContactHero />

      {/* Formulaire de qualification (gauche) + coordonnées (droite) */}
      <QualificationForm />

      <FAQSection />
      <MapSection />
    </>
  );
}