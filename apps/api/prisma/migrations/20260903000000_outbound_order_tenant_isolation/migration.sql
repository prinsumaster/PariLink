-- Tenant isolation for OutboundOrder and OutboundOrderItem.
--
-- WHY THESE TWO WERE SKIPPED, AND WHY THAT IS NO LONGER ACCEPTABLE
-- Every prior RLS migration passed over these two tables because
-- OutboundOrder has no companyId and all three of its foreign keys are
-- nullable (waveId, loadId, stagedAtDockId), so there is no required parent
-- to resolve tenancy through and an EXISTS-against-parent policy would make
-- every parentless row invisible to everyone. That reasoning was correct.
-- What it missed is that these are not dormant schema: OutboundOrder is
-- served by live code in warehouse.controller.ts, outbound.service.ts,
-- inbound-outbound.engine.ts and inventory-optimizer.service.ts. Shipped
-- endpoints, no database-level isolation.
--
-- THE FIX IS A DENORMALISED companyId, because there is no alternative.
-- A nullable-FK chain cannot anchor tenancy. The column is added nullable,
-- backfilled through whichever parent each row actually has, then made NOT
-- NULL only once the data supports it.
--
-- NOTE ON THE POLICY SHAPE: no `app.bypass_rls` disjunct. That escape hatch
-- was deliberately removed from all 219 policies by
-- 20260902000000_drop_bypass_rls and replaced by the parilink_sys BYPASSRLS
-- role, which runAsSystem now uses. Including it here would silently
-- reopen the hole on two tables. This matches the CURRENT convention, not
-- the one in the older migrations.

-- 1. Add the column, nullable for now.
ALTER TABLE "OutboundOrder"     ADD COLUMN IF NOT EXISTS "companyId" TEXT;
ALTER TABLE "OutboundOrderItem" ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- 2. Backfill through whichever parent exists. Order matters only in that
--    the first non-null wins; all three resolve to the same tenant for any
--    correctly-formed row.
UPDATE "OutboundOrder" o
SET "companyId" = COALESCE(
  (SELECT l."companyId" FROM "Load"         l WHERE l."id" = o."loadId"),
  (SELECT w."companyId" FROM "OutboundWave" w WHERE w."id" = o."waveId"),
  (SELECT wh."companyId"
     FROM "YardDock" d
     JOIN "Warehouse" wh ON wh."id" = d."warehouseId"
    WHERE d."id" = o."stagedAtDockId")
)
WHERE o."companyId" IS NULL;

UPDATE "OutboundOrderItem" i
SET "companyId" = (SELECT o."companyId" FROM "OutboundOrder" o WHERE o."id" = i."orderId")
WHERE i."companyId" IS NULL;

-- 3. Refuse to continue if any row could not be resolved, naming them.
--    A NOT NULL constraint added blind would fail with one row id and tell
--    you nothing about scale.
DO $$
DECLARE orphan_orders int; orphan_items int; sample text;
BEGIN
  SELECT count(*) INTO orphan_orders FROM "OutboundOrder"     WHERE "companyId" IS NULL;
  SELECT count(*) INTO orphan_items  FROM "OutboundOrderItem" WHERE "companyId" IS NULL;

  IF orphan_orders > 0 THEN
    SELECT string_agg(id, ', ') INTO sample
      FROM (SELECT id FROM "OutboundOrder" WHERE "companyId" IS NULL LIMIT 10) s;
    RAISE EXCEPTION
      'Cannot add NOT NULL companyId: % OutboundOrder row(s) have no resolvable tenant '
      '(waveId, loadId and stagedAtDockId all null or dangling). First 10: %. '
      'These rows cannot be attributed to a tenant and must be assigned or deleted first.',
      orphan_orders, sample;
  END IF;

  IF orphan_items > 0 THEN
    RAISE EXCEPTION
      'Cannot add NOT NULL companyId: % OutboundOrderItem row(s) have no parent order.',
      orphan_items;
  END IF;
END $$;

-- 4. Now enforce it.
ALTER TABLE "OutboundOrder"     ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "OutboundOrderItem" ALTER COLUMN "companyId" SET NOT NULL;

ALTER TABLE "OutboundOrder"
  ADD CONSTRAINT "OutboundOrder_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OutboundOrderItem"
  ADD CONSTRAINT "OutboundOrderItem_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "OutboundOrder_companyId_idx"     ON "OutboundOrder"("companyId");
CREATE INDEX IF NOT EXISTS "OutboundOrderItem_companyId_idx" ON "OutboundOrderItem"("companyId");

-- 5. RLS. FORCE is not optional: without it the policy does not apply to the
--    table owner, and the migration role owns these tables.
ALTER TABLE "OutboundOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OutboundOrder" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OutboundOrder";
CREATE POLICY "tenant_isolation_policy" ON "OutboundOrder"
AS PERMISSIVE FOR ALL
USING (
  "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  "companyId" = current_setting('app.current_company_id', true)
);

ALTER TABLE "OutboundOrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OutboundOrderItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OutboundOrderItem";
CREATE POLICY "tenant_isolation_policy" ON "OutboundOrderItem"
AS PERMISSIVE FOR ALL
USING (
  "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  "companyId" = current_setting('app.current_company_id', true)
);

-- 6. Assert the outcome rather than trusting the statements above.
DO $$
DECLARE missing int;
BEGIN
  SELECT count(*) INTO missing
    FROM (VALUES ('OutboundOrder'),('OutboundOrderItem')) t(name)
   WHERE NOT EXISTS (
     SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = t.name
        AND c.relrowsecurity AND c.relforcerowsecurity
        AND EXISTS (SELECT 1 FROM pg_policies p
                     WHERE p.tablename = t.name
                       AND p.policyname = 'tenant_isolation_policy'));
  IF missing > 0 THEN
    RAISE EXCEPTION 'RLS not correctly applied to % of the 2 outbound tables', missing;
  END IF;
END $$;
