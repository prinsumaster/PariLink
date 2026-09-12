-- CreateEnum
CREATE TYPE "ReviewRole" AS ENUM ('DISPATCHER', 'LOADER', 'SAFETY_OFFICER', 'UNLOADER', 'FLEET_MANAGER');

-- DropIndex
DROP INDEX "LorryReceipt_companyId_idx";

-- DropIndex
DROP INDEX "LorryReceipt_companyId_status_idx";

-- DropIndex
DROP INDEX "LorryReceipt_vehicleId_idx";

-- DropIndex
DROP INDEX "VehicleLocation_companyId_gpsTimestamp_idx";

-- AlterTable
ALTER TABLE "VehicleLocation" ALTER COLUMN "id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TripReview" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewerRole" "ReviewRole" NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TripReview_companyId_tripId_idx" ON "TripReview"("companyId", "tripId");

-- CreateIndex
CREATE INDEX "TripReview_companyId_reviewerId_idx" ON "TripReview"("companyId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "TripReview_tripId_reviewerRole_key" ON "TripReview"("tripId", "reviewerRole");

-- CreateIndex
CREATE INDEX "VehicleLocation_companyId_gpsTimestamp_idx" ON "VehicleLocation"("companyId", "gpsTimestamp");

-- AddForeignKey
ALTER TABLE "TripReview" ADD CONSTRAINT "TripReview_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripReview" ADD CONSTRAINT "TripReview_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripReview" ADD CONSTRAINT "TripReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security
ALTER TABLE "TripReview" ENABLE ROW LEVEL SECURITY;

-- Create Tenant Isolation Policy
CREATE POLICY "tenant_isolation_policy" ON "TripReview"
  FOR ALL
  USING ("companyId" = current_setting('app.current_company_id', true));
