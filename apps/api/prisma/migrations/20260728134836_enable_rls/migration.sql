
-- RLS for Trip
ALTER TABLE "Trip" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trip" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Trip";
CREATE POLICY "tenant_isolation_policy" ON "Trip"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for LocationHistory
ALTER TABLE "LocationHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LocationHistory" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "LocationHistory";
CREATE POLICY "tenant_isolation_policy" ON "LocationHistory"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Load
ALTER TABLE "Load" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Load" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Load";
CREATE POLICY "tenant_isolation_policy" ON "Load"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Document
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Document" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Document";
CREATE POLICY "tenant_isolation_policy" ON "Document"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DocumentSignature
ALTER TABLE "DocumentSignature" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocumentSignature" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DocumentSignature";
CREATE POLICY "tenant_isolation_policy" ON "DocumentSignature"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ComplianceRequirement
ALTER TABLE "ComplianceRequirement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ComplianceRequirement" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ComplianceRequirement";
CREATE POLICY "tenant_isolation_policy" ON "ComplianceRequirement"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Invoice
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Invoice";
CREATE POLICY "tenant_isolation_policy" ON "Invoice"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Payment
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Payment";
CREATE POLICY "tenant_isolation_policy" ON "Payment"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Customer
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Customer";
CREATE POLICY "tenant_isolation_policy" ON "Customer"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Vendor
ALTER TABLE "Vendor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vendor" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Vendor";
CREATE POLICY "tenant_isolation_policy" ON "Vendor"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Driver
ALTER TABLE "Driver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Driver" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Driver";
CREATE POLICY "tenant_isolation_policy" ON "Driver"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Vehicle
ALTER TABLE "Vehicle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vehicle" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Vehicle";
CREATE POLICY "tenant_isolation_policy" ON "Vehicle"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Role
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Role";
CREATE POLICY "tenant_isolation_policy" ON "Role"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Branch
ALTER TABLE "Branch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Branch" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Branch";
CREATE POLICY "tenant_isolation_policy" ON "Branch"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for User
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "User";
CREATE POLICY "tenant_isolation_policy" ON "User"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AuditLog
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AuditLog";
CREATE POLICY "tenant_isolation_policy" ON "AuditLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for RateCard
ALTER TABLE "RateCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RateCard" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "RateCard";
CREATE POLICY "tenant_isolation_policy" ON "RateCard"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for CreditNote
ALTER TABLE "CreditNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditNote" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "CreditNote";
CREATE POLICY "tenant_isolation_policy" ON "CreditNote"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Settlement
ALTER TABLE "Settlement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Settlement" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Settlement";
CREATE POLICY "tenant_isolation_policy" ON "Settlement"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for VendorBill
ALTER TABLE "VendorBill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VendorBill" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "VendorBill";
CREATE POLICY "tenant_isolation_policy" ON "VendorBill"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Expense
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Expense";
CREATE POLICY "tenant_isolation_policy" ON "Expense"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Account
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Account";
CREATE POLICY "tenant_isolation_policy" ON "Account"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for JournalEntry
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "JournalEntry";
CREATE POLICY "tenant_isolation_policy" ON "JournalEntry"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for JournalLine
ALTER TABLE "JournalLine" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalLine" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "JournalLine";
CREATE POLICY "tenant_isolation_policy" ON "JournalLine"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for TenantConfiguration
ALTER TABLE "TenantConfiguration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TenantConfiguration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TenantConfiguration";
CREATE POLICY "tenant_isolation_policy" ON "TenantConfiguration"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for SupportTicket
ALTER TABLE "SupportTicket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupportTicket" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "SupportTicket";
CREATE POLICY "tenant_isolation_policy" ON "SupportTicket"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for LeaveRequest
ALTER TABLE "LeaveRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeaveRequest" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "LeaveRequest";
CREATE POLICY "tenant_isolation_policy" ON "LeaveRequest"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WorkflowRule
ALTER TABLE "WorkflowRule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkflowRule" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WorkflowRule";
CREATE POLICY "tenant_isolation_policy" ON "WorkflowRule"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for RuleExecutionHistory
ALTER TABLE "RuleExecutionHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RuleExecutionHistory" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "RuleExecutionHistory";
CREATE POLICY "tenant_isolation_policy" ON "RuleExecutionHistory"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ApiKey
ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiKey" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ApiKey";
CREATE POLICY "tenant_isolation_policy" ON "ApiKey"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for OAuthClient
ALTER TABLE "OAuthClient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OAuthClient" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OAuthClient";
CREATE POLICY "tenant_isolation_policy" ON "OAuthClient"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for PersonalAccessToken
ALTER TABLE "PersonalAccessToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PersonalAccessToken" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "PersonalAccessToken";
CREATE POLICY "tenant_isolation_policy" ON "PersonalAccessToken"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WebhookEndpoint
ALTER TABLE "WebhookEndpoint" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookEndpoint" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WebhookEndpoint";
CREATE POLICY "tenant_isolation_policy" ON "WebhookEndpoint"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for IntegrationConfig
ALTER TABLE "IntegrationConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IntegrationConfig" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "IntegrationConfig";
CREATE POLICY "tenant_isolation_policy" ON "IntegrationConfig"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Geofence
ALTER TABLE "Geofence" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Geofence" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Geofence";
CREATE POLICY "tenant_isolation_policy" ON "Geofence"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for GeofenceEvent
ALTER TABLE "GeofenceEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GeofenceEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "GeofenceEvent";
CREATE POLICY "tenant_isolation_policy" ON "GeofenceEvent"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AlertRule
ALTER TABLE "AlertRule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AlertRule" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AlertRule";
CREATE POLICY "tenant_isolation_policy" ON "AlertRule"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Alert
ALTER TABLE "Alert" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Alert" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Alert";
CREATE POLICY "tenant_isolation_policy" ON "Alert"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for VehicleTelemetry
ALTER TABLE "VehicleTelemetry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VehicleTelemetry" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "VehicleTelemetry";
CREATE POLICY "tenant_isolation_policy" ON "VehicleTelemetry"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DomainEvent
ALTER TABLE "DomainEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DomainEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DomainEvent";
CREATE POLICY "tenant_isolation_policy" ON "DomainEvent"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for TwinSnapshot
ALTER TABLE "TwinSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TwinSnapshot" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TwinSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "TwinSnapshot"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DispatchPlan
ALTER TABLE "DispatchPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DispatchPlan" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DispatchPlan";
CREATE POLICY "tenant_isolation_policy" ON "DispatchPlan"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DispatchCandidate
ALTER TABLE "DispatchCandidate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DispatchCandidate" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DispatchCandidate";
CREATE POLICY "tenant_isolation_policy" ON "DispatchCandidate"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ConstraintViolation
ALTER TABLE "ConstraintViolation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ConstraintViolation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ConstraintViolation";
CREATE POLICY "tenant_isolation_policy" ON "ConstraintViolation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for CustomerPromise
ALTER TABLE "CustomerPromise" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CustomerPromise" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "CustomerPromise";
CREATE POLICY "tenant_isolation_policy" ON "CustomerPromise"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for OptimizationScenario
ALTER TABLE "OptimizationScenario" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OptimizationScenario" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OptimizationScenario";
CREATE POLICY "tenant_isolation_policy" ON "OptimizationScenario"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for OperationalPlan
ALTER TABLE "OperationalPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OperationalPlan" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OperationalPlan";
CREATE POLICY "tenant_isolation_policy" ON "OperationalPlan"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for OptimizationRecommendation
ALTER TABLE "OptimizationRecommendation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OptimizationRecommendation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OptimizationRecommendation";
CREATE POLICY "tenant_isolation_policy" ON "OptimizationRecommendation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Quotation
ALTER TABLE "Quotation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quotation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Quotation";
CREATE POLICY "tenant_isolation_policy" ON "Quotation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Contract
ALTER TABLE "Contract" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Contract" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Contract";
CREATE POLICY "tenant_isolation_policy" ON "Contract"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Tender
ALTER TABLE "Tender" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tender" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Tender";
CREATE POLICY "tenant_isolation_policy" ON "Tender"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Warehouse
ALTER TABLE "Warehouse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Warehouse" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Warehouse";
CREATE POLICY "tenant_isolation_policy" ON "Warehouse"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for InventoryItem
ALTER TABLE "InventoryItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InventoryItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InventoryItem";
CREATE POLICY "tenant_isolation_policy" ON "InventoryItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for InboundReceipt
ALTER TABLE "InboundReceipt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InboundReceipt" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InboundReceipt";
CREATE POLICY "tenant_isolation_policy" ON "InboundReceipt"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for OutboundWave
ALTER TABLE "OutboundWave" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OutboundWave" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OutboundWave";
CREATE POLICY "tenant_isolation_policy" ON "OutboundWave"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for YardGateLog
ALTER TABLE "YardGateLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "YardGateLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "YardGateLog";
CREATE POLICY "tenant_isolation_policy" ON "YardGateLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for MaterialEquipment
ALTER TABLE "MaterialEquipment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaterialEquipment" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MaterialEquipment";
CREATE POLICY "tenant_isolation_policy" ON "MaterialEquipment"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WorkflowDefinition
ALTER TABLE "WorkflowDefinition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkflowDefinition" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WorkflowDefinition";
CREATE POLICY "tenant_isolation_policy" ON "WorkflowDefinition"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WorkflowExecution
ALTER TABLE "WorkflowExecution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkflowExecution" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WorkflowExecution";
CREATE POLICY "tenant_isolation_policy" ON "WorkflowExecution"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ApprovalRequest
ALTER TABLE "ApprovalRequest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApprovalRequest" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ApprovalRequest";
CREATE POLICY "tenant_isolation_policy" ON "ApprovalRequest"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for IntegrationConnection
ALTER TABLE "IntegrationConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IntegrationConnection" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "IntegrationConnection";
CREATE POLICY "tenant_isolation_policy" ON "IntegrationConnection"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WebhookDelivery
ALTER TABLE "WebhookDelivery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookDelivery" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WebhookDelivery";
CREATE POLICY "tenant_isolation_policy" ON "WebhookDelivery"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DataMappingTemplate
ALTER TABLE "DataMappingTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DataMappingTemplate" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DataMappingTemplate";
CREATE POLICY "tenant_isolation_policy" ON "DataMappingTemplate"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for SyncJob
ALTER TABLE "SyncJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SyncJob" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "SyncJob";
CREATE POLICY "tenant_isolation_policy" ON "SyncJob"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiRecommendation
ALTER TABLE "AiRecommendation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiRecommendation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiRecommendation";
CREATE POLICY "tenant_isolation_policy" ON "AiRecommendation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiPrediction
ALTER TABLE "AiPrediction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiPrediction" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiPrediction";
CREATE POLICY "tenant_isolation_policy" ON "AiPrediction"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiAnomaly
ALTER TABLE "AiAnomaly" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiAnomaly" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiAnomaly";
CREATE POLICY "tenant_isolation_policy" ON "AiAnomaly"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiAgent
ALTER TABLE "AiAgent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiAgent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiAgent";
CREATE POLICY "tenant_isolation_policy" ON "AiAgent"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiInteractionLog
ALTER TABLE "AiInteractionLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiInteractionLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiInteractionLog";
CREATE POLICY "tenant_isolation_policy" ON "AiInteractionLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiMetricsLog
ALTER TABLE "AiMetricsLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiMetricsLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiMetricsLog";
CREATE POLICY "tenant_isolation_policy" ON "AiMetricsLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for FeatureFlag
ALTER TABLE "FeatureFlag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FeatureFlag" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "FeatureFlag";
CREATE POLICY "tenant_isolation_policy" ON "FeatureFlag"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for TenantConfig
ALTER TABLE "TenantConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TenantConfig" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TenantConfig";
CREATE POLICY "tenant_isolation_policy" ON "TenantConfig"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for PlatformMetric
ALTER TABLE "PlatformMetric" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlatformMetric" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "PlatformMetric";
CREATE POLICY "tenant_isolation_policy" ON "PlatformMetric"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AppInstallation
ALTER TABLE "AppInstallation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppInstallation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AppInstallation";
CREATE POLICY "tenant_isolation_policy" ON "AppInstallation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for VehicleLocation
ALTER TABLE "VehicleLocation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VehicleLocation" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "VehicleLocation";
CREATE POLICY "tenant_isolation_policy" ON "VehicleLocation"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for GpsVehicleMapping
ALTER TABLE "GpsVehicleMapping" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GpsVehicleMapping" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "GpsVehicleMapping";
CREATE POLICY "tenant_isolation_policy" ON "GpsVehicleMapping"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for MasterRecord
ALTER TABLE "MasterRecord" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterRecord" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MasterRecord";
CREATE POLICY "tenant_isolation_policy" ON "MasterRecord"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DocumentFolder
ALTER TABLE "DocumentFolder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocumentFolder" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DocumentFolder";
CREATE POLICY "tenant_isolation_policy" ON "DocumentFolder"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Comment
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Comment";
CREATE POLICY "tenant_isolation_policy" ON "Comment"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for FileExport
ALTER TABLE "FileExport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FileExport" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "FileExport";
CREATE POLICY "tenant_isolation_policy" ON "FileExport"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WebResource
ALTER TABLE "WebResource" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebResource" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WebResource";
CREATE POLICY "tenant_isolation_policy" ON "WebResource"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ChatChannel
ALTER TABLE "ChatChannel" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatChannel" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ChatChannel";
CREATE POLICY "tenant_isolation_policy" ON "ChatChannel"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AiChatSession
ALTER TABLE "AiChatSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiChatSession" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiChatSession";
CREATE POLICY "tenant_isolation_policy" ON "AiChatSession"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for StarredItem
ALTER TABLE "StarredItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StarredItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "StarredItem";
CREATE POLICY "tenant_isolation_policy" ON "StarredItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for BackgroundJob
ALTER TABLE "BackgroundJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BackgroundJob" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "BackgroundJob";
CREATE POLICY "tenant_isolation_policy" ON "BackgroundJob"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for WorkspaceSnapshot
ALTER TABLE "WorkspaceSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkspaceSnapshot" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WorkspaceSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "WorkspaceSnapshot"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for OperationalAnomaly
ALTER TABLE "OperationalAnomaly" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OperationalAnomaly" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OperationalAnomaly";
CREATE POLICY "tenant_isolation_policy" ON "OperationalAnomaly"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for EventTimeline
ALTER TABLE "EventTimeline" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EventTimeline" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "EventTimeline";
CREATE POLICY "tenant_isolation_policy" ON "EventTimeline"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DeveloperApp
ALTER TABLE "DeveloperApp" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DeveloperApp" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DeveloperApp";
CREATE POLICY "tenant_isolation_policy" ON "DeveloperApp"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ApiAnalyticsLog
ALTER TABLE "ApiAnalyticsLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiAnalyticsLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ApiAnalyticsLog";
CREATE POLICY "tenant_isolation_policy" ON "ApiAnalyticsLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for MarketplaceUsageStats
ALTER TABLE "MarketplaceUsageStats" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MarketplaceUsageStats" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MarketplaceUsageStats";
CREATE POLICY "tenant_isolation_policy" ON "MarketplaceUsageStats"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AnalyticsDashboard
ALTER TABLE "AnalyticsDashboard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsDashboard" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AnalyticsDashboard";
CREATE POLICY "tenant_isolation_policy" ON "AnalyticsDashboard"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DashboardWidget
ALTER TABLE "DashboardWidget" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DashboardWidget" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DashboardWidget";
CREATE POLICY "tenant_isolation_policy" ON "DashboardWidget"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AnalyticsSnapshot
ALTER TABLE "AnalyticsSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnalyticsSnapshot" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AnalyticsSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "AnalyticsSnapshot"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ApiCredential
ALTER TABLE "ApiCredential" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiCredential" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ApiCredential";
CREATE POLICY "tenant_isolation_policy" ON "ApiCredential"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for ApiRequestLog
ALTER TABLE "ApiRequestLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiRequestLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ApiRequestLog";
CREATE POLICY "tenant_isolation_policy" ON "ApiRequestLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Notification
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Notification";
CREATE POLICY "tenant_isolation_policy" ON "Notification"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for NotificationPreference
ALTER TABLE "NotificationPreference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationPreference" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "NotificationPreference";
CREATE POLICY "tenant_isolation_policy" ON "NotificationPreference"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for NotificationTemplate
ALTER TABLE "NotificationTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationTemplate" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "NotificationTemplate";
CREATE POLICY "tenant_isolation_policy" ON "NotificationTemplate"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for NotificationDelivery
ALTER TABLE "NotificationDelivery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NotificationDelivery" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "NotificationDelivery";
CREATE POLICY "tenant_isolation_policy" ON "NotificationDelivery"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Announcement
ALTER TABLE "Announcement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Announcement" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Announcement";
CREATE POLICY "tenant_isolation_policy" ON "Announcement"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for InboxThread
ALTER TABLE "InboxThread" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InboxThread" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InboxThread";
CREATE POLICY "tenant_isolation_policy" ON "InboxThread"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for BusinessHealthSnapshot
ALTER TABLE "BusinessHealthSnapshot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessHealthSnapshot" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "BusinessHealthSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "BusinessHealthSnapshot"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for IdentityProvider
ALTER TABLE "IdentityProvider" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IdentityProvider" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "IdentityProvider";
CREATE POLICY "tenant_isolation_policy" ON "IdentityProvider"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Department
ALTER TABLE "Department" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Department" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Department";
CREATE POLICY "tenant_isolation_policy" ON "Department"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Team
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Team";
CREATE POLICY "tenant_isolation_policy" ON "Team"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for CostCenter
ALTER TABLE "CostCenter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CostCenter" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "CostCenter";
CREATE POLICY "tenant_isolation_policy" ON "CostCenter"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for SystemHealthLog
ALTER TABLE "SystemHealthLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemHealthLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "SystemHealthLog";
CREATE POLICY "tenant_isolation_policy" ON "SystemHealthLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for TraceSpan
ALTER TABLE "TraceSpan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TraceSpan" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TraceSpan";
CREATE POLICY "tenant_isolation_policy" ON "TraceSpan"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for EnterpriseLog
ALTER TABLE "EnterpriseLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EnterpriseLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "EnterpriseLog";
CREATE POLICY "tenant_isolation_policy" ON "EnterpriseLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for AlertEscalationPolicy
ALTER TABLE "AlertEscalationPolicy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AlertEscalationPolicy" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AlertEscalationPolicy";
CREATE POLICY "tenant_isolation_policy" ON "AlertEscalationPolicy"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for MaintenanceWindow
ALTER TABLE "MaintenanceWindow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MaintenanceWindow" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MaintenanceWindow";
CREATE POLICY "tenant_isolation_policy" ON "MaintenanceWindow"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Incident
ALTER TABLE "Incident" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Incident" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Incident";
CREATE POLICY "tenant_isolation_policy" ON "Incident"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for IncidentTimelineEvent
ALTER TABLE "IncidentTimelineEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "IncidentTimelineEvent" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "IncidentTimelineEvent";
CREATE POLICY "tenant_isolation_policy" ON "IncidentTimelineEvent"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for PostmortemReport
ALTER TABLE "PostmortemReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PostmortemReport" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "PostmortemReport";
CREATE POLICY "tenant_isolation_policy" ON "PostmortemReport"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for BackupJob
ALTER TABLE "BackupJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BackupJob" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "BackupJob";
CREATE POLICY "tenant_isolation_policy" ON "BackupJob"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DisasterRecoveryPlan
ALTER TABLE "DisasterRecoveryPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DisasterRecoveryPlan" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DisasterRecoveryPlan";
CREATE POLICY "tenant_isolation_policy" ON "DisasterRecoveryPlan"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for DisasterRecoveryDrill
ALTER TABLE "DisasterRecoveryDrill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DisasterRecoveryDrill" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DisasterRecoveryDrill";
CREATE POLICY "tenant_isolation_policy" ON "DisasterRecoveryDrill"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for PerformanceProfile
ALTER TABLE "PerformanceProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PerformanceProfile" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "PerformanceProfile";
CREATE POLICY "tenant_isolation_policy" ON "PerformanceProfile"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);


-- RLS for Company
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Company" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Company";
CREATE POLICY "tenant_isolation_policy" ON "Company"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "id" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "id" = current_setting('app.current_company_id', true)
);
