# Johnson & Johnson MedTech — SWAV Supply/Demand Planning Tool

> An Office Scripts + Excel automation that replaced a manual, multi-source supply planning process at a Johnson & Johnson MedTech manufacturing team. Two sites, ~1,800 components, 52-week horizon — built and written in under 30 seconds per refresh.

---

## Overview

| | |
|---|---|
| **Client / Company** | Johnson & Johnson MedTech (formerly Shockwave Medical) — Supply Chain / Planning |
| **Industry** | Medical Devices · Manufacturing · Supply Chain |
| **Type** | `Contractor` (via Proxify) |
| **Role** | Automation / Tools Developer |
| **Period** | 2025–2026 |
| **Status** | `Completed — Phase 1` · delivered & invoiced. Phase 2 (US expansion) under discussion with stakeholder. |
| **Visibility** | `Source-of-truth doc` — derivatives (LinkedIn, website, deck) to be spun off once project is fully wrapped |

---

## Context

A supply planning team inside Johnson & Johnson MedTech needed a weekly view of component-level supply vs. demand across a 52-week horizon — for two manufacturing sites (US and Costa Rica) covering roughly 1,800+ unique components. The existing process required planners to manually cross-reference five separate data sources: a demand forecast, a Bill of Materials, a Material Master, an inventory snapshot, and open purchase orders. There was no automated explosion from finished-good demand to component demand, no consolidated view, and no signal for which components were at risk of a negative projected end-of-hand.

The constraint was tight: the team worked entirely in Excel and Microsoft 365. No new infrastructure was available. The solution had to live inside the existing Excel workbook as an Office Script.

---

## My Contribution

- Designed and built **two Office Scripts** (TypeScript) — one per manufacturing site — that together replace the entire manual assembly process: one script for the US Site (`LOCATION = "10"`) and one for the Costa Rica Site (`LOCATION = "CRI"`), sharing identical architecture with only the location constant differing.
- Engineered a **BOM demand explosion** in JavaScript: reads finished-good "Adjusted Baseline Demand" from the Demand Tracker, multiplies by BOM quantity for each component parent, and aggregates component-level demand across all finished-good parents — covering ~1,761 components in the US Site alone.
- Solved a fundamental **Excel Office Scripts scaling problem**: `setFormulas` for 1.1 million cells (1,761 components × 12 rows × 52 weeks) triggers a timeout regardless of batch size. Redesigned the script to pre-compute all values in JavaScript and write with `setValues` — ~10× faster because Excel skips formula parsing — completing the full projection in ~15–25 seconds via ~36 batched API calls.
- Built a **12-row Key Figure structure** per component (BOH by inventory bucket, open POs, supply adjustment, total supply, demand, projected EOH, projected EOH in dollars, freight cost, and projected Weeks on Hand) with a rolling weekly projection computed entirely in JavaScript — each week's closing EOH becomes the next week's opening BOH, with no cross-cell formula references needed.
- Implemented **flexible Material Master column detection** to handle both direct exports and SharePoint list exports, which rename columns ("SKU" → "Title", "Cost" → "Material Cost", "Freight" → "Unit Freight Cost"). Silent column mismatches had caused all Material Master data to be dropped without an error message.
- Applied a **single formula-based conditional format** to the entire week data range — `=AND(MOD(ROW()-2,12)=8,I2<0)` — that highlights every negative projected-EOH cell in red without applying 1,761 individual conditional format rules (which would have added significant overhead).
- Diagnosed and resolved a **data layout mismatch** in the CR Site's Inventory Details source data, where the client's sheet had columns in non-standard positions; deferred the script fix at the client's request while they correct the source data layout.
- Authored **internal reference documentation**: data model with column-index maps for all five source sheets, a phase-by-phase script walkthrough, version history documenting four distinct failure modes encountered and resolved (internal error, payload size exceeded, timeout, API method not found), and a 7-item improvement backlog.

---

## Tools & Deliverables

| Category | Detail |
|---|---|
| **Platform** | Office Scripts (TypeScript) · Excel for Microsoft 365 · SharePoint Online |
| **Patterns** | Chunked `getValues` reads · batched `setValues` writes · JS-side BOM demand explosion · rolling EOH projection · formula-based conditional format (single CF on full range) · flexible column detection |
| **Data sources** | Demand Tracker · FlatBOM table · Material Master · Inventory Details · Purchase Orders |
| **Output** | `SDADetails` Excel table — 12 KF rows × 52 week columns per component, one snapshot per weekly refresh |
| **Deliverables** | 2 production scripts · 5 supporting clean-up scripts · CLAUDE.md working memory · SDA-Script-Reference.md · this case study |

---

## Results & Impact

- ⚡ **Reduced refresh time from hours to ~25 seconds** — the script reads all five source tabs, explodes BOM demand to ~1,761 components, computes a full 52-week rolling projection, and writes 1.1 million values in a single run.
- 🧮 **Zero manual cross-referencing** — planners no longer pull data from five sources; the SDA Details tab is regenerated fresh each week from the live source tabs in the same workbook.
- 🚦 **At-risk components visible at a glance** — negative projected EOH rows are automatically highlighted in red, surfacing supply shortfalls without any planner filtering.
- 📊 **12 Key Figures per component** — BOH by inventory sub-bucket (RM / RI / MRB), open POs, supply adjustments, total supply, demand, EOH in units and dollars, freight cost, and Weeks on Hand — all in one contiguous Excel table that planners can filter, sort, and pivot.
- 🏭 **Two-site coverage** — same architecture deployed to both the US and Costa Rica manufacturing sites with no duplication of business logic.
- 🔧 **Resilient to data format variation** — flexible column detection means the script handles SharePoint export column renames without a code change.

> *Scale figures (1,761 components, 52 weeks) are from the US Site. CR Site scale is smaller; exact figures withheld pending final deployment.*

---

## Artifacts

| Type | Location |
|---|---|
| US Site production script | `Office Scripts/4- SDA Details REFRESH data - SC.txt` |
| CR Site production script | `Office Scripts/4- SDA Details REFRESH data - CR.txt` |
| Supporting clean-up scripts | `Office Scripts/1- Atlas Demand -Clean-up.txt`, `2- BOM Clean-up.txt`, `3- Demand Tracker Builder US/CR.txt` |
| Internal reference doc | `SDA-Script-Reference.md` |
| Claude working memory | `CLAUDE.md` |
| SDA Details output screenshot | `Screenshots/sda-details-output.png` |
| Architecture diagram | `Screenshots/diagram-architecture.svg` |
| Before/after diagram | `Screenshots/diagram-before-after.svg` |
| Hero stats card | `Screenshots/hero-stats-card.svg` |
| Original project proposal | `_Resources/SWAV Tool Proposal.docx` |
| Closing summary deck | `_Resources/SWAV What-if Tool - Closing Summary.pptx` |
| US Site workbook | `_Resources/What-if Tool (US Site).xlsx` |
| CR Site workbook | `_Resources/What-if Tool (CR Site).xlsx` |
| Material Master source | `_Resources/Material Master.xlsx` |
| Archive (prior versions v1–v8) | `_Archive/` — reference only |
| Demo recordings (Atlas Demand, BOM Report) | Moved to cold storage — see `SOURCE-MEDIA.md` |

---

## Confidentiality

Methodology, architecture, and Office Scripts patterns described here are general practice and safe to share. **No component SKUs, demand figures, inventory balances, supplier names, or purchase order data are included in this document.** Scale figures (components, weeks) are non-identifying operational characteristics. Lead with **Johnson & Johnson MedTech** across all channels — no legacy entity name (Shockwave Medical), no business-unit specifics beyond "Supply Chain / Planning."

---

## Reusable Content Blocks

> *Pre-formatted building blocks for LinkedIn, website, pitch deck, and conversations. Mix-and-match once the project is fully wrapped.*

### Headline variants

| Channel | Headline |
|---|---|
| **Long form (website case study, deck cover)** | *Built an Office Scripts automation at Johnson & Johnson MedTech that collapses a five-source manual supply planning process into a 25-second Excel refresh — ~1,800 components, 52-week rolling projection, two manufacturing sites.* |
| **Medium (portfolio card, deck tile)** | *Replaced a manual weekly supply planning assembly at J&J MedTech with an Office Scripts automation covering ~1,800 components across two sites.* |
| **Short (LinkedIn hook, deck subtitle)** | *Turned a five-tab manual supply planning process into a 25-second Excel refresh — at J&J MedTech.* |
| **Tagline (one-pager footer)** | *Office Scripts · Excel · J&J MedTech · Supply Chain Planning.* |

### Hero stats (use 1–2 per asset)

- **~1,800 components** tracked across two manufacturing sites
- **52-week rolling horizon** refreshed in ~25 seconds
- **1.1 million cell values** computed in JavaScript and written without formula strings
- **5 source data tabs** consolidated into one SDA Details output table
- **12 Key Figures per component** — BOH, POs, supply, demand, EOH, WOH
- **2 manufacturing sites** — US and Costa Rica — from one shared script architecture

### Pull-quote candidates

- *"The root constraint was Excel's 5-minute Office Scripts timeout. Formula strings for 1.1 million cells triggered it every time. The fix was to stop writing formulas entirely — compute everything in JavaScript and write plain values."*
- *"Silent data failures are worse than loud ones. The Material Master was returning zero items because SharePoint exports rename columns without warning. Flexible column detection fixed it without touching the source data."*
- *"One conditional format, applied to the full range, highlights every negative EOH row — no per-component rules, no extra overhead. The formula `MOD(ROW()-2,12)=8` does the row targeting."*
- *"The team had five data sources and a manual assembly process. The only acceptable solution was something that lived inside the Excel workbook itself, no new infrastructure."*

### Story arc (LinkedIn / website narrative shape)

1. **Hook** — A supply planning team at J&J MedTech was manually assembling a 52-week component-level supply view each week — pulling from five separate tabs, doing BOM explosions by hand.
2. **Stakes** — ~1,800 components, two manufacturing sites, and a demand horizon that changes every week. Missing a supply shortfall meant production risk.
3. **Constraint** — No new tools. No database. The answer had to be an Excel Office Script inside the workbook the team already used.
4. **Problem inside the problem** — Office Scripts has a 5-minute timeout. Writing 1.1 million formula strings hits it every time. The architectural decision was: compute everything in JavaScript, write values only.
5. **Move** — BOM demand explosion in JS, rolling EOH projection week by week, Material Master flexible column detection, a single formula-based conditional format for negative EOH. All data from five tabs into one `SDADetails` table in ~25 seconds.
6. **Result** — Weekly manual process replaced by a single script run. Negative EOH rows light up red automatically. Two sites, same script, one line different.
7. **Lesson / hook for prospects** — When the constraint is "it has to stay inside Excel," the design wins are almost never about the formulas. They're about what you move into JavaScript.

### Visual assets (to build once project wraps)

- **Architecture diagram** — five source tabs → script → SDA Details table. Show the data flow with BOM explosion as the central step.
- **Before/after** — manual five-tab process vs. one-click script run. Strongest visual for LinkedIn and deck.
- **SDA Details table screenshot** — redacted, with red EOH highlights visible. Shows the actual output planners see.
- **Script performance log** — console output showing the phase checkpoints and "=== DONE ===" line with component and row counts. Shows the engineering rigor without exposing business data.

### Channel-specific notes

- **LinkedIn**: lead with the story arc (Hook → Stakes → Constraint → Move → Result). Use the "five-tab manual process → 25-second script" contrast as the hook. Audience is ops leaders, supply chain professionals, Excel power users, and contractors evaluating what's possible inside M365.
- **Website case study**: full narrative + architecture diagram + redacted SDA Details screenshot + hero stats panel + 2 pull quotes. End with a CTA aligned to your offer (M365 automation, supply chain tooling, etc.).
- **Pitch deck**: one tile per stat (4 stats → 2×2 grid), architecture diagram on a second slide if the buyer asks for depth. Drop into a "proof of work" section.
- **Cold email / DM intro**: short headline + one stat ("~1,800 components, five manual data sources, now a 25-second script") + offer to walk them through it. Don't lead with the timeout problem — that's a detail for the follow-up.

### What I'd say in a sales conversation

> "Supply planning teams inside large medtech companies almost always have the same problem: five data sources, a manual weekly assembly process, and a spreadsheet that nobody has time to automate because IT won't touch it. At J&J MedTech, the constraint was tight — had to live inside Excel as an Office Script, no new infrastructure. The wrinkle was scale: ~1,800 components, 52 weeks, 12 metrics per component — that's 1.1 million cells. Office Scripts has a 5-minute timeout. Formula strings hit it every time. The fix was to move all the computation into JavaScript and write values only. Now they run one script, the SDA Details tab refreshes in about 25 seconds, negative supply rows highlight red automatically, and both manufacturing sites get the same output. That's the kind of problem I look for — high manual effort, existing tools already in place, just needs the right architecture."

---

## Portfolio Notes

- **Best for:** Demonstrating M365 automation depth (Office Scripts at scale), supply chain domain literacy, ability to solve platform constraints architecturally rather than working around them, and comfort building for non-technical end users inside tools they already own.
- **Headline:** *Built an Office Scripts + Excel supply/demand planning automation at Johnson & Johnson MedTech — BOM demand explosion, rolling 52-week projection, two manufacturing sites, 1.1 million values written in ~25 seconds.*
- **Visibility:** `Source-of-truth doc` — derivatives (LinkedIn post, website case study, pitch deck tile) to be written once the CR Site is fully deployed and the project is wrapped.
- **Tags:** `#contractor` `#office-scripts` `#excel` `#supply-chain` `#medical-devices` `#jnj` `#2025` `#2026`

---

*Tags: #portfolio #contractor #office-scripts #excel #supply-chain #medical-devices #jnj #automation*
