import { useEffect, useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Layers,
  HeartPulse,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Building2,
  Factory,
} from 'lucide-react';

import { Button } from './Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { type Route } from '../lib/router';
import { useT } from '../lib/useT';

/* =========================================================
   INDUSTRY ICONS & COLORS
   ========================================================= */

const INDUSTRY_STYLES: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
  }
> = {
  healthcare: {
    icon: HeartPulse,
    bg: 'from-rose-500 to-pink-600',
  },

  finance: {
    icon: Landmark,
    bg: 'from-emerald-500 to-teal-600',
  },

  retail: {
    icon: ShoppingBag,
    bg: 'from-amber-500 to-orange-600',
  },

  education: {
    icon: GraduationCap,
    bg: 'from-violet-500 to-purple-600',
  },

  government: {
    icon: Building2,
    bg: 'from-brand-500 to-navy-700',
  },

  manufacturing: {
    icon: Factory,
    bg: 'from-cyan-500 to-electric-600',
  },
};


/* =========================================================
   NAVBAR
   ========================================================= */

export function Navbar({
  route,
  navigate,
}: {
  route: Route;
  navigate: (r: Route) => void;
}) {
  const t = useT();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mega, setMega] = useState<
    'services' | 'industries' | null
  >(null);


  /* =========================================================
     NAVIGATION ITEMS
     ========================================================= */

  const navItems: {
    label: string;
    route: Route;
    mega?: 'services' | 'industries';
  }[] = [
    {
      label: t.nav.home,
      route: 'home',
    },
    {
      label: t.nav.about,
      route: 'about',
    },
    {
      label: t.nav.services,
      route: 'services',
      mega: 'services',
    },
    {
      label: t.nav.industries,
      route: 'industries',
      mega: 'industries',
    },
    {
      label: t.nav.partners,
      route: 'partners',
    },
    {
      label: t.nav.blog,
      route: 'blog',
    },
    {
      label: t.nav.careers,
      route: 'careers',
    },
    {
      label: t.nav.contact,
      route: 'contact',
    },
  ];


  /* =========================================================
     SCROLL EFFECT
     ========================================================= */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);


  /* =========================================================
     CLOSE MENUS WHEN ROUTE CHANGES
     ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
    setMega(null);
  }, [route]);


  /* =========================================================
     NAVIGATION HANDLER
     ========================================================= */

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
    setMega(null);
  };


  /* =========================================================
     MEGA MENU ITEMS
     ========================================================= */

  const megaItems =
    mega === 'services'
      ? t.services.items.map((s) => ({
          id: s.id,
          title: s.title,
          short: s.short,
          accent: 'from-brand-500 to-brand-700',
          icon: Layers,
        }))

      : mega === 'industries'
        ? t.industriesPage.items.map((ind) => {
            const style =
              INDUSTRY_STYLES[ind.id] ?? {
                icon: Building2,
                bg: 'from-brand-500 to-navy-700',
              };

            return {
              id: ind.id,
              title: ind.name,
              short: ind.description,
              accent: style.bg,
              icon: style.icon,
            };
          })

        : [];


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          transition-all
          duration-500
          ${
            scrolled
              ? 'glass shadow-soft'
              : 'bg-transparent'
          }
        `}
      >

        {/* ===================================================
            NAVIGATION BAR
            =================================================== */}

        <nav
          className="
            container-px
            max-w-7xl
            mx-auto
            flex
            items-center
            justify-between
            h-16
            lg:h-20
          "
        >

          {/* =================================================
              RESTORED ITROAD LOGO
              ================================================= */}

          <button
            type="button"
            onClick={() => go('home')}
            className="
              flex
              items-center
              flex-shrink-0
              cursor-pointer
            "
            aria-label="ITROAD Group"
          >
            <img
              src="/IT-Group.png"
              alt="ITROAD Group"
              className="
                h-9
                lg:h-10
                w-auto
                object-contain
              "
            />
          </button>


          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <div className="hidden lg:flex items-center gap-1">

            {navItems.map((item) => (

              <div
                key={item.route}
                className="relative"

                onMouseEnter={() =>
                  setMega(item.mega ?? null)
                }

                onMouseLeave={() =>
                  setMega(null)
                }
              >

                <button
                  onClick={() =>
                    go(item.route)
                  }

                  className={`
                    flex
                    items-center
                    gap-1
                    px-3.5
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    transition-colors

                    ${
                      route === item.route
                        ? 'text-brand-600'
                        : 'text-navy-600 hover:text-navy-900'
                    }
                  `}
                >

                  {item.label}

                  {item.mega && (
                    <ChevronDown
                      className="
                        w-3.5
                        h-3.5
                        opacity-50
                      "
                    />
                  )}

                </button>

              </div>

            ))}

          </div>


          {/* =================================================
              DESKTOP ACTIONS
              ================================================= */}

          <div className="hidden lg:flex items-center gap-3">

            <LanguageSwitcher />

            <Button
              size="sm"
              onClick={() =>
                go('contact')
              }
            >
              {t.nav.bookConsultation}
            </Button>

          </div>


          {/* =================================================
              MOBILE ACTIONS
              ================================================= */}

          <div
            className="
              lg:hidden
              flex
              items-center
              gap-2
            "
          >

            <LanguageSwitcher />

            <button
              className="
                p-2
                -mr-2
                text-navy-700
              "

              onClick={() =>
                setMobileOpen(!mobileOpen)
              }

              aria-label={
                t.nav.toggleMenu
              }
            >

              {mobileOpen ? (

                <X
                  className="
                    w-6
                    h-6
                  "
                />

              ) : (

                <Menu
                  className="
                    w-6
                    h-6
                  "
                />

              )}

            </button>

          </div>

        </nav>


        {/* =================================================
            MEGA MENU
            ================================================= */}

        {mega && (

          <div
            className="
              hidden
              lg:block
              absolute
              left-0
              right-0
              top-full
            "

            onMouseEnter={() =>
              setMega(mega)
            }

            onMouseLeave={() =>
              setMega(null)
            }
          >

            <div
              className="
                container-px
                max-w-7xl
                mx-auto
                pt-2
              "
            >

              <div
                className="
                  glass
                  rounded-3xl
                  shadow-elevated
                  p-6
                  grid
                  grid-cols-3
                  gap-3
                  animate-fade-in
                "
              >

                {megaItems.map((item) => {

                  const Icon = item.icon;

                  return (

                    <button
                      key={item.id}

                      onClick={() =>
                        go(
                          mega === 'services'
                            ? 'services'
                            : 'industries'
                        )
                      }

                      className="
                        flex
                        items-start
                        gap-3
                        p-4
                        rounded-2xl
                        hover:bg-white/60
                        transition-colors
                        text-left
                        group
                      "
                    >

                      <div
                        className={`
                          w-10
                          h-10
                          rounded-xl
                          bg-gradient-to-br
                          ${item.accent}
                          flex
                          items-center
                          justify-center
                          text-white
                          flex-shrink-0
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        `}
                      >

                        <Icon
                          className="
                            w-5
                            h-5
                          "
                        />

                      </div>

                      <div>

                        <div
                          className="
                            font-semibold
                            text-navy-900
                            text-sm
                            group-hover:text-brand-600
                            transition-colors
                          "
                        >
                          {item.title}
                        </div>

                        <div
                          className="
                            text-xs
                            text-navy-400
                            mt-0.5
                            line-clamp-1
                          "
                        >
                          {item.short}
                        </div>

                      </div>

                    </button>

                  );

                })}

              </div>

            </div>

          </div>

        )}

      </header>


      {/* =====================================================
          MOBILE MENU
          ===================================================== */}

      {mobileOpen && (

        <div
          className="
            lg:hidden
            fixed
            inset-0
            z-40
            bg-white
            pt-16
            animate-fade-in
          "
        >

          <div
            className="
              container-px
              py-6
              space-y-1
            "
          >

            {navItems.map((item) => (

              <button
                key={item.route}

                onClick={() =>
                  go(item.route)
                }

                className={`
                  block
                  w-full
                  text-left
                  px-4
                  py-3.5
                  rounded-2xl
                  text-base
                  font-medium
                  transition-colors

                  ${
                    route === item.route
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-navy-700 hover:bg-navy-50'
                  }
                `}
              >

                {item.label}

              </button>

            ))}


            {/* =================================================
                MOBILE CTA
                ================================================= */}

            <div className="pt-4">

              <Button
                className="w-full"
                onClick={() =>
                  go('contact')
                }
              >
                {t.nav.bookConsultation}
              </Button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}