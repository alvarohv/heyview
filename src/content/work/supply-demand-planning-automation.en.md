---
lang: en
title: Supply/demand planning automation
tag: "MEDICAL DEVICES   OFFICE SCRIPTS AUTOMATION"
summary: A supply planning team at a global medical device manufacturer was manually cross-referencing five Excel sources every week to track ~1,800 components against a 52-week demand horizon. We replaced it with an Office Scripts automation that explodes BOM demand and refreshes the full supply/demand picture in about 25 seconds.
cover: /work/supply-demand-planning-automation/diagram-before-after.svg
client: "Confidential (global medical device manufacturer)"
industry: Medical Devices · Supply Chain Planning
services: Process Automation, Excel Systems Design
period: Nov 2025 – May 2026
team: Automation & Tools Developer
tools: Office Scripts (TypeScript), Excel for Microsoft 365, SharePoint Online
year: 2026
order: 6
featured: false
context:
  body: >
    A supply planning team inside a global medical device manufacturer
    needed a weekly, component-level view of supply versus demand across a
    52-week horizon, for two manufacturing sites and roughly 1,800 unique
    components. The existing process required planners to manually
    cross-reference five separate data sources — a demand forecast, a Bill
    of Materials, a Material Master, an inventory snapshot, and open
    purchase orders — with no automated explosion from finished-good
    demand down to component demand, no consolidated view, and no signal
    for which components were at risk of running negative. The team worked
    entirely inside Excel and Microsoft 365; no new infrastructure was on
    the table, so the fix had to live inside the existing workbook as an
    Office Script.
solution:
  intro: >
    We designed and built two Office Scripts — one per manufacturing site,
    sharing identical architecture — that replace the entire manual
    assembly process end to end.
  features:
    - title: "BOM demand explosion in JavaScript"
      body: >
        The script reads finished-good demand from the Demand Tracker,
        multiplies it by BOM quantity for each component parent, and
        aggregates component-level demand across every finished-good
        parent — covering roughly 1,800 components per site.
    - title: "Beat the Office Scripts timeout"
      body: >
        Writing formula strings for 1.1 million cells (1,800 components ×
        12 rows × 52 weeks) hits Excel's 5-minute Office Scripts timeout
        regardless of batch size. We pre-compute every value in JavaScript
        and write it in batched calls — around 10x faster, since Excel
        skips formula parsing entirely.
    - title: "Rolling 52-week projection"
      body: >
        A 12-row key-figure structure per component — inventory on hand by
        bucket, open POs, supply adjustments, total supply and demand,
        projected end-of-hand in units and dollars, freight cost, and
        weeks on hand — computed as a rolling projection, where each
        week's closing balance becomes the next week's opening balance.
    - title: "One conditional format instead of 1,800"
      body: >
        A single formula-based conditional format applied across the
        entire week-data range highlights every negative projected
        end-of-hand cell in red, without applying a separate rule per
        component.
    - title: "Resilient to source-data drift"
      body: >
        Flexible column detection on the Material Master handles both
        direct exports and SharePoint list exports, which silently rename
        columns (SKU to Title, Cost to Material Cost) — a mismatch that
        had previously caused Material Master data to drop out with no
        error.
results:
  intro: >
    The weekly manual assembly is gone. Planners run one script and get a
    full component-level supply/demand picture in about 25 seconds, with
    at-risk components already flagged in red.
stats:
  - { value: "~1,800", label: "Components tracked" }
  - { value: "~25s", label: "Full refresh time" }
  - { value: "1.1M", label: "Cell values computed" }
  - { value: "2", label: "Manufacturing sites" }
gallery:
  - src: /work/supply-demand-planning-automation/diagram-architecture.svg
    caption: "Five source tabs feed one Office Script, which explodes BOM demand and writes a single SDA Details table."
  - src: /work/supply-demand-planning-automation/sda-details-output-mockup.svg
    caption: "SDA Details output, illustrative: 12 key figures per component, negative projected end-of-hand auto-highlighted in red. Data shown is fabricated for portfolio use, not actual client figures."
---

## The situation

A supply planning team at a global medical device manufacturer needed a weekly, component-level view of supply versus demand across a 52-week horizon, for two manufacturing sites and roughly 1,800 unique components. Getting there meant manually cross-referencing five separate data sources — a demand forecast, a Bill of Materials, a Material Master, an inventory snapshot, and open purchase orders — with no automated explosion from finished-good demand down to component demand, no consolidated view, and no signal for which components were at risk of running negative.

The constraint was tight: the team worked entirely inside Excel and Microsoft 365, with no new infrastructure on the table. The fix had to live inside the workbook the planners already used, as an Office Script.

## What we built

We designed and built two Office Scripts — one per manufacturing site, sharing identical architecture and differing only in a location constant — that replace the entire manual assembly process. Each script reads finished-good demand from the Demand Tracker, explodes it to component-level demand using Bill-of-Materials quantities, and aggregates it across every finished-good parent, covering roughly 1,800 components per site.

The core engineering problem was scale hitting a platform ceiling: writing formula strings for the resulting 1.1 million cells (1,800 components × 12 key figures × 52 weeks) triggers Office Scripts' 5-minute timeout no matter how the batches are sized. The fix was architectural — pre-compute every value in JavaScript and write plain values instead of formulas, roughly 10x faster since Excel skips formula parsing entirely. Each component gets a 12-row key-figure block (inventory on hand by bucket, open POs, supply adjustments, total supply and demand, projected end-of-hand in units and dollars, freight cost, weeks on hand) computed as a rolling projection, where each week's closing balance becomes the next week's opening balance.

A single formula-based conditional format applied across the entire week-data range highlights every negative projected end-of-hand cell in red, instead of registering a separate rule per component. And because the Material Master sheet arrives from two different export paths that silently rename columns (SKU to Title, Cost to Material Cost), the script uses flexible column detection instead of hardcoded headers — a mismatch that had previously caused Material Master data to drop out of the model with no error at all.

## The outcome

The weekly manual assembly is gone. Planners run one script per site and get a full component-level supply/demand picture in about 25 seconds — five data sources consolidated, BOM demand exploded, a 52-week rolling projection computed, and at-risk components already flagged in red, with no cross-referencing and no spreadsheet gymnastics.
