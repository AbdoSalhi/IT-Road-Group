import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  path: string; // e.g. "/btech"
  image?: string;
}

const SITE_URL = 'https://www.itroadgroup.com';
const DEFAULT_OG_IMAGE = '/IT-Group.png';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
  return el;
}

/**
 * Sets document title, meta description, OpenGraph, Twitter Card, and a
 * schema.org Organization JSON-LD block for the current page.
 *
 * Note (client-rendered SPA caveat): this runs client-side after mount, so
 * it works for browsers and most modern crawlers, but it's not equivalent
 * to server-rendered meta tags (Next.js-style). Search engines that don't
 * execute JS, and most social-preview unfurlers, will only see whatever is
 * in index.html at request time. If perfect link-preview/OG rendering on
 * every platform is a hard requirement, a prerendering step (e.g.
 * vite-plugin-ssg or a build-time prerender script) would be the real fix -
 * flagging this now rather than silently under-delivering on it.
 */
export function useSEO({ title, description, path, image = DEFAULT_OG_IMAGE }: SEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ITROAD Group`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', description);

    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', `${SITE_URL}${image}`);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', `${SITE_URL}${image}`);

    upsertJsonLd('brand-schema-org', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: title,
      description,
      url,
      parentOrganization: {
        '@type': 'Organization',
        name: 'ITROAD Group',
        url: SITE_URL,
      },
    });
  }, [title, description, path, image]);
}
