---
lang: en
title: Supplier notification automation
tag: "MEDICAL DEVICES   SUPPLY CHAIN AUTOMATION"
summary: A global medical device manufacturer's supply chain team was manually emailing ~50 suppliers every week about past-due and upcoming purchase orders. We replaced it with a one-click Power Automate system with built-in urgency signaling and an audit trail.
cover: /work/supplier-notification-automation/flow-diagram.svg
client: "Confidential (global medical device manufacturer)"
industry: Medical Devices · Global Supply Chain
services: Process Automation, Systems Design
period: Aug-Sep 2025 (ongoing)
team: Automation Architect
tools: Power Automate, SharePoint, Outlook
year: 2025
order: 4
featured: false
context:
  body: >
    A supply chain team inside a global medical device manufacturer was keeping
    around 50 suppliers aware of two things every week: purchase orders that
    had passed their delivery date, and POs about to come due in the next
    seven days. The process was entirely manual: a buyer copy-pasting PO
    numbers from an open-order export into individual emails, roughly 140 open
    line items per week, with inconsistent tone and no audit trail of who had
    been notified. The team had standardized on SharePoint Online for PO data
    and Outlook for outreach, so any fix had to live inside that stack, with
    no new infrastructure and no new tools to learn.
solution:
  intro: >
    We built three coordinated Power Automate flows that turned a weekly
    manual ritual into a one-click system, with urgency and accountability
    designed into the email itself.
  features:
    - title: "Three coordinated flows"
      body: >
        A bulk "notify all suppliers" flow, a one-supplier on-demand flow
        triggered straight from the SharePoint list, and a reset utility that
        clears the PO list before each weekly data reload.
    - title: "Two-tier urgency email"
      body: >
        Each supplier gets one consolidated email with a red past-due table
        and a yellow due-soon table; subject line and Outlook importance flag
        flip to URGENT / High whenever past-due items exist.
    - title: "Audit trail by design"
      body: >
        Notified POs are marked Status = "Notified" in the same loop, giving
        the team an in-list record of who's been contacted without a separate
        tracking spreadsheet.
results:
  intro: >
    The weekly outreach that used to take a buyer an afternoon of copy-paste
    now runs in one click, with the inbox itself doing the prioritization.
stats:
  - { value: "50", label: "Suppliers notified weekly" }
  - { value: "140", label: "Open PO line items per cycle" }
  - { value: "3", label: "Coordinated automation flows" }
  - { value: "4", label: "Failure modes handled gracefully" }
gallery:
  - src: /work/supplier-notification-automation/email-mockup.png
    caption: "Sample supplier notification email: red past-due table, yellow due-soon table, subject line flips to URGENT when needed."
---

## The situation

A supply chain team at a global medical device manufacturer was keeping suppliers ahead of two failure modes: purchase orders that were already past due, and POs about to come due in the next seven days. Doing this by hand meant a buyer copying PO numbers from an open-order export into individual emails, every week, for around 50 suppliers and roughly 140 open line items: slow, inconsistent, and with no record of who had actually been notified.

The constraint was tight: the team had standardized on SharePoint Online for PO data and Outlook for outreach, so the fix had to live inside Power Platform, send from the team's own mailbox, and degrade gracefully when supplier records were incomplete. New infrastructure was off the table.

## What we built

We designed and built three Power Automate cloud flows that operate as a small system: a bulk "notify all suppliers" flow, a one-supplier-on-demand flow triggered from the SharePoint list UI, and a reset utility that clears the PO list before each weekly data reload.

The SharePoint backbone is two operational lists, a PO list and a Supplier DB, joined on supplier number, plus a log list for the on-demand path. Every flow action maps to the underlying field schema so the team can extend it without breaking the joins.

Each notification email is a two-table HTML message generated inline by the flow: a red-themed "past due" table and a yellow-themed "due in 7 days" table, each conditionally rendered, with the subject line and Outlook importance flag flipping to URGENT / High whenever any past-due rows exist.

We also built graceful degradation across four failure modes (suppliers without emails, suppliers with no matching POs after filtering, send failures, and read failures), each routed to its own log or admin-notification branch instead of crashing the flow mid-loop. Notified POs are marked back to Status = "Notified" inside the same loop, giving the team an in-list audit trail without a separate tracking spreadsheet.

## The outcome

What used to be a buyer's Friday afternoon of copy-paste now runs in one click. The two-tier urgency signal is baked into the email itself, so suppliers' inboxes self-prioritize without the buyer writing per-email language. The status field doubles as the audit log. The system has been running in production since it shipped, with only routine connection maintenance required.
