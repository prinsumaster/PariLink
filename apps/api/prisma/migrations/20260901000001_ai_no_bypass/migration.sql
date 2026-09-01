-- RESTRICTIVE policy so the AI role cannot escape tenant scope.
--
-- Why RESTRICTIVE: tenant_isolation_policy is PERMISSIVE with no TO clause,
-- so it applies to every role including parilink_ai, and it contains the
-- `bypass_rls = 'on'` disjunct. Permissive policies OR together, so adding
-- another permissive policy could never remove that escape hatch.
-- RESTRICTIVE policies AND with the permissive set, so this one cannot be
-- OR'd away. parilink_ai can call set_config('app.bypass_rls','on') itself
-- -- no special privilege is required -- which is exactly why the role
-- cannot be trusted and the constraint has to be RESTRICTIVE.
--
-- Why the `current_user <> 'parilink_ai'` guard rather than relying on the
-- TO clause alone: setup-test-db.sh runs `GRANT parilink_ai TO
-- parilink_test`, and PostgreSQL matches a policy's TO list by role
-- MEMBERSHIP (has_privs_of_role), not by exact current_user. Without this
-- guard the policy also binds to parilink_test, the main application role.
-- Being RESTRICTIVE it would then AND with the permissive set, and every
-- runAsSystem call (which sets app.bypass_rls but NOT
-- app.current_company_id) would evaluate `companyId = NULL` -> NULL -> false
-- and return zero rows. Seeding, cross-tenant admin and reports on these
-- seven tables would silently return nothing.
--
-- postgres:15 has no `GRANT ... WITH INHERIT FALSE` (PostgreSQL 16+), so the
-- guard is the portable fix: inert when current_user is parilink_test,
-- binding when it is genuinely parilink_ai.
--
-- Scope: these are exactly the 7 entries of ALLOWED_TABLES in
-- sql-generator.service.ts. Every other table is protected from the AI role
-- by the narrowed GRANT in setup-test-db.sh, not by a policy here.

-- NOTE: this migration does NOT create the parilink_ai role. Provisioning it
-- here was considered and rejected: in production the migrating user has no
-- CREATEROLE, so the guard would fail with "permission denied to create role"
-- -- a more confusing error than the honest one. Role provisioning is infra,
-- not schema, and lives in setup-test-db.sh, test/run-e2e.sh and DEPLOY.md.
-- On a database where the role was never provisioned this migration fails
-- loudly with `role "parilink_ai" does not exist`, which points straight at
-- the fix. Both scripts create the role BEFORE `prisma migrate deploy`.

DROP POLICY IF EXISTS "ai_no_bypass" ON "Trip";
CREATE POLICY "ai_no_bypass" ON "Trip"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);

DROP POLICY IF EXISTS "ai_no_bypass" ON "Load";
CREATE POLICY "ai_no_bypass" ON "Load"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);

DROP POLICY IF EXISTS "ai_no_bypass" ON "Invoice";
CREATE POLICY "ai_no_bypass" ON "Invoice"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);

DROP POLICY IF EXISTS "ai_no_bypass" ON "Vehicle";
CREATE POLICY "ai_no_bypass" ON "Vehicle"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);

DROP POLICY IF EXISTS "ai_no_bypass" ON "Driver";
CREATE POLICY "ai_no_bypass" ON "Driver"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);

DROP POLICY IF EXISTS "ai_no_bypass" ON "Customer";
CREATE POLICY "ai_no_bypass" ON "Customer"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);

DROP POLICY IF EXISTS "ai_no_bypass" ON "Expense";
CREATE POLICY "ai_no_bypass" ON "Expense"
AS RESTRICTIVE FOR ALL TO parilink_ai
USING (
  current_user <> 'parilink_ai'
  OR "companyId" = current_setting('app.current_company_id', true)
);
