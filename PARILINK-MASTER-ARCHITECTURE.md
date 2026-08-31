# PariLink — Master Architecture

> The definitive architecture for PariLink: every module, how they connect, the data model, the AI
> layer, security, and the build order. This consolidates the Blueprint + Scale Edition into one
> engineering source of truth. Any agent building PariLink follows this.
> Companion docs: `PARILINK-BLUEPRINT.md` (product), `PARILINK-SCALE-EDITION.md` (large-fleet depth),
> `PARILINK-HANDOFF.md` (current state).

---

## 1. System at a glance

```
        ┌─────────────────────────────────────────────────────────────┐
        │                     CLIENTS                                    │
        │  Web app (Next.js)   Driver app (React Native)   WhatsApp      │
        └───────────────┬─────────────────┬──────────────┬─────────────┘
                        │ REST / SSE       │              │ WhatsApp API
        ┌───────────────▼─────────────────▼──────────────▼─────────────┐
        │                      API  (NestJS)                             │
        │  Auth/RBAC  ·  Modules (below)  ·  AI layer  ·  Jobs (BullMQ)  │
        └───────────────┬───────────────────────────┬──────────────────┘
                        │ Prisma (RLS per tenant)    │
        ┌───────────────▼──────────┐   ┌─────────────▼──────────┐   ┌──────────────┐
        │   PostgreSQL (RLS)        │   │   Redis  (cache/queue) │   │  MinIO / S3  │
        │   all business data       │   │   jobs, sessions       │   │  files/PODs  │
        └───────────────────────────┘   └────────────────────────┘   └──────────────┘
```

- **Multi-tenant:** every row is scoped to a `companyId`; Postgres **Row-Level Security** enforces
  isolation. Code path: `prisma.runAsTenant(companyId, cb)` (RLS on) vs `runAsSystem(reason, cb)`
  (RLS off, rare, audited). The app DB role MUST be non-superuser so RLS actually applies.
- **Async work** (WhatsApp sends, PDF generation, nightly aggregations, anomaly scans) runs on
  **BullMQ/Redis** workers, not in the request.
- **Files** (bilty PDF, POD photos, documents) live in **MinIO/S3**, referenced by URL.

---

## 2. Domain map — all modules grouped by area

PariLink is organized into 6 domains. Modules marked **[NEW]** are the large-fleet additions; **[UP]**
are upgrades to an existing module; the rest are core.

**A. Operations (the trip lifecycle)**
- Bookings / Loads — intake of a load (customer, goods, from→to, rate)
- Trips & Dispatch — assign truck+driver, run the trip
- **Trip Desks [NEW]** — multi-role ownership of one trip (Diesel / FASTag / Workshop / Docs / Dispatch); trip closes only when all desks complete
- **Loading & Unloading [NEW]** — points, time in/out → detention, hamali, weight in/out
- Live Tracking — trucks on an India map
- Bilty / LR **[UP]** — multi-copy, GST-ready, WhatsApp PDF
- Documents — bilty, POD, e-way bill, permits storage

**B. Fleet & Assets**
- Vehicles — trucks, status, odometer, telemetry, papers
- Trailers — trailer master
- Permits — permit/insurance/fitness/FASTag with expiry reminders
- Maintenance / **Workshop & Job Cards [UP]** — repairs with labour + parts + vendor + cost
- **Tyre Management [NEW]** — tyres by position, life, cost/km
- FASTag / Tolls — toll spend, balance

**C. Workforce**
- Drivers — master, licence, status, trips
- **Driver Scorecard [NEW/UP]** — rated every trip → running score → feeds dispatch
- Attendance — driver attendance (optional)

**D. Finance**
- Invoices — GST invoice from a trip, line items, PDF
- GST — CGST/SGST/IGST engine, tax-invoice format, filing summary
- Payments — record RTGS/NEFT/UPI/cash against invoices
- Ledger & Finance — auto double-entry, general ledger, trial balance, party ledger
- Fuel & Expenses — diesel, toll, bhatta, repairs per trip/truck

**E. Intelligence (the smart layer — grounded on real data)**
- Profitability (per lane) — revenue − costs by route
- **Per-Truck P&L / TCO [NEW]** — net profit per truck (diesel+toll+driver+workshop+EMI)
- **Fuel Intelligence / Diesel-theft [NEW]** — expected vs actual fuel, anomaly feed, cause bucketing
- Reports & Dashboard analytics — charts, KPIs
- AI Copilot — grounded Q&A (Hindi/Gujarati + voice), anomaly insights

**F. Platform (cross-cutting)**
- Auth & RBAC — login, roles, permissions (`['*']` = all), fail-closed
- Companies / Branches — tenant + multi-branch
- Customers / CRM & Vendors — party masters
- **Bulk Import / Onboarding [NEW]** — import trucks/drivers/customers/opening balances from Excel
- WhatsApp integration — bilty, tracking links, reminders, daily brief
- Notifications, Search, Settings

> Everything else in the codebase (digital-twin, marketplace, SDK, WMS, EDI, 20+ AI engines) stays
> **out of scope** — internal code only, never on the product menu until a paying client needs it.

---

## 3. The core data model (key entities & how they relate)

```
Company (tenant)
  ├─ User (role, permissions)               ├─ Customer            ├─ Vendor
  ├─ Vehicle ──┬─ Tyre                       ├─ Driver ─ DriverScore
  │            ├─ Permit                     └─ Branch
  │            └─ MaintenanceJob ─ JobPart
  │
  └─ Booking ─▶ Trip ─┬─ TripDesk (diesel|fastag|workshop|docs|dispatch, status)
                      ├─ FuelEntry (litres, ₹, expected, variance)
                      ├─ TollEntry / FASTag
                      ├─ LoadingEvent (point, time, weight, hamali, detention)
                      ├─ Bilty (LR) ─ Document(POD, e-way)
                      ├─ TripExpense (bhatta, misc)
                      └─ Invoice ─┬─ InvoiceLineItem
                                  ├─ Payment
                                  └─ JournalEntry (double-entry → Ledger)
```

**Rules that make it work:**
- Every entity carries `companyId` (RLS).
- A **Trip is the spine** — bookings become trips; fuel, tolls, loading, bilty, expenses, and the
  invoice all hang off the trip. This is what makes per-truck and per-lane P&L accurate.
- **Per-Truck P&L** = sum, over a truck's trips in a period: freight revenue − FuelEntry − TollEntry −
  driver cost − MaintenanceJob/JobPart − fixed (EMI/insurance/depreciation).
- **Fuel Intelligence** = per Trip, `FuelEntry.expected` (from distance ÷ truck's expected mileage) vs
  `actual`; variance rolls up per truck and per driver to find the leak.
- **Ledger** posts automatically: Invoice → Dr Receivable / Cr Revenue + Cr GST; Payment → Dr Bank /
  Cr Receivable; Expense/JobPart → Dr Cost / Cr Bank.

---

## 4. The golden thread (end-to-end flow — every module feeds the next)

```
Booking → Bilty/LR → Dispatch(truck+driver) → [Trip Desks fill: Diesel · FASTag · Loading · Workshop]
        → Live Tracking → POD upload → Trip close (all desks done)
        → Invoice(GST) → Payment → Ledger(auto) → Per-Trip / Per-Lane / Per-Truck Profit
        → Fuel & cost anomalies flagged → Driver scored
```
If a step doesn't feed the next automatically, it isn't finished.

---

## 5. Roles & the desk model (how the app is arranged)
Each user sees a **home screen for their job**, not one giant menu:
- **Owner/Manager** → Dashboard: per-truck & per-lane profit, cash, dues, alerts, anomalies.
- **Dispatch** → Bookings, Trips, free trucks/drivers, tracking.
- **Diesel / FASTag / Workshop / Docs desks** → only their slice of open trips (Trip Desks).
- **Accountant** → Invoices, Payments, GST, Ledger.
- **Driver (mobile)** → current trip only: pickup/drop, POD, expenses.
Access enforced by RBAC, fail-closed, `['*']` = owner.

---

## 6. AI layer architecture (grounded — never invents numbers)
```
User question / scheduled scan
        │
   Intent router (deterministic)  ──▶  real Prisma queries (tenant-scoped)
        │                                    │
   Copilot answer (₹ formatted, Hindi/Guj)   Anomaly engine (nightly job):
                                             fuel variance, cost spikes, lane→loss,
                                             driver score drop, papers expiring
                                                   │
                                             Owner's anomaly feed + WhatsApp brief
```
- **Demo/launch:** deterministic router + anomaly rules on real data (no LLM key, can't hallucinate).
- **Later upgrade:** a real LLM for free-form phrasing sits ON TOP of the router; the router stays the
  accuracy layer. Predictions (maintenance-due, fuel forecast) added once there's trip history.

---

## 7. Security & multi-tenant (non-negotiable before real data)
- **Tenant isolation:** RLS on every table; app DB role non-superuser; proven on a fresh
  `docker compose down -v`. Un-fakeable check: `grep -rn -A2 "runAsSystem(" apps/api/src | grep -c "companyId"`.
- **Secrets:** provider keys in env, never committed. The 5 leaked live keys are an **owner action** to
  revoke/reissue — never write fake keys.
- **RBAC:** every controller `@RequirePermissions`, fail-closed.
- **Files:** signed URLs, tenant-scoped buckets.
- **Backups + uptime:** required before onboarding a real fleet (they run their business on this).

---

## 8. Performance for 200+ truck fleets
- Index hot queries: trips, fuel, ledger by `(companyId, date)`.
- **Pre-aggregate** per-truck P&L and fuel stats in a nightly job — don't compute live on every load.
- Paginate every list (the "0 of 0" bug was a paging count error — never regress it).
- Test with realistic volume (200 trucks × trips × history), not 10 demo rows.
- Bulk import so a big fleet can actually move their data in.

---

## 9. Tech stack
- **Backend:** NestJS (Node 20), Prisma, PostgreSQL (RLS), Redis + BullMQ, MinIO/S3.
- **Frontend:** Next.js 16 (App Router), React, Recharts, maplibre-gl + react-map-gl (raster tiles).
- **Mobile:** React Native (bare) driver app → Android APK.
- **Integrations:** WhatsApp Business API; GST/e-way (India).

---

## 10. Build order (do NOT build everything at once)

**Phase 0 — stabilize the current core (now):** get the existing broken screens green — map tiles + AI
copilot, invoices+GST+PDF, payments, ledger, vehicles, drivers, documents. Seed real data. (Prompts
`FIX-map-tiles-and-ai-copilot.md`, `FIX-everything-data-and-actions.md` already exist.) **Screenshot-gate each.**

**Phase 1 — lean product to Diwali (Nov 8):** the 22 core modules solid + driver APK + security gate
(revoke keys, durable RLS). This is the launchable product.

**Phase 2 — large-fleet depth (Nov → Jan, post-launch, with paying fleets):**
1. Trip Desks (multi-role) + Loading/Unloading + Bilty upgrade
2. Workshop/Job Cards + Tyre + Per-Truck P&L
3. Driver Scorecard
4. Fuel Intelligence / diesel-theft AI (needs trip history) + Bulk Import
5. WhatsApp integration (bilty, tracking, reminders, daily brief)

**Golden rules for any agent:** screenshot is the gate · never fake data or weaken a check · every
module feeds the next · security before real data · build the scoped modules only.

---

## 11. Where to start RIGHT NOW
1. Run `FIX-map-tiles-and-ai-copilot.md`, verify with the 3 screenshots.
2. Run `FIX-everything-data-and-actions.md`, one screenshot per fixed screen.
3. Add the Prisma models for the new entities (TripDesk, FuelEntry, LoadingEvent, Tyre, JobPart,
   DriverScore, per-truck P&L view) — schema first, before UI, so Phase 2 has a foundation.
4. Then build Phase 2 modules in the order above, one at a time, each proven by screenshot.
