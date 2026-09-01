-- Partition VehicleLocation by month. Second attempt.
--
-- WHY THE FIRST ONE FAILED (P3018: relation "VehicleLocation_pkey" already
-- exists): ALTER TABLE ... RENAME TO renames the TABLE only. Constraints and
-- indexes keep their names and stay attached to the renamed table. So after
-- renaming to VehicleLocation_old, the name "VehicleLocation_pkey" was still
-- taken, and creating the replacement table collided on it.
--
-- SIX objects collide, not three. Every one must be renamed first:
--     VehicleLocation_pkey                                  (PK constraint)
--     VehicleLocation_companyId_fkey                        (FK constraint)
--     VehicleLocation_vehicleId_fkey                        (FK constraint)
--     VehicleLocation_companyId_vehicleId_gpsTimestamp_idx  (index)
--     VehicleLocation_provider_providerVehicleId_idx        (index)
--     VehicleLocation_companyId_gpsTimestamp_idx            (index, added by
--                                                            20260901150000)
--
-- SCHEMA-VISIBLE CONSEQUENCE: PostgreSQL requires the partition key to be
-- part of every unique constraint, so the primary key becomes
-- (id, gpsTimestamp) rather than (id). schema.prisma must carry
-- @@id([id, gpsTimestamp]) to match, or Prisma reports drift.
--
-- LOCKING: step 1's RENAME takes ACCESS EXCLUSIVE, and Prisma wraps each
-- migration in a single transaction, so that lock is held until COMMIT --
-- for the whole copy. VehicleLocation is unreadable and unwritable for the
-- entire duration. On an empty or near-empty table that is milliseconds.
-- At 100M rows (~20GB with indexes) the INSERT ... SELECT plus index builds
-- is realistically tens of minutes to over an hour: a planned outage of
-- telemetry ingest, not a migration to run casually. Beyond roughly 10M rows
-- this should be an online backfill (dual-write, copy in batches, swap)
-- rather than a migration.

-- 1-2. Rename the old table AND everything named after it.
ALTER TABLE "VehicleLocation" RENAME TO "VehicleLocation_old";

ALTER TABLE "VehicleLocation_old"
  RENAME CONSTRAINT "VehicleLocation_pkey" TO "VehicleLocation_old_pkey";
ALTER TABLE "VehicleLocation_old"
  RENAME CONSTRAINT "VehicleLocation_companyId_fkey" TO "VehicleLocation_old_companyId_fkey";
ALTER TABLE "VehicleLocation_old"
  RENAME CONSTRAINT "VehicleLocation_vehicleId_fkey" TO "VehicleLocation_old_vehicleId_fkey";

ALTER INDEX "VehicleLocation_companyId_vehicleId_gpsTimestamp_idx"
  RENAME TO "VehicleLocation_old_cvg_idx";
ALTER INDEX "VehicleLocation_provider_providerVehicleId_idx"
  RENAME TO "VehicleLocation_old_ppv_idx";
ALTER INDEX "VehicleLocation_companyId_gpsTimestamp_idx"
  RENAME TO "VehicleLocation_old_cg_idx";

-- 3. The partitioned replacement.
CREATE TABLE "VehicleLocation" (
  "id"                TEXT             NOT NULL DEFAULT gen_random_uuid()::text,
  "companyId"         TEXT             NOT NULL,
  "provider"          TEXT             NOT NULL,
  "providerVehicleId" TEXT             NOT NULL,
  "vehicleId"         TEXT,
  "latitude"          DOUBLE PRECISION NOT NULL,
  "longitude"         DOUBLE PRECISION NOT NULL,
  "speed"             DOUBLE PRECISION,
  "heading"           DOUBLE PRECISION,
  "altitude"          DOUBLE PRECISION,
  "accuracy"          DOUBLE PRECISION,
  "ignition"          BOOLEAN,
  "fuel"              DOUBLE PRECISION,
  "odometer"          DOUBLE PRECISION,
  "engineHours"       DOUBLE PRECISION,
  "signalStrength"    DOUBLE PRECISION,
  "gpsTimestamp"      TIMESTAMP(3)     NOT NULL,
  "receivedAt"        TIMESTAMP(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VehicleLocation_pkey" PRIMARY KEY ("id", "gpsTimestamp")
) PARTITION BY RANGE ("gpsTimestamp");

-- 4. Current month + 3 ahead, plus the catch-all.
DO $$
DECLARE
  m date := date_trunc('month', now())::date;
  i int;
  part text;
BEGIN
  FOR i IN 0..3 LOOP
    part := 'VehicleLocation_' || to_char(m + (i || ' month')::interval, 'YYYY_MM');
    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF "VehicleLocation" FOR VALUES FROM (%L) TO (%L)',
      part,
      (m + (i     || ' month')::interval)::date,
      (m + ((i+1) || ' month')::interval)::date);
  END LOOP;
END
$$;

-- Catch-all so a clock-skewed device does not error the insert. Rows landing
-- here are an alarm: PartitionMaintenanceService.warnIfDefaultPartitionHasRows()
-- reports them, and they cannot be moved into a real partition cheaply.
CREATE TABLE IF NOT EXISTS "VehicleLocation_default"
  PARTITION OF "VehicleLocation" DEFAULT;

-- 5. Copy. This is the expensive step; see LOCKING above.
INSERT INTO "VehicleLocation" (
  "id","companyId","provider","providerVehicleId","vehicleId","latitude",
  "longitude","speed","heading","altitude","accuracy","ignition","fuel",
  "odometer","engineHours","signalStrength","gpsTimestamp","receivedAt")
SELECT
  "id","companyId","provider","providerVehicleId","vehicleId","latitude",
  "longitude","speed","heading","altitude","accuracy","ignition","fuel",
  "odometer","engineHours","signalStrength","gpsTimestamp","receivedAt"
FROM "VehicleLocation_old";

-- 6. Indexes, FKs and RLS on the new table.
-- Created AFTER the copy: building an index once over the finished data is
-- markedly cheaper than maintaining three of them per inserted row.
CREATE INDEX "VehicleLocation_companyId_vehicleId_gpsTimestamp_idx"
  ON "VehicleLocation" ("companyId", "vehicleId", "gpsTimestamp");
CREATE INDEX "VehicleLocation_companyId_gpsTimestamp_idx"
  ON "VehicleLocation" ("companyId", "gpsTimestamp" DESC);
CREATE INDEX "VehicleLocation_provider_providerVehicleId_idx"
  ON "VehicleLocation" ("provider", "providerVehicleId");

-- A partitioned table may HAVE outgoing foreign keys (PG 12+); it may not be
-- the TARGET of one. Nothing references VehicleLocation, so both are restored.
ALTER TABLE "VehicleLocation"
  ADD CONSTRAINT "VehicleLocation_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VehicleLocation"
  ADD CONSTRAINT "VehicleLocation_vehicleId_fkey"
  FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RLS does not survive the swap -- the policy belonged to the old table.
-- Declared on the parent; PostgreSQL applies it to every partition.
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

-- 7. Drop the original.
DROP TABLE "VehicleLocation_old";
