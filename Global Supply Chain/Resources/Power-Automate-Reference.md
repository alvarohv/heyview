# J&J MedTech Global Supply Chain — Supplier Notification Automation

> **Internal reference doc.** Full implementation detail for the Power Automate + SharePoint solution built for the Johnson & Johnson MedTech Global Supply Chain team. Written from the actual flow definitions (`definition.json`) plus the original PDF spec.

| | |
|---|---|
| **Client** | Johnson & Johnson MedTech — Global Supply Chain |
| **SharePoint site** | `https://jnj.sharepoint.com/teams/[site-name]` *(actual site identifier redacted from public-readable docs; see the live flow `definition.json` for the real value)* |
| **Stack** | Power Automate (Cloud Flows) · SharePoint Online · Office 365 Outlook |
| **Author** | Alvaro Hernandez |
| **Last verified** | 2026-05-16 (against exported flow definitions) |

---

## 1. Business purpose

The Global Supply Chain team needed to keep suppliers ahead of two failure modes: purchase orders that were already past due, and POs about to come due in the next 7 days. Doing this manually meant a buyer copying PO numbers from an open-order report into individual emails, every week, for dozens of suppliers — error-prone, slow, and inconsistent in tone.

The automation centralizes that work into a single, branded email per supplier with two clearly-labeled tables (red for past due, yellow for upcoming) and updates each PO's status to `Notified` so the team has an audit trail.

---

## 2. What's actually built (vs. the original spec)

The original PDF spec described **one flow** that runs every Friday. The implemented solution is **three flows**, all manually triggered today:

### 2.1 `Notify All Suppliers` — the main flow

Flow ID: `868300fd-cb52-491a-b434-aa916a7a6fec`

- **Trigger:** Manual button (not scheduled). To make it Friday-recurring, swap the `manual` trigger for a `Recurrence` trigger — no other changes needed.
- **What it does:** Pulls every open PO due within the next 7 days (past due included), groups by supplier, looks up the supplier's email, builds one consolidated email per supplier, sends it, and marks each notified PO.

### 2.2 `Notify Suppliers Pendings PO's` — one-supplier-on-demand

Flow ID: `b42c8cfd-7868-49e8-a00d-a7905d6c87da`

- **Trigger:** SharePoint "For a selected item" on the Supplier DB list (right-click → run flow from a single supplier row).
- **What it does:** Same logic as the main flow, scoped to one supplier. Also writes a row to the `Log` SharePoint list with the ISO week number and supplier identifiers — useful for ad-hoc nudges with a paper trail.

### 2.3 `Clean POs` — list reset utility

Flow ID: `5c0bafa3-69c7-4551-844d-a6210a0d68cd`

- **Trigger:** Manual button.
- **What it does:** Pulls every item from the PO List and deletes it. Used before reloading a fresh `Open Order Report` export from the source system.
- **Risk note:** Destructive and unconditional. Anyone with run rights can wipe the list. Consider scoping permissions or adding a confirmation step.

---

## 3. Data model

### 3.1 PO List

SharePoint list ID: `e78134f1-551f-477a-89d9-f3f17ef86622`

The flow uses SharePoint's *internal* `field_N` names — friendly names are mapped below.

| Internal name | Friendly name | Type | Used for |
|---|---|---|---|
| `ID` | Auto | Number | Primary key, used in `PatchItem`/`DeleteItem` |
| `field_1` | Purchase Order Number | Text | Table column |
| `field_3` | Notified flag | Choice | Set to `Yes` after notification |
| `field_4` | Supplier Number / Code | Text | Join key to Supplier DB |
| `field_5` | Supplier Name | Text | Table column |
| `field_7` | Purchase Order Line | Text | Table column |
| `field_10` | Item Number | Text | Filter (`field_10 ne ''`) + table column |
| `field_11` | Item Description | Text | Table column |
| `field_14` | Quantity Ordered | Number | — |
| `field_15` | Quantity Received | Number | — |
| `field_17` | Quantity Open | Number | Filter (`field_17 gt 0`) + table column |
| `field_25` | **Requested** Delivery Date | Date | **Not used by the flow.** Source date from the original PO. |
| `field_26` | **Promised** Delivery Date | Date | Filter + past-due/upcoming split (this is what the flow actually uses) |
| `field_32` | Buyer | Text | — |
| `field_43` | Today (computed) | Number | — |
| `field_44` | Aging (computed) | Number | — |
| `Status` | Status | Choice | Set to `Notified` after sending (choices: `Pending`, `Notified`) |

> **⚠ Label bug worth flagging.** The flow uses `field_26` (Promised Delivery Date) for filtering and date math, which is correct. But the HTML table column headers are inconsistent:
> - In `Notify All Suppliers`, both tables label the column **"Requested Delivery Date"** — wrong; it's the Promised date.
> - In `Notify Suppliers Pendings PO's`, the past-due table labels it **"Promised Delivery Date"** (correct) but the upcoming table labels it **"Requested Delivery Date"** (wrong).
>
> Quick fix: change every header in the `Create_*_Table` actions to `"Promised Delivery Date"`. Suppliers receiving these emails today may have been confused by which date they were being held to.

### 3.2 Supplier DB

SharePoint list ID: `e39cb16d-dab5-4672-9cee-9e4fda2a4c88`

Uses friendly column names directly (not `field_N`):

| Column | Type | Notes |
|---|---|---|
| `Title` | Text | Supplier Name |
| `SupplierNumber` | Text | Join key to PO List `field_4` |
| `Email` | Text | Single recipient address |

### 3.3 Log

SharePoint list ID: `0b3a55fd-da65-402a-80e7-df28460364d4`

Used only by the on-demand flow:

| Column | Value written |
|---|---|
| `Title` | ISO week number |
| `SupplierName` | From triggering supplier row |
| `SupplierNumber` | From triggering supplier row |

---

## 4. Main flow walkthrough — `Notify All Suppliers`

The flow is implemented in three logical phases. Action names below match the `definition.json` so you can locate them in the designer.

### Phase 1 — Pull and dedupe suppliers

```
Get_POs                  → SharePoint GetItems on PO List
                           $filter = field_10 ne ''
                                     and field_26 le today+7
                                     and field_17 gt 0
                           $top    = 5000

Select_Suppliers         → Project each PO down to {SupplierNumber, SupplierName}

Unique_Suppliers         → Compose: union(body('Select_Suppliers'),
                                          body('Select_Suppliers'))
                           (Power Automate idiom for "dedupe an array of objects")

Get_Supplier_Database    → SharePoint GetItems on Supplier DB (no filter, top 5000)

Initialize_Suppliers     → Variable: Suppliers = []
```

### Phase 2 — Match each supplier to its email

```
Apply_to_each_Supplier_(Get_Email):
  Filter_Supplier_Email_Address  → Query: supplier row where
                                           SupplierNumber == current.SupplierNumber
  Supplier                       → Compose: { SupplierNumber, SupplierName, SupplierEmail }
                                   SupplierEmail = first(matches).Email  |  ''
  Append_Supplier_to_Array       → push onto Suppliers variable
```

This produces an array of suppliers, each carrying their resolved email (empty string if missing).

### Phase 3 — Per supplier: filter, build, send, mark

```
Apply_to_each_Final_Supplier:
  Check_If_Supplier_Has_Email (If):
    THEN:
      Filter_By_Supplier                       → POs where field_4 == current.SupplierNumber
      Filter_Past_Due_POs_for_Supplier         → field_26 <  today
      Filter_Due_Within_7Days_POs_for_Supplier → field_26 >= today
      Create_Past_Due_Table                    → HTML table (8 columns)
      Create_Due_Within_7Days_Table            → HTML table (8 columns)

      Check_If_Supplier_Has_Any_POs (If):
        THEN:
          Send_an_email_(V2)   → see §5 for body
                                  Importance = High if any past due, else Normal
                                  Subject prefix toggles between URGENT and Upcoming
          Apply_to_each (PO):
            Update_item        → set Status = "Notified" and field_3 = "Yes"
          Exception (runAfter Send_an_email Failed):
            Send email to admin (eduartes@its.jnj.com)
        ELSE:
          No_POs_for_Supplier_Log → Compose with timestamp + supplier info
    ELSE:
      Missing_Email_Error_Log    → Compose with timestamp + supplier info
```

Status updates fire **for every PO returned by `Filter_By_Supplier`**, not just past-due or upcoming — anything that fell into the 7-day window is marked.

---

## 5. Email composition

The email body is built inline in the `Send_an_email_(V2)` action using nested `if()` expressions to include or omit each table conditionally.

- **Subject** — `if(past_due > 0, 'URGENT: Past Due + Upcoming', 'Upcoming') Purchase Orders - MM/dd/yyyy`
- **Importance** — `High` when any past-due rows exist, else `Normal`
- **Body structure:**
  1. Greeting using `SupplierName`
  2. Intro paragraph framing the email
  3. **Past Due table** — red theme (`#d73527`), shown only if past-due rows > 0
  4. **Due Within 7 Days table** — yellow theme (`#856404`), shown only if upcoming rows > 0
  5. **Remarks block** — blue left-border (`#007acc`) callout with four bullets:
     - Validate PO number
     - Validate quantity open + promised delivery date
     - For past due: provide expected ship date / AWB#
     - For Costa Rica POs: send paperwork to `swlogisticr@shockwavemedical.com`
  6. Signoff: legacy entity name still hardcoded in the email body (see improvement backlog item 13 — needs re-branding to **J&J MedTech Supply Chain team**)

Table columns (both tables use the same schema):

```
Purchase Order Number · Supplier Number · Supplier Name · Purchase Order Line
Item Number · Item Description · Quantity Open · Requested Delivery Date
```

> **Styling caveat:** Inline `<style>` tags inside emails are stripped by some clients (Gmail web, in particular). The flow inlines a subset of styles directly on `<table>` and `<th>` via `replace()`, which is what actually survives. The `<style>` block is largely cosmetic and won't render in Gmail — that's why the per-cell styles exist.

---

## 6. Error handling and observability

The flow degrades gracefully across four failure modes:

| Failure | Detected by | What happens |
|---|---|---|
| Supplier has no email | `Check_If_Supplier_Has_Email` else branch | `Missing_Email_Error_Log` Compose; PO status **not** updated |
| Supplier has email but no matching POs after filtering | `Check_If_Supplier_Has_Any_POs` else branch | `No_POs_for_Supplier_Log` Compose; nothing sent |
| Email send fails | `Send_an_email_(V2)` failure → `runAfter: Failed` | `Exception` action sends admin email to `eduartes@its.jnj.com` |
| List read fails | Power Automate default retry policy | Run marked failed, surfaced in run history |

Observability is limited:

- The "log" Composes only exist inside flow run history — they aren't written to a SharePoint list.
- The on-demand flow (#2) does write to the `Log` SharePoint list, but only `Title` (week), `SupplierName`, `SupplierNumber`. No counts, no payloads.
- The exception email body is empty (`<p><br></p>`) — recipient gets a notification but no detail.

> **Improvement to flag:** route Composes into the `Log` list and enrich the exception email body with `error?['message']`.

---

## 7. Connections used

| Connector | Operation | Auth |
|---|---|---|
| `shared_sharepointonline_1` | `GetItems`, `GetItem`, `PatchItem`, `PostItem`, `DeleteItem` | Invoker-delegated (user runs the flow) |
| `shared_office365_1` | `SendEmailV2` (supplier emails) | Invoker |
| `shared_office365` | `SendEmailV2` (admin exception emails) | Invoker |

All three connectors are invoker-delegated, which means the flow sends emails *as the user who runs the flow*. To send from a shared mailbox, switch to the Office 365 connector's `SendEmailFromSharedMailbox` operation.

---

## 8. Operations

### 8.1 Re-loading the PO list weekly

The intended cadence is:

1. Export `Open Order Report All Items.csv` from the source system.
2. Run `Clean POs` flow → wipes the PO List.
3. Re-import the CSV into the PO List (via SharePoint Quick Edit, or a future ingest flow).
4. Run `Notify All Suppliers` → consolidated emails go out.

Steps 1–3 are still manual; that's the next obvious automation target.

### 8.2 Managing supplier emails

The Supplier DB is hand-maintained. Adding a new supplier means adding a row with `SupplierNumber` (must match PO List `field_4` exactly), `Title` (supplier name), and `Email`.

Suppliers with missing emails are silently skipped by the main flow — they hit `Missing_Email_Error_Log`. The PO status stays at its prior value, so re-running won't double-notify but also won't auto-recover. Run a periodic check for `Status != 'Notified'` after a flow run to surface skipped suppliers.

### 8.3 Re-running and idempotency

The flow is **partially idempotent**:

- Re-running won't change anything if all POs are already `Notified` (the filter `field_17 gt 0` and the status field aren't tied, so this needs explicit handling if you want to gate it).
- Currently the filter doesn't exclude already-notified POs — re-running will re-notify everything in the 7-day window. To prevent this, extend the `$filter`:

  ```
  field_10 ne ''
    and field_26 le 'today+7'
    and field_17 gt 0
    and Status ne 'Notified'
  ```

---

## 9. Known issues and improvement backlog

| # | Issue | Impact | Suggested fix |
|---|---|---|---|
| 1 | Trigger is manual on Notify All Suppliers | Defeats the original "Friday recurring" goal | Replace `manual` trigger with `Recurrence` (weekly, Fri 08:00 local) |
| 2 | Re-running re-notifies | Suppliers can receive duplicate emails | Add `Status ne 'Notified'` to `$filter` (see §8.3) |
| 3 | `Clean POs` has no guardrails | Anyone can wipe the list | Add a confirmation input, scope by `runAfter` of an approval, or remove the share |
| 4 | Exception email body is empty | Admin gets noise, not signal | Inject `concat('Error: ', actions('Send_an_email_(V2)')['error']['message'])` |
| 5 | Log Composes never persist | No audit trail for skipped suppliers | Write to the `Log` SharePoint list inside both `else` branches |
| 6 | One email per supplier | Suppliers with multiple buyer contacts only reach one | Either change Supplier DB to allow multiple rows per supplier, or split `Email` on `;` and pass as a list |
| 7 | Hardcoded admin email | Admin change requires editing two flows | Move `eduartes@its.jnj.com` to a Flow input parameter or a config list |
| 8 | `<style>` blocks in email body | Stripped by Gmail web; per-cell styles compensate but it's fragile | Strip the `<style>` blocks, keep only inlined per-element styles |
| 9 | `union(body('Select_Suppliers'), body('Select_Suppliers'))` | Works, but the dedup-on-self idiom is opaque | Replace with `Select` distinct on `SupplierNumber` once you can verify no key collisions |
| 10 | Costa Rica logistics rule lives in email body | Adding another country means editing markup | Move "destination-specific instructions" to the Supplier DB as a per-supplier note column |
| 11 | Date column headers mislabeled | Suppliers may be confused about which date they're committed to | Standardize all `Create_*_Table` headers on **"Promised Delivery Date"** (the field the flow actually filters on) |
| 12 | Multi-contact suppliers stored as `;`-separated string in one Email cell | Outlook accepts it, but harder to manage in SharePoint UI and impossible to flag "primary contact" | Either keep as-is and document the convention, or split into a child list of contacts joined on `SupplierNumber` |
| 13 | Email body still uses legacy entity branding (signoff line + logistics email address `swlogisticr@shockwavemedical.com`) | Supplier-facing comms don't match current J&J MedTech identity post-acquisition | Update the email template signoff to `J&J MedTech Supply Chain team` and replace the logistics mailto with the current J&J equivalent |

---

## 10. Troubleshooting

The pasted business doc covers the common situations well. The actual diagnostic order I'd follow:

1. **Did the run succeed?** — Power Automate portal → Flow → Run history. Reds = failed step + error message.
2. **Did `Get_POs` return rows?** — Check the action output. Empty = data hasn't been loaded, or `field_17 gt 0` is filtering everything (quantities loaded as 0?).
3. **Did `Suppliers` array populate emails?** — Inspect the `Append_Supplier_to_Array` outputs. Empty `SupplierEmail` strings = no match in Supplier DB (check exact `SupplierNumber` casing and whitespace).
4. **Did the email send?** — Look for the green `Send_an_email_(V2)` in each iteration. If the supplier got nothing despite the action succeeding, check Outlook's *Sent Items* under the invoker's account, then check the recipient's spam.
5. **Are statuses updating?** — `Update_item` runs once per PO inside `Apply_to_each`. If the email succeeds but statuses don't move, check `field_3` choice values match exactly (`Yes` is case-sensitive in some SharePoint choice fields).

---

## 11. Files in this folder

| File | What it is |
|---|---|
| `Power-Automate-Reference.md` | This document |
| `Case-Study.md` | Portfolio case study version |
| `Flow-Diagram.svg` | Architecture diagram of `Notify All Suppliers` |
| `Email-Mockup.html` | Rendered example of the supplier email |
| `Supplier Automation - Original Spec.pdf` | Original spec |
| `PO Confirmation Process.xlsx` | Process documentation (Excel) |
| `_Private-Raw-Data/Open Order Report All Items.csv` | Live PO export — **RESTRICTED** (real production data) |
| `_Private-Raw-Data/Supplier Email DB.csv` | Live Supplier DB export — **RESTRICTED** (real supplier emails) |
| `_Private-Raw-Data/Notification Log.csv` | Live Log list export — **RESTRICTED** (empty in this snapshot) |
| `_Private-Raw-Data/README.md` | Restrictions and provenance for the raw data files |
| `Notify All Suppliers.zip` | Power Automate export — main flow |
| `Pending POs Notification.zip` | Power Automate export — on-demand flow |
| `Clean POs May 17 2026.zip` | Power Automate export — list reset |
| `*/Microsoft.Flow/flows/*/definition.json` | Extracted flow definitions (canonical source) |

---

*Document version 1.0 · Generated from `definition.json` + original spec on 2026-05-16.*
