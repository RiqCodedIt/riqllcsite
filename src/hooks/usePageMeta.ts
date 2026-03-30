import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  noIndex?: boolean;
}

const SITE_URL = 'https://prodbyriq.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/covers/cover001.png`;

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const usePageMeta = ({ title, description, canonicalPath, ogImage, noIndex }: PageMeta): void => {
  useEffect(() => {
    const canonical = `${SITE_URL}${canonicalPath}`;
    const image = ogImage ?? DEFAULT_OG_IMAGE;

    document.title = title;

    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    setMeta('og:type', 'website', 'property');
    setMeta('og:site_name', 'PRODBYRIQ', 'property');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:image', image, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    setLink('canonical', canonical);
  }, [title, description, canonicalPath, ogImage, noIndex]);
};

export default usePageMeta;
