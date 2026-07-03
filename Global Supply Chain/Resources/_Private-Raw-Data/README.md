# _Private-Raw-Data — RESTRICTED

> ⚠ **Do not publish, share, or screen-record over the contents of this folder.**

This folder contains raw CSV exports from the live SharePoint lists that back the Supplier Notification Automation. The files contain **real production data**:

- Real supplier names and SAP/ERP supplier codes
- Real contact email addresses (B2B contacts at vendor companies)
- Real purchase order numbers, line items, quantities, and prices in USD
- Real buyer and requester names (J&J employees)
- Real product codes, descriptions, and ship-to locations

## What it is and isn't

- It **is** the source data Alvaro used to verify metrics for the case study (~50 suppliers, ~140 open PO line items per weekly snapshot).
- It **is not** suitable for any public-facing material — website, LinkedIn, pitch deck, prospect demo, screen recording.

## If you need to demo the structure

Use the synthetic example in `../Email-Mockup.html` or the column map in `../Power-Automate-Reference.md` (§3 Data model). Both are derived from these files but fully sanitized.

## Files

| File | What it contains |
|---|---|
| `Open Order Report All Items.csv` | ~138 open PO line items with full PO metadata |
| `Supplier Email DB.csv` | ~49 suppliers with one or more contact emails each |
| `Notification Log.csv` | Empty schema export — no rows beyond the header |

## Provenance

Exports taken from the live J&J MedTech SharePoint site backing the production flow, May 2026.
