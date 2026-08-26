# PariLink — fix the "Permission Denied" endpoints (payments + siblings). Short + verified.

Profitability is genuinely fixed now (verified: ₹3,87,000, Pune→Nagpur red loss lane). But
**/payments shows a red toast "Permission Denied — Authorization configuration missing. Access
denied by default"** and an empty table — even though payments were seeded. This is the
fail-closed PermissionsGuard: the payments controller's `@RequirePermissions(...)` is missing or
wrong, so it denies by default. A "Permission Denied" page renders without crashing, so your
crash sweep passes it — that's why it slipped. Judge by screenshot, not the sweep.

## STEP 1 — find EVERY endpoint that fails closed like this
```bash
cd ~/Desktop/PariLink/apps/api
# controllers that have routes but NO @RequirePermissions (these deny-by-default):
for c in $(grep -rl "@Controller" src --include=*.controller.ts); do
  if grep -q "@Get\|@Post\|@Patch\|@Delete" "$c" && ! grep -q "RequirePermissions\|@Public" "$c"; then echo "MISSING PERMS: $c"; fi
done
```
Focus on the demo-path ones: **payments**, and check documents, maintenance, fuel, fastag, gst,
tracking, support the same way.

## STEP 2 — fix each with the CORRECT permission (do not remove the guard, don't fail open)
Add the right `@RequirePermissions(...)` to each route so a normal role reaches it and the admin
(`['*']`) is granted. Payments = `finance:read` (GET) / `finance:write` (POST), mirroring how
invoices (which works) is decorated. Match each controller to the permission its sibling working
controller uses. Do NOT make it `@Public` and do NOT delete the guard — that's a security hole.

## STEP 3 — verify LIVE + by FRESH screenshot (both)
Bring servers up (api + web both 200), then for payments and any others you fixed:
```bash
c=$(curl -s -c /tmp/ck.txt localhost:8080/api/v1/health >/dev/null; grep XSRF /tmp/ck.txt|awk '{print $7}')
TOK=$(curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck.txt -H 'Content-Type: application/json' -d '{"email":"admin@parilink.in","password":"password123"}' | jq -r .access_token)
curl -s -w "\nHTTP %{http_code}\n" "localhost:8080/api/v1/payments" -H "Authorization: Bearer $TOK" | head -c 300
```
Must be 200 with real payment rows. Then regenerate screenshots with the freshness gate (every
file mtime newer than the run start = FRESH), and OPEN payments.png: it must show real payment
rows in ₹ and NO "Permission Denied" toast.

## STEP 4 — one full pass: open EVERY demo screenshot, confirm none has a red toast / ₹0.00 / empty
dashboard, customers, fleet, drivers, loads, trips, lorry-receipts, dispatch, invoices, payments,
ledger, profitability, documents, maintenance, warehouse, notifications, tracking. Any red
error toast or empty-where-seeded = fix it and re-shoot. Commit.

## Report
Paste: the MISSING PERMS list, the payments curl = 200 with rows, the FRESH list, and confirm
"payments.png shows real rows, no toast." Claude will re-open payments.png and the others.

## Parked for after demo: durable RLS on fresh `docker compose down -v`; owner revokes 5 keys.
