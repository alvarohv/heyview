---
title: Enterprise finance automation
tag: "FINANCE   PROCESS AUTOMATION"
summary: A multinational manufacturer was spending 80+ hours per month on a finance close process that ran on copy-paste and spreadsheets. We rebuilt it in four weeks.
cover: /work/finance-automation/finance-automation-cover.png
client: Confidential — multinational manufacturer
industry: Manufacturing · Finance Operations
services: Process Automation, Systems Design
period: Jan – Apr 2025
team: Process Design, Integration Engineer, Finance Lead
tools: Power Automate, Excel, SQL, Analytics
year: 2025
order: 3
featured: false
context:
  body: >
    A multinational manufacturer was closing the books by hand every month —
    pulling numbers from four systems, reconciling them in Excel, formatting
    reports, and emailing PDFs to regional leadership. By the time we were
    brought in, month-end close consumed three full-time people for nearly two
    weeks, errors were routine, and leadership was reading numbers that were
    already a week old by the time they arrived.
solution:
  intro: >
    We built three automated layers that eliminated the manual steps entirely,
    without changing how the finance team thinks about the work.
  features:
    - title: "Automated data collection"
      body: >
        Scheduled connectors pull source data from ERP, billing, payroll, and
        the regional consolidation tool nightly — normalize it, and land it in
        one model. No human touches the extraction step anymore.
    - title: "Reconciliation engine"
      body: >
        Discrepancies are now flagged automatically with a plain-language
        explanation and a direct link to the source record. The team reviews
        exceptions, not rows.
    - title: "Leadership reporting"
      body: >
        The final close report generates automatically on Day 1 of each month —
        formatted, versioned, and distributed. Regional leads get a live
        dashboard instead of a static PDF.
results:
  intro: >
    The first close after go-live ran in six hours. Three people who had spent
    half their working lives on data plumbing were redeployed to FP&A work.
    The system has been running for five months without intervention.
stats:
  - { value: "80 hrs", label: "Monthly close, before" }
  - { value: "→ 6 hrs", label: "Monthly close, after" }
  - { value: "3 FTE", label: "Redeployed to higher-value work" }
  - { value: "94%", label: "Reduction in manual data entry" }
  - { value: "12", label: "Automated process flows" }
  - { value: "4 wks", label: "Design to live" }
---

## The situation

The finance team at a mid-size manufacturing subsidiary was closing the books by hand every month — pulling numbers from four systems, reconciling them in Excel, formatting reports, and emailing PDFs to regional leadership. It worked until the business grew. By the time we were brought in, month-end close consumed three full-time people for nearly two weeks, errors were routine, and leadership was reading numbers that were already a week old by the time they arrived.

The ask was simple: make it stop.

## What we built

We spent the first week watching how the team actually worked — not the process as documented, but the real sequence of workarounds and manual corrections they'd developed over three years. That told us exactly where to automate and where not to.

> "The goal wasn't to eliminate the team. It was to get rid of the part of the job that felt like data plumbing — so they could focus on what finance people are actually good at."

We built three layers:

### Automated data collection
A set of scheduled connectors pulls the source data from each system nightly — ERP, billing platform, payroll, and the regional consolidation tool — normalizes it, and lands it in a single model. No human touches the extraction step anymore.

### Reconciliation engine
Discrepancies that previously required a analyst to track down are now flagged automatically, with a plain-language explanation of the delta and a link to the source record. The team reviews exceptions, not rows.

### Leadership reporting
The final close report is generated automatically on Day 1 of the new month — formatted, versioned, and distributed without anyone touching a template. Regional leads get a live dashboard instead of a static PDF.

## The outcome

The first close after go-live ran in six hours. The team spent the rest of the week on actual analysis.

Three people who had spent half their working lives on data plumbing were redeployed to FP&A work — forecasting, margin analysis, the kind of work the company hired them to do. The error rate on reconciliation dropped to near zero. Leadership stopped asking "is this current?" because the answer is always yes.

The system has been running for five months without intervention.
