# Blog automation

How the blog gets drafted automatically. The website is static (no backend), so
generation runs **outside** the site as an agent that opens a Pull Request; a
human reviews and merges; the merge triggers the normal deploy. **Nothing
publishes without a human merge.**

Two interchangeable engines run the same workflow — pick one:

- **Engine A — Claude Code scheduled routine (recommended to start).** A cloud
  routine on a weekly cron (create with `/schedule`). No infrastructure, no extra
  accounts. Best for getting going.
- **Engine B — n8n (productizable).** A workflow: *Schedule trigger → Claude API
  node → GitHub "create PR" node.* Visible in your n8n panel and re-sellable to
  clients as a service. Requires authorizing the n8n connector first.

## The workflow (identical for both engines)

1. **Pick a topic.** Read [content-queue.md](../content-queue.md); take the top
   unchecked item under "Up next". If none, stop.
2. **Research.** Web-search the question: how people phrase it, current best
   practices, concrete numbers. Prioritize the *real questions* buyers ask — the
   post should answer one directly (that's what LLMs cite).
3. **Ground in HeyView's voice + facts.** Read `src/i18n/en.ts` (services,
   process, pricing, FAQ), `src/content/work/*.en.md`, and an existing post for
   tone. Reuse real facts (four-week delivery, fixed scope, no hourly billing).
   Add **internal links** to `/services`, `/work`, `/health`, relevant case
   studies.
4. **Write the file.** Create `src/content/blog/<kebab-slug>.en.md` matching the
   schema in `src/content.config.ts` (frontmatter: `title, description, pubDate,
   author, tags, lang: en`). Question-shaped `title`; `description` = the
   one-sentence answer. ~600–900 words, declarative, no fluff. Optionally add a
   Spanish `.es.md` translation with the same slug.
5. **Open a PR.** Branch, commit, push, open a PR titled after the post. In the
   PR body, note the queue item and a 2-line summary.
6. **Human review.** You edit if needed and merge. Then tick the item in
   `content-queue.md` and move it to "Published".

## Drafting prompt (paste into the routine / Claude API node)

> You are drafting one blog post for HeyView, a design, automation, and AI studio
> for specialty practices and operations-heavy businesses. Read
> `content-queue.md` and take the top unchecked "Up next" item. Research the
> question with web search. Read `src/i18n/en.ts`, `src/content/work/*.en.md`,
> and an existing post in `src/content/blog/` for voice and facts. Write a new
> `src/content/blog/<slug>.en.md` following the frontmatter schema in
> `src/content.config.ts`: a question-shaped title, a one-sentence-answer
> description, `pubDate` today, `tags`, `lang: en`. 600–900 words, plain
> declarative prose, real HeyView facts (four-week delivery, fixed scope, no
> hourly billing), and internal links to /services, /work, /health, and any
> relevant case study. Do not invent client names or metrics. Then open a PR —
> do not merge.

## Notes
- Keep the queue full; the agent is only as good as the topics you feed it.
- Never let the agent auto-merge. The PR gate is the quality control.
- If a post needs Spanish, add `<slug>.es.md` (same slug) — see the bilingual
  convention in `SEO.md` §6.
