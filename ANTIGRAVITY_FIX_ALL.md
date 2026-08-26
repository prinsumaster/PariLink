# PariLink — full security & bug remediation (hand to Antigravity)

This is the consolidated finding list from a complete external audit of PariLink,
verified on real hardware across many rounds. Fix it in the order below.

## Ground rules (the owner's, and they are not optional)
- **Do ONE item at a time. Fix it, PROVE it with pasted raw output, then the next.**
  Batching has left this repo unverifiable twice.
- **Do not trust any prior "fixed" report** — including this file's "already done"
  list — without re-proving. Verify against a production-style build + real DB.
- A 404 without a **positive control** proves nothing. Where isolation is claimed,
  show A→404/403 AND B→200 on the same record.
- Never: weaken a guard, edit a test's expectation to match broken behaviour,
  delete a failing route/spec to go green, fake data / Math.random, or hardcode.
- If an item won't go green, STOP and report. "NOT DONE" is always acceptable.
- Method for each real vuln: find → root cause → attack test → run against the
  real server → verify DB/storage state → rebuild → rerun → document.

## ALREADY FIXED & VERIFIED — do NOT redo (re-prove only if you touch them)
- Telemetry ingress IDOR: unconditional secret + `timingSafeEqual` + `runAsTenant`.
  Proven (missing-secret install → 401).
- Money DTOs validate: `finance/ledger/entries`, `vendors/purchase-orders`,
  `finance/wallet/expenses`, `saas/billing/checkout` — POST {} → 400, valid payload
  reaches business logic (positive control passed).
- Build + Docker image build; `apps/api` builds; web app-source typechecks (0).
- Suites green: auth 7/7, integrations-security 10/10, dto-validation 18/18,
  soft-delete-references 4/4. Seed idempotent, lands in admin's company.
- Password/seed mismatch fixed; standalone assets confirmed in the image.

## JUST APPLIED to the repo (verify with `git diff`, do NOT redo)
- `apps/api/src/integrations/webhooks/webhook.controller.ts` — removed the rawBody
  re-serialization fallback in the HMAC check; now fails closed (no rawBody → 401).
- `apps/web/Dockerfile` — removed both silent-failure escapes (`... || npm install
  --legacy-peer-deps` at line 19, `npx tsc || true` at line 30).
Verify: `git diff apps/web/Dockerfile apps/api/src/integrations/webhooks/webhook.controller.ts`,
then confirm `docker compose build web` still exits 0. These are done — do not repeat them.

=====================================================================
# SECTION 1 — P0 SECURITY (ship-blockers)
=====================================================================

## 1.1 — Leaked secrets (HUMAN action required — code can't finish this)
`.env.bak` (21 real credentials incl. JWT_PRIVATE_KEY, MASTER_ENCRYPTION_KEY_V1/V2,
POSTGRES_PASSWORD, RAZORPAY_KEY_SECRET, TWILIO_AUTH_TOKEN, RESEND_API_KEY,
MAPBOX_TOKEN, MINIO_SECRET_KEY) was committed. `token.json` and
`apps/web/tests/.auth/user.json` too. They were untracked from HEAD in commit
`b829b1f`, but the values are STILL in git history and STILL LIVE at the providers.
- Confirm untracked: `git ls-tree -r HEAD --name-only | grep -E '\.env\.bak|token\.json|\.auth'` → empty.
- **REVOKE + REISSUE at each provider**: Razorpay, Twilio, Resend, Mapbox, MinIO.
  Put new values only in the untracked `.env`. One line each: done / not done.
- Purge history: `git filter-repo --path .env.bak --path token.json --invert-paths`
  then rotate the platform secrets (JWT keys, encryption keys) too, since they
  leaked. Only do the history rewrite if you can coordinate the force-push.

## 1.2 — Vulnerable dependencies (`npm audit`: apps/api 1 critical + 14 high)
- **passport-saml@3.2.4** on the live SSO path (`apps/api/src/auth/sso/saml.service.ts`)
  pulls vulnerable `xml-crypto@2.1.6` → `@xmldom/xmldom@0.7.13` (signature-verification
  / XML-injection advisories, "no fix available" transitively). Migrate to
  `@node-saml/passport-saml` v5 (breaking API — test SSO login after). If SSO is not
  in the demo/pilot scope, disable the SSO module and remove the dep entirely.
- `npm audit --workspace=apps/api` and `--workspace=apps/web`: fix the critical +
  highs that are NOT breaking (`npm audit fix`), and list what's left needing
  `--force`. Many highs live in Tier-3 deps (langchain, deck.gl, docusaurus) — if
  you hide those modules (MASTER_PLAN Phase 2), remove the deps and the vulns go too.
- PROOF: paste `npm audit --workspace=apps/api | tail -3` before and after.

### Login helper (used by 1.3, 1.4, and the LR proof)
```bash
cd ~/Desktop/PariLink
login(){ curl -s -c /tmp/ck_$1.txt localhost:8080/api/v1/health >/dev/null
  local c=$(grep XSRF-TOKEN /tmp/ck_$1.txt|awk '{print $7}')
  curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck_$1.txt \
    -H 'Content-Type: application/json' -d "{\"email\":\"$2\",\"password\":\"$3\"}" | jq -r '.access_token'; }
A=$(login a admin_a@parilink.com password123)   # tenant-a admin (adjust email if seed differs)
B=$(login b admin_b@parilink.com password123)   # tenant-b admin
curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $A" | jq '.companyId'
curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $B" | jq '.companyId'   # must differ
```

## 1.3 — Prove tenant isolation across the core entities  (owner priority #3)
Multi-tenant SaaS: Company A must never touch Company B's data. For EACH of
customers, vehicles, drivers, loads, trips, invoices, payments, documents — grab one
of B's real record ids, then attack it as A. Required: A→404/403 on read/update/delete
AND B→200 on its own (positive control) AND the DB row stays intact. Template (customers,
repeat per entity, fixing path + table name):
```bash
BID=$(curl -s localhost:8080/api/v1/customers -H "Authorization: Bearer $B" | jq -r '.data[0].id')
curl -s -o /dev/null -w "  B reads own: %{http_code}\n" localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $B"
curl -s -o /dev/null -w "  A reads  B:  %{http_code}\n" localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A"
curl -s -o /dev/null -w "  A PATCH  B:  %{http_code}\n" -X PATCH localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A" -H "Content-Type: application/json" -d '{"name":"HACKED"}'
curl -s -o /dev/null -w "  A DELETE B:  %{http_code}\n" -X DELETE localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A"
psql -U parilink -d parilink_db -h localhost -c "SELECT id,name,\"deletedAt\" FROM \"Customer\" WHERE id='$BID';"
```
Paste the table for all 8. Any A→2xx, or a changed/deleted DB row, is a CRITICAL tenant
IDOR — fix it before anything else. Also: `curl .../customers -H "Bearer $A" | jq '[.data[].companyId]|unique'`
must show only A's company.

## 1.4 — Prove RBAC is real  (owner priority #4)
RBAC is real in code (`Role.permissions` JSON array; colon perms like `finance:write`,
`dispatch:read`; seed only makes SUPER_ADMIN `['*']`). Create a DISPATCHER and an
ACCOUNTANT role+user in Company A (use the real create-user route/role names from the
code), then prove the walls:
```bash
DISP=$(login disp disp_a@parilink.com password123); ACCT=$(login acct acct_a@parilink.com password123)
echo "dispatcher SHOULD reach ops (2xx):"
curl -s -o /dev/null -w "  loads: %{http_code}\n" localhost:8080/api/v1/loads -H "Authorization: Bearer $DISP"
echo "dispatcher must NOT reach finance/admin (403):"
curl -s -o /dev/null -w "  invoices: %{http_code}\n" localhost:8080/api/v1/finance/invoices -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  ledger:   %{http_code}\n" -X POST localhost:8080/api/v1/finance/ledger/entries -H "Authorization: Bearer $DISP" -H "Content-Type: application/json" -d '{}'
curl -s -o /dev/null -w "  make-user:%{http_code}\n" -X POST localhost:8080/api/v1/admin/users/invite -H "Authorization: Bearer $DISP" -H "Content-Type: application/json" -d '{}'
```
A dispatcher reaching finance/user-admin with anything but 401/403 is an RBAC bypass.

## 1.5 — Storage (MinIO) tenant isolation  (owner priority #7)
Attack test: as Company A, try to fetch/download Company B's document by id and by
direct object key. Must be 403/404, never the file.
```
# A requests B's document
curl -s -o /dev/null -w "A gets B doc: %{http_code}\n" localhost:8080/api/v1/documents/$B_DOC_ID -H "Authorization: Bearer $A"
```
Confirm object keys are namespaced by companyId and the download path re-checks
ownership (not just a signed URL anyone can replay).

## 1.6 — Triage the 449 RLS bypasses
`grep -rho "runAsSystem(\s*'[^']*'" apps/api/src --include=*.ts | sort | uniq -c`
→ 448 share the auto-generated string `'System operation or legacy bypass'`. Mitigating
fact: ZERO services call Prisma directly (all go through runAsTenant/runAsSystem), so
the data layer is the boundary — but 448 identical bypasses is a migration that
painted over it, not 448 decisions. Triage, don't rewrite:
- Classify each into genuinely-cross-tenant (keep, give a real reason) vs
  accidentally-bypassed (convert to `runAsTenant(companyId, …)`).
- Start with NON-admin modules (telemetry, integrations/sync, billing, marketplace).
  Admin services legitimately span tenants; operational ones should not.
- PROOF: after converting a module, re-run the Part A isolation test for its entity.

=====================================================================
# SECTION 2 — CORRECTNESS BUGS
=====================================================================

## 2.1 — Endpoints that accept an empty body and create ghost records
The live-server scan found ~27 POST routes returning 200/201 on `{}`. Most are
Tier-3 (ai/*, operations/*, platform/*, sandbox) — hide those modules. The ones that
create real ghost rows and need a class-validator DTO now:
`POST /trailers`, `POST /support/ticket`, `POST /fleet/lifecycle/onboard`,
`POST /vehicles/compliance/registration/:vehicleId`, `POST /ai/copilot/sessions`.
- Fix: add a DTO so required fields are enforced. PROOF per endpoint: POST {} → 400,
  valid payload → 2xx.

## 2.2 — Endpoints that CRASH (500) on an empty body
~19 POST routes 500 on `{}` (e.g. `finance/expenses`, others from the scan). A 500 on
a missing field is a bad-input bug and can leak a stack. Add DTOs / input guards so
they return 400. Re-run the live scan (below) and confirm 0 × 500.

## 2.3 — Unguarded `.map()` over API data (frontend crashes)
65 sites map over API-derived data with no `Array.isArray` guard; the nested-relation
ones crash when the API returns the parent without the child array. Fix these 12 on
the demo path FIRST (`Array.isArray(x) ? x.map(...) : <EmptyState/>`):
`components/finance/invoice-detail-view.tsx:111` (invoice.lineItems),
`components/orders/order-detail-view.tsx:87` (order.items),
`app/(dashboard)/loads/[id]/page.tsx:359` (load.invoices),
`components/crm/customer-detail-view.tsx:100` (customer.contacts),
`components/wms/warehouse-detail-view.tsx:81` (warehouse.zones),
`components/automation/ExecutionCenter.tsx:103` (exec.steps),
`components/alip/anomaly-log.tsx:101` (anomaly.affectedEntities),
`components/notifications/notification-center.tsx:133` (notif.channels),
`components/documents/document-viewer.tsx:70` (document.tags),
`app/(dashboard)/admin/marketplace/[appId]/install/page.tsx:46` (app.permissions),
`app/(dashboard)/chat/page.tsx:251` (group.messages),
`app/(dashboard)/operations/traces/page.tsx:54` (span.children).
PROOF: each screen renders with the API returning `[]` / the relation omitted.

## 2.4 — Soft deletes with no reference check
`trailers`, `branches`, `vendors` delete unconditionally (customers/loads/trips/
drivers correctly check dependents — mirror them). PROOF per entity: delete with a
dependent row → 409; without → 200.

## 2.5 — Webhook signature re-serialization fallback  ✅ ALREADY APPLIED
`apps/api/src/integrations/webhooks/webhook.controller.ts` — the rawBody fallback is
already removed (fails closed now). Just confirm via `git diff`; do not redo.

## 2.6 — CSRF blocks external webhooks / telemetry (they can't call you)
Confirmed: `ingress/telemetry` and the webhook routes require an XSRF token (they
return 403 without it), so a real IoT provider / payment webhook can NEVER call them.
These are HMAC/secret-authenticated, not browser flows. Exempt the webhook + ingress
paths from `csrf.middleware.ts` (keep CSRF on the browser API). PROOF: external-style
POST (no cookie, valid signature) → 202/200, not 403.

## 2.7 — WebKit/Safari cannot reach the API (CORS)
The web client calls `http://localhost:8080/api/v1` directly (`NEXT_PUBLIC_API_URL`),
so every request is cross-origin; Chromium tolerates it, WebKit blocks all 111.
`next.config.ts` already defines a same-origin `/backend/:path*` proxy. Point the API
client at `/backend` so requests are same-origin (kills CORS, fixes Safari, matches
prod ingress). PROOF: `npx playwright test tests/smoke.spec.ts --project=webkit` → 0
CORS errors.

## 2.8 — Firefox smoke assertion is too strict (test defect)
`apps/web/tests/smoke.spec.ts:114` fails on `304 Not Modified` because
`response.ok()` is true only for 200–299. 304 is a correct cached response. Widen to
`expect(response?.ok() || response?.status() === 304, ...)`. This is fixing a wrong
belief about HTTP, NOT editing a test to hide a bug — do not remove the route.

=====================================================================
# SECTION 3 — BUILD & TEST HYGIENE
=====================================================================

## 3.1 — Dockerfile silent-failure fallbacks  ✅ ALREADY APPLIED
`apps/web/Dockerfile` — both `||` escapes already removed. Confirm via `git diff`;
PROOF that it still builds: `docker compose build web` → exit 0.

## 3.2 — Broken always-red spec
`apps/api/test/dto-coverage.e2e-spec.ts` (the in-process version) always fails — a
committed red spec. Delete it; the live-server bash scan below is the real tool.

## 3.3 — Re-run the real DTO scan, fix the create subset
Run the corrected live scan (hits `localhost:8080$path` from swagger.json — NOT
double-prefixed). Paste the status breakdown and the 200/201 list. Fix only the
genuine create endpoints from 2.1; confirm the 500s from 2.2 are gone.

## 3.4 — Two regression specs that would have caught most of this
Add and commit (green):
1. `POST {} → 400` for every create endpoint (from the swagger POST list, minus
   auth/webhook/ingress with a documented skip list).
2. cross-tenant access → 403/404 for every `:id` core route, WITH a positive control.
These two would have caught the ghost-records, the isolation gaps, and the DTO holes.

## 3.5 — Green gate
All suites TWICE back-to-back (auth, dto-validation, integrations-security,
soft-delete-references, multi-tenant, + new regression specs, + LR spec). Both
`tsc --noEmit` = 0. `docker compose build web` + `api` = 0. Container: /login 200 +
3 static assets 200. Browser smoke TWICE, Chromium green both. Paste every summary.

=====================================================================
# SECTION 4 — Finish the LR / Bilty module (backend already written)
=====================================================================
The LR backend was just committed: `apps/api/src/lorry-receipts/*`, schema models
`LorryReceipt` + `LrSequence`, wired in `app.module.ts`. Bring it live and prove it:
```
cd apps/api && npx prisma generate && npx prisma migrate dev --name add_lorry_receipt
npx tsc --noEmit          # must be 0 — this is the real test of the new code
```
Then prove: POST {} → 400; create from a loadId → 201 with an `lrNumber`; fire 5
concurrent creates → 5 DISTINCT numbers (race-safe); `GET /:id/print` renders the
Bilty; B cannot read A's LR (404/403). Then build the frontend "LR / Bilty" page and
add it to nav (MASTER_PLAN Phase 1.5 / Phase 2).

=====================================================================
# SECTION 5 — Honest close-out
=====================================================================
- E-Way Bill & GST are STUBS (mock gateway, tax-rules table only) — never present
  government filing as working. Show real data or hide. (MASTER_PLAN Phase 6.)
- Final honest table: module · verified · demo-ready · known issues ("Unknown" is
  valid for untouched modules). Then `git status --short` and `git log --oneline -8`.

## Priority if the clock runs out
1.1 (revoke keys) → 1.3/1.4 (isolation+RBAC proofs) → 2.3 (demo-path crashes) →
2.6/2.7 (webhooks + Safari) → Section 4 (LR live) → the rest. Everything through
there makes a real, safe pilot; the long tail (1.6 full triage, all 27/19 endpoints)
continues after.
