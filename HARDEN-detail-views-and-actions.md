# PariLink — harden DETAIL views + ACTIONS (the demo-harden missed these). Verify by clicking in.

The crash sweep only ever tested LIST pages. DETAIL pages (`/[id]`) and ACTION buttons (generate
bilty, record payment) were never hardened — and they crash when the API omits a field
(`invoice.subtotal.toLocaleString()` → "Cannot read properties of undefined"). Claude already
fixed `invoice-detail-view.tsx`. Fix the rest the same way, plus two specific bugs.

## STEP 1 — guard EVERY unguarded numeric formatter (23 `.toLocaleString()` + 7 `.toFixed(`)
Find them:
```bash
cd ~/Desktop/PariLink/apps/web
grep -rnE "[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\.toLocaleString\(\)" src --include=*.tsx | grep -vE "\?\? 0\)|\?\.|CountUp|formatFn"
grep -rnE "\.toFixed\(" src --include=*.tsx | grep -vE "\?\? 0\)|\?\."
```
Guard each so a missing field renders `0`, not a crash. Handle NESTED access correctly — optional
-chain the whole path, don't just wrap the last property:
- `warehouse.capacity.totalPallets.toLocaleString()` → `(warehouse.capacity?.totalPallets ?? 0).toLocaleString()`
- `order.totalValue.toLocaleString()` → `(order.totalValue ?? 0).toLocaleString()`
- `x.y.toFixed(2)` → `(x.y ?? 0).toFixed(2)`
Do it by hand or a careful script, then `npx tsc --noEmit` MUST stay 0. Priority files (demo path):
`loads/[id]/page.tsx`, `components/wms/warehouse-detail-view.tsx`, `components/orders/order-detail-view.tsx`,
`components/fleet/maintenance-timeline.tsx`, `trailers/page.tsx`, `components/reports/reports-dashboard.tsx`.
(Minor: `loads/[id]` weight shows "lbs" — change to "kg".)

## STEP 2 — fix "Failed to generate Bilty" (demo step 5 — critical)
Bring the API up, then reproduce the POST as admin and read the REAL error:
```bash
cd ~/Desktop/PariLink/apps/api && (npm run start:prod > /tmp/api.log 2>&1 &) ; sleep 10
c=$(curl -s -c /tmp/ck.txt localhost:8080/api/v1/health >/dev/null; grep XSRF /tmp/ck.txt|awk '{print $7}')
TOK=$(curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck.txt -H 'Content-Type: application/json' -d '{"email":"admin@parilink.in","password":"password123"}' | jq -r .access_token)
LOAD=$(curl -s "localhost:8080/api/v1/loads" -H "Authorization: Bearer $TOK" | jq -r '.data[0].id')
curl -s -w "\nHTTP %{http_code}\n" -X POST "localhost:8080/api/v1/lorry-receipts" -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' -d "{\"loadId\":\"$LOAD\"}"
```
Likely cause: the `LrSequence` field mismatch — the seed uses `nextNumber` but the schema model
has `lastNumber`/`financialYear`. Check `grep -A8 "model LrSequence" apps/api/prisma/schema.prisma`
against `lorry-receipts.service.ts` and the seed, make them consistent, and fix the numbering
logic so the POST returns 201 with an LR id. Then confirm `/lorry-receipts/:id/print` renders.
Proof: paste the POST returning 201 + the printed LR.

## STEP 3 — fix the billing-page MenuGroupContext crash
`src/app/(dashboard)/billing/page.tsx:43` renders `<DropdownMenuGroup>` outside a valid menu
context → "MenuGroupContext is missing". Wrap it correctly inside `<DropdownMenu><DropdownMenuContent>…`,
or remove the stray group wrapper. Proof: `/billing` loads with no console error, no boundary.

## STEP 4 — CLICK-TEST every detail view + action (screenshots, not just list sweep)
With both servers up, open each and screenshot into `demo-shots/detail/`:
loads/[id], trips/[id] (or trip detail), invoices/[id], customers/[id], vehicles/[id],
warehouse detail, order detail. Then trigger the actions: generate Bilty from a load, record a
payment. NONE may show the "Dashboard View Error" boundary. Any that does → fix its field
mismatch and re-shoot.

## STEP 5 — commit + final sweep
`git add -A && git commit -m "fix: guard all detail-view numeric formatters, fix bilty generate + billing menu"`.
Re-run the crash sweep (still green). 

## Report
Paste: the guard count fixed, `tsc --noEmit` = 0, the bilty POST = 201, the detail-view screenshot
list. Claude will open the detail screenshots and confirm none crashes.
