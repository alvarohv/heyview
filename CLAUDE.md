# HeyView — Agency Website

## Project
B2B agency website for HeyView, an agency focused on Automation, Design, and AI for specialty practices. Built with Astro for maximum performance (zero-JS by default, 100 Lighthouse score goal).

## Stack
- **Framework**: Astro 6 (`npm run dev` to start)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Fonts**: EB Garamond (serif, headings/display) + Inter Variable (sans-serif, body/UI)
- **Icons**: Material Symbols Outlined (Google)

## SEO & AI discoverability
See [SEO.md](SEO.md) for the full playbook. Key conventions:
- Canonical domain `https://heyview.studio` — set once in `astro.config.mjs` (`site`); read via `Astro.site`.
- `Layout.astro` handles canonical, OG/Twitter, and JSON-LD. **Every page should pass its own `title` + `description`** (format: `Phrase: HeyView`). Use `<Layout noindex>` for thin pages.
- Site identity lives in `src/config.ts` (`SITE`, `SOCIALS`); sitemap is auto-generated; `public/robots.txt` + `public/llms.txt` are AI-crawler friendly.
- Portfolio uses **Content Collections** (`src/content/work/*.md`, schema in `src/content.config.ts`) — one indexable URL per project at `/work/<slug>`, no CMS/DB. Set `confidential: true` for teaser-only (no detail page), `featured: true` for the large card. `CaseStudies.astro` (homepage teaser) and `/work` index both read the collection via `WorkCard.astro`. See SEO.md §5.

## Design Source
Designs live in Stitch. Project ID: `752958268504802919` (title: "HeyView | Design 1 | Generic").

Key screen being built: **"HeyView Homepage — Full-Width Textured Hero Final"**
- Screen ID: `1d510a2aad5047b28f6f147268f252e8`
- Device: Desktop (2560px wide, full-page)

To fetch latest HTML from Stitch: use `mcp__stitch__get_screen` with the screen name `projects/752958268504802919/screens/1d510a2aad5047b28f6f147268f252e8`.

## Design Tokens (from Stitch Tailwind config)

### Colors
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#091523` | Dark text |
| `primary-container` / navy | `#1E2A38` | Nav bg, hero CTA buttons, dark sections |
| `surface` / cream | `#F5F0E8` | Hero bg, section bg |
| `accent-warm` | `#A67C52` | Step numbers, bullet dots, numbered labels |
| `accent-green` | `#526251` | Overline labels |
| `secondary` | `#3A4350` | Body text |
| `outline-variant` | `#E7E1D6` | Hairline borders |

### Typography
| Role | Family | Size | Weight |
|---|---|---|---|
| Display / Hero H1 | EB Garamond | 64–72px | 300 (light) |
| H1 | EB Garamond | 56px | 400 |
| H2 | EB Garamond | 40px | 400 |
| H3 | EB Garamond | 22px | 500 |
| Body LG | Inter | 17–20px | 400 |
| Body SM | Inter | 13px | 400 |
| Overline | Inter | 10–11px | 600, tracking-[0.15em] UPPERCASE |
| UI Label | Inter | 14px | 500 |

### Design Principles
- No border radius (buttons and cards are `rounded-none`)
- Hairline borders: always `0.5px` in `#E7E1D6`
- Grain texture overlay on hero sections via CSS `::before` pseudo-element
- Max page width: 1440px centered
- Desktop horizontal padding: 64px (`px-margin-desktop`)
- Mobile horizontal padding: 20px (`px-margin-mobile`)

## Component Structure
```
src/
  layouts/
    Layout.astro          ← base HTML, fonts, meta
  components/
    Navbar.astro           ← sticky top nav + mobile drawer
    Hero.astro             ← full-width textured hero section
    WhatWeDo.astro         ← dark navy "what we do" + 3 services
    Process.astro          ← 4-step timeline
    CaseStudies.astro      ← work/portfolio grid (TBD)
    Footer.astro           ← footer (TBD)
  pages/
    index.astro            ← composes all sections
```

## Other Stitch Screens (for future sessions)
| Title | Screen ID | Device |
|---|---|---|
| Refined Hero with Editorial Details | `2806b9b9f5e84d0aae581ba85f8553fe` | Desktop |
| Full-Width Textured Hero | `aac224aee3014d34a4370ebdd6eec6fe` | Desktop |
| Clinic Hero Update | `5291b8ed8b8d46269ca566f0fbbd2186` | Desktop |
| Refined Sinaí Alfaro Bio | `16b3d9e7a9ac4dac83e1083b17f56cc2` | Desktop |
| Tablet Editorial Hero & Navbar | `b24b40d8d01641a98749908fece5b45c` | Mobile |
| Tablet Breakpoint 768px | `22da787d832c43f98010d4633dd92e98` | Mobile |
| Tablet Refined About Section | `b668ca3361cf4ae59d9d4f5866c1cba6` | Mobile |
