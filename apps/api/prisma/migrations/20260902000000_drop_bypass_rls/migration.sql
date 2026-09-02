-- Migration to drop app.bypass_rls from all tenant_isolation_policies

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ApiAnalyticsLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."ApiAnalyticsLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MarketplaceUsageStats";
CREATE POLICY "tenant_isolation_policy" ON "public"."MarketplaceUsageStats" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AnalyticsSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "public"."AnalyticsSnapshot" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."NotificationDelivery";
CREATE POLICY "tenant_isolation_policy" ON "public"."NotificationDelivery" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ApiRequestLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."ApiRequestLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."NotificationTemplate";
CREATE POLICY "tenant_isolation_policy" ON "public"."NotificationTemplate" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."SystemHealthLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."SystemHealthLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TraceSpan";
CREATE POLICY "tenant_isolation_policy" ON "public"."TraceSpan" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."EnterpriseLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."EnterpriseLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AlertEscalationPolicy";
CREATE POLICY "tenant_isolation_policy" ON "public"."AlertEscalationPolicy" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MaintenanceWindow";
CREATE POLICY "tenant_isolation_policy" ON "public"."MaintenanceWindow" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Incident";
CREATE POLICY "tenant_isolation_policy" ON "public"."Incident" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IncidentTimelineEvent";
CREATE POLICY "tenant_isolation_policy" ON "public"."IncidentTimelineEvent" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PostmortemReport";
CREATE POLICY "tenant_isolation_policy" ON "public"."PostmortemReport" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BackupJob";
CREATE POLICY "tenant_isolation_policy" ON "public"."BackupJob" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DisasterRecoveryPlan";
CREATE POLICY "tenant_isolation_policy" ON "public"."DisasterRecoveryPlan" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntelligencePrediction";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntelligencePrediction" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntelligencePredictionHistory";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntelligencePredictionHistory" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntelligenceVehicleHealth";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntelligenceVehicleHealth" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntelligenceRiskAssessment";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntelligenceRiskAssessment" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TrustedDevice";
CREATE POLICY "tenant_isolation_policy" ON "public"."TrustedDevice" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "TrustedDevice"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "TrustedDevice"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InvoiceLineItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."InvoiceLineItem" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "Invoice" p
  WHERE ((p.id = "InvoiceLineItem"."invoiceId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "Invoice" p
  WHERE ((p.id = "InvoiceLineItem"."invoiceId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DocumentVersion";
CREATE POLICY "tenant_isolation_policy" ON "public"."DocumentVersion" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "Document" p
  WHERE ((p.id = "DocumentVersion"."documentId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "Document" p
  WHERE ((p.id = "DocumentVersion"."documentId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."RefreshToken";
CREATE POLICY "tenant_isolation_policy" ON "public"."RefreshToken" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "RefreshToken"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "RefreshToken"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BackupCode";
CREATE POLICY "tenant_isolation_policy" ON "public"."BackupCode" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "BackupCode"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "BackupCode"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WebAuthnCredential";
CREATE POLICY "tenant_isolation_policy" ON "public"."WebAuthnCredential" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "WebAuthnCredential"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "WebAuthnCredential"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OptimizationWeightConfig";
CREATE POLICY "tenant_isolation_policy" ON "public"."OptimizationWeightConfig" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OptimizationFeedback";
CREATE POLICY "tenant_isolation_policy" ON "public"."OptimizationFeedback" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OAuthToken";
CREATE POLICY "tenant_isolation_policy" ON "public"."OAuthToken" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "OAuthClient" p
  WHERE ((p.id = "OAuthToken"."clientId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "OAuthClient" p
  WHERE ((p.id = "OAuthToken"."clientId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OperationalPlanItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."OperationalPlanItem" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "OperationalPlan" p
  WHERE ((p.id = "OperationalPlanItem"."planId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "OperationalPlan" p
  WHERE ((p.id = "OperationalPlanItem"."planId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TenderBid";
CREATE POLICY "tenant_isolation_policy" ON "public"."TenderBid" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "Tender" p
  WHERE ((p.id = "TenderBid"."tenderId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "Tender" p
  WHERE ((p.id = "TenderBid"."tenderId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WarehouseZone";
CREATE POLICY "tenant_isolation_policy" ON "public"."WarehouseZone" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "Warehouse" p
  WHERE ((p.id = "WarehouseZone"."warehouseId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "Warehouse" p
  WHERE ((p.id = "WarehouseZone"."warehouseId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WarehouseBin";
CREATE POLICY "tenant_isolation_policy" ON "public"."WarehouseBin" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM ("WarehouseZone" m
     JOIN "Warehouse" g ON ((g.id = m."warehouseId")))
  WHERE ((m.id = "WarehouseBin"."zoneId") AND (g."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("WarehouseZone" m
     JOIN "Warehouse" g ON ((g.id = m."warehouseId")))
  WHERE ((m.id = "WarehouseBin"."zoneId") AND (g."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AppConfiguration";
CREATE POLICY "tenant_isolation_policy" ON "public"."AppConfiguration" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppConfiguration"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppConfiguration"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DockAppointment";
CREATE POLICY "tenant_isolation_policy" ON "public"."DockAppointment" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "YardDock" p
  WHERE (p.id = "DockAppointment"."dockId")))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "YardDock" p
  WHERE (p.id = "DockAppointment"."dockId"))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CrmLead";
CREATE POLICY "tenant_isolation_policy" ON "public"."CrmLead" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."SsoSession";
CREATE POLICY "tenant_isolation_policy" ON "public"."SsoSession" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "IdentityProvider" p
  WHERE ((p.id = "SsoSession"."identityProviderId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "IdentityProvider" p
  WHERE ((p.id = "SsoSession"."identityProviderId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CrmActivity";
CREATE POLICY "tenant_isolation_policy" ON "public"."CrmActivity" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."SalesTarget";
CREATE POLICY "tenant_isolation_policy" ON "public"."SalesTarget" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiChatMessage";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiChatMessage" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "AiChatSession" p
  WHERE ((p.id = "AiChatMessage"."sessionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "AiChatSession" p
  WHERE ((p.id = "AiChatMessage"."sessionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."GstTaxRule";
CREATE POLICY "tenant_isolation_policy" ON "public"."GstTaxRule" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TaxLedger";
CREATE POLICY "tenant_isolation_policy" ON "public"."TaxLedger" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AnnouncementAudience";
CREATE POLICY "tenant_isolation_policy" ON "public"."AnnouncementAudience" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "Announcement" p
  WHERE ((p.id = "AnnouncementAudience"."announcementId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "Announcement" p
  WHERE ((p.id = "AnnouncementAudience"."announcementId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TollAccount";
CREATE POLICY "tenant_isolation_policy" ON "public"."TollAccount" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TollTransaction";
CREATE POLICY "tenant_isolation_policy" ON "public"."TollTransaction" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ChatChannelMember";
CREATE POLICY "tenant_isolation_policy" ON "public"."ChatChannelMember" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "ChatChannel" p
  WHERE ((p.id = "ChatChannelMember"."channelId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "ChatChannel" p
  WHERE ((p.id = "ChatChannelMember"."channelId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ComplianceRequirement";
CREATE POLICY "tenant_isolation_policy" ON "public"."ComplianceRequirement" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Invoice";
CREATE POLICY "tenant_isolation_policy" ON "public"."Invoice" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Trip";
CREATE POLICY "tenant_isolation_policy" ON "public"."Trip" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."LocationHistory";
CREATE POLICY "tenant_isolation_policy" ON "public"."LocationHistory" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Load";
CREATE POLICY "tenant_isolation_policy" ON "public"."Load" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Document";
CREATE POLICY "tenant_isolation_policy" ON "public"."Document" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DocumentSignature";
CREATE POLICY "tenant_isolation_policy" ON "public"."DocumentSignature" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Payment";
CREATE POLICY "tenant_isolation_policy" ON "public"."Payment" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AuditLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."AuditLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."RateCard";
CREATE POLICY "tenant_isolation_policy" ON "public"."RateCard" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CreditNote";
CREATE POLICY "tenant_isolation_policy" ON "public"."CreditNote" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Settlement";
CREATE POLICY "tenant_isolation_policy" ON "public"."Settlement" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."VendorBill";
CREATE POLICY "tenant_isolation_policy" ON "public"."VendorBill" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Expense";
CREATE POLICY "tenant_isolation_policy" ON "public"."Expense" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Account";
CREATE POLICY "tenant_isolation_policy" ON "public"."Account" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."JournalEntry";
CREATE POLICY "tenant_isolation_policy" ON "public"."JournalEntry" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."JournalLine";
CREATE POLICY "tenant_isolation_policy" ON "public"."JournalLine" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TenantConfiguration";
CREATE POLICY "tenant_isolation_policy" ON "public"."TenantConfiguration" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."VehicleTelemetry";
CREATE POLICY "tenant_isolation_policy" ON "public"."VehicleTelemetry" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DomainEvent";
CREATE POLICY "tenant_isolation_policy" ON "public"."DomainEvent" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TwinSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "public"."TwinSnapshot" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DispatchPlan";
CREATE POLICY "tenant_isolation_policy" ON "public"."DispatchPlan" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DispatchCandidate";
CREATE POLICY "tenant_isolation_policy" ON "public"."DispatchCandidate" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ConstraintViolation";
CREATE POLICY "tenant_isolation_policy" ON "public"."ConstraintViolation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CustomerPromise";
CREATE POLICY "tenant_isolation_policy" ON "public"."CustomerPromise" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OptimizationScenario";
CREATE POLICY "tenant_isolation_policy" ON "public"."OptimizationScenario" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OperationalPlan";
CREATE POLICY "tenant_isolation_policy" ON "public"."OperationalPlan" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OptimizationRecommendation";
CREATE POLICY "tenant_isolation_policy" ON "public"."OptimizationRecommendation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Quotation";
CREATE POLICY "tenant_isolation_policy" ON "public"."Quotation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntegrationConnection";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntegrationConnection" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WebhookDelivery";
CREATE POLICY "tenant_isolation_policy" ON "public"."WebhookDelivery" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DataMappingTemplate";
CREATE POLICY "tenant_isolation_policy" ON "public"."DataMappingTemplate" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."SyncJob";
CREATE POLICY "tenant_isolation_policy" ON "public"."SyncJob" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiRecommendation";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiRecommendation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiPrediction";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiPrediction" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiAnomaly";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiAnomaly" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiAgent";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiAgent" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiInteractionLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiInteractionLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiMetricsLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiMetricsLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Company";
CREATE POLICY "tenant_isolation_policy" ON "public"."Company" AS PERMISSIVE FOR ALL TO public USING ((id = current_setting('app.current_company_id'::text, true))) WITH CHECK ((id = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."StarredItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."StarredItem" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BackgroundJob";
CREATE POLICY "tenant_isolation_policy" ON "public"."BackgroundJob" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WorkspaceSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "public"."WorkspaceSnapshot" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OperationalAnomaly";
CREATE POLICY "tenant_isolation_policy" ON "public"."OperationalAnomaly" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Locale";
CREATE POLICY "tenant_isolation_policy" ON "public"."Locale" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Translation";
CREATE POLICY "tenant_isolation_policy" ON "public"."Translation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FuelStation";
CREATE POLICY "tenant_isolation_policy" ON "public"."FuelStation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FuelTransaction";
CREATE POLICY "tenant_isolation_policy" ON "public"."FuelTransaction" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."JobCardPart";
CREATE POLICY "tenant_isolation_policy" ON "public"."JobCardPart" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "JobCard" p
  WHERE ((p.id = "JobCardPart"."jobCardId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "JobCard" p
  WHERE ((p.id = "JobCardPart"."jobCardId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PurchaseOrderItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."PurchaseOrderItem" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "PurchaseOrder" p
  WHERE ((p.id = "PurchaseOrderItem"."purchaseOrderId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "PurchaseOrder" p
  WHERE ((p.id = "PurchaseOrderItem"."purchaseOrderId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Workshop";
CREATE POLICY "tenant_isolation_policy" ON "public"."Workshop" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Mechanic";
CREATE POLICY "tenant_isolation_policy" ON "public"."Mechanic" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."JobCard";
CREATE POLICY "tenant_isolation_policy" ON "public"."JobCard" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MaintenanceSchedule";
CREATE POLICY "tenant_isolation_policy" ON "public"."MaintenanceSchedule" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FuelCard";
CREATE POLICY "tenant_isolation_policy" ON "public"."FuelCard" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Customer";
CREATE POLICY "tenant_isolation_policy" ON "public"."Customer" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Vendor";
CREATE POLICY "tenant_isolation_policy" ON "public"."Vendor" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Driver";
CREATE POLICY "tenant_isolation_policy" ON "public"."Driver" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Vehicle";
CREATE POLICY "tenant_isolation_policy" ON "public"."Vehicle" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Role";
CREATE POLICY "tenant_isolation_policy" ON "public"."Role" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Branch";
CREATE POLICY "tenant_isolation_policy" ON "public"."Branch" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."User";
CREATE POLICY "tenant_isolation_policy" ON "public"."User" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."SupportTicket";
CREATE POLICY "tenant_isolation_policy" ON "public"."SupportTicket" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."LeaveRequest";
CREATE POLICY "tenant_isolation_policy" ON "public"."LeaveRequest" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WorkflowRule";
CREATE POLICY "tenant_isolation_policy" ON "public"."WorkflowRule" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."RuleExecutionHistory";
CREATE POLICY "tenant_isolation_policy" ON "public"."RuleExecutionHistory" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ApiKey";
CREATE POLICY "tenant_isolation_policy" ON "public"."ApiKey" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OAuthClient";
CREATE POLICY "tenant_isolation_policy" ON "public"."OAuthClient" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PersonalAccessToken";
CREATE POLICY "tenant_isolation_policy" ON "public"."PersonalAccessToken" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WebhookEndpoint";
CREATE POLICY "tenant_isolation_policy" ON "public"."WebhookEndpoint" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."YardGateLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."YardGateLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntegrationConfig";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntegrationConfig" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Geofence";
CREATE POLICY "tenant_isolation_policy" ON "public"."Geofence" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."GeofenceEvent";
CREATE POLICY "tenant_isolation_policy" ON "public"."GeofenceEvent" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AlertRule";
CREATE POLICY "tenant_isolation_policy" ON "public"."AlertRule" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Alert";
CREATE POLICY "tenant_isolation_policy" ON "public"."Alert" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Contract";
CREATE POLICY "tenant_isolation_policy" ON "public"."Contract" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Tender";
CREATE POLICY "tenant_isolation_policy" ON "public"."Tender" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Warehouse";
CREATE POLICY "tenant_isolation_policy" ON "public"."Warehouse" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InventoryItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."InventoryItem" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InboundReceipt";
CREATE POLICY "tenant_isolation_policy" ON "public"."InboundReceipt" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."OutboundWave";
CREATE POLICY "tenant_isolation_policy" ON "public"."OutboundWave" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MaterialEquipment";
CREATE POLICY "tenant_isolation_policy" ON "public"."MaterialEquipment" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WorkflowDefinition";
CREATE POLICY "tenant_isolation_policy" ON "public"."WorkflowDefinition" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WorkflowExecution";
CREATE POLICY "tenant_isolation_policy" ON "public"."WorkflowExecution" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DocumentFolder";
CREATE POLICY "tenant_isolation_policy" ON "public"."DocumentFolder" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Comment";
CREATE POLICY "tenant_isolation_policy" ON "public"."Comment" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FileExport";
CREATE POLICY "tenant_isolation_policy" ON "public"."FileExport" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WebResource";
CREATE POLICY "tenant_isolation_policy" ON "public"."WebResource" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ChatChannel";
CREATE POLICY "tenant_isolation_policy" ON "public"."ChatChannel" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AiChatSession";
CREATE POLICY "tenant_isolation_policy" ON "public"."AiChatSession" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."EventTimeline";
CREATE POLICY "tenant_isolation_policy" ON "public"."EventTimeline" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DeveloperApp";
CREATE POLICY "tenant_isolation_policy" ON "public"."DeveloperApp" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AnalyticsDashboard";
CREATE POLICY "tenant_isolation_policy" ON "public"."AnalyticsDashboard" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DashboardWidget";
CREATE POLICY "tenant_isolation_policy" ON "public"."DashboardWidget" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ApiCredential";
CREATE POLICY "tenant_isolation_policy" ON "public"."ApiCredential" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Notification";
CREATE POLICY "tenant_isolation_policy" ON "public"."Notification" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."NotificationPreference";
CREATE POLICY "tenant_isolation_policy" ON "public"."NotificationPreference" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Announcement";
CREATE POLICY "tenant_isolation_policy" ON "public"."Announcement" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."VehiclePermit";
CREATE POLICY "tenant_isolation_policy" ON "public"."VehiclePermit" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PayrollStructure";
CREATE POLICY "tenant_isolation_policy" ON "public"."PayrollStructure" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PayrollRun";
CREATE POLICY "tenant_isolation_policy" ON "public"."PayrollRun" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Payslip";
CREATE POLICY "tenant_isolation_policy" ON "public"."Payslip" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DriverAttendance";
CREATE POLICY "tenant_isolation_policy" ON "public"."DriverAttendance" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FleetKpiSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "public"."FleetKpiSnapshot" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Claim";
CREATE POLICY "tenant_isolation_policy" ON "public"."Claim" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntelligenceRecommendation";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntelligenceRecommendation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IntelligenceModelMetrics";
CREATE POLICY "tenant_isolation_policy" ON "public"."IntelligenceModelMetrics" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."EmergencyAlert";
CREATE POLICY "tenant_isolation_policy" ON "public"."EmergencyAlert" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TyreLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."TyreLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."HosViolation";
CREATE POLICY "tenant_isolation_policy" ON "public"."HosViolation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DvirLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."DvirLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InsuranceLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."InsuranceLog" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BankTransaction";
CREATE POLICY "tenant_isolation_policy" ON "public"."BankTransaction" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."KpiDefinition";
CREATE POLICY "tenant_isolation_policy" ON "public"."KpiDefinition" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CustomMetric";
CREATE POLICY "tenant_isolation_policy" ON "public"."CustomMetric" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TrendReport";
CREATE POLICY "tenant_isolation_policy" ON "public"."TrendReport" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."LorryReceipt";
CREATE POLICY "tenant_isolation_policy" ON "public"."LorryReceipt" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PurchaseOrder";
CREATE POLICY "tenant_isolation_policy" ON "public"."PurchaseOrder" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ExternalCarrier";
CREATE POLICY "tenant_isolation_policy" ON "public"."ExternalCarrier" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CarrierBid";
CREATE POLICY "tenant_isolation_policy" ON "public"."CarrierBid" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."LrSequence";
CREATE POLICY "tenant_isolation_policy" ON "public"."LrSequence" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."UserIdentity";
CREATE POLICY "tenant_isolation_policy" ON "public"."UserIdentity" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "UserIdentity"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "UserIdentity"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FuelEntry";
CREATE POLICY "tenant_isolation_policy" ON "public"."FuelEntry" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PlatformMetric";
CREATE POLICY "tenant_isolation_policy" ON "public"."PlatformMetric" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AppInstallation";
CREATE POLICY "tenant_isolation_policy" ON "public"."AppInstallation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."GpsVehicleMapping";
CREATE POLICY "tenant_isolation_policy" ON "public"."GpsVehicleMapping" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MasterRecord";
CREATE POLICY "tenant_isolation_policy" ON "public"."MasterRecord" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InboxThread";
CREATE POLICY "tenant_isolation_policy" ON "public"."InboxThread" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BusinessHealthSnapshot";
CREATE POLICY "tenant_isolation_policy" ON "public"."BusinessHealthSnapshot" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."IdentityProvider";
CREATE POLICY "tenant_isolation_policy" ON "public"."IdentityProvider" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Department";
CREATE POLICY "tenant_isolation_policy" ON "public"."Department" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Team";
CREATE POLICY "tenant_isolation_policy" ON "public"."Team" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."CostCenter";
CREATE POLICY "tenant_isolation_policy" ON "public"."CostCenter" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DisasterRecoveryDrill";
CREATE POLICY "tenant_isolation_policy" ON "public"."DisasterRecoveryDrill" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."PerformanceProfile";
CREATE POLICY "tenant_isolation_policy" ON "public"."PerformanceProfile" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BankStatement";
CREATE POLICY "tenant_isolation_policy" ON "public"."BankStatement" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."LoadBoardItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."LoadBoardItem" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ReportTemplate";
CREATE POLICY "tenant_isolation_policy" ON "public"."ReportTemplate" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ReportSchedule";
CREATE POLICY "tenant_isolation_policy" ON "public"."ReportSchedule" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ReportExecution";
CREATE POLICY "tenant_isolation_policy" ON "public"."ReportExecution" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."VehicleRegistration";
CREATE POLICY "tenant_isolation_policy" ON "public"."VehicleRegistration" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DriverScore";
CREATE POLICY "tenant_isolation_policy" ON "public"."DriverScore" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."Tyre";
CREATE POLICY "tenant_isolation_policy" ON "public"."Tyre" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."UserWorkspaceState";
CREATE POLICY "tenant_isolation_policy" ON "public"."UserWorkspaceState" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "UserWorkspaceState"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "UserWorkspaceState"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."JobPart";
CREATE POLICY "tenant_isolation_policy" ON "public"."JobPart" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."LoadingEvent";
CREATE POLICY "tenant_isolation_policy" ON "public"."LoadingEvent" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MaintenanceJob";
CREATE POLICY "tenant_isolation_policy" ON "public"."MaintenanceJob" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TripDesk";
CREATE POLICY "tenant_isolation_policy" ON "public"."TripDesk" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TripExpense";
CREATE POLICY "tenant_isolation_policy" ON "public"."TripExpense" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TruckProfitability";
CREATE POLICY "tenant_isolation_policy" ON "public"."TruckProfitability" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."SyncError";
CREATE POLICY "tenant_isolation_policy" ON "public"."SyncError" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "IntegrationConnection" p
  WHERE ((p.id = "SyncError"."connectionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "IntegrationConnection" p
  WHERE ((p.id = "SyncError"."connectionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."VehicleCurrentPosition";
CREATE POLICY "tenant_isolation_policy" ON "public"."VehicleCurrentPosition" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AppHealth";
CREATE POLICY "tenant_isolation_policy" ON "public"."AppHealth" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppHealth"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppHealth"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AppOAuthConnection";
CREATE POLICY "tenant_isolation_policy" ON "public"."AppOAuthConnection" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppOAuthConnection"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppOAuthConnection"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AppUsageStatistic";
CREATE POLICY "tenant_isolation_policy" ON "public"."AppUsageStatistic" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppUsageStatistic"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppUsageStatistic"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."AppWebhook";
CREATE POLICY "tenant_isolation_policy" ON "public"."AppWebhook" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppWebhook"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "AppInstallation" p
  WHERE ((p.id = "AppWebhook"."appInstallationId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ApprovalStep";
CREATE POLICY "tenant_isolation_policy" ON "public"."ApprovalStep" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "ApprovalRequest" p
  WHERE ((p.id = "ApprovalStep"."requestId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "ApprovalRequest" p
  WHERE ((p.id = "ApprovalStep"."requestId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ExternalReference";
CREATE POLICY "tenant_isolation_policy" ON "public"."ExternalReference" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "MasterRecord" p
  WHERE ((p.id = "ExternalReference"."masterRecordId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "MasterRecord" p
  WHERE ((p.id = "ExternalReference"."masterRecordId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InboundReceiptItem";
CREATE POLICY "tenant_isolation_policy" ON "public"."InboundReceiptItem" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "InboundReceipt" p
  WHERE ((p.id = "InboundReceiptItem"."receiptId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "InboundReceipt" p
  WHERE ((p.id = "InboundReceiptItem"."receiptId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."WorkflowExecutionStep";
CREATE POLICY "tenant_isolation_policy" ON "public"."WorkflowExecutionStep" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "WorkflowExecution" p
  WHERE ((p.id = "WorkflowExecutionStep"."executionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "WorkflowExecution" p
  WHERE ((p.id = "WorkflowExecutionStep"."executionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."YardDock";
CREATE POLICY "tenant_isolation_policy" ON "public"."YardDock" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "Warehouse" p
  WHERE ((p.id = "YardDock"."warehouseId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "Warehouse" p
  WHERE ((p.id = "YardDock"."warehouseId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."BankAccount";
CREATE POLICY "tenant_isolation_policy" ON "public"."BankAccount" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ChatMessage";
CREATE POLICY "tenant_isolation_policy" ON "public"."ChatMessage" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "ChatChannel" p
  WHERE ((p.id = "ChatMessage"."channelId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "ChatChannel" p
  WHERE ((p.id = "ChatMessage"."channelId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."DataQualityScore";
CREATE POLICY "tenant_isolation_policy" ON "public"."DataQualityScore" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "MasterRecord" p
  WHERE ((p.id = "DataQualityScore"."masterRecordId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "MasterRecord" p
  WHERE ((p.id = "DataQualityScore"."masterRecordId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."InboxMessage";
CREATE POLICY "tenant_isolation_policy" ON "public"."InboxMessage" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "InboxThread" p
  WHERE ((p.id = "InboxMessage"."threadId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "InboxThread" p
  WHERE ((p.id = "InboxMessage"."threadId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MasterDataChangeLog";
CREATE POLICY "tenant_isolation_policy" ON "public"."MasterDataChangeLog" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "MasterRecord" p
  WHERE ((p.id = "MasterDataChangeLog"."masterRecordId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "MasterRecord" p
  WHERE ((p.id = "MasterDataChangeLog"."masterRecordId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."MessageReaction";
CREATE POLICY "tenant_isolation_policy" ON "public"."MessageReaction" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "MessageReaction"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "User" p
  WHERE ((p.id = "MessageReaction"."userId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ScheduledSync";
CREATE POLICY "tenant_isolation_policy" ON "public"."ScheduledSync" AS PERMISSIVE FOR ALL TO public USING ((EXISTS ( SELECT 1
   FROM "IntegrationConnection" p
  WHERE ((p.id = "ScheduledSync"."connectionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "IntegrationConnection" p
  WHERE ((p.id = "ScheduledSync"."connectionId") AND (p."companyId" = current_setting('app.current_company_id'::text, true))))));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."ApprovalRequest";
CREATE POLICY "tenant_isolation_policy" ON "public"."ApprovalRequest" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."FeatureFlag";
CREATE POLICY "tenant_isolation_policy" ON "public"."FeatureFlag" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."TenantConfig";
CREATE POLICY "tenant_isolation_policy" ON "public"."TenantConfig" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

DROP POLICY IF EXISTS "tenant_isolation_policy" ON "public"."VehicleLocation";
CREATE POLICY "tenant_isolation_policy" ON "public"."VehicleLocation" AS PERMISSIVE FOR ALL TO public USING (("companyId" = current_setting('app.current_company_id'::text, true))) WITH CHECK (("companyId" = current_setting('app.current_company_id'::text, true)));

