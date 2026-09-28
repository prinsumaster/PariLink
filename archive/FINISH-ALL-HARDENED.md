# PariLink — FINISH (hardened): the whole remaining backlog + un-fakeable proof

You keep declaring work "green" that was not verified. Last round every isolation
result was `000` (server down — the test never ran) and it was reported as "strictly
green." That stops now. This prompt has a PROOF CONTRACT you must satisfy on every
item. Speed is not the goal; a true, verified finish is.

=====================================================================
# PROOF CONTRACT — read fully, applies to EVERY item below
=====================================================================
1. **`000` is NEVER a pass. It means the server did not respond.** Before ANY
   curl-based test, confirm the API is live:
   ```bash
   curl -s -o /dev/null -w "health: %{http_code}\n" localhost:8080/api/v1/health
   ```
   If that is not `200`, the server is DOWN. `npm run start:prod`, wait for
   "Nest application successfully started", re-check health, THEN test. If any probe
   in a test prints `000`, the whole test is INVALID — restart and rerun. Do not
   interpret `000` as anything except "test did not run."
2. **A psql row is not proof of isolation.** The DB row printing means the record
   exists — it says NOTHING about whether the API blocked cross-tenant access. Only
   the HTTP codes prove that, and only when health is `200`.
3. **Never weaken a guard, a check, or a test assertion to go green.** (You did this
   once: `expect(permissions)` → `expect(permissions || [])`.) If a test fails, the
   fix is the code, never the assertion.
4. **One item, one proof, then the next. No batching.** Do NOT edit six modules and
   then run one test. After each module/fix, rebuild AND run its proof with a live
   server. If you batched and the test is `000`, you have no idea which of the six
   broke something.
5. **A `runAsSystem` → `runAsTenant` conversion needs TWO proofs, not one:**
   (a) isolation still holds (A→404, B→200, live server), AND
   (b) the converted operation STILL FUNCTIONS and lands in the right tenant — because
   passing the wrong `companyId` would break it silently. Trigger the operation and
   show it works.
6. **Every "done" line must have its pasted real output directly above it.** No
   summary table claims a pass unless the raw proof for it appears above. "NOT DONE"
   is always acceptable and always better than a false green.

=====================================================================
# PHASE A1 (finish) — runAsSystem triage, Pass 3+
=====================================================================
First: **re-verify Pass 1 & 2 for real.** Bring the server up (health=200) and run
`/tmp/iso-test.sh`. Paste REAL codes (200/404). Then functionally spot-check two
converted modules — run `POST /simulator/start` and create a chat notification — and
show they succeed AND write to the correct companyId (SQL the created row's companyId).
If any conversion regressed, fix it before Pass 3.

Then Pass 3 across the remaining ~301: operations, common, iam, data-lifecycle,
api-platform, saas, companies. These are admin/platform-heavy, so MORE of them are
legitimately cross-tenant — expect to re-justify (specific reason string) more than you
convert here. Rule unchanged: `companyId` in scope → convert; genuinely all-tenant →
specific reason; single-tenant but companyId not threaded → thread it, then convert.

Per module: edit → `npm run build` (exit 0) → server up (health 200) → the module's
isolation/functional proof. Report the running tally each pass:
`converted: N   re-justified: M   remaining generic: (grep count)`.
DONE only when: `grep -rn "System operation or legacy bypass" apps/api/src` prints
NOTHING, build is clean, and `/tmp/iso-test.sh` shows real 200/404 across all 8 entities.

=====================================================================
# PHASE A2 — dependency highs
=====================================================================
`npm audit --workspace=apps/api|tail -3` and web. Fix non-breaking. Remaining highs are
Tier-3 (langchain/deck.gl/docusaurus) — after Phase D hides those modules, remove the
deps and re-audit. Paste before/after.

# PHASE A3 — (owner) revoke Razorpay/Twilio/Resend/Mapbox/MinIO. Not code.

=====================================================================
# PHASE B — Correctness bugs (each with its live proof)
=====================================================================
B1. DTOs on ghost-record creates: `/trailers`, `/support/ticket`,
    `/fleet/lifecycle/onboard`, `/vehicles/compliance/registration/:id`,
    `/ai/copilot/sessions`. Proof each (server live): POST {} → 400, valid → 2xx.
B2. Re-run the live DTO scan (swagger POST paths at `localhost:8080$path`, not
    double-prefixed). Every 500-on-`{}` gets a DTO/guard → 400. Proof: scan shows 0×500.
B3. `Array.isArray` guards on the 12 nested `.map()` sites (invoice-detail-view:111,
    order-detail-view:87, loads/[id]:359, customer-detail-view:100,
    warehouse-detail-view:81, ExecutionCenter:103, anomaly-log:101,
    notification-center:133, document-viewer:70, marketplace/install:46, chat:251,
    traces:54). Proof: each screen renders with API returning `[]`.
B4. Soft-delete ref checks on trailers/branches/vendors (mirror customers). Proof each:
    delete with a dependent → 409; without → 200 (server live).
B5. Exempt `ingress/telemetry` + webhook routes from `csrf.middleware.ts` (HMAC-authed).
    Proof: external-style POST (no cookie, valid signature) → 202/200, not 403.
B6. Point web API client at the same-origin `/backend` proxy. Proof:
    `npx playwright test tests/smoke.spec.ts --project=webkit` → 0 CORS errors.
B7. Widen `smoke.spec.ts:114` to accept 304. Proof: firefox smoke passes.

=====================================================================
# PHASE C — Regression tests
=====================================================================
C1. Delete broken `apps/api/test/dto-coverage.e2e-spec.ts`.
C2. Spec: POST {} → 400 for every create endpoint (documented skip list).
C3. Spec: cross-tenant :id → A 404/403 AND B 200 (positive control) per core entity.
    Proof: both committed and PASSING (`jest ... | grep Tests:`), server live.

=====================================================================
# PHASE D — Demo readiness (Janmashtami)
=====================================================================
D1. Indian seed data: real transporter names, lanes (Mumbai→Delhi, Pune→Nagpur,
    Ahmedabad→Surat), truck numbers (GJ-01-AB-1234), ₹ freight, ≥1 loss trip.
    Idempotent. Proof: seed twice, counts identical; Profitability shows Indian lanes.
D2. Relabel nav (Loads→Booking, Ledger→Accounts, add LR/Bilty + Profitability); hide
    AI Platform, Marketplace, SRE, Command Center, Automation, Messaging. Proof: web
    tsc=0; sidebar screenshot; every visible item renders.
D3. LR/Bilty frontend page (list + generate-from-booking + Print). Proof: create + print
    an LR from the UI.
D4. Transporter dashboard: real KPIs from DB (no Math.random). Proof: 2 tiles match SQL;
    screenshot 1440.
D5. E-Way/GST: show real or hide — never a fake portal button.
D6. The walk (server + web live): login→dashboard→customers→fleet→booking→LR→dispatch→
    trip→delivery/POD→invoice→payment→accounts→profitability. Screenshot each at 1440,
    open each, confirm real rows. Finance integrity: every JournalEntry balances (0 rows
    where sum(debit)≠sum(credit)); fully-paid invoice → PAID.

=====================================================================
# PHASE E — Final green gate (all must hold at once)
=====================================================================
- Server live (health 200) for every runtime proof.
- All suites TWICE: auth, dto-validation, integrations-security, soft-delete, multi-
  tenant, LR, + the 2 new regression specs. Paste both runs.
- `tsc --noEmit` both apps = 0. `docker compose build web`+`api` = 0. Container /login
  200 + 3 static assets 200.
- Browser smoke TWICE, Chromium green both.
- `grep -rc "System operation or legacy bypass" apps/api/src` → nothing.
- Honest table: module · verified · demo-ready · known issues. `git status --short`,
  `git log --oneline -10`.

Do NOT write "ready to ship" until A1 shows zero generic bypasses (proven on a live
server) AND the five keys are revoked. Report per phase; I will spot-check the raw proof.
