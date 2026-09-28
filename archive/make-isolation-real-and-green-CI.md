# PariLink — make isolation DURABLE, green the CI, then Phase D + E

Claude verified this round on the repo. Real wins this time: the `bypass_rls='off'` reset in
`runAsTenant` (prisma.service.ts:273) is correct, `FORCE ROW LEVEL SECURITY` is in a migration,
the A1 gate holds at 82. Good.

But there is a critical illusion and the CI is red. Fix these before Phase D.

=====================================================================
# P0-1 — Your RLS fix is EPHEMERAL. Make it permanent, prove it on a FRESH volume.
=====================================================================
You ran `ALTER ROLE parilink NOSUPERUSER` by hand on the live DB. It is in NO migration and NO
init script. `docker-compose.yml` sets `POSTGRES_USER: parilink` (created as a **superuser**),
and the app connects as `parilink`. **Superusers bypass RLS even with FORCE.** So the next
`docker compose down -v && up` (CI, prod, any teammate) brings the superuser back and tenant
isolation silently disappears. Your isolation e2e passes ONLY because of a manual change that
lives nowhere in the repo.

Fix it durably. Recommended shape:
- The app must connect at runtime as a **dedicated NOSUPERUSER, NOBYPASSRLS role** (e.g.
  `parilink_app`) that has CRUD on the schema but cannot bypass RLS.
- Keep the privileged `parilink` role ONLY for running migrations.
- Encode it so a fresh DB is correct with no manual step: an init script in
  `docker-entrypoint-initdb.d/` (or a migration) that creates `parilink_app`
  (`CREATE ROLE parilink_app LOGIN NOSUPERUSER NOBYPASSRLS PASSWORD ...; GRANT ...`), and point
  the app's `DATABASE_URL` at `parilink_app` while a separate `MIGRATION_DATABASE_URL` uses
  `parilink`. (If you keep a single role, the init script must `ALTER ROLE parilink NOSUPERUSER`
  AND migrations must still succeed — verify `prisma migrate deploy` runs as a non-superuser
  owner; if any migration needs superuser, you MUST split the roles.)

UN-FAKEABLE PROOF (a manual ALTER can't survive `-v`):
```bash
cd ~/Desktop/PariLink
docker compose down -v          # wipes the volume — no hand-patched state survives
docker compose up -d
# run migrations, seed, start the server (health must be 200)
# then, as the ROLE THE APP CONNECTS AS:
psql "$DATABASE_URL" -c "SELECT current_user, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = current_user;"
#   ^ rolsuper MUST be f AND rolbypassrls MUST be f
npx jest --config ./test/jest-e2e.json test/isolation.e2e-spec.ts test/cross-tenant.e2e-spec.ts 2>&1 | grep -E "Tests:|PASS|FAIL"
```
Paste: the `down -v` line, the `rolsuper=f rolbypassrls=f` row, and the passing isolation
tests. Isolation is "proven" ONLY on a freshly-wiped volume.

Then the STEP-1 curl proof from the last prompt, ALSO on this fresh DB: health=200 first, then
the 8-entity table (customers, vehicles, drivers, loads, trips, invoices, payments, documents):
B reads own = 200, A reads/patch/delete B = 404/403, DB row unchanged. Raw codes.

=====================================================================
# P0-2 — CI: Secret Scanning is RED (3 findings). Green it honestly.
=====================================================================
1. Open the workflow run → the 3 Secret Scanning annotations. They name the exact file/commit
   and rule. Paste them. Do not guess.
2. If they point at **git history** (old `.env.bak` / `token.json` / leaked keys): those keys
   are compromised forever — they must be REVOKED at the provider (see A3), and the history
   scrubbed (`git filter-repo --path .env.bak --path token.json --invert-paths`, coordinate the
   force-push) or the finding baselined only after revocation.
3. If they point at the **example files**: replace any real-looking value with an obvious
   placeholder (`JWT_SECRET=<generate-with-openssl-rand-hex-32>`), and add a scanner allowlist
   entry for `*.example` so placeholders don't trip it.
4. Never commit `apps/api/.env` (confirm it's git-ignored). Proof: re-run the workflow (or the
   scanner locally) → Secret Scanning green, and say which of the above each finding was.

=====================================================================
# P0-3 — CI: Trivy is RED (npm audit: 15 vulns, 9 high). Reduce + document.
=====================================================================
- Most highs are Tier-3 deps (langchain, deck.gl, docusaurus). Per plan they get removed when
  the AI/Tier-3 modules are hidden in Phase D — do that removal, THEN `npm audit` again.
  (Remember: `AiModule` is wired into dispatch/planning/warehouse/analytics — detach those
  imports first, or the build breaks. Do NOT just uninstall.)
- `npm audit fix` the non-breaking ones. For anything left, list it: package, severity, why it
  can't be fixed yet, and whether it's reachable in pilot scope.
- Paste `npm audit --omit=dev | tail -3` before and after. Trivy green, or a written list of
  the exact remaining highs with justification (a demo can ship with a documented, scoped list —
  it cannot ship with an unexamined red).

=====================================================================
# P0-4 — A3 is still fake (3rd time). This is owner-only; stop faking it.
=====================================================================
`TWILIO_ACCOUNT_SID=AC_50ac…` is random hex you generated — not a revocation, and `AC_` with an
underscore isn't even a valid SID. STOP writing fake keys into `.env`. Leave real revocation to
the owner at each dashboard (Razorpay, Twilio, Resend, Mapbox, MinIO) and report it as
**"owner action — NOT done"** until the owner confirms. Do not mark A3 done.

=====================================================================
# THEN Phase D (Janmashtami demo) — only after isolation is durable + CI honest
=====================================================================
Indian seed (real transporter names, Mumbai→Delhi / Pune→Nagpur / Ahmedabad→Surat lanes,
GJ-01-AB-1234 trucks, ₹ freight, ≥1 loss trip, idempotent — seed twice, counts identical);
relabel nav + hide Tier-3 (this is where AI/langchain/deck.gl actually get removed, in order);
LR/Bilty frontend (list + generate-from-booking + Print); real dashboard KPIs (no Math.random);
the full walk login→dashboard→customers→fleet→booking→LR→dispatch→trip→POD→invoice→payment→
accounts→profitability, screenshot each at 1440, every JournalEntry balances, a paid invoice
flips to PAID.

=====================================================================
# THEN Phase E — green gate (all at once)
=====================================================================
Fresh `docker compose down -v && up`; migrations + seed; health 200; all e2e suites TWICE
(auth, dto-validation, integrations-security, soft-delete, multi-tenant, cross-tenant,
isolation, LR); `tsc --noEmit` both apps = 0; docker build web+api = 0; browser smoke TWICE;
the A1 gate at 82 (C4 lock green); **CI: Secret Scanning green, Trivy green-or-documented,
CodeQL green**; honest module table + `git status`/`git log`.

Report per section, raw output above every "done". Claude will re-check: the app role's
`rolsuper`/`rolbypassrls` after `down -v`, the gate count, and the CI job states.
