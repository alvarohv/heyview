# Johnson & Johnson MedTech — Supplier Notification Automation

> A Power Automate + SharePoint system that replaced the weekly manual supplier outreach for a Johnson & Johnson MedTech Global Supply Chain team. One click, ~50 supplier emails, two-tier urgency, audit trail in-place.

---

## Overview

|  |  |
|---|---|
| **Client / Company** | Johnson & Johnson MedTech — Global Supply Chain |
| **Industry** | Medical Devices · Global Supply Chain |
| **Type** | `Contractor` (via Proxify) |
| **Role** | Automation Architect |
| **Period** | Aug – Sep 2025 (with ongoing maintenance into 2026) |
| **Status** | `Live` — running in production |
| **Visibility** | `Source-of-truth doc` — derivatives (LinkedIn, website, deck) to be spun off once brand guide is finalized |

---

## Context

A Global Supply Chain team inside Johnson & Johnson MedTech was keeping suppliers aware of two things every week: purchase orders that had passed their delivery date, and POs about to come due in the next 7 days. The existing process was a buyer manually copy-pasting PO numbers from an open-order export into individual emails — roughly **50 suppliers, ~140 open PO line items** per week, inconsistent tone, no status tracking, no audit trail of who had been notified.

The team had standardized on SharePoint Online for PO data and Outlook for outreach, so the constraint was tight: the solution had to live inside Power Platform, send from the team's own mailbox, and degrade gracefully when supplier records were incomplete. New infrastructure was off the table.

---

## My Contribution

- Designed and built **three Power Automate cloud flows** that operate as a small system: a bulk "notify all suppliers" flow, a one-supplier-on-demand flow triggered from the SharePoint list UI, and a reset utility that wipes the PO list before each weekly data reload.
- Modeled the **SharePoint backbone** — two operational lists (PO List + Supplier DB) joined on `SupplierNumber`, plus a Log list for the on-demand path — and mapped every flow action to the underlying internal field schema so the team can extend it without breaking joins.
- Implemented a **two-table HTML email** generated inline by the flow: a red-themed "past due" table and a yellow-themed "due in 7 days" table, each conditionally rendered, with the subject line and Outlook importance flag flipping to *URGENT / High* when any past-due rows exist.
- Built **graceful degradation** across four failure modes: suppliers without emails, suppliers with no matching POs after filtering, send failures, and read failures — each routed to its own log or admin-notification branch instead of crashing the flow mid-loop.
- Marked notified POs back to `Status = 'Notified'` inside the same loop, giving the team an in-list audit trail of which orders had been touched without bolting on a separate tracking spreadsheet.
- Handled real-world data quirks the original spec missed: suppliers with **multiple contact emails** per record (semicolon-separated, up to 10 addresses per supplier), and **mislabeled date columns** in the source data (filtering on Promised, displaying Requested — fix queued).
- Authored the **internal reference documentation**: field map, action-by-action walkthrough, troubleshooting playbook, and a 12-item improvement backlog (idempotency, scheduling, observability) so the next person to touch it can ship changes safely.

---

## Tools & Deliverables

| Category | Detail |
|---|---|
| **Platform** | Power Automate Cloud Flows · SharePoint Online · Office 365 Outlook |
| **Patterns** | Apply-to-each loops · Filter Query (OData) · Compose `union()` dedupe · HTML `Create Table` · conditional branches with else-paths · `runAfter: Failed` exception handling |
| **Data model** | 2 operational SharePoint lists (PO List, Supplier DB) + 1 log list, joined on `SupplierNumber` |
| **Deliverables** | 3 flows · Field schema docs · HTML email template · Reference doc · Architecture diagram · Email mockup |

---

## Results & Impact

- ✉️ Replaced an ad-hoc, copy-paste weekly outreach with a **one-click consolidated email** to every supplier with open POs in the rolling 7-day window — ~**50 suppliers** in the active database, ~**140 open PO line items** per weekly snapshot.
- 🚦 **Two-tier urgency signalling** baked into the email itself — red past-due table, yellow upcoming table, plus High importance flag — so suppliers' inboxes self-prioritize without the buyer having to write per-email language.
- 🧾 **Audit trail by design**: each notified PO is marked `Status = 'Notified'` in-place, so the team can filter the PO List to see which orders have been communicated without spinning up a separate tracker.
- 🛡️ **Four-mode failure handling** — missing supplier emails, no POs after filtering, email send failures, list read failures — none crash the loop; admin gets a notification on send fails, skipped records logged inside run history.
- 🔁 Still running in production as of May 2026 — last connection refresh in May 2026, no rebuild needed.

> *Approximations are derived from the latest weekly CSV exports in this folder (Supplier DB and Open Order Report). Exact volumes vary week to week.*

---

## Artifacts

| Type | Location |
|---|---|
| Internal reference doc | `Portfolio/JnJ - Global Supply Chain/Power-Automate-Reference.md` |
| Architecture diagram (SVG) | `Portfolio/JnJ - Global Supply Chain/Flow-Diagram.svg` |
| Sample supplier email (HTML) | `Portfolio/JnJ - Global Supply Chain/Email-Mockup.html` |
| Original spec (PDF) | `Portfolio/JnJ - Global Supply Chain/Supplier Automation - Original Spec.pdf` |
| Process documentation (XLSX) | `Portfolio/JnJ - Global Supply Chain/PO Confirmation Process.xlsx` |
| Flow exports (Power Automate) | `…/{Notify All Suppliers,Pending POs Notification,Clean POs May 17 2026}.zip` |
| Extracted flow definitions | `…/Microsoft.Flow/flows/*/definition.json` |
| Raw data exports (CSV) — **RESTRICTED** | `_Private-Raw-Data/{Open Order Report All Items, Supplier Email DB, Notification Log}.csv` *(real production data — do not publish; see folder README)* |

---

## Confidentiality

Methodology, architecture, and Power Automate patterns described here are general practice and safe to share. **All supplier names, purchase order numbers, item codes, and email addresses in the email mockup and diagram are synthetic** and do not reflect real J&J data. The two metrics quoted in this case study (~50 suppliers, ~140 PO line items per week) are aggregate counts pulled from the source CSV exports in this folder — non-identifying.

Lead with **Johnson & Johnson MedTech** across every channel (LinkedIn, website, pitch deck, conversation). No legacy entity name. No business-unit specifics beyond "Global Supply Chain."

---

## Reusable Content Blocks

> *Pre-formatted building blocks for derivatives. Mix-and-match when the brand guide is ready.*

### Headline variants

| Channel | Headline |
|---|---|
| **Long form (website case study, deck cover)** | *Replacing a weekly manual outreach with a one-click Power Automate system at Johnson & Johnson MedTech — ~50 suppliers, ~140 open POs, audit-trail-by-design.* |
| **Medium (portfolio card, deck tile)** | *Built a Power Automate + SharePoint supplier notification system at J&J MedTech that replaced a weekly manual process for ~50 suppliers.* |
| **Short (LinkedIn hook, deck subtitle)** | *Turned a buyer's weekly copy-paste ritual into one click — at J&J MedTech.* |
| **Tagline (one-pager footer)** | *Power Automate · SharePoint · J&J MedTech · Live since 2025.* |

### Hero stats (use 1–2 per asset)

- **~50 suppliers** in the active notification roster
- **~140 open PO line items** processed per weekly snapshot
- **3 coordinated flows** (bulk, on-demand, reset)
- **2-tier urgency** signal — past due vs. due in 7 days
- **4 failure modes** handled gracefully (missing emails, no POs, send fail, read fail)
- **Live since Aug 2025** — running in production through 2026

### Pull-quote candidates

- *"The team had standardized on SharePoint and Outlook — the solution had to live inside Power Platform without new infrastructure or new training."*
- *"Audit trail by design — each notified PO marks itself `Notified` in-place; no separate tracker, no Excel babysitting."*
- *"Two-tier urgency baked into the email itself: red past-due, yellow upcoming, High importance flag — supplier inboxes self-prioritize."*
- *"Real-world data quirks the spec didn't mention: suppliers with up to 10 contact emails per record, and date columns mislabeled in the source data. The system absorbs both."*

### Story arc (LinkedIn / website narrative shape)

1. **Hook** — Every Friday, a buyer at a J&J MedTech supply chain team sat down to copy-paste PO numbers into ~50 individual emails.
2. **Stakes** — Past-due POs slipped because urgency wasn't visible; nobody had a clean audit trail of who'd been notified when.
3. **Constraint** — No new tools allowed. Solution had to live inside the SharePoint + Outlook stack the team already used.
4. **Move** — Three Power Automate flows, two-table HTML email with red/yellow urgency, in-list status updates as audit trail, graceful failure handling on four edge cases.
5. **Result** — One click instead of an afternoon. Suppliers self-prioritize from inbox preview. Status field becomes the audit log.
6. **Lesson / hook for prospects** — When the answer is "Power Platform inside the existing tenant," the design wins are 80% about the data model and the failure paths — not the trigger or the email template.

### Visual assets ready to use

- **Architecture diagram** (`Flow-Diagram.svg`) — three-phase layout (Collect → Match → Notify), color-coded past-due/upcoming branches. Use as hero on website case study and deck detail slide.
- **Sample email mockup** (`Email-Mockup.html`) — open in browser, screenshot at desktop width. Strongest single visual for LinkedIn carousel and deck "proof of work" slide.
- **Architecture diagram + email mockup side-by-side** — composite image for the website hero. The diagram says *"I designed the system"*; the email says *"and here's what the user actually sees."*

### Channel-specific notes

- **LinkedIn**: lead with the story arc (1 → 2 → 4 → 5). Skip the diagram, use a screenshot of the email mockup. Keep technical detail to 1 line max — audience is mostly non-technical buyers, founders, and ops leaders.
- **Website case study**: full narrative + diagram + email mockup side-by-side + hero stats panel + 2 pull quotes. End with a CTA aligned to your offer (medical practice automation, supply chain integrations, etc.).
- **Pitch deck**: one tile per stat (4 stats → 2x2 grid), diagram on second slide if buyer asks for depth. Drop into a "proof of work" section.
- **Cold email / DM intro**: short headline + one stat ("~50 suppliers, weekly manual process, now one click") + offer to walk them through it. Don't lead with technical detail.

### What I'd say in a sales conversation

> "Most internal automation projects fail because the founder picks the most exciting problem instead of the most boring one. At a J&J MedTech supply chain team, the weekly supplier email wasn't exciting — it was a buyer copy-pasting PO numbers into Outlook. We replaced that with a three-flow Power Automate system inside their existing SharePoint + Outlook setup, no new tools to learn. Two-tier urgency in the email itself so supplier inboxes self-prioritize. Status field doubles as the audit log. Live since 2025, ~50 suppliers, ~140 POs per week. That's the kind of problem I look for — visible to the team, ignored by IT, low-stakes if you ship it badly the first time."

---

## Portfolio Notes

- **Best for:** Demonstrating enterprise low-code automation chops (Power Platform + SharePoint at Fortune-500 scale), comfort working inside customer-owned tooling, supply-chain domain literacy, and the ability to design for graceful failure rather than just the happy path.
- **Headline:** *Built and shipped a Power Automate + SharePoint supplier notification system at Johnson & Johnson MedTech — three coordinated flows, two-tier urgency emails, audit-trail-by-design — replacing the team's weekly manual outreach for ~50 suppliers.*
- **Visibility:** `Source-of-truth doc` — derivatives (LinkedIn, website case study, pitch deck) to be spun from the Reusable Content Blocks once brand guide is finalized.
- **Tags:** `#contractor` `#power-automate` `#sharepoint` `#supply-chain` `#medical-devices` `#jnj` `#2025`

---

*Tags: #portfolio #contractor #power-automate #sharepoint #supply-chain #medical-devices #jnj #2025*
