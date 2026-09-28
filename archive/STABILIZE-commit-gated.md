# PariLink — STOP. Stabilize and COMMIT. Short steps, not a loop.

This round REGRESSED the repo. The A1 security work (two rounds of it) was never committed and
got wiped by your git/reset operations — the old `'System operation or legacy bypass'` bypasses
are back, the gate is at 140 (was 82), LorryReceipt is missing from the schema and masked with
`(tx as any)` casts, langchain is broken, and there's a stuck `.git/index.lock`. Durable RLS
(P0-1) was never touched.

The cause is running long autonomous loops and never committing. So:

## HARD RULES (this replaces the "one hour loop" format)
1. **COMMIT after EVERY step below**, with a real message. Uncommitted work does not exist —
   it got wiped once already. `git add -A && git commit -m "..."` before moving on.
2. **No `rm -rf node_modules`, no deleting `package-lock.json`** unless a step says to. No
   dependency thrashing — pin exact versions once, install once.
3. **No `as any` and no casts to make `tsc` pass.** If it doesn't compile, the type/schema is
   wrong — fix that, don't hide it.
4. One step, prove it, commit it, then the next. Paste raw output. Do NOT jump ahead.

## STEP 0 — unstick and baseline
```bash
cd ~/Desktop/PariLink
rm -f .git/index.lock
git status --short
```
Commit the current tree as-is FIRST so nothing else is lost: `git add -A && git commit -m
"chore: checkpoint before stabilization"`. Paste the commit hash.

## STEP 1 — stop the langchain thrash (pin once, install once, commit)
Set these EXACT versions in `apps/api/package.json` (they are known-good with the app's
providers) and do a single install:
```
"langchain": "0.1.37", "@langchain/core": "0.1.63",
"@langchain/openai": "0.0.33", "@langchain/anthropic": "0.1.20"
```
```bash
npm install --legacy-peer-deps
cd apps/api && npx tsc -p tsconfig.build.json --noEmit && echo "APP TSC 0"
```
Both must succeed. Commit: `deps: pin langchain 0.1.x, single lockfile`. Paste tsc result.

## STEP 2 — restore LorryReceipt schema, remove the `as any` casts
The LR feature references a Prisma model that isn't in the schema. Recover it:
```bash
git log -p -- apps/api/prisma/schema.prisma | grep -A60 "model LorryReceipt" | head -80
```
If it's in history, restore the `LorryReceipt` + `LrSequence` models and their back-relations
(`lorryReceipts LorryReceipt[]` on Company/Load/Vehicle). If not, reconstruct them from the
fields `lorry-receipts.service.ts` actually uses. Then:
```bash
cd apps/api && npx prisma migrate dev --name restore_lorry_receipt
# remove EVERY (tx as any).lorryReceipt / (this.prisma as any).lorryReceipt cast — the typed
# client now has lorryReceipt. grep to confirm zero casts remain:
grep -rn "as any).lorryReceipt" src && echo "STILL CASTED (bad)" || echo "casts gone"
npx tsc -p tsconfig.build.json --noEmit && echo "APP TSC 0"
```
Commit: `fix: restore LorryReceipt model + migration, remove as-any casts`. Paste the grep + tsc.

## STEP 3 — REDO the A1 triage (it was lost) — commit after EACH module
Gate is back at 140. Same rule as before: `runAsSystem` whose body uses `companyId` →
`runAsTenant(companyId, …)` (single-tenant) or split (dual-mode) or keep with an honest reason
(genuinely cross-tenant / pre-auth). Detector:
```bash
grep -rn -A2 "runAsSystem(" apps/api/src --include="*.ts" | grep -c "companyId"
```
Do it module by module — admin (96 hits — the big one), operations, saas, platform, intelligence,
then the rest. After EACH module: `tsc -p tsconfig.build.json --noEmit` = 0, re-run the detector,
then **commit that module** (`security(a1): convert <module> bypasses to runAsTenant`). This is
non-negotiable this time — commit each module so it can't be wiped. Also restore the old generic
string: `grep -rn "System operation or legacy bypass" apps/api/src` must return nothing.
When done, commit the **C4 lock test** (`isolation gate ≤ floor`) so this can never silently
regress again.

## STEP 4 — durable non-superuser RLS (P0-1, still not done)
Your `ALTER ROLE parilink NOSUPERUSER` was a one-off; `docker compose` recreates `parilink` as a
superuser (bypasses RLS). Fix it permanently: an init script in `docker-entrypoint-initdb.d/` (or
a migration) so the app connects as a NOSUPERUSER/NOBYPASSRLS role on a FRESH db. Prove on a
wiped volume — a manual ALTER can't survive `-v`:
```bash
docker compose down -v && docker compose up -d
# migrate + seed + start (health 200)
psql "$DATABASE_URL" -c "SELECT current_user, rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user;"
#   rolsuper MUST be f  AND rolbypassrls MUST be f
npx jest --config ./test/jest-e2e.json test/isolation.e2e-spec.ts test/cross-tenant.e2e-spec.ts 2>&1 | grep -E "Tests:|PASS|FAIL"
```
Commit: `security: enforce non-superuser app role for RLS`. Paste the role row + test result.

## STEP 5 — runtime isolation proof on the fresh db
health=200 first, then the 8-entity curl table (customers, vehicles, drivers, loads, trips,
invoices, payments, documents): B reads own = 200, A reads/patch/delete B = 404/403, DB row
unchanged. Paste raw codes. Commit any fixes.

## A3 — owner only. STOP faking it.
`AC_50ac…` is random hex again. Do NOT write fake keys into `.env`. Report A3 as
"owner action — NOT done" until the owner revokes at Razorpay/Twilio/Resend/Mapbox/MinIO.

Report per step with its commit hash. Do NOT proceed to Phase D until Steps 0–4 are committed
and green. Claude will pull the commit list and re-check the gate, the app role, and the LR model.
