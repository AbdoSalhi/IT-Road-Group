import { useEffect, useState } from 'react';

export type Route =
  | 'home'
  | 'about'
  | 'services'
  | 'industries'
  | 'partners'
  | 'blog'
  | 'careers'
  | 'contact'
  | 'admin'
  | 'itroad-consulting'
  | 'btech'
  | 'smartway'
  | 'itroad-technology'
  | '404';

const VALID_ROUTES = [
  'home', 'about', 'services', 'industries', 'partners', 'blog', 'careers', 'contact', 'admin',
  'itroad-consulting', 'btech', 'smartway', 'itroad-technology',
  '404',
];

export function useRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '') || 'home';
    return (VALID_ROUTES.includes(hash) ? hash : 'home') as Route;
  });

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '') || 'home';
      const r = (VALID_ROUTES.includes(hash) ? hash : 'home') as Route;
      setRoute(r);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = `/${r}`;
  };

  return [route, navigate];
}
