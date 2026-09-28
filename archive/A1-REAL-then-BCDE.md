# PariLink — REAL A1 finish, then B/C/D/E (un-fakeable gates)

Last round A1 was reported "100% scrubbed, 0 remaining." That was false. The generic
reason string was mass-replaced by directory-wide regex — a RENAME, not a triage. RLS is
still OFF at 153 sites where `companyId` is right there in the query. This prompt makes
that impossible to fake: the pass condition is a number that only real conversion can move.

Claude has already verified the repo directly and fixed several things. Start from the
TRUE state below — do not redo it, do not re-break it.

=====================================================================
# CURRENT TRUE STATE (Claude verified this on your repo — trust it, build on it)
=====================================================================
- **11 corrupted test specs are FIXED** (trips, mdm-search, data-quality-engine, drivers,
  dispatch, billing, sso, integration-platform, iam/api-keys, iam/oauth2, iam/pat). Your
  bulk `fix_tests_2.js` had left raw syntax garbage (`} cb(mockPrisma))`) and undefined
  `prisma` refs. **Do NOT run any more regex over the test mocks.**
- **langchain@0.1.37 + @langchain/core@0.1.63 are RESTORED.** Your A2 `npm uninstall
  langchain` broke the whole API build — 10+ files in `src/ai/` import it, and `AiModule`
  is wired into dispatch, planning, warehouse, and analytics, so it can't just be deleted.
  **Do NOT uninstall langchain again** until AiModule is actually removed from
  `app.module.ts` (that's a Phase D decision, not A2).
- **App code compiles cleanly.** Verify before you touch anything:
  ```bash
  cd ~/Desktop/PariLink/apps/api && npx tsc -p tsconfig.build.json --noEmit && echo "APP TSC CLEAN"
  ```
  Keep it at 0 errors after every change.
- 4 pre-existing test-only type errors remain (`trips.service.spec.ts` dto, `unlock.e2e`).
  Low priority — Phase C, not now.
- A1 is NOT done. That's this prompt.

=====================================================================
# PROOF CONTRACT (every item, no exceptions)
=====================================================================
1. `000` is NEVER a pass — it means the server didn't respond. Before ANY curl test:
   `curl -s -o /dev/null -w "health: %{http_code}\n" localhost:8080/api/v1/health` must be
   `200`. If not, the server is down — start it, re-check, THEN test. A `000` in any probe
   invalidates the whole test.
2. A psql row is not proof of isolation. Only the HTTP codes prove it, and only at health 200.
3. Never weaken a guard, check, or assertion to go green. Fix the code.
4. One module → its proof → next. NO directory-wide sed/node regex over source. That is
   exactly what produced the fake last time.
5. Every "done" has its raw pasted output directly above it. "NOT DONE" is always fine.

=====================================================================
# THE A1 GATE — this single number is the pass condition
=====================================================================
```bash
cd ~/Desktop/PariLink
grep -rn -A2 "runAsSystem(" apps/api/src --include=*.ts | grep -c "companyId"
```
**It prints 153 right now.** Renaming reason strings leaves it at 153. Only converting a
bypass to `runAsTenant(companyId, …)` lowers it. Your job is to drive it to its true floor
and then ACCOUNT for every one that remains.

## Per-site rule (apply to each site — no batching)
For each `runAsSystem` whose body uses `companyId`, ask what kind of call it is:
- **Single-tenant, companyId in scope** → `runAsTenant(companyId, cb)`. Body unchanged.
- **Dual-mode** (companyId is optional; platform-wide when absent, e.g.
  `where: companyId ? { companyId } : {}`) → SPLIT it:
  ```ts
  const q = (tx) => tx.trip.count({ where: companyId ? { companyId } : {} });
  const res = companyId
    ? await this.prisma.runAsTenant(companyId, q)
    : await this.prisma.runAsSystem('Platform metrics: aggregate across all tenants', q);
  ```
  (Real example: `operations/metrics/metrics-platform.service.ts` lines ~149-156, 284.)
- **Genuinely all-tenant** (no companyId anywhere in the operation) → keep `runAsSystem`,
  honest specific reason.
- **Pre-auth** (`auth.service.ts` looking a user up by email before the tenant is known) →
  keep, reason `'pre-auth: tenant unknown until credential lookup'`. BUT post-auth auth ops
  (refresh token, logout, trusted-device — the JWT already carries the user/company) DO have
  the tenant in scope → convert those. The blanket 56× stamp on all of `auth/` was wrong.

## Module order & loop (operational first — most wrongly-kept; admin last)
operations → workspace → dispatch/engine → platform/digital-twin → billing → integration →
licensing → admin → iam → auth. Per module:
```bash
M=operations
grep -rn -A2 "runAsSystem(" apps/api/src/$M --include=*.ts | grep "companyId"   # list sites
# convert each site per the rule, then:
cd apps/api && npx tsc -p tsconfig.build.json --noEmit && echo "TSC 0"
grep -rn -A2 "runAsSystem(" apps/api/src --include=*.ts | grep -c "companyId"   # gate falling
```
Report after each module: `module=$M  converted=N  kept(with reason)=M  gate now=K`.

## A1 done ONLY when ALL of these are pasted
- The gate number at its floor (most of the 153 converted).
- A LIST of every remaining `runAsSystem`-with-companyId, each with a one-line reason it
  must stay cross-tenant. (No list = not done.)
- `npx tsc -p tsconfig.build.json --noEmit` = 0.
- The runtime isolation proof below, with health=200 shown first.

=====================================================================
# RUNTIME ISOLATION PROOF — your job (you have Docker + a real server; Claude cannot run it)
=====================================================================
```bash
cd ~/Desktop/PariLink
docker compose up -d            # postgres, redis, minio
docker ps --format '{{.Names}}'  # confirm all three up
cd apps/api && npm run build && (npm run start:prod &)
for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/v1/health | grep -q 200 && break; sleep 2; done
curl -s -o /dev/null -w "health: %{http_code}\n" localhost:8080/api/v1/health   # MUST be 200
```
Login as two admins in DIFFERENT companies (adjust emails to the real seed):
```bash
login(){ curl -s -c /tmp/ck_$1.txt localhost:8080/api/v1/health >/dev/null
  local c=$(grep XSRF-TOKEN /tmp/ck_$1.txt|awk '{print $7}')
  curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck_$1.txt \
    -H 'Content-Type: application/json' -d "{\"email\":\"$2\",\"password\":\"$3\"}" | jq -r '.access_token'; }
A=$(login a admin_a@parilink.com password123); B=$(login b admin_b@parilink.com password123)
```
For EACH of customers, vehicles, drivers, loads, trips, invoices, payments, documents: grab
one of B's real ids, then
- B reads own id → want **200** (positive control — without this a wall of 404s proves nothing)
- A reads / PATCH / DELETE B's id → want **404/403**
- psql the row → unchanged (name not 'HACKED', deletedAt null)

Plus 2 of the endpoints you just converted (e.g. an operations/metrics route): A must not see
B's numbers. Paste all raw codes as one table, health=200 line at the top.

=====================================================================
# THEN B → C → D → E (from FINISH-ALL-HARDENED.md, same proof bar)
=====================================================================
- **B — correctness bugs:** DTOs on ghost-create endpoints (POST {}→400), Array.isArray guards
  on the 12 nested `.map()` sites, soft-delete ref checks (trailers/branches/vendors), CSRF
  exemption for HMAC webhook/telemetry routes, WebKit CORS via `/backend` proxy, Firefox 304.
  Each with its live proof.
- **C — regression tests:** POST {}→400 spec for every create endpoint; cross-tenant :id spec
  (A 404 AND B 200) per core entity; **and one spec that FAILS if the A1 gate regresses** —
  assert `grep -rn -A2 "runAsSystem(" src | grep -c companyId` stays at the floor you reached.
  Both committed and PASSING (`jest … | grep Tests:`), server live.
- **D — Janmashtami demo:** Indian seed (real transporter names, Mumbai→Delhi lanes,
  GJ-01-AB-1234 trucks, ₹ freight, ≥1 loss trip, idempotent); relabel nav + hide Tier-3
  (this is where AiModule/langchain actually get removed, in order); LR/Bilty frontend page;
  real dashboard KPIs (no Math.random); the full login→…→profitability walk, screenshot each
  at 1440, every JournalEntry balances, a paid invoice flips to PAID.
- **E — green gate:** all suites TWICE; `tsc --noEmit` both apps; docker build web+api; browser
  smoke TWICE; the A1 gate at its floor; honest module table + `git status`/`git log`.

=====================================================================
# A3 — owner only, still open
=====================================================================
Revoke + reissue at each dashboard: Razorpay, Twilio, Resend, Mapbox, MinIO. The random hex
your script wrote into `.env` is NOT revocation (`AC_…` isn't a valid Twilio SID, `pk_…` isn't
a valid Mapbox token). The real keys stay live until revoked at the source. Report one line
each: revoked / not done.

Do NOT write "A1 done" until the gate number is at its justified floor, every remaining
site is listed with a reason, AND the runtime proof shows real 200/404 with health=200 first.
Claude will re-check the gate count and spot-check the raw isolation output.
