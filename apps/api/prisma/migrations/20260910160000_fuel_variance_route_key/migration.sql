-- Migration: fuel_variance_route_key
-- Adds originCity and destinationCity to FuelEntry.
-- These are copied from the trip's first Load at write-time, so the
-- root-cause engine can group by (vehicle+route) or (driver+route)
-- without a runtime join. RLS on FuelEntry already exists from the
-- prior FuelEntry migration — no new policy needed here.

-- AlterTable
ALTER TABLE "FuelEntry" ADD COLUMN "destinationCity" TEXT;
ALTER TABLE "FuelEntry" ADD COLUMN "originCity" TEXT;
