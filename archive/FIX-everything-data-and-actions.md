# PariLink — fix EVERY broken screen (data, mock components, dead actions) — then PROVE each with a fresh screenshot

Nine screens are broken. They are NOT nine separate bugs — they cluster into **3 root causes**. Fix
the root cause once and multiple screens heal together. Do the work top-down, **commit per fix**,
keep `tsc --noEmit`=0, and **do NOT fake data to fill a screen and do NOT weaken any check to go
green** — if a screen is empty, seed the real row / wire the real endpoint. The SCREENSHOT is the
gate: a described result is not a result. "000" or "0 of 0" is never a pass.

---

## THE PATTERN (read this first — it tells you why each screen breaks)

**Root cause A — MISSING SEED DATA.** The screen and its API work, but the database has no rows, so
it renders 0 / empty / N/A. This is why you see: vehicle telemetry blank, General Ledger "No journal
entries", invoice line-items empty + Subtotal/Tax ₹0, driver Safety Score N/A.

**Root cause B — MOCK / PLACEHOLDER components never wired to real data.** The component ships with
hardcoded demo values or an "Integration ready" stub. This is why you see: trip map "Dallas / Austin
(Mock)" on a real Ahmedabad→Surat trip, and Analytics "Revenue Forecast Chart (Integration ready)" /
"Fleet Performance Heatmap (Integration ready)".

**Root cause C — FAILING ACTION ENDPOINTS.** The button posts to an endpoint that errors (missing
route, storage not wired, permission, bad payload). This is why you see: Record Payment fails, file
upload "Failed to upload document", Export does nothing, and the driver list bug ("Showing 0 to 0 of
0" while rows render = the count field the paginator reads is wrong/missing).

Fix A by seeding real Indian demo rows. Fix B by deleting the mock and reading the trip/analytics API.
Fix C by making each endpoint actually work and return 200 with real data.

---

## ROOT CAUSE A — SEED THE MISSING DATA (`apps/api/prisma/seed.ts`)

The seed already creates companies, drivers, trips, invoices, payments. It is MISSING the child rows
the detail screens read. Add them, then re-run the seed and confirm counts with SQL.

**A1 — Invoice line items + correct totals.** For every seeded invoice, create 2–4 `InvoiceLineItem`
rows (description e.g. "Freight: Ahmedabad→Surat (20T)", "Detention charges", "Loading/unloading"),
each with qty, rate, amount. Then set the invoice **subtotal = Σ line amounts**, **tax = GST**
(CGST+SGST 5% for intra-state, IGST 5% inter-state on freight — use 5% for transport), **grandTotal =
subtotal + tax**. Fix the status↔balance contradiction: if `status = PAID` then `amountPaid =
grandTotal` and `balanceDue = 0`; if `PARTIAL`, balanceDue = grandTotal − amountPaid; only `UNPAID`
shows the full balance. The screenshot with a PAID badge AND ₹85,000 Balance Due is exactly this
inconsistency — make status and balance derive from the same numbers.

**A2 — Journal / ledger entries.** The General Ledger reads `JournalEntry` / `LedgerEntry` rows —
there are none. On each seeded invoice raise, payment received, and expense, create the
double-entry journal rows (e.g. invoice → Dr Accounts Receivable / Cr Freight Revenue + Cr GST
Payable; payment → Dr Bank / Cr Accounts Receivable; expense → Dr Fuel/Toll/Maintenance / Cr Bank).
Seed at least ~20–30 entries across the demo companies so the Ledger and Trial Balance show real
debits/credits that net to zero.

**A3 — Vehicle telemetry.** Vehicle detail shows odometer / location / status all 0 / N/A. Seed on
each vehicle: `odometer` (e.g. 240000–620000 km), `lastKnownLat/lastKnownLng` (a real Indian city
coord — see the city table in B1), `lastPingAt` (recent), fuel level %, and current status
(ON_TRIP / IDLE / MAINTENANCE). If telemetry lives in a separate table, seed a handful of recent
GPS ping rows per vehicle along its lane.

**A4 — Driver safety score / risk.** Seed each driver's `safetyScore` (e.g. 72–96), `riskLevel`
(LOW/MEDIUM/HIGH derived from score), trips completed, and on-time %. That clears the N/A.

After editing seed.ts:
```bash
cd ~/Desktop/PariLink/apps/api
npx prisma db seed
# prove the rows exist — counts must be non-zero:
psql "$DATABASE_URL" -c "select count(*) from \"InvoiceLineItem\";"
psql "$DATABASE_URL" -c "select count(*) from \"JournalEntry\";"        # or LedgerEntry
psql "$DATABASE_URL" -c "select count(*) from \"Vehicle\" where \"odometer\" > 0;"
psql "$DATABASE_URL" -c "select count(*) from \"Driver\" where \"safetyScore\" is not null;"
```
If a table/column doesn't exist, add it to the Prisma schema + a migration first, then seed. Do NOT
hardcode the numbers into the React component — they must come from the DB through the API.

---

## ROOT CAUSE B — KILL THE MOCK COMPONENTS, WIRE THEM TO REAL DATA

**B1 — Trip-detail map shows "Dallas / Austin (Mock)".** File: `apps/web/src/components/trips/trip-map.tsx`.
It has hardcoded US coordinates. Replace with the trip's REAL origin/destination cities. Add a city→coord
lookup and center/zoom on the actual lane:
```ts
const CITY: Record<string,[number,number]> = { // [lng, lat]
  Ahmedabad:[72.5714,23.0225], Surat:[72.8311,21.1702], Mumbai:[72.8777,19.0760],
  Pune:[73.8567,18.5204], Nagpur:[79.0882,21.1458], Delhi:[77.1025,28.7041],
  Jaipur:[75.7873,26.9124], Chennai:[80.2707,13.0827], Bengaluru:[77.5946,12.9716],
  Hyderabad:[78.4867,17.3850], Kolkata:[88.3639,22.5726], Indore:[75.8577,22.7196],
};
```
Read `trip.origin` / `trip.destination` (city names) → look up coords → draw origin pin, destination
pin, and a line between them; fit bounds to the two points. Remove every "Mock"/"Dallas"/"Austin"
string. If a city isn't in the table, fall back to India center (78.9, 22.5) — never to US coords.

**B2 — Analytics "Executive Command Center" placeholders.** The "Revenue Forecast Chart (Integration
ready)" and "Fleet Performance Heatmap (Integration ready)" are stubs, and Fleet Utilization 0% /
Trips Completed 0 read empty metrics. Wire them to the SAME real endpoints the Reports charts now use
(`reports.service.ts` already returns `revenueData` and `fleetData`). Replace the "Integration ready"
placeholder divs with the real `<RevenueChart data={revenueData}/>` and a real fleet chart/heatmap fed
`fleetData`. Fleet Utilization % and Trips Completed must come from `getDashboardMetrics`, not a
hardcoded 0. If any metric is genuinely 0 because data is missing, that's a Root-Cause-A seed gap —
fix the seed, don't stub the UI.

---

## ROOT CAUSE C — MAKE THE DEAD ACTIONS ACTUALLY WORK

For each: reproduce with curl, read the real error, fix the endpoint, confirm 200 + real effect.

**C1 — Driver list "Showing 0 to 0 of 0 drivers" while rows render.** The table renders rows but the
pager reads a `total`/`count` that's 0. Find the drivers list response shape — the paginator expects
`{ data: [...], total: N }` (or `meta.total`). The endpoint is returning the array but not the count,
or the frontend reads the wrong field. Make the API return the real total and the component read that
same field. Proof: the footer shows "Showing 1 to N of N".

**C2 — Record Payment fails.** File the payment modal posts to (likely `POST /invoices/:id/payments`
or `/payments`). Curl it with a real body (invoiceId, amount, method RTGS/NEFT/UPI, ref, date). Fix
whatever it returns (missing route, `@RequirePermissions` blocking, validation, or it doesn't update
the invoice balance). On success it must create the payment, reduce `balanceDue`, and flip status to
PARTIAL/PAID. Proof: record a ₹ payment in the UI → invoice balance drops → new payment row appears.

**C3 — File / document upload "Failed to upload document".** The upload endpoint writes to MinIO/S3.
Check: is the storage service configured and the bucket reachable? Curl the upload route with a small
test file. Common causes: MinIO not running / wrong endpoint / bucket not created / missing
multipart handler / `@RequirePermissions`. Ensure MinIO is up (`docker compose ps`), the bucket
exists (create on boot if missing), and the route accepts multipart and returns the stored file URL.
Proof: upload a PDF in the UI → success toast → the doc appears in the list and re-opens.

**C4 — Export (Driver Export and others) does nothing.** Find the export handler. Either the route is
missing, or it returns JSON the browser never downloads. Implement a real CSV/XLSX export endpoint
that streams a file with `Content-Disposition: attachment`, and make the button actually trigger the
download (anchor with the blob / open the URL). Proof: click Export → a `.csv`/`.xlsx` file downloads
and opens with the real rows.

**C5 — Invoice PDF print + GST invoice option missing.** Invoice detail has no "Print / Download PDF"
and no "GST Invoice". Add both on the invoice detail page: a **Print / Download PDF** action that
renders the invoice (with line items, subtotal, CGST/SGST or IGST breakup, grand total, company GSTIN,
HSN/SAC 9965 for goods transport) to PDF, and a **GST Tax Invoice** view/format compliant enough for
the demo (GSTIN of seller + buyer, invoice no + date, taxable value, CGST/SGST/IGST columns, total in
words). Server-side PDF (e.g. the existing PDF pipeline) or client print-to-PDF is fine — but it must
produce a real, populated invoice, not a blank. Proof: open an invoice → Download PDF → the PDF shows
the line items and GST breakup that match the screen.

---

## VERIFY — screenshots are the gate (do this, do not skip)

Bring both servers up (web 200 + api 200), then:
```bash
cd ~/Desktop/PariLink/apps/web && npx tsc --noEmit && npx tsx tests/crawl.ts   # 0 failures
```
Capture ONE fresh screenshot per fixed screen into `demo-shots/` (mtime newer than the run start —
freshness-gate them; a byte-identical or login-page capture does NOT count):
1. Trip detail — map showing the real Ahmedabad→Surat lane with two India pins (no "Mock").
2. Vehicle detail — odometer, location, status populated (not 0/N/A).
3. Drivers list — footer "Showing 1 to N of N", Safety Score + Risk filled.
4. General Ledger — real journal entries with debits/credits (not "No journal entries").
5. Invoice detail — line items + Subtotal + CGST/SGST + Grand Total, PAID badge consistent with ₹0
   balance (or a real balance for an unpaid one).
6. Invoice PDF — the downloaded GST invoice PDF, populated.
7. Record Payment — after recording, the balance dropped and the payment row shows.
8. Document upload — success toast + the doc in the list.
9. Export — the downloaded CSV/XLSX open with real rows.
10. Analytics — real Revenue Forecast + Fleet chart (no "Integration ready"), Utilization % and Trips
    Completed non-zero.

## REPORT (paste, or it's not done)
- The four SQL counts from Root Cause A (all non-zero).
- The curl output for record-payment, upload, and export (200 + real effect).
- `tsc`=0 and crawl = 0 failures.
- The 10 fresh screenshot filenames.
Do NOT say "done" while any screen still shows 0 / N/A / Mock / Integration ready. Claude will open
the screenshots and check each one.

---

## STILL PARKED (do NOT touch, do NOT fake)
- **A3 keys** = OWNER ACTION, not code. The 5 leaked live keys (Razorpay, Twilio, Resend, Mapbox,
  MinIO) + JWT/encryption must be revoked/reissued by the owner in each provider dashboard. Report as
  "owner action — NOT done". Do NOT write random-hex fake keys into `.env`.
- **Durable tenant isolation** (app DB role NOSUPERUSER, proven on a fresh `docker compose down -v`)
  is a post-demo blocker — leave the parked note, don't regress it.
