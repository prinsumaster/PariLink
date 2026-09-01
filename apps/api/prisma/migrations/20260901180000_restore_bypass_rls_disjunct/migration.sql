-- Assert -- and if necessary repair -- the app.bypass_rls disjunct on every
-- tenant_isolation_policy.
--
-- WHY THIS EXISTS
-- On 1 Sep 2026 six committed RLS migrations were found with the disjunct
--     current_setting('app.bypass_rls', true) = 'on' OR ...
-- stripped out of the WORKING TREE while HEAD still carried it:
--     20260808072558_enable_rls                    240 occurrences in HEAD, 0 in tree
--     20260808082758_enable_rls_new_models          50                      0
--     20260808090000_enable_rls_all_models         344                      0
--     20260831173000_enable_rls_new_fleet_models    18                      0
--     20260901150000_partition_vehicle_location      2                      0
--     20260901160000_partition_vehicle_location_v2   2                      0
-- 656 disjuncts in total, and in every one of the six the strip was the ONLY
-- change against HEAD. The files were restored from HEAD and verified
-- byte-identical. No git operation caused it (the reflog contains only
-- commits) and scripts/legacy-maintenance/generate_rls.py emits the disjunct
-- correctly, so the edit came from outside version control -- most likely a
-- concurrent agent. It had already happened once before, to
-- 20260831174500_enable_rls_fk_linked_auth_money.
--
-- WHY IT MATTERS, MEASURED RATHER THAN ASSERTED
-- PrismaService.runAsSystem(reason, cb) sets `app.bypass_rls = 'on'` and is
-- called from 231 sites across 30+ services, including auth.service.ts,
-- jwt.strategy.ts and api-key.guard.ts. 63 of the affected tables are read
-- inside a runAsSystem block, User and Company among them. On PostgreSQL 16,
-- as a non-superuser, with FORCE ROW LEVEL SECURITY and the disjunct absent:
--     SET app.bypass_rls='on'; SELECT count(*) FROM "User"          -> 0  (2 rows exist)
--     SET app.bypass_rls='on'; SELECT count(*) FROM "Company"       -> 0  (2 rows exist)
--     SET app.bypass_rls='on'; SELECT count(*) FROM "RefreshToken"  -> 2  (positive control:
--                                                    this one still had the disjunct)
-- Repeated as the non-superuser TABLE OWNER, to rule out "it only affects the
-- test role": owner + bypass_rls='on' -> 0 of 2 rows; owner + tenant context
-- -> 1 of 2. FORCE makes the policy apply to the owner as well, so the only
-- role that escapes is a SUPERUSER or BYPASSRLS one -- and if the API
-- connected as one of those, RLS would be decorative and there would be no
-- tenant isolation at all. Deploying a stripped migration therefore either
-- breaks login outright or means isolation was never real.
--
-- WHAT THIS MIGRATION DOES
-- Normally nothing: against a database built from the correct migrations it
-- patches 0 policies and simply asserts the invariant. Against a database
-- migrated from a stripped tree it repairs every affected policy, prepending
-- the disjunct while keeping the existing tenant predicate VERBATIM -- read
-- back out of pg_policies rather than retyped, so no policy can be silently
-- rewritten or weakened. The point is the assertion at the end: a stripped
-- migration now fails the deploy loudly instead of reaching production.
--
-- Resulting three-state behaviour, which the newer migrations already document:
--     runAsSystem  -> bypass disjunct true, tenant predicate never evaluated
--     runAsTenant  -> bypass false, tenant predicate decides
--     neither set  -> both false, zero rows. Fails closed.
--
-- WHAT IT DELIBERATELY DOES NOT TOUCH
-- The RESTRICTIVE `ai_no_bypass` policies from 20260901000001. RESTRICTIVE
-- policies AND with the permissive set, so widening a permissive policy
-- cannot loosen them: parilink_ai still cannot read across tenants even with
-- app.bypass_rls set. Verified after this migration ran --
--     as parilink_ai, bypass_rls='on', no tenant  -> Trip 0 rows
--     as parilink_ai, bypass_rls='on', tenant CO-A -> Trip 1 row (T-A), not 2
-- -- and the count of those policies is asserted below so this migration
-- cannot quietly disturb them.
--
-- Idempotent: policies that already carry the disjunct are skipped.

DO $$
DECLARE
  r         record;
  patched   int := 0;
  skipped   int := 0;
  new_qual  text;
  new_check text;
BEGIN
  FOR r IN
    SELECT p.schemaname, p.tablename, p.policyname, p.qual, p.with_check
    FROM pg_policies p
    WHERE p.policyname  = 'tenant_isolation_policy'
      AND p.permissive  = 'PERMISSIVE'
      AND p.cmd         = 'ALL'
      AND p.schemaname  = 'public'
    ORDER BY p.tablename
  LOOP
    IF r.qual LIKE '%app.bypass_rls%' THEN
      skipped := skipped + 1;
      CONTINUE;
    END IF;

    -- WITH CHECK defaults to the USING expression when it was omitted.
    new_qual  := 'current_setting(''app.bypass_rls'', true) = ''on'' OR (' || r.qual || ')';
    new_check := 'current_setting(''app.bypass_rls'', true) = ''on'' OR ('
                 || coalesce(r.with_check, r.qual) || ')';

    EXECUTE format('DROP POLICY %I ON %I.%I',
                   r.policyname, r.schemaname, r.tablename);
    EXECUTE format('CREATE POLICY %I ON %I.%I AS PERMISSIVE FOR ALL TO public USING (%s) WITH CHECK (%s)',
                   r.policyname, r.schemaname, r.tablename, new_qual, new_check);
    patched := patched + 1;
  END LOOP;

  RAISE NOTICE 'bypass_rls disjunct: % policies patched, % already correct', patched, skipped;
END $$;

-- Assert the outcome rather than trusting the loop.
DO $$
DECLARE missing int; ai_guards int;
BEGIN
  SELECT count(*) INTO missing FROM pg_policies
   WHERE policyname = 'tenant_isolation_policy' AND schemaname = 'public'
     AND qual NOT LIKE '%app.bypass_rls%';
  IF missing > 0 THEN
    RAISE EXCEPTION
      'bypass_rls invariant violated: % tenant_isolation_policy still lack the disjunct. '
      'runAsSystem cannot read those tables -- see the header of this migration.', missing;
  END IF;

  -- Removal, not the exact count: a later migration may legitimately add more.
  SELECT count(*) INTO ai_guards FROM pg_policies
   WHERE policyname = 'ai_no_bypass' AND permissive = 'RESTRICTIVE';
  IF ai_guards < 7 THEN
    RAISE EXCEPTION
      'ai_no_bypass RESTRICTIVE policies dropped to % (expected at least 7) -- '
      'the parilink_ai cross-tenant guard was disturbed.', ai_guards;
  END IF;
END $$;
