# PariLink — Master Execution Plan to a credible Janmashtami demo

**For Antigravity.** This is grounded in the ACTUAL codebase (schema, RBAC, nav
all read directly). It turns PariLink from "enterprise software wearing a costume"
into a tool an Indian transporter recognizes as their own.

## How to run this — non-negotiable
- Do **ONE phase at a time.** Finish it, paste its PROOF, then start the next.
  Batching is what broke this repo before.
- Every proof is raw terminal/SQL/screenshot output. A described result is not a
  result.
- Never weaken a guard, edit a test to match broken behaviour, fake data, or use
  Math.random / hardcoded numbers. The demo must run on real DB state.
- If a phase won't go green, STOP and report. "NOT DONE" is always acceptable.
- Work tenant-scoped: every DB access through `runAsTenant(companyId, ...)`, every
  write endpoint guarded.

## Priority order (owner's, for the demo)
P0 security proofs (isolation + RBAC) → LR/Bilty module → relabel+hide → dashboard
→ demo data → the walk → finance integrity → final green. E-Way/GST stay honest
(they are stubs — see Phase 6). If time runs out, everything through "the walk"
must be done; polish can slip.

## Facts already established (don't re-litigate)
- Build works, image builds, auth suite 7/7, money DTOs validate, telemetry IDOR
  fixed. Section A is closed.
- `Load` IS the "Booking" (has consignor, consignee, originCity/State,
  destinationCity/State, pickupDate, deliveryDate, weight, rate, referenceNumber,
  status). LR generates FROM a Load.
- `Customer.taxId` holds GSTIN. `Vehicle.licensePlate` is the truck number.
- RBAC is real: `Role.permissions` is a JSON string array; `['*']` = all. Perms
  are colon-namespaced: `dispatch:read/write`, `finance:read/write`,
  `vehicles:read/write`, `documents:create/read/update`, `admin:manage`,
  `users:update`, `tracking:read/write`, `analytics:read`. Seed only creates
  `SUPER_ADMIN`.
- E-Way Bill and GST are STUBS — the gateway is literally "a very simple mock API
  Guard for MVP", GST is only a tax-RULES table, no NIC/GST-portal filing.
- There is NO LR / Bilty / Challan anywhere (0 files). This is the one real gap.

=====================================================================
# PHASE 0 — Prove tenant isolation (#3) and RBAC (#4)
=====================================================================
Run the separate file `demo-security-proofs.md` exactly as written. It proves
company A cannot touch company B's core records (with the positive control), and
that a dispatcher role is blocked from finance/admin. Paste its two tables.
Do not proceed to Phase 1 until isolation and RBAC are proven or the failures are
listed. If it finds a CRITICAL IDOR or RBAC bypass, fix THAT first — it outranks
everything below.

=====================================================================
# PHASE 1 — LR / Bilty (Lorry Receipt) module   ← the real gap
=====================================================================
The Lorry Receipt (LR / GR / Bilty) is the core document of Indian road transport.
Every booking produces one. PariLink has none. Build it on top of `Load`.

## 1.1 — Prisma model + migration
Add to schema.prisma and relate to Load, Company, Vehicle. Add the relation field
`lorryReceipts LorryReceipt[]` to Company and `lorryReceipts LorryReceipt[]` to Load.

```prisma
model LorryReceipt {
  id                String    @id @default(uuid())
  companyId         String
  loadId            String
  lrNumber          String                       // per-company, per-FY sequential
  date              DateTime  @default(now())

  // Consignor (sender) — prefill from Load.consignor / Customer
  consignorName     String
  consignorGstin    String?
  consignorAddress  String?
  // Consignee (receiver)
  consigneeName     String
  consigneeGstin    String?
  consigneeAddress  String?

  fromStation       String                        // origin city
  toStation         String                        // destination city
  vehicleId         String?
  vehicleNumber     String?                        // truck number, snapshot

  goodsDescription  String
  packagesCount     Int       @default(1)
  packingType       String?                        // e.g. Bags, Bundles, Loose
  actualWeightKg    Float?
  chargedWeightKg   Float?
  invoiceValue      Float?                         // declared goods value

  freightAmount     Float     @default(0)
  hamaliCharges     Float     @default(0)          // loading/unloading
  otherCharges      Float     @default(0)
  gstAmount         Float     @default(0)
  totalAmount       Float     @default(0)
  paymentType       String    @default("TOPAY")    // PAID | TOPAY | TBB
  ewayBillNumber    String?

  status            String    @default("ISSUED")   // ISSUED | IN_TRANSIT | DELIVERED | CANCELLED
  podDocumentId     String?                         // set on delivery
  pdfDocumentId     String?

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?

  company           Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  load              Load      @relation(fields: [loadId], references: [id])
  vehicle           Vehicle?  @relation(fields: [vehicleId], references: [id])

  @@unique([companyId, lrNumber])
  @@index([companyId, status])
  @@index([companyId, loadId])
  @@index([companyId, deletedAt])
}

// race-safe per-company, per-FY counter
model LrSequence {
  id            String  @id @default(uuid())
  companyId     String
  financialYear String                            // "25-26"
  lastNumber    Int     @default(0)
  @@unique([companyId, financialYear])
}
```
Add the Vehicle relation back-reference `lorryReceipts LorryReceipt[]` too.
Run `npx prisma migrate dev --name add_lorry_receipt` (or `db push` for the demo).

## 1.2 — Race-safe LR numbering (owner flagged race conditions as a real bug class)
In the service, allocate the number INSIDE the same transaction as the LR insert,
using an atomic upsert-increment so two concurrent creates cannot collide:
```ts
// financial year: Apr–Mar. Compute from date.
const fy = (d: Date) => { const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear()-1; return `${String(y).slice(2)}-${String(y+1).slice(2)}`; };

// inside runAsTenant tx:
const year = fy(new Date());
const seq = await tx.$queryRaw`
  INSERT INTO "LrSequence" ("id","companyId","financialYear","lastNumber")
  VALUES (gen_random_uuid(), ${companyId}, ${year}, 1)
  ON CONFLICT ("companyId","financialYear")
  DO UPDATE SET "lastNumber" = "LrSequence"."lastNumber" + 1
  RETURNING "lastNumber"`;
const n = seq[0].lastNumber;
const lrNumber = `PL/${year}/${String(n).padStart(5,'0')}`; // e.g. PL/25-26/00042
```
(Use the company's short code as prefix if one exists; else "PL".)

## 1.3 — DTO, controller, service
- `CreateLorryReceiptDto` — class-validator: `@IsUUID() loadId`, `@IsString()
  consignorName/consigneeName/goodsDescription/fromStation/toStation`, numeric
  fields `@IsNumber()`, `paymentType @IsIn(['PAID','TOPAY','TBB'])`, optionals
  `@IsOptional()`. So the global ValidationPipe fires (POST {} → 400).
- Controller `@Controller('lorry-receipts')` with
  `@UseGuards(JwtAuthGuard, PermissionsGuard)`:
  - `POST /` `@RequirePermissions('documents:create')` — create from a loadId;
    prefill consignor/consignee/from/to/weight from the Load and Customer.
  - `GET /` `@RequirePermissions('documents:read')` — list, tenant-scoped, paged.
  - `GET /:id` — one.
  - `GET /:id/pdf` — render/stream the PDF.
  - `PATCH /:id/status` — ISSUED→IN_TRANSIT→DELIVERED (attach podDocumentId).
- Service: everything through `runAsTenant(companyId, ...)`; on create, verify the
  Load belongs to the company (findFirst where {id: loadId, companyId}), else 404.

## 1.4 — PDF (real Indian LR layout)
`handlebars` IS already in apps/api — use it for the LR HTML template. For
rendering to PDF, the repo already ships Chromium (Playwright) — print the
Handlebars HTML to PDF via Playwright (no new heavy dependency), or add `pdfkit`
if you prefer direct drawing. Template must show: company header,
"LORRY RECEIPT / BILTY", LR No + date, Consignor (name+GSTIN+addr), Consignee
(name+GSTIN+addr), From→To station, Truck No, Goods description + packages +
packing, Actual/Charged weight, freight breakup (Freight / Hamali / Other / GST /
**Total**), Payment type (Paid/ToPay/TBB), E-Way Bill No, signature line. Store
the generated file as a `Document` linked to the Load (type: 'LR'), set
`pdfDocumentId`.

## 1.5 — UI
- New page under Operations: **"LR / Bilty"** — a table (LR No, Date, From→To,
  Consignee, Truck, Amount, Payment type, Status) + a "Generate LR" action from a
  Booking that opens a prefilled form + a Print/Download button (calls
  `/:id/pdf`). Guard the map with `Array.isArray`.
- Add nav entry (see Phase 2).

## 1.6 — PROOF (paste all)
```bash
# create a booking (Load), then an LR from it
# ... login as admin (see demo-security-proofs.md helper) ...
LOAD=$(curl -s localhost:8080/api/v1/loads -H "Authorization: Bearer $A" | jq -r '.data[0].id')
# POST {} must be 400 (DTO fires)
curl -s -o /dev/null -w "empty LR: %{http_code}\n" -X POST localhost:8080/api/v1/lorry-receipts -H "Authorization: Bearer $A" -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck_a.txt -H "Content-Type: application/json" -d '{}'
# valid create -> 201 + an LR number
curl -s -X POST localhost:8080/api/v1/lorry-receipts -H "Authorization: Bearer $A" -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck_a.txt -H "Content-Type: application/json" -d "{\"loadId\":\"$LOAD\",\"consignorName\":\"Test\",\"consigneeName\":\"Test\",\"goodsDescription\":\"Steel\",\"fromStation\":\"Mumbai\",\"toStation\":\"Delhi\",\"paymentType\":\"TOPAY\",\"freightAmount\":25000}" | jq '{lrNumber, totalAmount, status}'
# numbering is sequential & unique
psql -U parilink -d parilink_db -h localhost -c 'SELECT "companyId","lrNumber" FROM "LorryReceipt" ORDER BY "createdAt" DESC LIMIT 5;'
# race safety: fire 5 concurrent creates, assert 5 DISTINCT numbers
for i in 1 2 3 4 5; do (curl -s -X POST localhost:8080/api/v1/lorry-receipts -H "Authorization: Bearer $A" -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck_a.txt -H "Content-Type: application/json" -d "{\"loadId\":\"$LOAD\",\"consignorName\":\"R\",\"consigneeName\":\"R\",\"goodsDescription\":\"x\",\"fromStation\":\"A\",\"toStation\":\"B\",\"paymentType\":\"PAID\",\"freightAmount\":1}" | jq -r '.lrNumber') & done; wait
# ^ the 5 printed numbers must all be different
# PDF renders
curl -s -o /tmp/lr.pdf -w "pdf: %{http_code} %{size_download} bytes\n" localhost:8080/api/v1/lorry-receipts/$LRID/pdf -H "Authorization: Bearer $A"
# cross-tenant: B cannot read A's LR
curl -s -o /dev/null -w "B reads A's LR: %{http_code} (want 404/403)\n" localhost:8080/api/v1/lorry-receipts/$LRID -H "Authorization: Bearer $B"
```

=====================================================================
# PHASE 2 — Speak the transporter's language; hide the bloat
=====================================================================
Edit `apps/web/src/config/navigation.ts`. This is mostly labels + visibility, and
it changes how the whole product FEELS to a transporter.

## Relabel
- "Loads" → **"Booking"**
- "Ledger" → **"Accounts"**
- keep "Billing", "Payments", "Dispatch", "Trips", "Tracking", "Fleet",
  "Drivers", "Customers", "Documents", "Dashboard"
- add **"LR / Bilty"** (from Phase 1) and **"POD"** under Operations
- add **"E-Way Bill"** and **"GST Reports"** ONLY if Phase 6 confirms they render
  real data; otherwise leave them out or mark clearly "Coming soon" (see Phase 6).

## Hide for the transporter customer (comment out / feature-flag off — do NOT delete)
LogOS Workspace, Command Center (unless it renders as a clean control tower),
Messaging, AI Copilot, Enterprise AI Platform, Knowledge Hub, Agent Console,
Prompt Studio, Model Registry, AI Analytics, Cost & Optimization, AI Governance,
Automation, App Marketplace, Subscription Center, SRE & Observability, Log
Explorer, Trace Explorer, Incidents, Backup & DR.

Target menu a transporter sees: Dashboard · Booking · LR/Bilty · Dispatch · Trips
· Tracking · POD · Fleet · Drivers · Customers · Billing · Payments · Accounts ·
GST Reports* · E-Way Bill* · Documents · Reports · Users · Roles · Settings.
(* only if real)

## PROOF
```bash
cd apps/web && npx tsc --noEmit; echo "WEB_TYPECHECK=$?"   # must be 0
```
Then open the app and paste a screenshot of the new sidebar. Every visible item
must lead to a page that renders (no dead links, no blank screens). If a page
isn't ready, it stays hidden — hiding beats a broken screen.

=====================================================================
# PHASE 3 — Transporter dashboard (real numbers only)
=====================================================================
Match the mental model in the ad: Total Bookings, Today's Billing, Outstanding,
Active Vehicles, Top Clients, Recent Bookings. Every value from the DB, none faked.

- Total Bookings = `Load` count (this company, not deleted).
- Today's Billing = sum of `Invoice.amount` created today.
- Outstanding = sum of unpaid/partly-paid `Invoice.amount` (amount − payments).
- Active Vehicles = `Vehicle` count status IN_SERVICE.
- Top Clients = customers by total invoiced (desc, top 5).
- Recent Bookings = latest Loads with LR No, From→To city, amount, status.

Remove any Math.random / hardcoded KPI in the dashboard components. Guard every
`.map` with `Array.isArray`.

## PROOF
Paste the dashboard API response next to the raw SQL for two tiles, and show they
match:
```bash
psql -U parilink -d parilink_db -h localhost -c 'SELECT count(*) FROM "Load" WHERE "companyId"=$AID AND "deletedAt" IS NULL;'
psql -U parilink -d parilink_db -h localhost -c 'SELECT COALESCE(sum(amount),0) FROM "Invoice" WHERE "companyId"=$AID AND status <> '\''PAID'\'';'
```
Screenshot the dashboard at 1440. Zero fake numbers.

=====================================================================
# PHASE 4 — Realistic Indian demo data (idempotent)
=====================================================================
Extend the seed (keep it idempotent — upsert by natural key) so the admin's
company looks like a real transporter:
- 6–8 customers with real names + GSTIN + city (e.g. "Bhonsle Transport",
  "Gupta Roadways", "Krishna Logistics", "Verma Transport", "Real Cargo").
- 10–15 vehicles with Indian plates (GJ-01-AB-1234, MH-12-CD-5678).
- 8–12 drivers.
- 20–30 bookings (Loads) on real lanes: Mumbai→Delhi, Pune→Nagpur,
  Ahmedabad→Surat, Delhi→Jaipur, with ₹ freight (₹15k–₹1.2L).
- An LR for most bookings; a mix of statuses (ISSUED/IN_TRANSIT/DELIVERED).
- Invoices + some Payments + the matching ledger entries, so Accounts isn't empty.
All in the admin's companyId.

## PROOF
```bash
# run seed twice — counts identical (idempotent)
cd apps/api && npx ts-node prisma/seed-demo.ts && npx ts-node prisma/seed-demo.ts
psql -U parilink -d parilink_db -h localhost -c 'SELECT '\''Load'\'' t,count(*) FROM "Load" UNION ALL SELECT '\''LR'\'',count(*) FROM "LorryReceipt" UNION ALL SELECT '\''Invoice'\'',count(*) FROM "Invoice" UNION ALL SELECT '\''Payment'\'',count(*) FROM "Payment";'
psql -U parilink -d parilink_db -h localhost -c 'SELECT "companyId",count(*) FROM "Load" GROUP BY "companyId";'
```
Data must land in the admin's company (the one admin@parilink.com logs into).

=====================================================================
# PHASE 5 — The walk + finance integrity (what the client SEES)
=====================================================================
Log in as the admin and walk the whole chain, screenshot each at 1440, and OPEN
every screenshot to confirm real rows (not empty, not fake):

LOGIN → DASHBOARD → CUSTOMERS → FLEET+DRIVERS → BOOKING → **generate LR/Bilty** →
DISPATCH → TRIP → IN-TRANSIT/TRACKING → DELIVERY+POD → BILLING(invoice) → PAYMENT
→ ACCOUNTS(ledger) → REPORTS/PROFITABILITY.

Finance integrity (owner named payment/ledger bugs as a class) — prove on real data:
```bash
# record a payment against an invoice, then assert the ledger is balanced and no double-post
# invoice total == sum(payments) => status flips to PAID
psql -U parilink -d parilink_db -h localhost -c 'SELECT i."invoiceNumber", i.amount, i.status, COALESCE(sum(p.amount),0) paid FROM "Invoice" i LEFT JOIN "Payment" p ON p."invoiceId"=i.id GROUP BY i.id LIMIT 10;'
# every JournalEntry balances: sum(debit)=sum(credit). JournalLine has debit &
# credit columns (both Float) and joins JournalEntry via jl."entryId".
psql -U parilink -d parilink_db -h localhost -c 'SELECT je.id, sum(jl.debit) dr, sum(jl.credit) cr FROM "JournalEntry" je JOIN "JournalLine" jl ON jl."entryId"=je.id GROUP BY je.id HAVING sum(jl.debit) <> sum(jl.credit);'
# ^ this query must return ZERO rows (no unbalanced entries)
```
Any unbalanced journal entry, or a paid-in-full invoice not marked PAID, is a
finance bug — flag it, don't hide it.

=====================================================================
# PHASE 6 — E-Way Bill & GST: honest, not fake
=====================================================================
Confirmed: the gateway is a "mock API Guard for MVP" and GST is only a tax-rules
table — there is NO real NIC e-way / GST-portal filing. Owner's rule: leave room,
don't pretend incomplete integrations are production-ready.
- GST: if invoice-level GST *calculation* from the rules table works on real data,
  show a "GST Reports" screen that summarizes GST on this company's invoices
  (that's honest). Do NOT show a "File to GST portal" button that does nothing.
- E-Way Bill: either hide it, or show a manual-entry form (store an e-way number
  on the LR) clearly labelled "manual entry — portal integration coming soon".
  Never show fake "generated from NIC" data.
- Fix the two Dockerfile silent-failure fallbacks while here (owner cares about
  real builds): `apps/web/Dockerfile:19` `npm ci ... || npm install
  --legacy-peer-deps` and `:30` `npx tsc || true` — remove both `||` escapes.

=====================================================================
# PHASE 7 — Final green + close-out
=====================================================================
- Delete the broken in-process `apps/api/test/dto-coverage.e2e-spec.ts` (it always
  fails; the live-server bash scan is the real tool). Or fix it to the live
  approach. A committed always-red spec is not allowed.
- Run every suite TWICE back-to-back, paste both summaries: auth, dto-validation,
  integrations-security, soft-delete-references, multi-tenant, + the new LR spec.
- `npx tsc --noEmit` both apps (0). `docker compose build web` + `api` (0). Run the
  container, curl /login (200) + 3 static assets (200).
- Run the browser smoke suite twice consecutively (owner priority #9); Chromium
  must pass both.
- `git status --short` and `git log --oneline -8`.
- Honest module table: module · verified · demo-ready · known issues (use
  "Unknown"/"Not done" freely).

=====================================================================
# STANDING P0 — not code, only the owner can do it
=====================================================================
Revoke + reissue at each provider: RAZORPAY, TWILIO, RESEND, MAPBOX, MINIO. Their
values are in git history (pre-b829b1f). Even in a "each customer brings own keys"
model, the leaked developer keys are live until revoked. One line each: done/not.
