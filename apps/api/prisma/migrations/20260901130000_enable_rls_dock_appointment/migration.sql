-- RLS for DockAppointment, via its REQUIRED parent.
--
-- 20260901120000_enable_rls_fk_linked_remaining deliberately excluded this
-- table, on the grounds that its parent FK is nullable. That is true of
-- `loadId String? @unique` -- but DockAppointment also has `dockId String`,
-- which is NOT NULL, and chains to tenancy as:
--
--     DockAppointment.dockId -> YardDock.id
--     YardDock.warehouseId   -> Warehouse.id
--     Warehouse.companyId
--
-- YardDock received its own EXISTS policy in that same migration, so the
-- subquery below resolves against an already tenant-filtered parent. No
-- schema change and no backfill are needed here: the required FK is enough.
--
-- Depth note: this is a two-hop chain (DockAppointment -> YardDock ->
-- Warehouse) but the policy only performs ONE lookup. YardDock's own policy
-- supplies the second hop when the subquery reads it, which is why matching
-- on p."warehouseId" is not necessary or correct here -- doing so would
-- duplicate YardDock's policy rather than compose with it.
--
-- Still NOT covered, and deliberately so:
--   OutboundOrder      -- every FK it has is nullable (waveId, loadId,
--                         stagedAtDockId), so there is no required parent to
--                         resolve tenancy through. Needs a denormalised
--                         companyId column plus a backfill.
--   OutboundOrderItem  -- orderId IS required, but its parent OutboundOrder
--                         has no tenancy anchor yet, so an EXISTS against it
--                         resolves nothing. Unblocked the moment
--                         OutboundOrder gets a companyId.
-- Both are a schema change and belong in their own migration.

ALTER TABLE "DockAppointment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DockAppointment" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "DockAppointment";
CREATE POLICY "tenant_isolation_policy" ON "DockAppointment"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "YardDock" p
    WHERE p."id" = "DockAppointment"."dockId"
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "YardDock" p
    WHERE p."id" = "DockAppointment"."dockId"
  )
);
