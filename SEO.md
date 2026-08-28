# SEO & AI Discoverability — HeyView

How search engines **and** AI assistants (ChatGPT, Claude, Perplexity, Google AI
Overviews) find, understand, and cite HeyView. Read top to bottom on Day 0;
use the checklist at the end as you go.

Canonical domain: **https://heyview.studio** (set once in `astro.config.mjs` → `site`).

---

## 1. What's already wired up ✅

These ship automatically — no accounts or domain activation needed.

| Thing | Where | Notes |
|---|---|---|
| Canonical URLs | `Layout.astro` | Derived from `Astro.site` + page path. |
| Open Graph + Twitter cards | `Layout.astro` | Per-page `title`/`description`/`image` props. |
| JSON-LD (`Organization` + `WebSite`) | `Layout.astro` | Reads from `src/config.ts` → `SITE`/`SOCIALS`. |
| `sitemap-index.xml` | `@astrojs/sitemap` | Auto-generated on `npm run build`. |
| `robots.txt` | `public/robots.txt` | Allows all + **explicitly opts in AI crawlers**. |
| `llms.txt` | `public/llms.txt` | Plain-language brief for LLMs (see §4). |
| `noindex` switch | `Layout.astro` prop | `<Layout noindex>` for thin/utility pages. |

**Per-page metadata** — every page should pass its own title/description:

```astro
<Layout
  title="Premium watch brand landing page: HeyView"
  description="How we built an editorial, conversion-focused landing page for a luxury watch brand."
  image="/work/watch-brand-og.jpg"
  type="article"
>
```

Title format: `Page-specific phrase: HeyView`. Keep ≤ ~60 chars, descriptions ≤ ~155.

---

## 2. Your action items (need the domain / accounts)

You're waiting on the domain transfer before creating accounts. In order:

### 2.1 — When the domain is live
1. **Confirm `site` in `astro.config.mjs`** still matches the live domain (incl. www-vs-non-www — pick one and 301 the other at the host/DNS level).
2. **Google Search Console** — verify the domain (DNS TXT record is easiest during transfer), then submit `https://heyview.studio/sitemap-index.xml`.
3. **Bing Webmaster Tools** — same; Bing also feeds ChatGPT search. Worth the 5 minutes.
4. **Create the OG image** — `public/og-image.jpg`, **1200×630**, with logo + tagline. Referenced by `SITE.ogImage`; until it exists, social shares have no preview image. Validate with the [Facebook](https://developers.facebook.com/tools/debug/) and [LinkedIn](https://www.linkedin.com/post-inspector/) inspectors.
5. ~~**Confirm socials**~~ — done. `SOCIALS.linkedin` in `src/config.ts` points at the live company page (`linkedin.com/company/heyview`), which drives JSON-LD `sameAs` and the footer.

### 2.2 — Analytics (PostHog + Microsoft Clarity)
Both are client scripts. Add them to `Layout.astro` so they load site-wide.
**Gate them on production** so localhost dev doesn't pollute your data.

Put keys in a `.env` file (already git-ignored) and read with `import.meta.env`:

```
# .env  (never commit real keys)
PUBLIC_POSTHOG_KEY=phc_xxx
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
PUBLIC_CLARITY_ID=xxxxxxxx
```

Then in `Layout.astro`, before `</head>` (or just before `</body>`):

```astro
---
const PROD = import.meta.env.PROD;
const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY;
const CLARITY_ID = import.meta.env.PUBLIC_CLARITY_ID;
---

{PROD && POSTHOG_KEY && (
  <script is:inline define:vars={{ POSTHOG_KEY, POSTHOG_HOST: import.meta.env.PUBLIC_POSTHOG_HOST }}>
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init(POSTHOG_KEY,{api_host:POSTHOG_HOST,person_profiles:'identified_only'})
  </script>
)}

{PROD && CLARITY_ID && (
  <script is:inline define:vars={{ CLARITY_ID }}>
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",CLARITY_ID);
  </script>
)}
```

> **Privacy/consent:** Clarity records sessions and PostHog tracks behavior.
> Update `privacy-policy.astro` to name both tools, and consider whether you
> need a cookie/consent banner for your audience (GDPR/CR data law). PostHog
> can run cookieless; Clarity is first-party but still records sessions.

### 2.3 — Off-site signals (the LLM/AI ranking lever)
AI assistants cite sources they can corroborate. Build presence on properties
they crawl heavily:
- **LinkedIn company page** (and founders' profiles linking to the site).
- **Google Business Profile** — **eligibility check first.** Google requires
  in-person contact with customers; businesses operating entirely online are
  explicitly not eligible, and forcing it is the classic cause of suspension.
  If we do meet clients face to face (CR clinic discovery, on-site interviews
  like the TOPEX engagement), we qualify as a *service-area business*: give an
  address for verification only, hide it, and publish a service area instead.
  No PO box, no virtual office. Google suggests keeping the service area
  within ~2 hours' drive of the base, so Alajuela → the whole GAM works; the
  US does not belong in that field.
- Directory/listing on Clutch or niche specialty-practice lists. A Clutch
  profile automatically creates a **The Manifest** profile too — they're one
  action, not two.
- Anywhere you get mentioned, ensure the name is exactly **"HeyView"** and the
  one-line descriptor matches `llms.txt` (consistency = entity confidence).

#### Copy kit — paste this *identically* everywhere
LLMs cite entities they can **corroborate** across sources they already crawl
(LinkedIn, Crunchbase, Clutch). Divergent names/descriptors lower confidence and
cost you citations. Use these exact strings on every profile:

- **Name**: HeyView  ·  **Legal**: HeyView Studio
- **One-liner**: *Design, automation, and AI studio for specialty practices and
  operations-heavy businesses.*
- **Founders**: Alvaro Hernandez — AI & Systems Architect · Sinaí Alfaro —
  Design & Product Lead
- **Location**: Costa Rica · serves the United States & Latin America (EN/ES)
- **Site**: https://heyview.studio  ·  **LinkedIn**: (confirmed handle — set in
  `src/config.ts` → `SOCIALS.linkedin`)
- **Categories/tags**: AI, Automation, Web Design, UX/UI, Software Development
- **Longer bio** (for Crunchbase/Clutch "about"): *HeyView is a design,
  automation, and AI studio founded in Costa Rica by Alvaro Hernandez and
  Sinaí Alfaro. It builds document and process automation, AI customer-communication
  assistants, operations dashboards, and custom system integrations on top of
  the software businesses already use. Fixed scope, senior hands, delivery in
  about four weeks.*

  Paste this verbatim. No em dashes and no `~`, both of which read badly in
  directory profiles and get mangled by some form fields. If you reword it for
  one platform, reword it here too — divergent descriptions are exactly what
  costs us entity confidence.
- **Sales / contact email**: must be on the domain (not a personal address) and
  actually monitored — Clutch routes lead notifications to it.

**Where to create profiles (priority order):**
1. **LinkedIn company page** — done, live at `/company/heyview`; founders
   link their profiles to it.
2. **Clutch** — free profile at [clutch.co/get-listed](https://clutch.co/get-listed)
   (~20 min), then invite clients to review. Clutch's team verifies and
   publishes each review, and the profile propagates to The Manifest for free.
   Ranked above Crunchbase because Clutch doesn't care that we're remote and
   its reviews are the citable third-party proof we currently have none of.
3. **Crunchbase** — org profile (one of the most-crawled entity sources).
4. **Google Business Profile** — only if the in-person-contact test above is
   genuinely met. If it isn't, LinkedIn recommendations, Clutch reviews, and
   on-site testimonials with `Review` schema are the substitute.

---

## 3. Classic SEO principles for this site

- **One `<h1>` per page**, matching search intent. Sections use `<h2>`/`<h3>`.
- **Semantic HTML** — already good (`<main>`, `<section>`, `<footer>`, skip link).
- **Images**: every `<img>` needs descriptive `alt` + `width`/`height` (prevents
  layout shift). Prefer Astro's `<Image>` (`astro:assets`) for local images to
  get automatic WebP/AVIF + sizing. The current portfolio uses remote Google
  CDN URLs as CSS backgrounds — replace with local optimized assets so you
  control them and they're crawlable.
- **Performance is SEO** — you're zero-JS by default; protect that. Core Web
  Vitals (LCP, CLS, INP) are ranking factors. Self-host fonts (done), lazy-load
  below-the-fold images, keep the hero image optimized.
- **Internal links** with descriptive anchor text (not "click here").
- **404 page** — add `src/pages/404.astro` so bad links degrade gracefully.

---

## 4. AI / LLM SEO ("GEO" — Generative Engine Optimization)

Optimizing to be **understood and cited by LLMs**, not just ranked by Google.

**Why our stack is already strong:** LLM crawlers read raw HTML and don't run
JS well. A zero-JS, server-rendered Astro site is ideal — content is right there
in the markup.

**Levers, strongest first:**
1. **Structured data (JSON-LD)** — done for the org. Add `CreativeWork`/article
   schema per case study (see §5) and `FAQPage` if you add an FAQ. This is the
   cleanest signal for machines.
2. **`llms.txt`** (`public/llms.txt`) — an emerging convention ([llmstxt.org](https://llmstxt.org))
   giving LLMs a curated, plain-language summary + key links. Keep it updated as
   pages/services change.
3. **Clear, factual, self-contained prose** — LLMs extract and quote sentences.
   Write copy that states *who you are, what you do, and for whom* in plain
   declarative sentences (the hero/about already do this well). Avoid burying
   facts in imagery or vague marketing-speak.
4. **Entity consistency** — same name, founders, descriptor everywhere (site,
   `llms.txt`, LinkedIn, directories). Disagreement lowers AI confidence.
5. **Allow the crawlers** — done in `robots.txt` (GPTBot, ClaudeBot,
   PerplexityBot, Google-Extended, etc.). Blocking them = invisible to AI.
6. **Question-shaped content** — pages/sections that answer real questions
   ("How long does an AI automation project take?") get surfaced in AI answers.
   A future blog or FAQ is the highest-leverage content you can add for this.

---

## 5. Portfolio / Projects — recommended approach

**Your instinct is half right.** A CMS or database **for SEO** would be wasted
effort *and can hurt you* (runtime cost, slower pages, nothing Google rewards).
But the current setup — a hardcoded array inside `CaseStudies.astro` rendering
one combined section — is **also leaving the biggest SEO win on the table.**

### The actual SEO win: one indexable URL per project
Right now all projects live at `/#projects`. Search engines and LLMs index
**pages**, not anchors. Each case study should be its **own crawlable URL**
(`/work/watch-brand-landing`) with its own title, description, OG image, and
`CreativeWork` JSON-LD. That's how you rank for "luxury watch brand landing
page" or get cited for "AI finance automation case study."

### Recommended: Astro **Content Collections** (file-based, no DB, no CMS)
This is the sweet spot for a developer-run site:

- Each project is a Markdown/MDX file in `src/content/work/` with typed
  frontmatter (title, client, tags, cover image, summary, body).
- A `[...slug].astro` page renders each into its own static, zero-JS HTML page.
- An index page (`/work`) lists them — replacing the hardcoded array.
- **Type-safe** (zod schema catches mistakes at build), **version-controlled**
  (git, no external service), **free**, and **as fast as the rest of the site.**
- You write content in Markdown — faster than editing a CMS UI, and it lives in
  the repo.

```
src/
  content/
    work/
      watch-brand-landing.md      ← frontmatter + body
      finance-automation.md
  content.config.ts               ← zod schema (defineCollection)
  pages/
    work/
      index.astro                 ← lists all projects
      [...slug].astro             ← renders one project page
```

**When a CMS/DB *would* make sense (not now):**
- A non-technical teammate needs to publish without touching git → layer a
  **Git-based CMS** (Decap, Sveltia, or Astro's Keystatic) *on top of the same
  content files*. No rearchitecting, still static.
- Truly dynamic, per-user, or frequently-changing data (e.g. live dashboards).
  None of that applies to a portfolio.

**Bottom line:** Skip the CMS/DB. Content Collections + per-project pages.
Same dev simplicity, but you unlock individual indexable URLs, which is where
portfolio SEO actually lives.

**Status: shipped.** This section reads as a recommendation because it was one;
the migration is done. Six bilingual case studies live in `src/content/work/`,
each at its own `/work/<slug>` (and `/es/work/<slug>`) with `CreativeWork`
JSON-LD. The hardcoded array in `CaseStudies.astro` is gone — it and the `/work`
index both read the collection through `WorkCard.astro`.

---

## 6. Bilingual (EN/ES) routing

The site is bilingual: English at the root (`/`, `/services`, …) and Spanish
under `/es/` (`/es/`, `/es/services`, …), using Astro's built-in `i18n`
routing (`astro.config.mjs` → `i18n`, `defaultLocale: 'en'`,
`prefixDefaultLocale: false`). English URLs are unchanged from before i18n
shipped — no redirects needed, no lost SEO equity.

**Conventions:**

- **Copy** lives in a central dictionary, not inline in components:
  `src/i18n/en.ts` / `src/i18n/es.ts`, one key per page/component. Read it via
  `useTranslations(Astro.currentLocale)` from `src/i18n/utils.ts`. `es.ts` is
  typed `satisfies typeof en` so a missing translation key is a build-time
  TypeScript error, not a silent English fallback in production.
- **Routing helpers** (`src/i18n/utils.ts`): `getRelativeLocaleUrl` (re-exported
  from `astro:i18n`) for internal links that should follow the current locale;
  `getAlternateUrls` computes the EN/ES/x-default hreflang URLs for a given
  path; `getSwitcherUrl` computes where the navbar's language toggle should
  point, falling back to that locale's homepage if the current page has no
  translation yet (tracked in the `translatedPaths` set in that file).
- **Use `localizedHref` for any link containing `#` or `?`.**
  `getRelativeLocaleUrl` normalizes its whole argument as a path, so `/#about`
  comes back as `/#about/` — a trailing slash *inside* the fragment, which is a
  dead anchor. `localizedHref` splits the fragment/query off, localizes only the
  path, and reattaches it. This shipped broken across the entire nav and footer
  in both locales; don't reintroduce it by reaching for `getRelativeLocaleUrl`
  on an anchor link.
- **`translatedPaths` entries are matched slash-insensitively.** Astro serves
  `/health/` but the set lists `/health`; before this was normalized, the
  language toggle on `/es/health` and `/es/services` silently dumped users on
  the English homepage. `/work` and `/blog` escaped it only because they also
  matched `translatedPrefixes`. Add new routes bare (`/pricing`, not
  `/pricing/`) and the normalization handles the rest.
- **hreflang**: every page emits reciprocal `<link rel="alternate">` tags
  (`en`, `es`, `x-default`) in `Layout.astro`, and the sitemap integration is
  configured with matching `i18n.locales` so `sitemap-index.xml` carries the
  same signal.
- **Coverage today**: homepage, `/services`, `/work`, `/health`, and `/blog`
  are all fully translated, including every case study and blog post. The
  `work` and `blog` collections carry a `lang` field with locale-suffixed
  filenames (`coolbrand.en.md` / `coolbrand.es.md`), so the bilingual schema
  change described in earlier drafts of this doc is already done.
  **`/privacy-policy` is the only English-only page left** — it's deliberately
  excluded from `translatedPaths` until legal copy gets a native-speaker pass,
  so the ES footer links to the English version on purpose.
- **Translation quality**: Spanish copy in `es.ts` was Claude-drafted (neutral
  Latin American / `es-419`) and should get a native-speaker review pass
  before being treated as final, especially anything customer-facing on the
  legal/privacy side once that page is translated.

---

## 7. Day-0 checklist

```
Already done (in the repo):
[x] site set in astro.config.mjs (heyview.studio)
[x] Canonical + OG + Twitter tags (Layout.astro)
[x] JSON-LD Organization + WebSite
[x] Sitemap (auto-generated on build)
[x] robots.txt with AI crawlers allowed
[x] llms.txt

⚠️ BLOCKER before any deploy:
[ ] Eyeball public/work/jnj/product-wireframes.html (embedded in the case study)
    for any real figures — wireframe numbers are likely mock, but confirm.
    (The unblurred dashboard screenshots were removed; the only dashboard image
    now is the already-blurred cover.)

Do when domain is live:
[ ] Pick www vs non-www; 301 the other
[ ] Verify Google Search Console + submit sitemap   ← nothing else is measurable
[ ] Verify Bing Webmaster Tools + submit sitemap       until these two are done
[x] OG images: auto-generated per-page branded cards at build (astro-og-canvas
    → /og/*.png; src/pages/og/[...route].ts + src/lib/og.ts). Validate live with
    the share inspectors once deployed.
[x] SOCIALS.linkedin points at the live company page

Off-site / entity (no code, highest leverage for a new domain):
[x] LinkedIn company page
[ ] Clutch profile (clutch.co/get-listed) — carries The Manifest for free
[ ] Invite CoolBrand + TOPEX Labs to leave Clutch reviews
[ ] Crunchbase org profile
[ ] Google Business Profile — run the in-person-contact eligibility test in
    §2.3 first; skip rather than risk a suspension

Do when accounts exist:
[ ] Add PostHog snippet (§2.2), key in .env
[ ] Add Microsoft Clarity snippet (§2.2), id in .env
[ ] Update privacy-policy.astro to name both tools

Bilingual correctness (fixed 2026-08-10, see §6):
[x] localizedHref — anchors no longer render as /#about/ across nav + footer
[x] Language toggle on /es/health and /es/services reaches the EN equivalent
    instead of falling back to the homepage
[x] Wordmark, "view all work", and vertical cards respect the active locale
[x] Stat counters server-render real values (crawlers were reading "0 years
    in enterprise systems" as fact); count-up animation preserved for visitors
[x] Process + ContactCTA counter scripts scoped to their own sections

Content / structure (next build phase):
[x] Migrate portfolio → Content Collections, one URL per project (§5)
[x] Add CreativeWork JSON-LD per case study (work/[...slug].astro)
[x] /work index + per-project pages; homepage teaser reads the collection
[ ] Per-page title + description on remaining pages (privacy-policy)
[x] Real case-study copy in src/content/work/*.md — 6 studies live, bilingual,
    with hard numbers (350MB/143-sheet model, ~1,800 components, 0→100+ inquiries)
[x] llms.txt lists all 6 case studies + both blog posts (was missing TOPEX
    Labs, supply/demand planning, and the second post)
[ ] Replace remote Google-CDN portfolio covers with local astro:assets
[x] Add src/pages/404.astro (noindex, branded, with recovery links)
[x] FAQ section on /services (bilingual) with FAQPage JSON-LD — question-shaped, AI-citable
[x] Upgrade Organization schema → Organization + ProfessionalService (serviceType, areaServed, knowsLanguage)
[x] Rewrite llms.txt to list every page + all case studies (was Home/Privacy only)
[x] Blog: content collection + /blog index + posts + BlogPosting schema + RSS
    (bilingual). 1 seed post. Automated drafter documented in docs/blog-automation.md
    (queue: content-queue.md) — activate via Claude routine or n8n when ready.
```
