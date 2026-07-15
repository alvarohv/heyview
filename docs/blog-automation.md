# Blog automation

How the blog gets drafted. The website is static (no backend), so drafting runs
as an agent that writes a Markdown post and opens a **GitHub Pull Request**; a
human reviews and merges; the merge triggers the normal deploy. **Nothing
publishes without a human merge.**

**Cadence: ~biweekly (one post every 2 weeks).** Daily/weekly is too much — it
dilutes quality and reads as filler, which search engines and LLMs discount.

## Primary path — on-demand from Cowork (recommended)

No schedule. Whenever you want the next post (roughly every couple of weeks),
open the Claude app (Cowork) — which you keep open all day — and ask it to draft
the next queued topic. You stay in full control and there's nothing to maintain.

Paste this into Cowork:

> Draft the next HeyView blog post. Read `content-queue.md`, take the top
> unchecked "Up next" item, and follow `docs/blog-automation.md`. Open a PR — do
> not merge.

Then review the PR, edit if needed, merge, and tick the item in
`content-queue.md` (move it to "Published").

## The workflow the agent follows

1. **Pick a topic.** Read [content-queue.md](../content-queue.md); take the top
   unchecked item under "Up next". If none, stop and ask for topics.
2. **Research.** Web-search the question: how people phrase it, current best
   practices, concrete numbers. Prioritize the *real questions* buyers ask — the
   post should answer one directly (that's what LLMs cite).
3. **Ground in HeyView's voice + facts.** Read `src/i18n/en.ts` (services,
   process, pricing, FAQ), `src/content/work/*.en.md`, and an existing post for
   tone. Reuse real facts (four-week delivery, fixed scope, no hourly billing).
   Add **internal links** to `/services`, `/work`, `/health`, relevant case
   studies. Never invent client names or metrics.
4. **Write the file.** Create `src/content/blog/<kebab-slug>.en.md` matching the
   schema in `src/content.config.ts` (frontmatter: `title, description, pubDate,
   author, tags, lang: en`). Question-shaped `title`; `description` = the
   one-sentence answer. ~600–900 words, declarative, no fluff. Optionally add a
   Spanish `.es.md` translation with the same slug.
5. **Open a PR.** Branch, commit, push, open a PR titled after the post. In the
   PR body, note the queue item and a 2-line summary. **Do not merge.**
6. **Human review.** You edit if needed and merge. Then tick the item in
   `content-queue.md` and move it to "Published".

## Drafting prompt (the full spec, for any engine)

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

## Optional — fully automated (set up later if the on-demand rhythm slips)

Same workflow, same prompt, but triggered on a cron instead of by you:

- **Engine A — Claude Code scheduled routine.** A cloud routine on a **biweekly**
  cron (create with `/schedule`). Runs in Anthropic's cloud even when Code/your
  laptop is closed; manage/pause it from your scheduled-agents list. The cloud
  runner needs GitHub credentials to open the PR — that's the one setup step.
- **Engine B — n8n (productizable).** A workflow: *Schedule trigger → Claude API
  node → GitHub "create PR" node.* Visible in your n8n panel and re-sellable to
  clients as a service. Requires authorizing the n8n connector first.

## Notes
- Keep the queue full; the agent is only as good as the topics you feed it.
- Never let the agent auto-merge. The PR gate is the quality control.
- If a post needs Spanish, add `<slug>.es.md` (same slug) — see the bilingual
  convention in `SEO.md` §6.
