import { useEffect, useRef } from 'react';
import { useRoute } from './lib/router';
import { LangProvider } from './lib/i18n';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { PartnersPage } from './pages/PartnersPage';
import { BlogPage } from './pages/BlogPage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/AdminPage';
import { BrandPage } from './pages/BrandPage';
import { ChatWidget } from './components/ChatWidget';
import { brandContents } from './lib/brandContent';
import { initTracking, sendTrackingEvent, setTrackingBrand, trackPageView } from './lib/tracking';

function App() {
  const [route, navigate] = useRoute();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // brandContents[route] resolves subsidiary sites (e.g. "btech",
    // "smartway"); every other route belongs to the main ITROAD Group site.
    setTrackingBrand(brandContents[route] ? route : 'itroad-group');
    initTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTrackingBrand(brandContents[route] ? route : 'itroad-group');
    // Skip double-firing the very first pageview: initTracking() above
    // already records one for the initial route on mount.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView(`/${route}`);
    if (route === 'services') sendTrackingEvent('service_page_view', { path: '/services' });
    if (route === 'industries') sendTrackingEvent('industry_page_view', { path: '/industries' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  if (route === 'admin') {
    return (
      <LangProvider>
        <AdminPage />
      </LangProvider>
    );
  }

  if (brandContents[route]) {
    return (
      <LangProvider>
        <BrandPage content={brandContents[route]} navigate={navigate} />
        <ChatWidget brand={route} />
      </LangProvider>
    );
  }

  return (
    <LangProvider>
      <div className="min-h-screen bg-white">
        <Navbar route={route} navigate={navigate} />

        <main>
          {route === 'home' && <HomePage navigate={navigate} />}
          {route === 'about' && <AboutPage navigate={navigate} />}
          {route === 'services' && <ServicesPage navigate={navigate} />}
          {route === 'industries' && <IndustriesPage navigate={navigate} />}
          {route === 'partners' && <PartnersPage navigate={navigate} />}
          {route === 'blog' && <BlogPage navigate={navigate} />}
          {route === 'careers' && <CareersPage navigate={navigate} />}
          {route === 'contact' && <ContactPage />}
          {route === '404' && <NotFoundPage navigate={navigate} />}
        </main>

        <Footer navigate={navigate} />
      </div>
      <ChatWidget brand="itroad-group" />
    </LangProvider>
  );
}

export default App;
