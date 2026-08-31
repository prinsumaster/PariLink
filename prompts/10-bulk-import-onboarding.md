# Prompt 10 — Bulk Import / Onboarding (so a 200-truck fleet can actually switch)

A big fleet has data in Excel; without import they'll never move. Build Excel/CSV import for the masters
+ opening balances. Rules: commit per step, `tsc`=0, real parsing + validation (no fake success),
screenshot gate.

## Backend (`apps/api/src/exports` sibling — an `import` service)
- `POST /import/:type` (type = vehicles | drivers | customers | vendors | opening-balances) — accept an
  uploaded .xlsx/.csv, parse rows, **validate** (required fields, duplicates, formats — GST no, truck
  no, phone), then insert tenant-scoped in a transaction.
- Return a **report**: rows imported, rows skipped with the reason per row (never silently drop).
- Provide `GET /import/:type/template` — a downloadable template file with the right columns.

## Frontend
- An "Import" page (in Settings/Onboarding): pick type → download template → upload filled file → see a
  preview + validation results → confirm import → success summary (X imported, Y skipped with reasons).

## VERIFY (screenshot gate)
- Curl: upload a small vehicles CSV (with one bad row) → response imports the good rows and reports the
  bad row's reason; confirm the rows exist (`select count(*) from "Vehicle"`).
- Screenshots: the import preview/validation screen and the success summary showing imported + skipped.
## REPORT
Paste the import curl (imported + skipped-with-reason) and the row-count SQL, `tsc`=0, screenshots.
Do NOT say done if bad rows are silently accepted or the count doesn't increase by the imported rows.

---

## You've reached the end of the 10-prompt sequence.
Run them in order (01 → 10), one at a time, and screenshot-gate each. After 10, the large-fleet product
depth is built. Remember the standing rules for every one: the screenshot is the gate; never fake data
or weaken a check; every module feeds the next; security before real client data.
