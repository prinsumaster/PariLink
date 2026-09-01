-- RLS for the remaining FK-linked tables: they hold tenant data but carry no
-- companyId of their own, so every earlier RLS migration skipped them.
-- Same EXISTS-against-the-parent approach as
-- 20260831174500_enable_rls_fk_linked_auth_money.
--
-- Behaviour, as with the auth/money batch:
--   runAsSystem  -> app.bypass_rls='on', first disjunct true, EXISTS never runs
--   runAsTenant  -> EXISTS resolves against the parent, itself RLS-filtered
--   neither set  -> both disjuncts false, zero rows. Fails closed.
--
-- Performance: every EXISTS is a primary-key lookup on the parent (all the
-- parents here use `id` as their PK, so it is indexed by definition). No new
-- index is required for these policies.
--
-- DELIBERATELY EXCLUDED -- these three must NOT get an EXISTS policy:
--   DockAppointment  (loadId  String?)
--   OutboundOrder    (waveId  String?)
--   OutboundOrderItem (chains through OutboundOrder)
-- Their parent FK is nullable and legitimately so -- a dock appointment that
-- is not yet tied to a load, an outbound order not yet assigned to a wave.
-- An EXISTS policy would evaluate false for those rows, making every
-- parentless row invisible to every tenant and blocking their creation
-- through WITH CHECK. That is a functional break, not a security win. These
-- three need a denormalised companyId column plus a backfill, which is a
-- schema change and belongs in its own migration.

-- AiChatMessage -> AiChatSession (via sessionId)
ALTER TABLE "AiChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiChatMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AiChatMessage";
CREATE POLICY "tenant_isolation_policy" ON "AiChatMessage"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AiChatSession" p
    WHERE p."id" = "AiChatMessage"."sessionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AiChatSession" p
    WHERE p."id" = "AiChatMessage"."sessionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- AnnouncementAudience -> Announcement (via announcementId)
ALTER TABLE "AnnouncementAudience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AnnouncementAudience" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AnnouncementAudience";
CREATE POLICY "tenant_isolation_policy" ON "AnnouncementAudience"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Announcement" p
    WHERE p."id" = "AnnouncementAudience"."announcementId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Announcement" p
    WHERE p."id" = "AnnouncementAudience"."announcementId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- AppConfiguration -> AppInstallation (via appInstallationId)
ALTER TABLE "AppConfiguration" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppConfiguration" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AppConfiguration";
CREATE POLICY "tenant_isolation_policy" ON "AppConfiguration"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppConfiguration"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppConfiguration"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- AppHealth -> AppInstallation (via appInstallationId)
ALTER TABLE "AppHealth" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppHealth" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AppHealth";
CREATE POLICY "tenant_isolation_policy" ON "AppHealth"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppHealth"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppHealth"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- AppOAuthConnection -> AppInstallation (via appInstallationId)
ALTER TABLE "AppOAuthConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppOAuthConnection" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AppOAuthConnection";
CREATE POLICY "tenant_isolation_policy" ON "AppOAuthConnection"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppOAuthConnection"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppOAuthConnection"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- AppUsageStatistic -> AppInstallation (via appInstallationId)
ALTER TABLE "AppUsageStatistic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppUsageStatistic" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AppUsageStatistic";
CREATE POLICY "tenant_isolation_policy" ON "AppUsageStatistic"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppUsageStatistic"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppUsageStatistic"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- AppWebhook -> AppInstallation (via appInstallationId)
ALTER TABLE "AppWebhook" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AppWebhook" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "AppWebhook";
CREATE POLICY "tenant_isolation_policy" ON "AppWebhook"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppWebhook"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "AppInstallation" p
    WHERE p."id" = "AppWebhook"."appInstallationId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- ApprovalStep -> ApprovalRequest (via requestId)
ALTER TABLE "ApprovalStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApprovalStep" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ApprovalStep";
CREATE POLICY "tenant_isolation_policy" ON "ApprovalStep"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "ApprovalRequest" p
    WHERE p."id" = "ApprovalStep"."requestId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "ApprovalRequest" p
    WHERE p."id" = "ApprovalStep"."requestId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- ChatChannelMember -> ChatChannel (via channelId)
ALTER TABLE "ChatChannelMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatChannelMember" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ChatChannelMember";
CREATE POLICY "tenant_isolation_policy" ON "ChatChannelMember"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "ChatChannel" p
    WHERE p."id" = "ChatChannelMember"."channelId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "ChatChannel" p
    WHERE p."id" = "ChatChannelMember"."channelId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- ChatMessage -> ChatChannel (via channelId)
ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ChatMessage";
CREATE POLICY "tenant_isolation_policy" ON "ChatMessage"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "ChatChannel" p
    WHERE p."id" = "ChatMessage"."channelId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "ChatChannel" p
    WHERE p."id" = "ChatMessage"."channelId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- DataQualityScore -> MasterRecord (via masterRecordId)
ALTER TABLE "DataQualityScore" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DataQualityScore" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DataQualityScore";
CREATE POLICY "tenant_isolation_policy" ON "DataQualityScore"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "MasterRecord" p
    WHERE p."id" = "DataQualityScore"."masterRecordId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "MasterRecord" p
    WHERE p."id" = "DataQualityScore"."masterRecordId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- DocumentVersion -> Document (via documentId)
ALTER TABLE "DocumentVersion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DocumentVersion" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DocumentVersion";
CREATE POLICY "tenant_isolation_policy" ON "DocumentVersion"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Document" p
    WHERE p."id" = "DocumentVersion"."documentId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Document" p
    WHERE p."id" = "DocumentVersion"."documentId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- ExternalReference -> MasterRecord (via masterRecordId)
ALTER TABLE "ExternalReference" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExternalReference" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ExternalReference";
CREATE POLICY "tenant_isolation_policy" ON "ExternalReference"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "MasterRecord" p
    WHERE p."id" = "ExternalReference"."masterRecordId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "MasterRecord" p
    WHERE p."id" = "ExternalReference"."masterRecordId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- InboundReceiptItem -> InboundReceipt (via receiptId)
ALTER TABLE "InboundReceiptItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InboundReceiptItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InboundReceiptItem";
CREATE POLICY "tenant_isolation_policy" ON "InboundReceiptItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "InboundReceipt" p
    WHERE p."id" = "InboundReceiptItem"."receiptId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "InboundReceipt" p
    WHERE p."id" = "InboundReceiptItem"."receiptId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- InboxMessage -> InboxThread (via threadId)
ALTER TABLE "InboxMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InboxMessage" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InboxMessage";
CREATE POLICY "tenant_isolation_policy" ON "InboxMessage"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "InboxThread" p
    WHERE p."id" = "InboxMessage"."threadId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "InboxThread" p
    WHERE p."id" = "InboxMessage"."threadId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- JobCardPart -> JobCard (via jobCardId)
ALTER TABLE "JobCardPart" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JobCardPart" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "JobCardPart";
CREATE POLICY "tenant_isolation_policy" ON "JobCardPart"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "JobCard" p
    WHERE p."id" = "JobCardPart"."jobCardId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "JobCard" p
    WHERE p."id" = "JobCardPart"."jobCardId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- MasterDataChangeLog -> MasterRecord (via masterRecordId)
ALTER TABLE "MasterDataChangeLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MasterDataChangeLog" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MasterDataChangeLog";
CREATE POLICY "tenant_isolation_policy" ON "MasterDataChangeLog"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "MasterRecord" p
    WHERE p."id" = "MasterDataChangeLog"."masterRecordId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "MasterRecord" p
    WHERE p."id" = "MasterDataChangeLog"."masterRecordId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- MessageReaction -> User (via userId)
ALTER TABLE "MessageReaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MessageReaction" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "MessageReaction";
CREATE POLICY "tenant_isolation_policy" ON "MessageReaction"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "MessageReaction"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "MessageReaction"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- OperationalPlanItem -> OperationalPlan (via planId)
ALTER TABLE "OperationalPlanItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OperationalPlanItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OperationalPlanItem";
CREATE POLICY "tenant_isolation_policy" ON "OperationalPlanItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "OperationalPlan" p
    WHERE p."id" = "OperationalPlanItem"."planId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "OperationalPlan" p
    WHERE p."id" = "OperationalPlanItem"."planId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- PurchaseOrderItem -> PurchaseOrder (via purchaseOrderId)
ALTER TABLE "PurchaseOrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PurchaseOrderItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "PurchaseOrderItem";
CREATE POLICY "tenant_isolation_policy" ON "PurchaseOrderItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "PurchaseOrder" p
    WHERE p."id" = "PurchaseOrderItem"."purchaseOrderId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "PurchaseOrder" p
    WHERE p."id" = "PurchaseOrderItem"."purchaseOrderId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- ScheduledSync -> IntegrationConnection (via connectionId)
ALTER TABLE "ScheduledSync" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ScheduledSync" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "ScheduledSync";
CREATE POLICY "tenant_isolation_policy" ON "ScheduledSync"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "IntegrationConnection" p
    WHERE p."id" = "ScheduledSync"."connectionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "IntegrationConnection" p
    WHERE p."id" = "ScheduledSync"."connectionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- SyncError -> IntegrationConnection (via connectionId)
ALTER TABLE "SyncError" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SyncError" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "SyncError";
CREATE POLICY "tenant_isolation_policy" ON "SyncError"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "IntegrationConnection" p
    WHERE p."id" = "SyncError"."connectionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "IntegrationConnection" p
    WHERE p."id" = "SyncError"."connectionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- TenderBid -> Tender (via tenderId)
ALTER TABLE "TenderBid" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TenderBid" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TenderBid";
CREATE POLICY "tenant_isolation_policy" ON "TenderBid"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Tender" p
    WHERE p."id" = "TenderBid"."tenderId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Tender" p
    WHERE p."id" = "TenderBid"."tenderId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- UserIdentity -> User (via userId)
ALTER TABLE "UserIdentity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserIdentity" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "UserIdentity";
CREATE POLICY "tenant_isolation_policy" ON "UserIdentity"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "UserIdentity"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "UserIdentity"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- UserWorkspaceState -> User (via userId)
ALTER TABLE "UserWorkspaceState" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserWorkspaceState" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "UserWorkspaceState";
CREATE POLICY "tenant_isolation_policy" ON "UserWorkspaceState"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "UserWorkspaceState"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "UserWorkspaceState"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- WarehouseZone -> Warehouse (via warehouseId)
ALTER TABLE "WarehouseZone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WarehouseZone" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WarehouseZone";
CREATE POLICY "tenant_isolation_policy" ON "WarehouseZone"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Warehouse" p
    WHERE p."id" = "WarehouseZone"."warehouseId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Warehouse" p
    WHERE p."id" = "WarehouseZone"."warehouseId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- WorkflowExecutionStep -> WorkflowExecution (via executionId)
ALTER TABLE "WorkflowExecutionStep" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkflowExecutionStep" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WorkflowExecutionStep";
CREATE POLICY "tenant_isolation_policy" ON "WorkflowExecutionStep"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "WorkflowExecution" p
    WHERE p."id" = "WorkflowExecutionStep"."executionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "WorkflowExecution" p
    WHERE p."id" = "WorkflowExecutionStep"."executionId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- YardDock -> Warehouse (via warehouseId)
ALTER TABLE "YardDock" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "YardDock" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "YardDock";
CREATE POLICY "tenant_isolation_policy" ON "YardDock"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Warehouse" p
    WHERE p."id" = "YardDock"."warehouseId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Warehouse" p
    WHERE p."id" = "YardDock"."warehouseId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- WarehouseBin -> WarehouseZone -> Warehouse (two hops: WarehouseZone has no companyId of its own)
ALTER TABLE "WarehouseBin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WarehouseBin" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WarehouseBin";
CREATE POLICY "tenant_isolation_policy" ON "WarehouseBin"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "WarehouseZone" m
    JOIN "Warehouse" g ON g."id" = m."warehouseId"
    WHERE m."id" = "WarehouseBin"."zoneId"
      AND g."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "WarehouseZone" m
    JOIN "Warehouse" g ON g."id" = m."warehouseId"
    WHERE m."id" = "WarehouseBin"."zoneId"
      AND g."companyId" = current_setting('app.current_company_id', true)
  )
);

-- Unrelated to RLS scope but surfaced by it: LorryReceipt has NO indexes at
-- all beyond the implicit primary key -- nothing on companyId, loadId,
-- lrNumber or vehicleId. Postgres does not auto-create indexes on foreign
-- key columns. Its tenant_isolation_policy (added in
-- 20260831173000_enable_rls_new_fleet_models) puts a companyId predicate on
-- every single query against it, so every one of those is a sequential scan.
CREATE INDEX IF NOT EXISTS "LorryReceipt_companyId_idx" ON "LorryReceipt"("companyId");
CREATE INDEX IF NOT EXISTS "LorryReceipt_companyId_status_idx" ON "LorryReceipt"("companyId", "status");
CREATE INDEX IF NOT EXISTS "LorryReceipt_loadId_idx" ON "LorryReceipt"("loadId");
CREATE INDEX IF NOT EXISTS "LorryReceipt_vehicleId_idx" ON "LorryReceipt"("vehicleId");
CREATE INDEX IF NOT EXISTS "LorryReceipt_companyId_lrNumber_idx" ON "LorryReceipt"("companyId", "lrNumber");
