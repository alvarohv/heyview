// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// `site` is the single source of truth for absolute URLs (canonical, OG,
// sitemap). Components read it via `Astro.site`. Update here only.
export default defineConfig({
  site: 'https://heyview.studio',
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/work/jnj-capacity-model': '/work/capacity-planning-system',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        // @astrojs/sitemap only allows letters and hyphens here, so plain
        // language codes (matching the hreflang values in Layout.astro)
        // rather than a region-qualified tag like es-419.
        locales: { en: 'en', es: 'es' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
