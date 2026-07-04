// Shared source of truth for auto-generated Open Graph cards.
//
// `buildOgPages()` enumerates every indexable URL (static pages + work + blog,
// both locales) as `{ key: { title, description } }`. The OG route
// (src/pages/og/[...route].ts) renders one PNG per key; Layout.astro maps the
// current pathname to a key via `ogImageKey()` and points og:image at
// `/og/<key>.png`. Keeping both sides on this module guarantees they agree.
import { getCollection } from 'astro:content';
import en from '../i18n/en';
import es from '../i18n/es';
import { workSlug, blogSlug } from '../content.config';

export interface OgPage {
  title: string;
  description?: string;
}

export async function buildOgPages(): Promise<Record<string, OgPage>> {
  const pages: Record<string, OgPage> = {
    'index': { title: 'Design & AI systems for complex operations', description: en.common.tagline },
    'es/index': { title: 'Sistemas de diseño e IA para operaciones complejas', description: es.common.tagline },
    'services': { title: en.servicesPage.hero.h1, description: en.servicesPage.hero.eyebrow },
    'es/services': { title: es.servicesPage.hero.h1, description: es.servicesPage.hero.eyebrow },
    'health': { title: en.healthPage.hero.h1, description: en.healthPage.hero.eyebrow },
    'es/health': { title: es.healthPage.hero.h1, description: es.healthPage.hero.eyebrow },
    'work': { title: 'Selected work', description: en.workPage.subhead },
    'es/work': { title: 'Trabajo seleccionado', description: es.workPage.subhead },
    'blog': { title: en.blogPage.headline, description: en.blogPage.subhead },
    'es/blog': { title: es.blogPage.headline, description: es.blogPage.subhead },
    'privacy-policy': { title: 'Privacy Policy', description: 'How HeyView handles data.' },
  };

  const work = await getCollection('work', ({ data }) => !data.draft);
  for (const p of work) {
    const slug = workSlug(p.id);
    const key = p.data.lang === 'es' ? `es/work/${slug}` : `work/${slug}`;
    pages[key] = { title: p.data.title, description: p.data.summary };
  }

  const blog = await getCollection('blog', ({ data }) => !data.draft);
  for (const p of blog) {
    const slug = blogSlug(p.id);
    const key = p.data.lang === 'es' ? `es/blog/${slug}` : `blog/${slug}`;
    pages[key] = { title: p.data.title, description: p.data.description };
  }

  return pages;
}

/** Map a page pathname to its OG card key (matches keys in `buildOgPages`). */
export function ogImageKey(pathname: string): string {
  const p = pathname.replace(/\/+$/, '');
  if (p === '') return 'index';
  if (p === '/es') return 'es/index';
  return p.replace(/^\//, '');
}
