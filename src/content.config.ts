import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'zod';

// Portfolio / case studies. One Markdown file per project in src/content/work/.
// Filenames carry a locale suffix (e.g. `coolbrand.en.md` / `coolbrand.es.md`)
// so both translations share the same URL slug — see `workSlug` below.
const work = defineCollection({
  // Default id generation slugifies filenames and strips dots (turning
  // `coolbrand.es.md` into `coolbrandes`), which collides with the
  // `workSlug` scheme below — so ids are the raw filename (sans `.md`).
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/work',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    /** Locale this entry is written in — matches the filename suffix. */
    lang: z.enum(['en', 'es']).default('en'),
    title: z.string(),
    /** Two-part eyebrow label, e.g. "LUXURY RETAIL   WEB DESIGN". */
    tag: z.string(),
    /** 1–2 sentences. Used on cards AND as the page meta description. */
    summary: z.string(),
    /** Cover image: path under /public or a remote URL. Optional — cards and
     *  the detail hero fall back to a branded block when absent. */
    cover: z.string().optional(),
    /** Client name. Omit for confidential / anonymized work. */
    client: z.string().optional(),
    year: z.number().optional(),
    /** Shown in the detail-page meta row, e.g. "Medical Devices · Manufacturing". */
    industry: z.string().optional(),
    /** Services delivered, e.g. "UI/UX, AI Integration". Shown in hero sidebar. */
    services: z.string().optional(),
    /** Engagement window, e.g. "May – Nov 2025". */
    period: z.string().optional(),
    /** Headline stats panel on the detail page. Keep to 3–6, all public-safe. */
    stats: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    /** Screenshot gallery on the detail page. Images must be public-safe
     *  (blurred where they contain real data). */
    gallery: z
      .array(z.object({ src: z.string(), caption: z.string().optional() }))
      .optional(),
    /** Large 8-col card on the homepage teaser + /work index. */
    featured: z.boolean().default(false),
    /** Teaser card only — no public detail page is generated. */
    confidential: z.boolean().default(false),
    /** Structured body sections — renders the two-column template instead of prose. */
    context: z.object({ body: z.string() }).optional(),
    solution: z.object({
      intro: z.string(),
      features: z.array(z.object({ title: z.string(), body: z.string() })),
    }).optional(),
    results: z.object({ intro: z.string() }).optional(),
    /** Pull quote shown below The Results section. */
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    }).optional(),
    /** Team members or roles, e.g. "Design Lead, Frontend, PM". */
    team: z.string().optional(),
    /** Tools used, e.g. "Figma, React, Power Platform". */
    tools: z.string().optional(),
    /** Lower numbers sort first. */
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };

/** Work collection ids are `<slug>.<lang>` (e.g. `coolbrand.es`) since the
 *  loader derives ids from filenames. Strip the suffix to get the URL slug
 *  shared across both locale versions of a case study. */
export function workSlug(id: string): string {
  return id.replace(/\.(en|es)$/, '');
}
