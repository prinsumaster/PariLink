# PariLink — fix profitability FOR REAL (backend) + final polish. Judge by screenshot.

Trips ✓ and dashboard currency ✓ are genuinely fixed — good. But you claimed profitability
"accurately visualizes the red and green lanes" while its own screenshot shows **₹0.00
everywhere, an empty table, and a red "Failed to load trips profitability" toast.** You fixed the
frontend guard (page renders now) but the BACKEND call still fails. You did not look at your own
screenshot. New iron rule: **before claiming a screen fixed, OPEN its screenshot and confirm real
non-zero values. If it shows ₹0.00 / empty / a toast, it is NOT fixed.**

## STEP 1 — diagnose profitability LIVE (don't guess, don't patch the frontend again)
The backend policy engine DOES honor `['*']` (iam-policy-engine.service.ts:77), so it's NOT the
wildcard. Start the server and hit the endpoint as the admin to see the REAL failure:
```bash
cd ~/Desktop/PariLink/apps/api && (npm run start:prod &) ; sleep 8
curl -s -o /dev/null -w "health: %{http_code}\n" localhost:8080/api/v1/health   # must be 200
# login helper
c=$(curl -s -c /tmp/ck.txt localhost:8080/api/v1/health >/dev/null; grep XSRF /tmp/ck.txt|awk '{print $7}')
TOK=$(curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck.txt \
  -H 'Content-Type: application/json' -d '{"email":"admin@parilink.in","password":"password123"}' | jq -r .access_token)
for p in /profitability/summary /profitability/trips; do
  echo "== $p =="; curl -s -w "\nHTTP %{http_code}\n" "localhost:8080/api/v1$p" -H "Authorization: Bearer $TOK" | head -c 500; echo
done
```
Read the ACTUAL status + body. It will be one of:
- **403** → cross-tenant / policy context problem (the request's companyId isn't reaching the
  guard). Trace how the profitability controller passes the tenant vs how invoices (which works)
  does, and fix the mismatch.
- **500** → the service query is throwing (profitability.service.ts runs per-trip
  `fuelTransaction`/`tollTransaction`/`expense` aggregates — a wrong field/relation throws). Paste
  the stack trace, fix the failing query.
- **404** → the frontend is calling the wrong URL (there was a double-`/v1` path bug here before).
  Fix the frontend path.
Fix the ONE that's actually happening. Paste the before (failing) and after (200 + JSON with real
numbers) curl.

## STEP 2 — prove it by screenshot (the only acceptance test)
Re-screenshot `/profitability`. It must show: non-zero Total Revenue / Total Cost / Net Profit in
₹, a populated Trip Profitability table, and **Best/Worst Lane filled (a real green profit lane
and a red loss lane)** — you seeded a loss-making trip, it must appear. If the screenshot still
shows ₹0.00 or a toast, keep going — do not report done.

## STEP 3 — final polish nits (small, real, visible in the demo)
- **Trips distance shows "0 km"** for every row → either seed a real `estimatedDistance` per trip
  (lane-appropriate km) or hide the Distance column. No "0 km" walls.
- **Dashboard `$` icons** still show on Daily Revenue / Revenue Today tiles (the text is ₹ now but
  the icon is a dollar sign) → swap the `DollarSign`/`$` icon for a ₹/IndianRupee icon.
- **Indian number grouping**: `₹157,000` should render `₹1,57,000` (en-IN). Confirm the formatter
  uses `Intl.NumberFormat('en-IN')` on the tiles and money columns.
- **Dates**: `8/25/2026` → Indian `DD/MM/YYYY` (or `25 Aug 2026`) on trips/invoices.
Commit each. Re-screenshot the affected screens and confirm.

## STEP 4 — re-capture ALL demo screenshots, keep the crash sweep green
Repopulate `demo-shots/`, re-run the Chromium crash sweep (stays green), and this time SPOT-OPEN
profitability, trips, dashboard, invoices, payments yourself and confirm real values before
reporting.

## Report
Paste: the profitability curl before/after (real JSON numbers), and say "screenshots attached —
profitability now shows ₹X revenue and a red loss lane." Claude will open profitability.png and
the others and judge by eye. Screenshot is the only gate.

## Still parked (after demo): durable RLS on fresh `docker compose down -v`, owner revokes 5 keys.
