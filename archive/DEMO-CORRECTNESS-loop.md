# PariLink — DEMO CORRECTNESS loop (judge every screen by its SCREENSHOT, not the sweep)

Your green sweep is LYING about readiness. Claude opened the screenshots and found:
- **/profitability → "403 Forbidden"** — the demo centerpiece is DEAD (admin can't view it).
- **/trips → every row = "Unknown Origin → Unknown Destination", "Invalid Date", blank
  tracking #, "mi"** — reads the wrong fields; looks broken.
- **/dashboard → currency in "$" and "MPG"** — must be ₹ and km for an Indian transporter.

All THREE passed your Playwright sweep, because a 403 page and an "Unknown Origin" table both
render without crashing. **A green sweep is NOT proof. The screenshot is proof.** This loop fixes
by screenshot.

## RULES
1. Commit after each fix. No dep/package churn. Match real API/DTO field shapes (no faking data
   to match a broken component — fix the component).
2. **Definition of done for a screen = its screenshot looks correct to a human.** Not "200",
   not "no crash". If the screenshot shows 403 / "Unknown" / "$" / "Invalid Date" / empty, it is
   NOT done.

## THE LOOP — per demo screen: open → screenshot → judge → fix → re-screenshot → repeat
Demo screens: dashboard, customers, fleet/vehicles, drivers, loads, trips, trip-detail,
lorry-receipts, LR-print, dispatch, invoices, payments, ledger, profitability, documents,
maintenance, warehouse, notifications, tracking.
For each: capture `demo-shots/<screen>.png` at 1440, then LOOK at it and fix anything wrong:
wrong/blank fields, 403/permission walls, wrong currency/units, "Invalid Date", empty tables,
mislabeled columns. Re-screenshot after the fix and confirm it's clean. Commit per screen.

## THE THREE KNOWN BREAKS — fix these first, with root cause
### A. /profitability returns 403 for the admin
The seeded admin is SUPER_ADMIN with permissions `['*']` yet gets 403 — so the guard on the
profitability controller isn't honoring `'*'`, OR the A1 `runAsTenant` conversion broke the
tenant/permission context. Find the `@RequirePermissions(...)` / guard on the profitability
route, trace why `['*']` fails, and fix it so the admin sees the page. 
**Proof: screenshot showing the profit table with a GREEN profit lane and a RED loss lane.**

### B. /trips shows "Unknown Origin/Destination", "Invalid Date", no tracking #, "mi"
The trips table component reads fields that don't match the API. Map to the real ones (trip
number, origin/destination city from the linked load, the real date field, distance in km).
Fix the component to the real shape. **Proof: screenshot with real tracking #s, real
Indian routes, real dates, km.**

### C. Currency/units are $ / MPG / mi across the app
Make it ₹ and km everywhere a value renders (dashboard tiles, trips distance, any $). Indian
number formatting (₹24,50,000). Centralize if there's a formatter. 
**Proof: dashboard screenshot showing ₹ and no "$"/"MPG".**

## AFTER the three + the per-screen loop
- Re-capture ALL demo screenshots into `demo-shots/`. Every one must look correct.
- Re-run the crash sweep (must stay green) AND paste the screenshot file list.
- Update DEMO-SCRIPT.md if any screen's flow changed.
Commit everything.

## Report
For each of A/B/C: the root cause, the fix, and confirm the new screenshot is clean. Then the
full `demo-shots/` list. Do NOT say "demo ready" again — say "screenshots attached, please
review." Claude will open every screenshot and judge readiness by eye. That is the only gate now.

## Reminder — still parked for after the demo
Durable tenant isolation on a fresh `docker compose down -v`, and the owner revoking the 5 keys.
