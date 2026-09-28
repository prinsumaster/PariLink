# PariLink — close A1 with the runtime proof, then Phase B + C

Claude verified your A1 code round directly on the repo and it holds up: gate is at **82**
(down from 153), **77 of those are false positives** (the word "companyId" inside a reason
string, not a bypass), the `metrics-platform` dual-mode splits are correct, the admin
conversions are correctly scoped to their `companyId` param, and `tsc -p tsconfig.build.json
--noEmit` = 0. Good — that was real work, not a rename.

**But A1 is NOT done: you never ran the runtime isolation proof.** No `docker compose up`,
no `health: 200`, no 200/404 codes anywhere in your report. Code that compiles is not code
that isolates — a conversion that quietly broke a tenant's own access looks identical in tsc.
This prompt makes you prove it, then continues.

Two process rules that are not optional:
- **STOP using bulk regex / sed / node scripts on source files.** It landed correctly this
  time by luck; it is the exact practice that produced the earlier fake. Edit sites by hand.
- Every "done" has its raw pasted output directly above it. `000` is NEVER a pass. "NOT
  DONE" is always acceptable; a false green is not.

=====================================================================
# STEP 1 — the A1 runtime isolation proof (do this FIRST, paste raw output)
=====================================================================
```bash
cd ~/Desktop/PariLink
docker compose up -d                     # postgres, redis, minio
docker ps --format '{{.Names}}'          # confirm all three are up
cd apps/api && npm run build && (npm run start:prod &)
for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/v1/health | grep -q 200 && break; sleep 2; done
curl -s -o /dev/null -w "health: %{http_code}\n" localhost:8080/api/v1/health   # MUST print 200
```
If health is not 200, the server is down — do not run any test, do not report any result.

Login as two admins in DIFFERENT companies (fix emails to the real seed if needed):
```bash
login(){ curl -s -c /tmp/ck_$1.txt localhost:8080/api/v1/health >/dev/null
  local c=$(grep XSRF-TOKEN /tmp/ck_$1.txt|awk '{print $7}')
  curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck_$1.txt \
    -H 'Content-Type: application/json' -d "{\"email\":\"$2\",\"password\":\"$3\"}" | jq -r '.access_token'; }
A=$(login a admin_a@parilink.com password123); B=$(login b admin_b@parilink.com password123)
curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $A" | jq '.companyId'
curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $B" | jq '.companyId'   # must differ
```
For EACH of customers, vehicles, drivers, loads, trips, invoices, payments, documents: take
one of B's real ids and prove
- B reads own id → **200** (positive control — without this a wall of 404s proves nothing)
- A reads / PATCH / DELETE B's id → **404/403**
- psql the row → unchanged (name not 'HACKED', deletedAt still null)

PLUS two endpoints you converted this round (an `operations/metrics` route and one admin
tenant route): A must not see B's data. Paste all raw codes as one table, `health: 200`
line at the top. **A1 is done only when this table is pasted with real 200/404 codes.**

=====================================================================
# STEP 2 — PHASE B: correctness bugs (each with its own live proof, server still up)
=====================================================================
Do these one at a time; after each, rebuild and prove it against the live server.
- **B1. DTOs on ghost-create endpoints** so `POST {}` → 400 (not 500/201): `POST /trailers`,
  `/support/ticket`, `/fleet/lifecycle/onboard`,
  `/vehicles/compliance/registration/:id`, `/ai/copilot/sessions`.
  Proof each: `POST {}` → 400, valid body → 2xx.
- **B2. 500-on-empty scan:** hit every swagger POST path at `localhost:8080$path` (NOT
  double-prefixed) with `{}`; every one returning 500 gets a DTO/guard → 400. Proof: scan
  shows 0×500.
- **B3. Array.isArray guards** on the 12 nested `.map()` sites (invoice-detail-view:111,
  order-detail-view:87, loads/[id]:359, customer-detail-view:100, warehouse-detail-view:81,
  ExecutionCenter:103, anomaly-log:101, notification-center:133, document-viewer:70,
  marketplace/install:46, chat:251, operations/traces:54). Proof: each screen renders with
  the API returning `[]`.
- **B4. Soft-delete reference checks** on trailers/branches/vendors (mirror customers).
  Proof each: delete with a dependent → 409; without → 200.
- **B5. CSRF exemption** for HMAC-authed `ingress/telemetry` + webhook routes in
  `csrf.middleware.ts`. Proof: external-style POST (no cookie, valid signature) → 202/200,
  not 403. Keep CSRF on the browser API.
- **B6. WebKit CORS:** point the web API client at the same-origin `/backend` proxy. Proof:
  `npx playwright test tests/smoke.spec.ts --project=webkit` → 0 CORS errors.
- **B7. Firefox 304:** widen `smoke.spec.ts:114` to accept `status()===304`. Proof: firefox
  smoke passes.

=====================================================================
# STEP 3 — PHASE C: regression tests (so none of the above silently comes back)
=====================================================================
- **C1.** Delete the broken always-red `apps/api/test/dto-coverage.e2e-spec.ts`.
- **C2.** Spec: `POST {}` → 400 for every create endpoint (documented skip list for
  auth/webhook/ingress). Committed and PASSING (`jest … | grep Tests:`).
- **C3.** Spec: cross-tenant `:id` → A 404/403 AND B 200 (positive control) for each core
  entity. Committed and PASSING, server live.
- **C4. The A1 lock:** a test that runs
  `grep -rn -A2 "runAsSystem(" apps/api/src --include="*.ts" | grep -c "companyId"` and
  FAILS if the count rises above the floor you leave it at (record the floor in the test).
  This is what stops a future round from silently re-introducing bypasses. Committed + green.

=====================================================================
# Also fix the 4 pre-existing test-type errors (so `tsc --noEmit` full = 0)
=====================================================================
`trips.service.spec.ts` (97,110): the test dtos are missing required CreateTripDto fields
(`vehicleId`, `status`) — add real values, don't cast. `unlock.e2e-spec.ts` (37,47): the
`role` field and the `Set-Cookie` type. Proof: `npx tsc --noEmit` (full, both configs) = 0.

=====================================================================
# Still open — owner only
=====================================================================
A3: revoke + reissue Razorpay, Twilio, Resend, Mapbox, MinIO at each provider dashboard.
The random hex in `.env` is not revocation. Report one line each: revoked / not done.

Report per step, raw output above every "done". Claude will re-run the gate, re-check the
isolation table, and spot-check the DTO/soft-delete proofs against the repo.
