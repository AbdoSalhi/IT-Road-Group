import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
} from 'lucide-react';

import { type Route } from '../lib/router';
import { useT } from '../lib/useT';

export function Footer({
  navigate,
  addressOverride,
  emailOverride,
  phoneOverride,
}: {
  navigate: (r: Route) => void;
  /** Brand-specific contact overrides, used by filiale pages - main site keeps its existing defaults when omitted. */
  addressOverride?: string;
  emailOverride?: string;
  phoneOverride?: string;
}) {
  const t = useT();

  const footerLinks: {
    label: string;
    route: Route;
  }[] = [
    { label: t.nav.home, route: 'home' },
    { label: t.nav.about, route: 'about' },
    { label: t.nav.services, route: 'services' },
    { label: t.nav.industries, route: 'industries' },
    { label: t.nav.partners, route: 'partners' },
    { label: t.nav.blog, route: 'blog' },
    { label: t.nav.careers, route: 'careers' },
    { label: t.nav.contact, route: 'contact' },
  ];

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-px max-w-7xl mx-auto">

        {/* =====================================================
            CTA STRIP
            ===================================================== */}

        <div className="py-16 border-b border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

            <div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl">
                {t.footer.ctaTitle}
              </h3>

              <p className="text-white/50 mt-2">
                {t.footer.ctaSubtitle}
              </p>
            </div>

            <button
              onClick={() => navigate('contact')}
              className="
                inline-flex
                items-center
                gap-2
                px-7
                py-3.5
                rounded-full
                bg-white
                text-navy-900
                font-semibold
                hover:bg-brand-50
                transition-colors
              "
            >
              {t.footer.startConversation}
            </button>

          </div>
        </div>


        {/* =====================================================
            MAIN FOOTER
            ===================================================== */}

        <div className="
          py-16
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-10
        ">

          {/* ===================================================
              COMPANY / LOGO
              =================================================== */}

          <div className="lg:col-span-1">

            {/* RESTORED ITROAD LOGO FROM /PUBLIC */}

            <button
              type="button"
              onClick={() => navigate('home')}
              className="
                inline-flex
                items-center
                justify-center
                w-[180px]
                h-[72px]
                bg-white
                rounded-xl
                p-3
                cursor-pointer
                flex-shrink-0
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
              "
              aria-label="ITROAD Group"
            >
              <img
                src="/IT-Group.png"
                alt="ITROAD Group"
                className="
                  w-full
                  h-full
                  object-contain
                "
              />
            </button>


            {/* Description */}

            <p
              className="
                text-white/40
                text-sm
                mt-5
                leading-relaxed
                max-w-xs
              "
            >
              {t.footer.description}
            </p>


            {/* Social Media */}

            <div className="flex gap-3 mt-6">

              {[Linkedin, Twitter, Facebook].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-white/5
                      hover:bg-brand-600
                      flex
                      items-center
                      justify-center
                      transition-colors
                    "
                    aria-label={t.footer.social}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              )}

            </div>

          </div>

          {/* ===================================================
              COMPANY LINKS
              =================================================== */}

          <div>

            <h4 className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-white/40
              mb-4
            ">
              {t.footer.company}
            </h4>

            <ul className="space-y-3">

              {footerLinks.slice(0, 5).map((l) => (

                <li key={l.route}>

                  <button
                    onClick={() =>
                      navigate(l.route)
                    }
                    className="
                      text-white/70
                      hover:text-white
                      text-sm
                      transition-colors
                    "
                  >
                    {l.label}
                  </button>

                </li>

              ))}

            </ul>

          </div>


          {/* ===================================================
              RESOURCES LINKS
              =================================================== */}

          <div>

            <h4 className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-white/40
              mb-4
            ">
              {t.footer.resources}
            </h4>

            <ul className="space-y-3">

              {footerLinks.slice(5).map((l) => (

                <li key={l.route}>

                  <button
                    onClick={() =>
                      navigate(l.route)
                    }
                    className="
                      text-white/70
                      hover:text-white
                      text-sm
                      transition-colors
                    "
                  >
                    {l.label}
                  </button>

                </li>

              ))}

            </ul>

          </div>


          {/* ===================================================
              CONTACT INFORMATION
              =================================================== */}

          <div>

            <h4 className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-white/40
              mb-4
            ">
              {t.footer.getInTouch}
            </h4>

            <ul className="
              space-y-3
              text-sm
              text-white/70
            ">

              {/* Address */}

              <li className="flex items-center gap-2.5">

                <MapPin
                  className="
                    w-4
                    h-4
                    text-brand-400
                    flex-shrink-0
                  "
                />

                <span>
                  {addressOverride || t.footer.address}
                </span>

              </li>


              {/* Email */}

              <li className="flex items-center gap-2.5">

                <Mail
                  className="
                    w-4
                    h-4
                    text-brand-400
                    flex-shrink-0
                  "
                />

                <a
                  href={`mailto:${emailOverride || 'contact@itroadgroup.com'}`}
                  className="
                    hover:text-white
                    transition-colors
                  "
                >
                  {emailOverride || 'contact@itroadgroup.com'}
                </a>

              </li>


              {/* Phone */}

              {phoneOverride === undefined || phoneOverride ? (
              <li className="flex items-center gap-2.5">

                <Phone
                  className="
                    w-4
                    h-4
                    text-brand-400
                    flex-shrink-0
                  "
                />

                <a
                  href={`tel:${(phoneOverride || '+212702074046').replace(/[^+\d]/g, '')}`}
                  className="
                    hover:text-white
                    transition-colors
                  "
                >
                  {phoneOverride || '+212 (0) 7 02 07 40 46'}
                </a>

              </li>
              ) : null}

            </ul>

          </div>

        </div>


        {/* =====================================================
            BOTTOM BAR
            ===================================================== */}

        <div className="
          py-8
          border-t
          border-white/10
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-4
        ">

          <p className="
            text-white/40
            text-sm
          ">
            {t.footer.rights}
          </p>

          <div className="
            flex
            gap-6
            text-sm
            text-white/40
          ">

            <a
              href="#"
              className="
                hover:text-white
                transition-colors
              "
            >
              {t.footer.privacy}
            </a>

            <a
              href="#"
              className="
                hover:text-white
                transition-colors
              "
            >
              {t.footer.terms}
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}