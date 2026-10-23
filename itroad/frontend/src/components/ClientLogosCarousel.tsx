/**
 * "They Trust Us" — Sector-based infinite logo carousel.
 *
 * Features:
 * - Keeps all existing client logos.
 * - Keeps all new logos from /public/logos.
 * - Organizes logos by sector.
 * - Displays one sector at a time.
 * - Logos move continuously.
 * - Seamless infinite loop.
 * - Does NOT pause on hover.
 * - Preserves original logo colours and aspect ratios.
 * - Automatically restarts the animation when changing sector.
 */

import { useState } from 'react';
import { useT } from '../lib/useT';

type LogoEntry = {
  name: string;
  src: string;
};

type SectorKey =
  | 'all'
  | 'banking'
  | 'energy'
  | 'telecom'
  | 'industry'
  | 'media'
  | 'healthcare';


/* =========================================================
   CLIENT LOGOS ORGANIZED BY SECTOR
   ========================================================= */

const SECTOR_LOGOS: Record<SectorKey, LogoEntry[]> = {

  /* =======================================================
     ALL CLIENTS
     ======================================================= */

  all: [
    // Existing logos
    {
      name: 'Lydec',
      src: '/logos/lydec.png',
    },
    {
      name: 'ADM — Autoroutes du Maroc',
      src: '/logos/Logo_de_ADM.jpg',
    },

    {
      name: 'Bank of Africa (BMCE)',
      src: '/logos/Bank_of_Africa_(BMCE).png',
    },
    {
      name: 'Banque Populaire',
      src: '/logos/LOGO-CHAABI-BANK.png',
    },

    {
      name: 'Crédit Agricole du Maroc',
      src: '/logos/Credit_Agricole_du_Maroc.webp',
    },
    {
      name: 'Attijariwafa Bank',
      src: '/logos/Logo_AWB.svg.webp',
    },
    {
      name: 'Société Générale',
      src: '/logos/Societe-Generale-logo.png',
    },
    {
      name: 'Royal Air Maroc',
      src: '/logos/Logo_Royal_Air_Maroc.svg.webp',
    },

    {
      name: 'Maroc Telecom',
      src: '/logos/Maroc_Telecom_logo.png',
    },


    // New logos
    {
      name: 'ADLPartner',
      src: '/logos/adlpartner_logo.png',
    },
    {
      name: 'Atos Origin',
      src: '/logos/atos_origin_logo.webp',
    },
    {
      name: 'Batiproducts',
      src: '/logos/batiproduits_logo.png',
    },
    {
      name: 'CNEH',
      src: '/logos/cneh_logo.jpg',
    },
    {
      name: 'FAAPA',
      src: '/logos/faapa_logo.webp',
    },
    {
      name: 'Fayat',
      src: '/logos/fayat_blanc.png',
    },
    {
      name: 'FPM',
      src: '/logos/fpm_logo.jpg',
    },
    {
      name: 'Groupe Hommell',
      src: '/logos/groupe_Hommell_logo.jpg',
    },
    {
      name: 'Groupe Profession Santé',
      src: '/logos/groupe_profession_sante_logo.jpg',
    },
    {
      name: 'La Gazette',
      src: '/logos/la_gazette.fr_logo.png',
    },
    {
      name: "L'Argus de la Presse",
      src: "/logos/l'argue_de_la_press_logo.png",
    },
    {
      name: 'Le Moniteur Emploi',
      src: '/logos/le_moniteur_emploi.com_logo.png',
    },
    {
      name: 'Le Parisien',
      src: '/logos/le_parisien_logo.webp',
    },
    {
      name: 'Bureau Veritas',
      src: '/logos/Logo_Bureau_Veritas.svg.webp',
    },
    {
      name: 'Micromania',
      src: '/logos/LogoMicromania.png',
    },
    {
      name: 'MAP Maroc',
      src: '/logos/MAPmaroc-logo.jpg',
    },
    {
      name: 'Marchés Online',
      src: '/logos/marchesonline.com_logo.png',
    },
    {
      name: 'NewsMed',
      src: '/logos/NewsMed-logo-2024-FIN.png',
    },
    {
      name: 'Santé Social Expo',
      src: '/logos/sante_social_expo_logo.png',
    },
    {
      name: 'Simi',
      src: '/logos/simi_logo.png',
    },
    {
      name: 'oksa',
      src: '/logos/oksa.webp',
    },
  ],


  /* =======================================================
     BANKING & FINANCE
     ======================================================= */

  banking: [

    {
      name: 'Bank of Africa (BMCE)',
      src: '/logos/Bank_of_Africa_(BMCE).png',
    },
    {
      name: 'Banque Populaire',
      src: '/logos/LOGO-CHAABI-BANK.png',
    },


    {
      name: 'Crédit Agricole du Maroc',
      src: '/logos/Credit_Agricole_du_Maroc.webp',
    },
    {
      name: 'Attijariwafa Bank',
      src: '/logos/Logo_AWB.svg.webp',
    },
    {
      name: 'Société Générale',
      src: '/logos/Societe-Generale-logo.png',
    },

  ],


  /* =======================================================
     ENERGY & UTILITIES
     ======================================================= */

  energy: [
    {
      name: 'NAREVA',
      src: '/logos/LOGO-NAREVA.png',
    },
    {
      name: 'Lydec',
      src: '/logos/lydec.png',
    },
    {
      name: 'oksa',
      src: '/logos/oksa.webp',
    },
    {
      name: 'cie',
      src: '/logos/cie.jpg',
    },

  ],



  /* =======================================================
     construction and public works
     ======================================================= */

  telecom: [

    {
      name: 'Atos Origin',
      src: '/logos/atos_origin_logo.webp',
    },
    {
      name: 'Simi',
      src: '/logos/simi_logo.png',
    },
    {
      name: 'Fayat',
      src: '/logos/fayat_blanc.png',
    },
    {
      name: 'Batiproducts',
      src: '/logos/batiproduits_logo.png',
    },
    {
      name: 'groupe moniteur',
      src: '/logos/Logo_Groupe_Moniteur_Holding_(1).jpg',
    },
    {
      name: 'gbatiprix',
      src: '/logos/batiprix.jpg',
    },
  ],


  /* =======================================================
     INDUSTRY & SERVICES
     ======================================================= */

  industry: [

    {
      name: 'Bureau Veritas',
      src: '/logos/Logo_Bureau_Veritas.svg.webp',
    },
    {
      name: 'ADLPartner',
      src: '/logos/adlpartner_logo.png',
    },
    {
      name: 'FPM',
      src: '/logos/fpm_logo.jpg',
    },
    {
      name: 'Simi',
      src: '/logos/simi_logo.png',
    },
    {
      name: 'Marchés Online',
      src: '/logos/marchesonline.com_logo.png',
    },
    {
      name: 'Micromania',
      src: '/logos/LogoMicromania.png',
    },
    {
      name: 'Atos Origin',
      src: '/logos/atos_origin_logo.webp',
    },

    {
      name: 'ADM — Autoroutes du Maroc',
      src: '/logos/Logo_de_ADM.jpg',
    },

    {
      name: 'Royal Air Maroc',
      src: '/logos/Logo_Royal_Air_Maroc.svg.webp',
    },
  ],


  /* =======================================================
     MEDIA & COMMUNICATION
     ======================================================= */

  media: [
    {
      name: 'FAAPA',
      src: '/logos/faapa_logo.webp',
    },
    {
      name: 'Groupe Hommell',
      src: '/logos/groupe_Hommell_logo.jpg',
    },
    {
      name: 'La Gazette',
      src: '/logos/la_gazette.fr_logo.png',
    },
    {
      name: "L'Argus de la Presse",
      src: "/logos/l'argue_de_la_press_logo.png",
    },
    {
      name: 'Le Moniteur Emploi',
      src: '/logos/le_moniteur_emploi.com_logo.png',
    },
    {
      name: 'Le Parisien',
      src: '/logos/le_parisien_logo.webp',
    },
    {
      name: 'MAP Maroc',
      src: '/logos/MAPmaroc-logo.jpg',
    },
  ],


  /* =======================================================
     HEALTHCARE
     ======================================================= */

  healthcare: [
    {
      name: 'CNEH',
      src: '/logos/cneh_logo.jpg',
    },
    {
      name: 'Groupe Profession Sante',
      src: '/logos/groupe_profession_sante_logo.jpg',
    },
    {
      name: 'NewsMed',
      src: '/logos/NewsMed-logo-2024-FIN.png',
    },
    {
      name: 'Santé Social Expo',
      src: '/logos/sante_social_expo_logo.png',
    },
  ],
};


/* =========================================================
   SECTOR LABELS
   ========================================================= */

const SECTOR_LABELS: Record<SectorKey, string> = {
  all: 'All',
  banking: 'Banking & Finance',
  energy: 'Energy & Utilities',
  telecom: 'construction and public works',
  industry: 'Industry & Services',
  media: 'Media & Communication',
  healthcare: 'Healthcare',
};


/* =========================================================
   LOGO ITEM
   ========================================================= */

function LogoItem({ logo }: { logo: LogoEntry }) {
  return (
    <div
      className="
        flex-shrink-0
        flex
        items-center
        justify-center
        px-8
        sm:px-12
        lg:px-14
      "
      style={{
        height: '96px',
      }}
    >
      <img
        src={logo.src}
        alt={logo.name}
        title={logo.name}
        className="
          h-14
          sm:h-16
          w-auto
          max-w-[160px]
          sm:max-w-[200px]
          object-contain
          transition-transform
          duration-300
          ease-out
          hover:scale-105
        "
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}


/* =========================================================
   CLIENT LOGOS CAROUSEL
   ========================================================= */

export function ClientLogosCarousel() {
  const t = useT();

  const [activeSector, setActiveSector] =
    useState<SectorKey>('all');

  const currentLogos = SECTOR_LOGOS[activeSector];

  /*
   * Duplicate the selected sector logos.
   *
   * The animation moves exactly 50% of the duplicated
   * track, creating a seamless infinite loop.
   */
  const track = [
    ...currentLogos,
    ...currentLogos,
  ];


  return (
    <div
      className="w-full"
      aria-label={t.clientLogosAria}
    >

      {/* =====================================================
          SECTOR SELECTOR
          ===================================================== */}

      <div
        className="
          flex
          flex-wrap
          justify-center
          gap-2
          mb-10
        "
      >
        {(Object.keys(SECTOR_LABELS) as SectorKey[]).map(
          (sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => setActiveSector(sector)}
              className={`
                px-4
                py-2.5
                rounded-full
                text-sm
                font-medium
                transition-all
                duration-300
                border

                ${activeSector === sector
                  ? 'bg-navy-900 text-white border-navy-900 shadow-soft'
                  : 'bg-white text-navy-600 border-navy-100 hover:border-brand-300 hover:text-brand-600'
                }
              `}
            >
              {SECTOR_LABELS[sector]}
            </button>
          )
        )}
      </div>


      {/* =====================================================
          LOGO CAROUSEL
          ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          w-full
          py-4
        "
      >

        {/* =================================================
            LEFT FADE
            ================================================= */}

        <div
          className="
            absolute
            left-0
            top-0
            bottom-0
            w-16
            sm:w-24
            lg:w-32
            z-10
            pointer-events-none
          "
          style={{
            background:
              'linear-gradient(to right, white 0%, rgba(255,255,255,0.9) 30%, transparent 100%)',
          }}
        />


        {/* =================================================
            RIGHT FADE
            ================================================= */}

        <div
          className="
            absolute
            right-0
            top-0
            bottom-0
            w-16
            sm:w-24
            lg:w-32
            z-10
            pointer-events-none
          "
          style={{
            background:
              'linear-gradient(to left, white 0%, rgba(255,255,255,0.9) 30%, transparent 100%)',
          }}
        />


        {/* =================================================
            ANIMATED TRACK
            ================================================= */}

        <div className="overflow-hidden">

          <div
            key={activeSector}
            className="
              flex
              w-max
              animate-scroll-x
            "
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {track.map((logo, index) => (
              <LogoItem
                key={`${activeSector}-${logo.name}-${index}`}
                logo={logo}
              />
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}