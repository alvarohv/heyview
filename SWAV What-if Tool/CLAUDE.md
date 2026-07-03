# CLAUDE.md — JnJ SWAV What-if Tool

> Working memory for Claude. Read this at the start of every session on this project.

---

## Project at a glance

| | |
|---|---|
| **Client** | Johnson & Johnson MedTech (formerly Shockwave Medical) |
| **Team** | Supply Chain / Planning |
| **Engagement** | Contractor via Proxify |
| **Role** | Alvaro Hernandez — Automation / Tools Developer |
| **What it is** | Excel-based Supply/Demand Analysis (SDA) planning tool — two separate XLSX workbooks, one per manufacturing site |
| **Status** | **In Progress — completing next week** · US Site v10 stable; CR Site pending client data fix |

---

## Two sites, two workbooks, one script architecture

| | CR Site | US Site |
|---|---|---|
| **Workbook** | `What-if Tool (CR Site).xlsx` | `What-if Tool (US Site).xlsx` |
| **LOCATION code** | `"CRI"` | `"10"` |
| **Script** | `Office Scripts/5- SDA Details REFRESH data - CR.txt` | `Office Scripts/5- SDA Details REFRESH data - SC.txt` |
| **Components** | Smaller set | ~1,761 components |
| **Script version** | v10 (logic identical to US Site; LOCATION differs) | v10 — stable |
| **Known issue** | Inventory Details column layout mismatch — client is fixing their sheet | None open |

---

## What the tool does

1. Reads **Demand Tracker** → pulls "Adjusted Baseline Demand" per finished-good SKU, by ISO week.
2. Reads **FlatBOM table** → explodes FG demand to component-level demand using BOM qty and BOM type/location filter.
3. Reads **Material Master** → description, buyer code/name, cost, freight, lead time.
4. Reads **Inventory Details** → current BOH split into RM / RI / MRB buckets.
5. Reads **Purchase Orders** → open PO qty by component by week.
6. Builds **SDA Details sheet** — one Excel Table named `SDADetails` — with 12 KF rows × 52 week columns per component.

---

## SDA Details tab structure

- **Header row:** `Snapshot ID | Organization | Item | Item Description | Buyer Code | Buyer Name | Product Sub Group | Key Figure | [week cols YYYYWW…]`
- **Fixed columns (8):** cols A–H (index 0–7); week data starts at col I (index 8)
- **Key Figures (12 rows per component, in order):**

| # | KF Name |
|---|---|
| 0 | BOH RM (Units) |
| 1 | BOH RI (Excluded for supply analysis) |
| 2 | BOH MRB (Excluded for supply analysis) |
| 3 | BOH Total ($) |
| 4 | Open Purchase Orders |
| 5 | Supply Adjustment Total |
| 6 | Total PP Supply |
| 7 | Total PP Demand |
| 8 | Projected EOH (Units) |
| 9 | Projected EOH ($) |
| 10 | Freight Cost |
| 11 | Projected WOH |

- **Week IDs:** 6-digit ISO format `YYYYWW` (e.g., `202621`)
- **Snapshot ID:** `WW{YYYY}.{WW}` (e.g., `WW2026.21`)

---

## Script architecture (v9 key decisions)

### Why setFormulas (v10), not setValues (v9)
- v9 used `setValues` (pre-computed JS numbers) — fast (~15 s) but broke Supply Adjustment cascade.
- v10 switched back to `setFormulas` with `FORMULA_BATCH=8` (4,992 strings/call, ~221 calls for 1,761 components).
- 4,992 strings/call is safely under the ~9,000 limit that causes Office Scripts "internal error".
- Dynamic rows (Total PP Supply, EOH, EOH $, WOH) reference Supply Adjustment by address → live cascade.
- BOH RM weeks 2+ reference prior week's EOH → adjustments ripple across all future weeks.

### Rolling projection
- BOH RM in week 1 = Inventory Details RM balance.
- Each week: `EOH = BOH RM + Open POs + Supply Adjustment − Demand`
- Next week's BOH RM = this week's EOH (roll-forward in JS, no cross-cell references).
- Supply Adjustment seeded as `0`; planner types directly into the cell; re-running script resets it.

> ⚠️ **Supply Adjustment cascade is broken in v9.** All week cells — including Total PP Supply (kfi 6), EOH Units (kfi 8), EOH $ (kfi 9), and WOH (kfi 11) — are written as plain numbers via `setValues`. Typing a value into Supply Adjustment does NOT update any downstream row. In v6 (`setFormulas`), those rows contained cross-row Excel formulas and cascaded live. The cascade was lost as a side-effect of the setFormulas→setValues migration. See open items.

### Batch constants
- `VAL_BATCH = 50` → 50 components × 12 × 52 = 31,200 values per `setValues` call.
- `FIXED_BATCH = 30` → fixed columns written in 30-component batches.
- `BOM_CHUNK = 5000`, `MM_CHUNK = 2000`, `INV_CHUNK = 3000`, `PO_CHUNK = 3000`.

### Conditional format
- ONE formula-based CF applied to the entire week data range (not per-component):
  - Formula: `=AND(MOD(ROW()-2,12)=8,I2<0)` — catches every EOH row (kfi 8, every 12th row starting from row 10) that is negative.
  - Red fill (`FF0000`), white text.
  - API: `customCf.getRule().setFormula(...)` — NOT `customCf.setFormula(...)`.

### WOH calculation
- `WOH = EOH / average of next 24 weeks of demand`
- Computed in JS: `demand.slice(wi, Math.min(wi+24, numWeeks))`

---

## Source data column layouts

### Demand Tracker
Detected dynamically by column name.
- Required: `Item`, `Key Figure`
- Optional: `Product Sub Group`
- Week columns: 6-digit numeric headers matching `/^\d{6}$/`
- KF filter: `"Adjusted Baseline Demand"`

### BOM (FlatBOM table)
Read as indexed columns (columns 0–6):
| Index | Field |
|---|---|
| 0 | FG SKU |
| 1 | Component SKU |
| 3 | BOM Qty |
| 5 | BOM Type (filter = `"Primary"`) |
| 6 | Location (filter = LOCATION) |

### Material Master
Flexible column detection — handles both direct exports and SharePoint exports:
| Field | Accepted header names |
|---|---|
| SKU | `SKU`, `Item`, `Title` |
| Description | `Description`, `Item Description` |
| Buyer Code | `Buyer Code` |
| Buyer Name | `Buyer Name` |
| Lead Time | `Lead Time` |
| Cost | `Cost`, `Material Cost` |
| Freight | `Freight`, `Unit Freight Cost` |
| Org filter | `Organization`, `Org` |

### Inventory Details
Read as indexed columns (hardcoded):
| Index | Field |
|---|---|
| 0 | SKU / Title |
| 6 | Organization (filter = LOCATION) |
| 8 | Qty on Hand |
| 9 | Location bucket (`RM`, `RI`, `MRB`) |
Read range: 10 columns (indices 0–9).

> **CR Site known issue:** Client's Inventory Details sheet has a different column layout (Org at col 12, Qty at col 14, Location at col 15). Client will fix their sheet layout. The script currently expects the standard layout above.

### Purchase Orders
Read as indexed columns (hardcoded):
| Index | Field |
|---|---|
| 0 | Business Unit / Org (filter = LOCATION) |
| 7 | Component SKU |
| 9 | Qty Ordered |
| 10 | Delivery Date |
Read range: 11 columns (indices 0–10).
POs with delivery date < current week are bucketed into the first planning week.

---

## Office Scripts — key limits and gotchas

| Limit | Value | Implication |
|---|---|---|
| Execution timeout | 5 minutes | Eliminated formula strings; must use setValues |
| Payload per network call | ~5 MB | VAL_BATCH=50 keeps well below limit |
| `setFormulas` formula parse overhead | ~10× slower than setValues | Never use setFormulas for bulk data |
| Custom CF API | `customCf.getRule().setFormula()` | `customCf.setFormula()` does NOT exist — throws at runtime |
| `internal error` | Triggered by >~9,000 formula strings per setFormulas call | Another reason to avoid setFormulas |

---

## All scripts in the Office Scripts folder

| File | What it does |
|---|---|
| `1- Atlas Demand -Clean-up.txt` | Cleans Atlas Demand data tab |
| `2- BOM Clean-up.txt` | Cleans / normalizes the BOM sheet |
| `3- Demand Tracker Clean-up.txt` | Cleans Demand Tracker tab |
| `4- Scenario Clean-up CR.txt` | Resets scenario data for CR Site |
| `4- Scenario Clean-up US.txt` | Resets scenario data for US Site |
| `5- SDA Details REFRESH data - CR.txt` | Builds SDA Details tab — CR Site (LOCATION="CRI") |
| `5- SDA Details REFRESH data - SC.txt` | Builds SDA Details tab — US Site (LOCATION="10") |

Archive versions in `_Archive/` — do not use for production.

---

## Files in this folder

| File | What it is |
|---|---|
| `What-if Tool (CR Site).xlsx` | Planning workbook — Costa Rica manufacturing site |
| `What-if Tool (US Site).xlsx` | Planning workbook — US manufacturing site |
| `Material Master.xlsx` | Source material master data |
| `SWAV Tool Proposal.docx` | Original project proposal |
| `CLAUDE.md` | This file — Claude working memory |
| `SDA-Script-Reference.md` | Technical reference for the SDA scripts |
| `Case-Study.md` | Portfolio case study and reusable content blocks |
| `Office Scripts/` | All Office Script .txt files (numbered by run order) |
| `_Archive/` | Prior script versions — for reference only |

---

## Open items / next steps

- [ ] CR Site: verify client fixed Inventory Details column layout, then test script.
- [x] Both sites: **Supply Adjustment cascade restored in v10** — switched back to `setFormulas` with `FORMULA_BATCH=8`; downstream KFs now reference Supply Adj row live; BOH RM rolls from prior-week EOH so adjustments cascade across all weeks. Planners confirmed clean-slate on re-run is acceptable.
- [ ] Both sites: validate WOH calculation against planner expectations (24-week avg denominator).
- [ ] Future: evaluate scheduling the script refresh via Power Automate.
- [ ] Case study and social content: draft once project is fully wrapped.

---

*Last updated: 2026-05-21 by Claude (Cowork session)*
