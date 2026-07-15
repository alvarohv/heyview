# Blog content queue

The topic backlog for the blog drafter (see
[docs/blog-automation.md](docs/blog-automation.md)). Add ideas to **Up next**;
the agent takes the top unchecked item, drafts a post, opens a PR, and — on
merge — you tick it and move it to **Published**.

**Cadence: ~biweekly, on-demand.** No cron — when you want the next post (roughly
every 2 weeks), ask Cowork to "draft the next queued post → PR" (prompt in the
doc above). One post every two weeks beats a firehose for quality and SEO.

Prefer **question-shaped titles** ("How much…", "What is…", "When should…").
Those are what LLMs surface and cite in answers.

## Up next
- [ ] What does it cost to automate a manual process? (pricing/ROI, fixed-scope model)
- [ ] What is an AI assistant for customer communication, really? (WhatsApp/IG/email, human handoff)
- [ ] When should a business build a custom dashboard instead of using reports?
- [ ] How do you stop losing revenue to no-shows in a specialty practice?
- [ ] What's the difference between an automation and an integration?
- [ ] How do you keep company knowledge searchable with AI over old documents?

## Published
- [x] How long does an AI automation project take? →
      `src/content/blog/how-long-does-an-ai-automation-project-take.en.md`
- [x] Do we have to replace our existing software to automate? (the "layer on top" approach) →
      `src/content/blog/do-you-have-to-replace-your-software-to-automate.en.md`
