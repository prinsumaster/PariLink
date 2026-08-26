# PariLink — PROVE profitability visually + finish. Screenshots MUST be fresh.

You reported "screenshots attached, ready" — but `profitability.png` did NOT regenerate. It is
byte-identical (same size, same mtime) to the BROKEN ₹0.00 version from the last round. Your web
server kept failing under Playwright and the capture silently did nothing. So the profitability
fix is UNPROVEN — the only screenshot of it still shows ₹0.00 and an error toast.

Root problem to fix first: **screenshot capture silently fails and you don't notice.** This loop
makes a stale screenshot impossible to hide.

## STEP 0 — bring BOTH servers up RELIABLY, and block until they're truly ready
```bash
cd ~/Desktop/PariLink
killall node 2>/dev/null; sleep 2
(cd apps/api && npm run start:prod > /tmp/api.log 2>&1 &)
(cd apps/web && npm run dev  > /tmp/web.log 2>&1 &)
# WAIT for real readiness — do not proceed on a guess:
for i in $(seq 1 40); do curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/v1/health | grep -q 200 && break; sleep 3; done
for i in $(seq 1 40); do curl -s -o /dev/null -w "%{http_code}" localhost:3000/login       | grep -q 200 && break; sleep 3; done
curl -s -o /dev/null -w "api: %{http_code}\n" localhost:8080/api/v1/health
curl -s -o /dev/null -w "web: %{http_code}\n" localhost:3000/login
```
Both MUST print 200 before you screenshot anything. If web isn't 200, read /tmp/web.log and fix
the boot — do NOT run the capture against a dead server (that's what produced the stale file).

## STEP 1 — regenerate ALL screenshots AND PROVE they're fresh (this is the anti-stale gate)
Record the time, run the capture, then assert every screenshot's mtime is NEWER than that time:
```bash
STAMP=$(date +%s)
cd apps/web && npx playwright test tests/screenshot-demo.spec.ts --project=chromium
echo "--- freshness check (any 'STALE' = capture failed, do not proceed) ---"
for f in demo-shots/*.png; do
  m=$(stat -f %m "$f"); [ "$m" -ge "$STAMP" ] && echo "FRESH  $f" || echo "STALE  $f";
done
```
If ANY file is STALE, the capture didn't work — fix the server/capture and rerun until every
file says FRESH. A stale screenshot is a failed step.

## STEP 2 — the profitability gate (the one that's been broken 3x)
Open `demo-shots/profitability.png` and confirm it shows: non-zero **₹ Total Revenue, Total Cost,
Net Profit**, a populated Trip Profitability table, and **Best lane (Ahmedabad→Surat green) +
Worst lane (Pune→Nagpur red, −102.9%)**. Also paste the live curl proving the API returns those
numbers:
```bash
c=$(curl -s -c /tmp/ck.txt localhost:8080/api/v1/health >/dev/null; grep XSRF /tmp/ck.txt|awk '{print $7}')
TOK=$(curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck.txt -H 'Content-Type: application/json' -d '{"email":"admin@parilink.in","password":"password123"}' | jq -r .access_token)
curl -s "localhost:8080/api/v1/profitability/summary" -H "Authorization: Bearer $TOK" | jq .
```
If the curl shows real numbers but the SCREENSHOT still shows ₹0.00, the frontend isn't consuming
the API (wrong path/param/shape) — fix the frontend until the screenshot shows the real numbers.
Screenshot is the gate, not the curl.

## STEP 3 — per-screen sanity (open each, fix if wrong, re-shoot until FRESH + correct)
dashboard, customers, fleet, drivers, loads, trips, lorry-receipts, dispatch, invoices, payments,
ledger, profitability, documents, maintenance, warehouse, notifications, tracking. Each screenshot
must be FRESH and show real ₹/data — no ₹0.00, no "Invalid Date", no empty-where-seeded, no toast.

## STEP 4 — endurance + commit
Run the crash sweep 5× on Chromium (green each). Commit everything:
`git add -A && git commit -m "demo: verified-fresh screenshots, profitability proven"`.

## Report
Paste: the api/web 200 lines, the FRESH/STALE list (all FRESH), the profitability curl JSON, and
say "profitability.png shows ₹<real revenue> and the Pune→Nagpur red loss lane." Do NOT say ready
until every screenshot is FRESH. Claude will pull the screenshots, check their mtimes are new, and
open profitability.png — a stale or ₹0.00 file means not done.

## Parked for after the demo: durable RLS on fresh `docker compose down -v`; owner revokes 5 keys.
