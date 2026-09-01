-- Telemetry at scale: partition VehicleLocation, and stop the dispatch map
-- reading history to find "where is each truck now".
--
-- 10,000 trucks x 1 ping / 2 min = 7.2M rows/day into VehicleLocation, and
-- the ingress writes a DomainEvent per ping as well, so ~14.4M rows/day
-- across the two. Roughly 900GB/year for VehicleLocation with its indexes.
--
-- This migration is free today because the table is small. The same change
-- against 2 billion rows is a rewrite under an ACCESS EXCLUSIVE lock.
--
-- THREE separate problems are addressed:
--
-- 1. NO INDEX SERVES THE LIVE MAP QUERY.
--    live-fleet.service.ts runs:
--        WHERE "companyId" = $1 ORDER BY "gpsTimestamp" DESC LIMIT 500
--    The only usable index is [companyId, vehicleId, gpsTimestamp]. Because
--    vehicleId sits between the equality column and the sort column and is
--    NOT constrained by that query, Postgres cannot walk the index in
--    gpsTimestamp order. It reads every row for the tenant and sorts. At
--    7.2M rows/day that becomes a multi-second sort within the first week.
--    [companyId, gpsTimestamp DESC] fixes it.
--
-- 2. RETENTION IS IMPOSSIBLE WITHOUT PARTITIONS.
--    Deleting old telemetry with DELETE ... WHERE gpsTimestamp < cutoff
--    rewrites and bloats the table and never returns space without VACUUM
--    FULL. With monthly RANGE partitions, dropping a month is DROP TABLE:
--    instant, and it actually returns the disk.
--
-- 3. THE DISPATCH MAP SHOULD NOT READ HISTORY AT ALL.
--    "Where is each truck right now" is 10,000 rows, not 2 billion.
--    VehicleCurrentPosition holds exactly one row per vehicle, upserted on
--    each ping. The map reads that and never touches the history table.

-- ── 1. The index the live map actually needs, on the existing table ────────
CREATE INDEX IF NOT EXISTS "VehicleLocation_companyId_gpsTimestamp_idx"
  ON "VehicleLocation" ("companyId", "gpsTimestamp" DESC);

-- ── 2. Current position: one row per vehicle, upserted on write ───────────
CREATE TABLE IF NOT EXISTS "VehicleCurrentPosition" (
  "companyId"         TEXT        NOT NULL,
  "providerVehicleId" TEXT        NOT NULL,
  "vehicleId"         TEXT,
  "provider"          TEXT        NOT NULL,
  "latitude"          DOUBLE PRECISION NOT NULL,
  "longitude"         DOUBLE PRECISION NOT NULL,
  "speed"             DOUBLE PRECISION,
  "heading"           DOUBLE PRECISION,
  "ignition"          BOOLEAN,
  "gpsTimestamp"      TIMESTAMP(3) NOT NULL,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VehicleCurrentPosition_pkey" PRIMARY KEY ("companyId", "providerVehicleId")
);

CREATE INDEX IF NOT EXISTS "VehicleCurrentPosition_companyId_vehicleId_idx"
  ON "VehicleCurrentPosition" ("companyId", "vehicleId");

-- Same tenant isolation as everything else. companyId is a real column here,
-- so this uses the standard policy, not an EXISTS.
ALTER TABLE "VehicleCurrentPosition" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VehicleCurrentPosition" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "VehicleCurrentPosition";
CREATE POLICY "tenant_isolation_policy" ON "VehicleCurrentPosition"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);

-- Seed current position from the newest row per vehicle already on file.
INSERT INTO "VehicleCurrentPosition" (
  "companyId","providerVehicleId","vehicleId","provider","latitude",
  "longitude","speed","heading","ignition","gpsTimestamp"
)
SELECT DISTINCT ON ("companyId","providerVehicleId")
  "companyId","providerVehicleId","vehicleId","provider","latitude",
  "longitude","speed","heading","ignition","gpsTimestamp"
FROM "VehicleLocation"
ORDER BY "companyId","providerVehicleId","gpsTimestamp" DESC
ON CONFLICT ("companyId","providerVehicleId") DO NOTHING;

