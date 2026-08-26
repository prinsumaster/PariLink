# PariLink — FINISH: the whole remaining backlog, in order (for Antigravity)

This is the single roadmap to a shippable pilot. Work it TOP-DOWN, one item at a
time, prove each with pasted raw output, then the next. This is more than an hour of
work — do not rush it into a false "all done." Report per phase.

## Rules (all phases)
- One item → its proof (raw output) → next. Never batch a whole phase into one claim.
- Never weaken a guard, a check, or a test assertion to go green. Fix the code.
- A 404 needs a positive control (B→200 on the same record). Empty ≠ proven.
- "NOT DONE" is always acceptable. A false "done" is not.
- After any change: `cd apps/api && npm run build` (or `apps/web`) must stay at exit 0.

## Status coming in (do NOT redo — re-prove only if you touch it)
DONE & verified: build + image, auth/dto-validation/integrations-security/soft-delete
suites, telemetry IDOR fix, money DTOs, LR backend (migrated, isolation passing),
Profitability (cost side proven, path bug fixed), tenant isolation across 8 core
entities (with positive controls), RBAC, storage isolation, SSO migrated to
@node-saml v5, webhook HMAC hardened, Dockerfile `||` fallbacks removed, js-yaml +
nanoid bumped. Two bugs already fixed: Documents 400→404, Payments missing
@RequirePermissions.

=====================================================================
# PHASE A — Security finish
=====================================================================
A1. **runAsSystem triage** — run the separate file `SECTION1b-runassystem-triage.md`
    in full (the 423 generic bypasses → converted or specifically re-justified until
    `grep "System operation or legacy bypass"` returns nothing). This is the largest
    remaining security item; expect several passes. Report the running tally.
A2. **Remaining npm-audit highs** — they're in Tier-3 deps (langchain, deck.gl,
    docusaurus). When Phase D hides those modules, remove the deps and re-audit.
    Paste `npm audit --workspace=apps/api | tail -3` after.
A3. (Owner, not code) revoke Razorpay / Twilio / Resend / Mapbox / MinIO keys.

=====================================================================
# PHASE B — Correctness bugs
=====================================================================
B1. **Ghost-record create endpoints** — add class-validator DTOs so POST {} → 400:
    `POST /trailers`, `/support/ticket`, `/fleet/lifecycle/onboard`,
    `/vehicles/compliance/registration/:id`, `/ai/copilot/sessions`.
    PROOF each: POST {} → 400, valid payload → 2xx.
B2. **500-on-empty endpoints** — re-run the live DTO scan (swagger POST paths hit at
    `localhost:8080$path`, NOT double-prefixed). Add DTOs/guards to every one that
    returns 500 on `{}` so it returns 400. PROOF: the scan shows 0 × 500.
B3. **Frontend crash-guards** — wrap these 12 nested `.map()` sites with
    `Array.isArray(x) ? x.map(...) : <EmptyState/>`:
    invoice-detail-view.tsx:111, order-detail-view.tsx:87, loads/[id]/page.tsx:359,
    customer-detail-view.tsx:100, warehouse-detail-view.tsx:81, ExecutionCenter.tsx:103,
    anomaly-log.tsx:101, notification-center.tsx:133, document-viewer.tsx:70,
    marketplace/[appId]/install/page.tsx:46, chat/page.tsx:251, operations/traces:54.
    PROOF: each screen renders with the API returning `[]`.
B4. **Soft-delete reference checks** — `trailers`, `branches`, `vendors` delete
    unconditionally; mirror the `customers` pattern (block if dependents exist).
    PROOF each: delete with a dependent → 409; without → 200.
B5. **CSRF vs external webhooks** — `ingress/telemetry` + webhook routes require an
    XSRF token, so real providers get 403. Exempt those paths in `csrf.middleware.ts`
    (they're HMAC/secret-authed). PROOF: external-style POST (no cookie, valid
    signature) → 202/200, not 403. Keep CSRF on the browser API.
B6. **Safari/WebKit CORS** — the web client calls `:8080` cross-origin. Point the API
    client at the same-origin `/backend` proxy (already in next.config.ts). PROOF:
    `npx playwright test tests/smoke.spec.ts --project=webkit` → 0 CORS errors.
B7. **Firefox 304** — widen `smoke.spec.ts:114` to
    `expect(response?.ok() || response?.status() === 304, ...)`. (Correcting a wrong
    belief about HTTP, not hiding a bug.)

=====================================================================
# PHASE C — Regression tests (would have caught most of the above)
=====================================================================
C1. Delete the broken always-red `apps/api/test/dto-coverage.e2e-spec.ts`.
C2. Add `POST {} → 400` spec for every create endpoint (from the swagger POST list,
    minus a documented skip list for auth/webhook/ingress).
C3. Add cross-tenant `:id` spec: for every core entity, A→404/403 AND B→200
    (positive control). Reuse the /tmp/iso-test.sh logic.
    PROOF: both specs committed and PASSING (`jest ... | grep Tests:`).

=====================================================================
# PHASE D — Demo readiness (the Janmashtami walk)
=====================================================================
D1. **Indian demo data** — the seed currently uses US routes (LA→Phoenix). Replace
    with Indian: customers ("Bhonsle Transport", "Gupta Roadways"…), lanes
    (Mumbai→Delhi, Pune→Nagpur, Ahmedabad→Surat, Delhi→Jaipur), truck numbers
    (GJ-01-AB-1234), ₹ freight. Keep idempotent + at least one loss-making trip.
    PROOF: seed twice, counts identical; Profitability shows Indian lanes + a red row.
D2. **Relabel nav + hide Tier-3** (`apps/web/src/config/navigation.ts`): Loads→
    "Booking", Ledger→"Accounts", add "LR / Bilty" + "Profitability"; hide AI Platform,
    Marketplace, SRE/Observability, Command Center, Automation, Messaging. PROOF: web
    `tsc` = 0; screenshot the transporter sidebar; every visible item renders.
D3. **LR / Bilty frontend page** — the backend is live; build the page (list + generate
    LR from a booking + Print via `/lorry-receipts/:id/print`) and add its nav item.
    PROOF: create an LR from the UI, print it.
D4. **Transporter dashboard** — real KPIs from DB (Total Bookings, Today's Billing,
    Outstanding, Active Vehicles, Top Clients, Recent Bookings). No Math.random.
    PROOF: dashboard numbers match SQL for two tiles; screenshot at 1440.
D5. **E-Way/GST honesty** — they are stubs. Show real GST-on-invoices if it works, or
    hide; never a fake "file to portal" button.
D6. **The walk** — login → dashboard → customers → fleet+drivers → booking → generate
    LR → dispatch → trip → delivery+POD → invoice → payment → accounts(ledger) →
    profitability. Screenshot each at 1440; open each and confirm real rows.
    Finance integrity: every JournalEntry balances (sum debit = sum credit → 0 rows),
    a fully-paid invoice flips to PAID.

=====================================================================
# PHASE E — Final green gate
=====================================================================
E1. All suites TWICE back-to-back: auth, dto-validation, integrations-security,
    soft-delete-references, multi-tenant, LR, + the two new regression specs. Paste
    both runs.
E2. `tsc --noEmit` both apps = 0. `docker compose build web` + `api` = 0. Container:
    /login 200 + 3 static assets 200.
E3. Browser smoke TWICE consecutively; Chromium green both.
E4. Final grep: `grep -rc "System operation or legacy bypass" apps/api/src` prints
    nothing (Phase A1 complete).
E5. Honest table: module · verified · demo-ready · known issues ("Unknown" allowed).
    Then `git status --short` and `git log --oneline -10`.

=====================================================================
# Priority if the clock runs out
=====================================================================
A1 (runAsSystem) + A3 (keys) are the security ship-blockers. B3/B4 + D1/D3/D6 are
what the client actually sees at the demo. B5/B6 matter for real providers and Safari
users. Everything else is hardening that can continue after the pilot starts. Do NOT
declare "ready to ship" until Phase A1 shows zero generic bypasses and the keys are
revoked.
