import { getRelativeLocaleUrl } from 'astro:i18n';
import en from './en';
import es from './es';

export type Locale = 'en' | 'es';

const dictionaries = { en, es } as const;

export function useTranslations(locale: string | undefined) {
  return dictionaries[locale === 'es' ? 'es' : 'en'];
}

export function ogLocale(locale: string | undefined): 'en_US' | 'es_419' {
  return locale === 'es' ? 'es_419' : 'en_US';
}

/** Paths that currently have a real Spanish translation. Expand as later
 *  phases (e.g. privacy-policy) ship their own /es routes. */
const translatedPaths = new Set(['/', '/services', '/work', '/health', '/blog']);

/** Case study detail pages share a slug across locales (see workSlug in
 *  content.config.ts), so any /work/<slug> is assumed translated. */
const translatedPrefixes = ['/work/', '/blog/'];

function isTranslatedPath(bare: string): boolean {
  // Astro serves these with a trailing slash ('/health/'), but the set above
  // lists them bare. Without normalizing, the lookup misses and the language
  // toggle silently falls back to the locale homepage — which is what used to
  // happen on /es/health and /es/services. ('/work' and '/blog' escaped it
  // only by matching translatedPrefixes.)
  const normalized = bare.length > 1 ? bare.replace(/\/$/, '') : bare;
  if (translatedPaths.has(normalized)) return true;
  return translatedPrefixes.some((prefix) => bare.startsWith(prefix));
}

function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/es(\/|$)/, '/');
  return stripped === '' ? '/' : stripped;
}

/** Absolute EN / ES / x-default URLs for the current path, for hreflang tags
 *  and the sitemap — both must agree on the same alternates. */
export function getAlternateUrls(pathname: string, site: URL) {
  const bare = stripLocalePrefix(pathname);
  return {
    en: new URL(bare, site),
    es: new URL(getRelativeLocaleUrl('es', bare), site),
    xDefault: new URL(bare, site),
  };
}

/** Where the navbar language toggle should point. Falls back to that
 *  locale's homepage when the current page has no translation yet. */
export function getSwitcherUrl(pathname: string, targetLocale: Locale): string {
  const bare = stripLocalePrefix(pathname);
  if (!isTranslatedPath(bare)) {
    return targetLocale === 'es' ? getRelativeLocaleUrl('es', '/') : '/';
  }
  return targetLocale === 'es' ? getRelativeLocaleUrl('es', bare) : bare;
}

/** Locale-aware href that survives hash fragments and query strings.
 *
 *  `getRelativeLocaleUrl` treats its argument as a whole path and normalizes
 *  it, so '/#about' comes back as '/#about/' — a trailing slash *inside* the
 *  fragment, which is a dead anchor. Split the fragment/query off, localize
 *  only the path portion, then reattach it verbatim.
 *
 *  Bare fragments ('#contact') resolve against the locale home ('/es/#contact')
 *  so the link works from any page, not just the homepage. */
export function localizedHref(locale: Locale, href: string): string {
  const [, rawPath = '', suffix = ''] = href.match(/^([^?#]*)([?#].*)?$/) ?? [];
  const path = rawPath === '' ? '/' : rawPath;
  return getRelativeLocaleUrl(locale, path) + suffix;
}

export { getRelativeLocaleUrl };
