# PariLink — runAsSystem triage (Section 1b, for Antigravity)

Isolation, RBAC, storage, and SSO are proven. The remaining tenant-isolation risk is
the ~423 `runAsSystem(...)` calls that still carry the generic reason
`'System operation or legacy bypass'`. Each one turns RLS OFF. Some genuinely need to
cross tenants; most are accidents where `companyId` was right there. This phase makes
every bypass intentional and auditable.

## The goal (not "convert all 423")
Some `runAsSystem` calls are legitimate (a webhook figuring out which company an
external event belongs to; admin/platform operations that truly span tenants). The
target is: **ZERO calls left with the generic string.** Every `runAsSystem` must end up
as one of:
- **Converted** to `runAsTenant(companyId, ...)` — because `companyId` was in scope and
  the operation is single-tenant (this is the majority), OR
- **Kept, with a SPECIFIC reason** describing why it must cross tenants
  (e.g. `runAsSystem('webhook: resolve company from provider signature', ...)`).

When `grep "System operation or legacy bypass"` returns nothing, this phase is done.

## Carry-over rules (same as Section 1)
One module at a time, prove it, then the next. Never weaken a guard or a test to go
green. Converting must preserve behavior — if a query used a `companyId` from the
request, `runAsTenant` uses that same value. Paste raw output. "NOT DONE" is fine;
a false "all triaged" is not.

## The classification rule (apply per call site)
```bash
# for a given module, list its bypass call sites with surrounding context
grep -rn -B3 -A2 "runAsSystem('System operation or legacy bypass'" apps/api/src/<module> --include=*.ts
```
At each site, ask ONE question: **is `companyId` (or a tenant id) already in scope?**
- YES  → it's an accidental bypass. Convert: `runAsSystem('...', cb)` →
  `runAsTenant(companyId, cb)`. (The callback body is unchanged.)
- NO, and it truly needs all tenants → keep `runAsSystem` but replace the generic
  string with a specific reason.
- NO, and it operates on ONE tenant but companyId isn't threaded in → thread the
  companyId through from the caller, then convert. (Don't leave it bypassed just
  because the plumbing is missing.)

## Module order — operational first (least justified), admin last
Do them in this order and report after each group:
1. **Operational (convert aggressively):** fleet, dispatch, trips, loads, warehouse,
   vehicles, drivers, documents, communications, reporting, workflow, marketplace,
   integrations, telemetry, finance, invoices, payments, optimization, maintenance.
2. **Platform/shared (review carefully):** operations, platform, data-lifecycle.
3. **Admin/cross-tenant (mostly keep, re-justify):** admin, iam, saas, auth, licensing.
   These often legitimately span tenants — keep most, but give each a specific reason.

## Per-module loop
```bash
M=fleet   # example
grep -rn -B3 -A2 "System operation or legacy bypass" apps/api/src/$M --include=*.ts
# classify + edit each site, then:
cd apps/api && npm run build 2>&1 | tail -3     # must stay green
# re-run the Section 1 isolation probe for that module's entity to prove no regression
```
After a module, paste: how many sites it had, how many converted vs re-justified, the
build result, and (for entities with an endpoint) the isolation probe still showing
A→404 / B→200.

## Batch reporting — do NOT claim all 423 in one message
After each pass, report a running tally:
```
converted so far: N   re-justified: M   remaining generic: (423 - N - M)
```
Keep going in passes until remaining generic = 0. It's fine — expected — for this to
take several passes.

## Final proof (the phase is done only when ALL of these hold)
```bash
# 1. zero generic-reason bypasses left
grep -rc "System operation or legacy bypass" apps/api/src --include=*.ts | grep -v ':0' | head
#    ^ should print NOTHING
# 2. every remaining runAsSystem has a specific reason — list them for the record
grep -rho "runAsSystem(\s*'[^']*'" apps/api/src --include=*.ts | sort | uniq -c | sort -rn
# 3. build clean
cd apps/api && npm run build 2>&1 | tail -3
# 4. the full 8-entity isolation test STILL passes (no regression) — re-run /tmp/iso-test.sh
bash /tmp/iso-test.sh
# 5. api e2e suites still green
npx jest --config test/jest-e2e.json test/auth.e2e-spec.ts test/integrations-security.e2e-spec.ts test/soft-delete-references.e2e-spec.ts 2>&1 | grep -E "Tests:|Suites:"
```
Paste all five. Report the final count: total runAsSystem, how many converted to
runAsTenant, how many kept with a specific reason, and confirm zero generic ones remain.

## Reminder — the item no code can close
The five provider keys (Razorpay, Twilio, Resend, Mapbox, MinIO) are still live in git
history until revoked at each dashboard. That stays the top P0 and only the owner can
do it.
