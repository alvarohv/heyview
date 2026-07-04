import { OGImageRoute } from 'astro-og-canvas';
import { buildOgPages, type OgPage } from '../../lib/og';

const pages = await buildOgPages();

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  // Our page keys are already the final slugs (e.g. `work/coolbrand`); append
  // the extension so the route resolves to `/og/work/coolbrand.png`.
  getSlug: (path) => `${path}.png`,
  getImageOptions: (_path: string, page: OgPage) => ({
    title: page.title,
    description: page.description ?? 'HeyView — Design · Automation · AI',
    // Brand tokens: navy background, copper accent edge, cream text.
    bgGradient: [
      [30, 42, 56],
      [16, 24, 35],
    ],
    border: { color: [166, 124, 82], width: 16, side: 'inline-start' },
    padding: 90,
    fonts: [
      './src/assets/fonts/EBGaramond.ttf',
      './src/assets/fonts/Inter.ttf',
    ],
    font: {
      title: {
        families: ['EB Garamond'],
        weight: 'Normal',
        color: [245, 240, 232],
        size: 68,
        // lineHeight is a MULTIPLIER (heightMultiplier), not pixels.
        lineHeight: 1.1,
      },
      description: {
        families: ['Inter'],
        weight: 'Normal',
        color: [200, 194, 183],
        size: 30,
        lineHeight: 1.4,
      },
    },
  }),
});
