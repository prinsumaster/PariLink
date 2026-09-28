# PariLink — enrich the seed so no demo screen looks empty + write the demo script

The crash-sweep is genuinely green (95 routes, Playwright `.last-run.json` = passed) — good, the
app won't crash. But the seed only fills ~15 core entities with 1–2 rows each, so most screens
render EMPTY, and the core path is too sparse (1 trip, 1 load, no loss-making trip). This makes
the demo look thin. Fix that. Keep the same rules that are finally working.

## RULES (keep doing these — they're why this round worked)
1. **Commit after each step.** `git add -A && git commit -m "..."`.
2. **No thrashing:** don't touch package.json/node_modules. Seed only.
3. **Match schema field names EXACTLY.** Before seeding each entity, read its model:
   `grep -A25 "model <Name> {" apps/api/prisma/schema.prisma`. The last seed broke on wrong
   field names (e.g. LorryReceipt uses `fromStation`/`toStation`, not `origin`/`destination`;
   LrSequence — check `lastNumber` vs `nextNumber`). Use the real fields, no `as any` hacks.
4. Seed must stay **idempotent** (findOrCreate/upsert) — running it twice = identical counts.

## STEP 1 — enrich the CORE demo path (make it look like a real business)
In `apps/api/prisma/seed.ts`, expand to:
- **5+ customers** (Tata Motors, Reliance Retail, Amul, Asian Paints, Havells…), 5+ vendors,
  6+ drivers, 6+ vehicles (GJ-01-AB-1234, MH-04-…, DL-1L-…, RJ-14-…).
- **8+ loads/bookings** across real lanes: Mumbai→Delhi, Pune→Nagpur, Ahmedabad→Surat,
  Delhi→Jaipur, Chennai→Bengaluru — varied ₹ freight (₹18k–₹85k).
- **8+ trips** linked to those loads/drivers/vehicles, mixed statuses (IN_TRANSIT, COMPLETED,
  PLANNED), realistic fuel/toll/expense rows so profitability is non-zero, and **at least ONE
  clearly loss-making trip** (costs > revenue) so the "which lane loses money" story lands.
- **6+ invoices** (mixed ISSUED / PAID / OVERDUE) with **matching payments** for the PAID ones.
- **6+ lorry receipts** generated from the loads.
Prove: `npx prisma db seed` runs clean twice; counts identical.
Commit: `feat(seed): rich core demo data (lanes, loss trip, payments, LRs)`.

## STEP 2 — populate the modules that are currently EMPTY on the click path
Add a few realistic rows to each so the screen isn't a "No data" wall (check each model's fields
first). Priority (most likely to be clicked): **payments, documents/POD, maintenance, fuel,
fastag, GST records, warehouse/yard, support tickets, notifications, chat threads, tracking /
location history.** 3–5 rows each is enough. If a module's schema is genuinely unused/complex,
note it in the report and leave it (we'll hide that nav item instead).
Prove: seed twice, clean. Commit: `feat(seed): populate secondary modules for demo`.

## STEP 3 — prove screens are POPULATED, not just non-crashing
The current sweep only checks "doesn't crash / >200 chars". Add a check that the KEY demo
screens actually show data. For these routes, assert the main table/list has ≥3 rows (or a
known row's text is visible):
`/customers /fleet (vehicles) /drivers /loads (bookings) /trips /invoices /payments
/lorry-receipts /profitability /dashboard`.
Re-run the full crash sweep too — must stay green on Chromium.
Paste: the populated-screen check results + `.last-run.json` = passed.
Commit: `test: assert key demo screens are populated`.

## STEP 4 — dashboard + profitability show real, non-trivial numbers
Confirm the dashboard KPIs and the profitability page reflect the richer seed (total bookings,
today's billing, outstanding, a red loss lane, a green profit lane). Spot-check 3 dashboard
tiles against SQL (`psql ... "SELECT count(*) FROM ..."`). No `Math.random`.
Paste the 3 tile-vs-SQL comparisons. Commit if anything changed.

## STEP 5 — write the 60-minute demo script (deliverable: DEMO-SCRIPT.md)
A minute-by-minute walkthrough that stays on the populated screens and routes AROUND any that
are still empty:
- Login → dashboard (point at the real KPIs) → customers → fleet + drivers → create/booking →
  generate LR/Bilty + print → dispatch → trip in transit → POD → invoice → record payment →
  ledger/accounts → **profitability (show the losing lane)**.
- For each step: what to click, what to say (the India/transporter value), ~how long.
- A short "if asked about X module" section: which screens to open, which to avoid.
Commit: `docs: 60-minute demo script`.

## Report
Per step: what you seeded (counts), the twice-seeded idempotency proof, the populated-screen
check, `.last-run.json` = passed, and the commit hashes. Do NOT claim "demo ready" without the
populated-screen check pasted. Claude will re-run the seed-count and the sweep to confirm.
