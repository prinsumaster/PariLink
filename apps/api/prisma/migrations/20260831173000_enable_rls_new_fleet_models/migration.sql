-- Enable RLS on the 9 tenant-scoped tables from the newer modules that were
-- created AFTER the three original RLS migrations (20260808*) and therefore
-- never received a tenant_isolation_policy.
--
-- Found by diffing every model in schema.prisma that has a "companyId" column
-- against every ENABLE ROW LEVEL SECURITY statement across all migrations:
-- 241 models total, 173 had RLS, 68 did not, and of those 68 exactly these 9
-- carry a companyId (the other 59 are global/catalog data with no tenant column).
--
-- Until this migration, isolation on these tables was enforced ONLY by the
-- application's explicit `where: { companyId }` predicates, with no database
-- backstop: dropping one of those predicates in a refactor would have been a
-- silent, total cross-tenant leak. FORCE is included on every table so the
-- table owner is subject to the policy too, matching the existing migrations.
--
-- Block shape is copied verbatim from 20260808072558_enable_rls (ENABLE +
-- FORCE + DROP POLICY IF EXISTS + CREATE POLICY with identical USING and
-- WITH CHECK expressions).

-- RLS for FuelEntry
ALTER TABLE "FuelEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FuelEntry" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "FuelEntry";
CREATE POLICY "tenant_isolation_policy" ON "FuelEntry"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for JobPart
ALTER TABLE "JobPart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JobPart" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "JobPart";
CREATE POLICY "tenant_isolation_policy" ON "JobPart"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for LoadingEvent
ALTER TABLE "LoadingEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoadingEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "LoadingEvent";
CREATE POLICY "tenant_isolation_policy" ON "LoadingEvent"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for LorryReceipt
ALTER TABLE "LorryReceipt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LorryReceipt" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "LorryReceipt";
CREATE POLICY "tenant_isolation_policy" ON "LorryReceipt"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for LrSequence
ALTER TABLE "LrSequence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LrSequence" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "LrSequence";
CREATE POLICY "tenant_isolation_policy" ON "LrSequence"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for MaintenanceJob
ALTER TABLE "MaintenanceJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaintenanceJob" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MaintenanceJob";
CREATE POLICY "tenant_isolation_policy" ON "MaintenanceJob"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for TripDesk
ALTER TABLE "TripDesk" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripDesk" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TripDesk";
CREATE POLICY "tenant_isolation_policy" ON "TripDesk"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for TripExpense
ALTER TABLE "TripExpense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TripExpense" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TripExpense";
CREATE POLICY "tenant_isolation_policy" ON "TripExpense"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- RLS for TruckProfitability
ALTER TABLE "TruckProfitability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TruckProfitability" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TruckProfitability";
CREATE POLICY "tenant_isolation_policy" ON "TruckProfitability"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);
