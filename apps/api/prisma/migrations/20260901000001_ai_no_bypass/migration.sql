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

-- The role must exist before CREATE POLICY ... TO parilink_ai, or this
-- migration fails with `role "parilink_ai" does not exist`. It is created by
-- setup-test-db.sh, but that script is NOT run by run-e2e.sh and is not
-- referenced by package.json -- and a migration has to stand on its own on
-- any database it is deployed to. Created NOLOGIN here: this migration only
-- needs the role to exist so the policy can reference it. setup-test-db.sh
-- separately grants it LOGIN and a password for the AI connection path.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_ai') THEN
    CREATE ROLE parilink_ai NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;

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
