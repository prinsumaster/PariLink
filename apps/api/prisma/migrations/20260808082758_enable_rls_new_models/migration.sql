
-- RLS for Workshop
ALTER TABLE "Workshop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workshop" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Workshop";
CREATE POLICY "tenant_isolation_policy" ON "Workshop"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Mechanic
ALTER TABLE "Mechanic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Mechanic" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Mechanic";
CREATE POLICY "tenant_isolation_policy" ON "Mechanic"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for JobCard
ALTER TABLE "JobCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JobCard" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "JobCard";
CREATE POLICY "tenant_isolation_policy" ON "JobCard"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for MaintenanceSchedule
ALTER TABLE "MaintenanceSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaintenanceSchedule" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MaintenanceSchedule";
CREATE POLICY "tenant_isolation_policy" ON "MaintenanceSchedule"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for FuelCard
ALTER TABLE "FuelCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FuelCard" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "FuelCard";
CREATE POLICY "tenant_isolation_policy" ON "FuelCard"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for FuelStation
ALTER TABLE "FuelStation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FuelStation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "FuelStation";
CREATE POLICY "tenant_isolation_policy" ON "FuelStation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for FuelTransaction
ALTER TABLE "FuelTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FuelTransaction" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "FuelTransaction";
CREATE POLICY "tenant_isolation_policy" ON "FuelTransaction"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Tyre
ALTER TABLE "Tyre" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tyre" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Tyre";
CREATE POLICY "tenant_isolation_policy" ON "Tyre"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for TyreLog
ALTER TABLE "TyreLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TyreLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TyreLog";
CREATE POLICY "tenant_isolation_policy" ON "TyreLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for HosViolation
ALTER TABLE "HosViolation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HosViolation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "HosViolation";
CREATE POLICY "tenant_isolation_policy" ON "HosViolation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DvirLog
ALTER TABLE "DvirLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DvirLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DvirLog";
CREATE POLICY "tenant_isolation_policy" ON "DvirLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for InsuranceLog
ALTER TABLE "InsuranceLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InsuranceLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InsuranceLog";
CREATE POLICY "tenant_isolation_policy" ON "InsuranceLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for LoadBoardItem
ALTER TABLE "LoadBoardItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoadBoardItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "LoadBoardItem";
CREATE POLICY "tenant_isolation_policy" ON "LoadBoardItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Locale
ALTER TABLE "Locale" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Locale" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Locale";
CREATE POLICY "tenant_isolation_policy" ON "Locale"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Translation
ALTER TABLE "Translation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Translation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Translation";
CREATE POLICY "tenant_isolation_policy" ON "Translation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ReportTemplate
ALTER TABLE "ReportTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReportTemplate" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ReportTemplate";
CREATE POLICY "tenant_isolation_policy" ON "ReportTemplate"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ReportSchedule
ALTER TABLE "ReportSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReportSchedule" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ReportSchedule";
CREATE POLICY "tenant_isolation_policy" ON "ReportSchedule"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ReportExecution
ALTER TABLE "ReportExecution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReportExecution" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ReportExecution";
CREATE POLICY "tenant_isolation_policy" ON "ReportExecution"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for VehicleRegistration
ALTER TABLE "VehicleRegistration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VehicleRegistration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "VehicleRegistration";
CREATE POLICY "tenant_isolation_policy" ON "VehicleRegistration"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for PurchaseOrder
ALTER TABLE "PurchaseOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PurchaseOrder" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "PurchaseOrder";
CREATE POLICY "tenant_isolation_policy" ON "PurchaseOrder"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ExternalCarrier
ALTER TABLE "ExternalCarrier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExternalCarrier" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ExternalCarrier";
CREATE POLICY "tenant_isolation_policy" ON "ExternalCarrier"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for CarrierBid
ALTER TABLE "CarrierBid" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CarrierBid" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "CarrierBid";
CREATE POLICY "tenant_isolation_policy" ON "CarrierBid"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for KpiDefinition
ALTER TABLE "KpiDefinition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KpiDefinition" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "KpiDefinition";
CREATE POLICY "tenant_isolation_policy" ON "KpiDefinition"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for CustomMetric
ALTER TABLE "CustomMetric" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomMetric" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "CustomMetric";
CREATE POLICY "tenant_isolation_policy" ON "CustomMetric"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for TrendReport
ALTER TABLE "TrendReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrendReport" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TrendReport";
CREATE POLICY "tenant_isolation_policy" ON "TrendReport"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

