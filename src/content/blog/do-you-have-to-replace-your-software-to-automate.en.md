---
title: Do you have to replace your software to automate it?
description: No — most integration problems don't need a new platform. A bidirectional sync between an optical lab system and SAP Business One, built with zero changes to either platform, shows what "layer on top" actually looks like.
pubDate: 2026-07-14
author: Alvaro Hernandez
tags: ['automation', 'integration', 'erp']
lang: en
---

No. The instinct to "just replace the old system" is almost always more expensive
and slower than the alternative: building a layer that connects what you already
have. Before HeyView existed as a studio, I ran a project that's a clean example
of what that looks like in practice.

## The problem: two systems, zero connection

TOPEX Labs, a Costa Rican optical lens manufacturer, ran two systems side by
side. **Lensware** managed everything on the lab floor — orders, prescriptions,
inventory. **SAP Business One** ran the business side — customers, sales orders,
invoicing. Neither system knew the other existed.

The gap was filled by hand. Staff re-typed orders from Lensware into SAP.
Customer records lived in both systems and had to be kept in sync manually.
Inventory movements in the warehouse never made it back to the lab system.
Invoice status generated in SAP didn't flow back to the people fielding
questions about it. Every data point that crossed the boundary between the two
systems crossed it by hand, and every manual re-entry was a chance for the two
systems to drift out of sync.

The obvious-sounding fix — replace one of the systems, or bolt on a new
platform that talks to both — was also the wrong one. Lensware was the lab's
system of record for prescriptions and orders; SAP was the company's ERP. Both
worked. Neither needed to change.

## What "layer on top" meant here

The build was four independent .NET services, deployed on the company's own
servers, meeting each platform on the terms it already offered:

- **Lensware's native integration is file-based.** It reads and writes
  industry-standard `.vca` order files and CSV files to a shared network
  folder. So instead of asking the lab system to change, the integration wrote
  to that folder in the format Lensware already expected.
- **SAP Business One exposes its full object model through the DI API**, which
  allows direct, transactional access to SAP's business objects. Every write
  was wrapped in a transaction with rollback on failure — a half-written sales
  order in an ERP is worse than no order at all.
- **One service per data flow** — customers, inventory, invoices, and orders
  each ran as its own background service. A hiccup in inventory sync couldn't
  take down order processing. Each service could be restarted, monitored, or
  redeployed independently.

No new platform. No cloud dependency the company didn't already have the
capacity to run. No changes to either system's core.

## The detail that made it trustworthy

The part that mattered most wasn't the file parsing or the DI API calls — it
was the feedback loop. When a new order came in from Lensware and the
integration created the matching sales order in SAP, SAP handed back a
document number. That number got written into a file back into Lensware's own
import folder, stamping it onto the original lab order. From that point on,
both systems referenced the same document.

That loop is what turns an integration into something staff actually trust.
Without it, you get two records that are *probably* the same order — which is
exactly the ambiguity manual re-entry was supposed to prevent in the first
place.

## What it fixed

- Orders placed in Lensware appeared in SAP automatically, with line items and
  warehouse codes populated — no manual entry for lab orders.
- Customer records managed in SAP synced continuously to Lensware — one source
  of truth instead of two copies drifting apart.
- Billing status generated in SAP flowed back to the lab floor, so staff could
  answer invoice questions without pinging accounting.
- Every sync event and SAP transaction was logged, giving the team an audit
  trail they didn't have before.

None of this required TOPEX to buy new software or migrate off a system that
already worked for them.

## The takeaway

Before you scope a project as "replace system X," ask what X already exposes —
a file format, an export folder, an API most vendors ship but nobody's used yet.
Most business software has *some* integration surface; the work is usually in
finding it and building against it carefully, not in ripping the platform out.
This is the same principle behind how we scope [automation work](/services) at
HeyView today: map what you already run before proposing what to replace. You
can see more of that approach in the [work](/work) we've delivered since.

*This project predates HeyView — it was delivered independently in 2023–2024,
before Sinaí and I formalized the studio. TOPEX Labs later became a HeyView
client for a separate engagement, an [AI strategy diagnostic](/work/topex-labs)
covering a different part of the business.*
