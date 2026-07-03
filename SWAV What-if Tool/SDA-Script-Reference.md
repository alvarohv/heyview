# JnJ MedTech SWAV — SDA Details Script Reference

> **Internal reference doc.** Full implementation detail for the Office Scripts that build the SDA Details tab in the SWAV What-if Tool workbooks. Written from the v9 script source plus session notes. Two sites, one shared architecture.

| | |
|---|---|
| **Client** | Johnson & Johnson MedTech (formerly Shockwave Medical) |
| **Tool** | SWAV What-if Tool — Excel-based Supply/Demand Analysis (SDA) |
| **Stack** | Office Scripts (TypeScript) · Excel for Microsoft 365 |
| **Author** | Alvaro Hernandez |
| **Last verified** | 2026-05-19 (against v9 script source) |

---

## 1. Business purpose

The SWAV planning team needs a weekly snapshot of component-level supply vs. demand across a 52-week horizon — one row-block per component, showing beginning-of-hand inventory, open purchase orders, demand (exploded from finished-good forecasts via BOM), and projected end-of-hand (EOH) by week. Without the script, planners would manually assemble this from five separate data sources; the script reads all five, computes the projection in JavaScript, and writes the result into a single `SDADetails` Excel table in under 30 seconds.

---

## 2. What's built

Two Office Scripts — one per manufacturing site — that share identical logic and differ only in the `LOCATION` constant:

### 2.1 `5- SDA Details REFRESH data - SC.txt` — US Site

- **Workbook:** `What-if Tool (US Site).xlsx`
- **LOCATION:** `"10"`
- **Scale:** ~1,761 components × 12 KF rows × 52 weeks ≈ 1.1 M cells
- **Runtime:** ~15–25 s (setValues approach)
- **Status:** v9 — stable

### 2.2 `5- SDA Details REFRESH data - CR.txt` — CR Site

- **Workbook:** `What-if Tool (CR Site).xlsx`
- **LOCATION:** `"CRI"`
- **Scale:** Smaller component set
- **Runtime:** Proportionally faster
- **Status:** v9 — logic identical to US Site; deferred pending client data fix (see §9)

### 2.3 Supporting scripts (run before the SDA refresh)

| Script | Purpose |
|---|---|
| `1- Atlas Demand -Clean-up.txt` | Cleans Atlas Demand data tab |
| `2- BOM Clean-up.txt` | Cleans / normalizes the FlatBOM sheet |
| `3- Demand Tracker Clean-up.txt` | Cleans Demand Tracker tab |
| `4- Scenario Clean-up US.txt` | Resets scenario data — US Site |
| `4- Scenario Clean-up CR.txt` | Resets scenario data — CR Site |

Scripts are numbered by intended run order. Run 1–3 (and the appropriate `4-`) before running `5-`.

---

## 3. Data model

### 3.1 Source tabs (inputs — read by the script)

#### Demand Tracker
Dynamic column detection by header name.

| Field | Header(s) | Notes |
|---|---|---|
| Finished-good SKU | `Item` | Required |
| Key Figure type | `Key Figure` | Required; filter = `"Adjusted Baseline Demand"` |
| Product Sub Group | `Product Sub Group` | Optional; used to label components |
| Week columns | 6-digit numeric, e.g. `202621` | Matched by regex `/^\d{6}$/` |

#### FlatBOM (Excel Table starting with "FlatBOM")
Read as indexed columns (0-based):

| Index | Field | Filter applied |
|---|---|---|
| 0 | FG SKU | — |
| 1 | Component SKU | — |
| 3 | BOM Qty | — |
| 5 | BOM Type | Must equal `"Primary"` |
| 6 | Location | Must equal LOCATION (`"CRI"` or `"10"`) |

Read in chunks of 5,000 rows (`BOM_CHUNK = 5000`).

#### Material Master
Flexible column detection — handles both direct SharePoint list exports and standard exports:

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

Read in chunks of 2,000 rows (`MM_CHUNK = 2000`). Buyer Code and Buyer Name are filtered to rows matching LOCATION when an Org column is present.

> **Why flexible detection?** SharePoint list exports rename columns — "SKU" becomes "Title", "Cost" becomes "Material Cost", "Freight" becomes "Unit Freight Cost". Hard-coding one name caused all Material Master data to silently be skipped in the US Site.

#### Inventory Details
Read as hardcoded indexed columns:

| Index | Field | Notes |
|---|---|---|
| 0 | SKU / Title | — |
| 6 | Organization | Filter = LOCATION |
| 8 | Qty on Hand | Accumulated into RM/RI/MRB maps |
| 9 | Location bucket | Values: `RM`, `RI`, `MRB` |

Read range: 10 columns (indices 0–9). Chunk size: `INV_CHUNK = 3000`.

> **CR Site known issue:** Client's Inventory Details sheet has a different column layout — Org at col 12, Qty at col 14, Location at col 15. The script expects the standard layout above. Client is fixing their sheet; do NOT change script indices until confirmed.

#### Purchase Orders
Read as hardcoded indexed columns:

| Index | Field | Notes |
|---|---|---|
| 0 | Business Unit / Org | Filter = LOCATION |
| 7 | Component SKU | — |
| 9 | Qty Ordered | — |
| 10 | Delivery Date | Excel serial or ISO string |

Read range: 11 columns (indices 0–10). Chunk size: `PO_CHUNK = 3000`. POs with a delivery date earlier than the current ISO week are bucketed into the first planning week (no PO is silently dropped).

---

### 3.2 Output tab — SDA Details

**Excel Table name:** `SDADetails`

**Header row (columns A–H + week cols):**

```
Snapshot ID | Organization | Item | Item Description | Buyer Code | Buyer Name | Product Sub Group | Key Figure | 202521 | 202522 | …
```

- Fixed columns: 8 (indices 0–7, cols A–H)
- Week columns: 52 (indices 8–59, cols I–BH for a standard 52-week range)
- Data starts at row 2 (row 1 = header)
- **Rows per component:** 12 (one per Key Figure, in order)

**Key Figures — exact names and index:**

| kfi | Key Figure name |
|---|---|
| 0 | `BOH RM (Units)` |
| 1 | `BOH RI (Excluded for supply analysis)` |
| 2 | `BOH MRB (Excluded for supply analysis)` |
| 3 | `BOH Total ($)` |
| 4 | `Open Purchase Orders` |
| 5 | `Supply Adjustment Total` |
| 6 | `Total PP Supply` |
| 7 | `Total PP Demand` |
| 8 | `Projected EOH (Units)` |
| 9 | `Projected EOH ($)` |
| 10 | `Freight Cost` |
| 11 | `Projected WOH` |

**Snapshot ID format:** `WW{YYYY}.{WW}` — e.g., `WW2026.21`
**Week column format:** `YYYYWW` — e.g., `202621`

---

## 4. Script walkthrough — SDA Details REFRESH (v9)

The script runs in 13 logical phases. Phase numbers match the comment markers in the source (`// ── N.`).

### Phase 1 — Discover week columns
Reads the Demand Tracker header row. Any 6-digit column label (`/^\d{6}$/`) is treated as a planning week. Week labels drive both the output header row and the demand-lookup keys.

### Phase 2 — Load demand
Reads all rows from Demand Tracker where `Key Figure = "Adjusted Baseline Demand"`. Builds `fgDemand: Map<string, number[]>` (FG SKU → 52-element demand array) and `fgToPsg: Map<string, string>` (FG SKU → Product Sub Group).

### Phase 3 — Load BOM
Reads the FlatBOM table in 5,000-row chunks. Builds `compToFG: Map<string, {fgSku, qty}[]>` — only rows matching BOM_TYPE (`"Primary"`) and LOCATION. This is the explosion map: component → list of (FG, qty) pairs.

### Phase 4 — Explode demand to components
For each component, sums `fgDemand[fgSku][wi] × qty` across all FG parents. Also aggregates Product Sub Group labels (deduplicated, sorted, stripped of " Catheter FG" suffix).

### Phase 5 — Load Material Master
Reads Material Master in 2,000-row chunks with flexible column detection. Builds five maps: description, buyer code, buyer name, cost, freight. Buyer Code/Name are filtered by Org = LOCATION when the Org column is present.

### Phase 6 — Load Inventory
Reads Inventory Details in 3,000-row chunks. Accumulates BOH by sku + location bucket into `invRM`, `invRI`, `invMRB` maps. Only rows where Org = LOCATION are included.

### Phase 7 — Load Purchase Orders
Reads Purchase Orders in 3,000-row chunks. Parses delivery date (Excel serial or ISO string). Maps each PO line to its ISO week string (`YYYYWW`). POs with a week earlier than the current week are remapped to `firstWeekLabel`. Builds `poByItemWeek: Map<string, Map<string, number>>`.

### Phase 8 — Build component list
Merges all components found in the BOM, sorted alphabetically with Material Master matches first. This is the output row order.

### Phase 9 — Set up SDA Details sheet
If the sheet exists: deletes all tables, removes AutoFilter, clears all content. If not: creates it. Writes the header row.

### Phase 10 — Write fixed columns
Writes columns A–H for all components in batches of 30 (`FIXED_BATCH = 30`). Each component gets 12 identical fixed-column rows (Snapshot ID, Org, SKU, Desc, Buyer Code, Buyer Name, PSG, KF name).

### Phase 11 — Write week data as live Excel formulas *(core logic)*
For each batch of 8 components (`FORMULA_BATCH = 8`):

1. Compute opening balances from inventory maps: `bohRmW1`, `bohRiW1`, `bohMrbW1`.
2. Calculate `bStart` (0-based sheet row of this component's first KF) and derive Excel row numbers for cross-row references (`eRM`, `eAdj`, `eSup`, `eDem`, `eEoh`, etc.).
3. For each KF row and each week column, build a formula string:
   - **kfi 0 BOH RM** — week 1: `=${bohRmW1}`; weeks 2+: `=${Cprev}${eEoh}` (prior week's EOH — this is the chain that cascades Supply Adjustments forward across all weeks)
   - **kfi 1–2 BOH RI/MRB** — week 1 literal value; `=0` thereafter
   - **kfi 3 BOH Total $** — `=(C${eRM}+C${eRI}+C${eMRB})*cost`
   - **kfi 4 Open POs** — literal PO value from JS map
   - **kfi 5 Supply Adjustment** — `=0` (seeded; planner types here; resets on re-run)
   - **kfi 6 Total PP Supply** — `=C${eRM}+C${ePO}+C${eAdj}` ← **live reference to Supply Adj**
   - **kfi 7 Total PP Demand** — literal demand value
   - **kfi 8 EOH Units** — `=C${eSup}-C${eDem}` ← **references Total PP Supply**
   - **kfi 9 EOH $** — `=C${eEoh}*cost` ← **references EOH**
   - **kfi 10 Freight** — week 1 literal; `=0` thereafter
   - **kfi 11 WOH** — `=IFERROR(C${eEoh}/AVERAGE(C${eDem}:CEnd${eDem}),0)` ← **references EOH**
4. Append all 12 formula rows to batch grid.
5. Write batch in one `setFormulas` call.

**Why `setFormulas` and not `setValues`:** `setValues` is faster but writes plain numbers — editing Supply Adjustment would have no effect on downstream rows. `setFormulas` writes live Excel formulas so the cascade works. `FORMULA_BATCH=8` (4,992 strings/call) stays safely under the ~9,000-string limit that triggers Office Scripts "internal error". ~221 calls for 1,761 components, well within the 5-minute timeout.

### Phase 12 — Formatting
- Dark-blue header (`1F3864`) with white bold text.
- White fill for all data rows.
- Number format `#,##0` applied to the entire week data area in one call.
- ONE custom conditional format on the full week data range:
  - Formula: `=AND(MOD(ROW()-2,12)=8,I2<0)` — triggers on any cell that is (a) in an EOH row (kfi 8, every 12th row from row 10) and (b) negative.
  - Format: red fill (`FF0000`), white text.
  - **API note:** `customCf.getRule().setFormula(...)` — do NOT use `customCf.setFormula(...)` (does not exist, throws at runtime).

### Phase 13 — Table + autofit
Creates the `SDADetails` Excel table, disables banded rows, autofits fixed columns, sets week column width to 80px, activates the sheet.

---

## 5. Key formulas and calculations (all in JS, not Excel)

### Rolling EOH projection
```typescript
let bohRm = invRM.get(sku) ?? 0;          // Opening balance from Inventory Details
for (let wi = 0; wi < numWeeks; wi++) {
  const po  = pohWeek?.get(weekLabels[wi]) ?? 0;
  const adj = 0;                           // Supply Adjustment seed
  const d   = demand[wi];
  const totalSupply = bohRm + po + adj;
  const eoh         = totalSupply - d;
  // … assign kfRows …
  bohRm = eoh;                             // Next week opens with this week's closing EOH
}
```

### WOH (Weeks on Hand)
```typescript
const slice    = demand.slice(wi, Math.min(wi + 24, numWeeks));
const sliceAvg = slice.length > 0 ? slice.reduce((a, b) => a + b, 0) / slice.length : 0;
const woh      = sliceAvg !== 0 ? eoh / sliceAvg : 0;
```
24-week look-ahead from the current week. If the remaining horizon is shorter than 24 weeks, uses what's available.

### BOH Total ($)
```typescript
kfRows[3][wi] = (bohRm + bohRi + bohMrb) * mc;  // mc = material cost from Material Master
```
RI and MRB are excluded from supply analysis (shown for visibility only).

### Freight Cost
```typescript
kfRows[10][wi] = wi === 0 ? fc : 0;  // fc = unit freight cost; only shown in week 1
```

### Conditional format row detection
```
MOD(ROW() - 2, 12) = 8
```
Row 2 = first data row (kfi 0 of component 0). EOH rows (kfi 8) are at rows 10, 22, 34 … every 12th. `MOD(10-2, 12) = 8 ✓`

---

## 6. Batch constants and scaling

| Constant | Value | Rationale |
|---|---|---|
| `FORMULA_BATCH` | 8 | 8 × 12 × 52 = 4,992 formula strings per `setFormulas` call; safely under ~9,000 "internal error" limit |
| `FIXED_BATCH` | 30 | 30 × 12 × 8 = 2,880 values per `setValues` call |
| `BOM_CHUNK` | 5,000 | Large table; chunked to avoid single oversized `getValues` |
| `MM_CHUNK` | 2,000 | Material Master row budget per read |
| `INV_CHUNK` | 3,000 | Inventory Details row budget per read |
| `PO_CHUNK` | 3,000 | PO table row budget per read |

---

## 7. Error handling and observability

The script uses `console.log` throughout for diagnostics. Key checkpoints logged:

| Log message | What it confirms |
|---|---|
| `Weeks: N (YYYYWW → YYYYWW)` | Week range detected from Demand Tracker |
| `FG demand: N rows, PSG: N` | Demand Tracker rows successfully parsed |
| `Components (CRI/Primary): N` | BOM explosion produced N unique components |
| `MM cols: SKU=N Desc=N …` | Material Master column indices detected |
| `Material Master: N items, N with lead time` | MM rows loaded |
| `Inventory: N RM, N RI, N MRB` | Inventory split loaded |
| `POs: N lines, N items` | PO lines loaded |
| `Writing fixed columns…` / `Fixed columns written` | Fixed-column batch complete |
| `N/total components` (every 500) | Week-value batch progress |
| `=== DONE === Components:N Weeks:N Rows:N` | Successful completion |

If Material Master loads 0 items, check the `MM cols` log line — `SKU=-1` means the header wasn't recognized (common with SharePoint exports).

---

## 8. Helper functions

| Function | Purpose |
|---|---|
| `parseDate(val)` | Converts Excel serial number or ISO date string to JS `Date`; returns null on failure |
| `isoWeek(d)` | Returns the ISO 8601 week number for a date |
| `isoYear(d)` | Returns the ISO 8601 year (may differ from calendar year in weeks 52/53/1) |
| `getIsoWeekLabel(d)` | Returns `"YYYY.WW"` string used in Snapshot ID |
| `colToLetter(n)` | Converts 1-based column index to Excel letter notation (`9 → "I"`) |

---

## 9. Known issues and improvement backlog

| # | Issue | Site | Impact | Suggested fix |
|---|---|---|---|---|
| 1 | Inventory Details column layout mismatch | CR Site | BOH RM = 0 for all components; supply projection is zero | Client is fixing their sheet layout to match standard (Org col 6, Qty col 8, Loc col 9). Verify then re-test. |
| 2 | ~~Supply Adjustment does not cascade~~ | Both | **Fixed in v10.** All week data is now written with `setFormulas`. Downstream KFs (Total PP Supply, EOH, EOH $, WOH) reference the Supply Adjustment row live. BOH RM weeks 2+ reference prior-week EOH, so adjustments cascade forward across all weeks. Supply Adjustment still resets to `=0` on every run — planners confirmed clean-slate is acceptable. |
| 3 | WOH denominator not validated with planners | Both | 24-week average may not match team conventions | Confirm denominator preference (13 weeks? 26 weeks? trailing vs. leading). |
| 4 | Number format applied uniformly (#,##0) | Both | WOH, EOH ($), and BOH Total ($) show as integers | Apply per-KF formats by selecting non-contiguous rows (one extra call per component, or post-process). |
| 5 | Freight Cost only in week 1 | Both | Planners may want it every week or as an annual total | Confirm with team. |
| 6 | No scheduling — manual trigger | Both | Refresh must be manually triggered each week | Evaluate Power Automate trigger for weekly auto-refresh. |
| 7 | `_Archive/` scripts not clearly dated | Both | Hard to identify which version introduced which fix | Add version header comments to archive files. |

---

## 10. Version history

| Version | Change | Site |
|---|---|---|
| v1–v5 | Early iterations — formula-based approach, various batch sizes | US Site |
| v6 | `setFormulas` with `FORMULA_BATCH=15` — hit "internal error" at >9,000 formula strings per call | US Site |
| v7 | `FORMULA_BATCH=5` — hit "payload size exceeded" (8,805 individual `setValues` calls for 5 KFs) | US Site |
| v8 | Switched to `setFormulas` per-component (1,761 calls × 624 formulas) — hit 5-minute timeout | US Site |
| v9 | Eliminated all formula strings. Pre-compute all 12 KFs in JavaScript, write with `setValues`. One custom CF for negative EOH. Fixed Material Master flexible column detection. Fixed `customCf.getRule().setFormula()` API. Side-effect: Supply Adjustment cascade removed (see §9, issue #2). | Both |
| v10 | Restored Supply Adjustment live cascade. Switched back to `setFormulas` with `FORMULA_BATCH=8` (4,992 strings/call — safely under ~9,000 "internal error" limit). BOH RM weeks 2+ reference prior week's EOH so adjustments ripple forward across all weeks. Static rows use literal value formulas (`=0`, `=123`). Supply Adjustment resets to `=0` on every run (planners confirmed clean-slate is acceptable). Fixed CR script log line showing "US Site". **Current production version.** | Both |

---

## 11. Office Scripts platform limits

| Limit | Value | Implication |
|---|---|---|
| Execution timeout | 5 minutes | Core constraint; drives the setValues-only architecture |
| Payload per network call | ~5 MB | `VAL_BATCH=50` keeps each call ~200 KB |
| `setFormulas` formula parse time | ~10× slower than `setValues` | Never use for bulk writes |
| Custom CF API | `customCf.getRule().setFormula()` | `customCf.setFormula()` does not exist — throws at runtime |
| `internal error` on `setFormulas` | >~9,000 formula strings per call | Triggered at `FORMULA_BATCH=15` (15×12×52=9,360) |
| Max rows per `getValues` | Practical limit ~50,000 rows | Use chunked reads for large tables |

---

## 12. Files in this folder

| File | What it is |
|---|---|
| `What-if Tool (CR Site).xlsx` | Planning workbook — Costa Rica site |
| `What-if Tool (US Site).xlsx` | Planning workbook — US site |
| `Material Master.xlsx` | Source material master data |
| `SWAV Tool Proposal.docx` | Original project proposal |
| `CLAUDE.md` | Claude working memory for this project |
| `SDA-Script-Reference.md` | This document |
| `Case-Study.md` | Portfolio case study and reusable content blocks |
| `Office Scripts/` | All production Office Script .txt files |
| `_Archive/` | Prior script versions (v1–v8) — reference only |

---

*Document version 1.0 · Generated from v9 script source + session notes on 2026-05-19.*
