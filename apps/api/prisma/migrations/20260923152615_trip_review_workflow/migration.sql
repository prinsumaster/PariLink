-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReviewRole" ADD VALUE 'WORKSHOP_MECHANIC';
ALTER TYPE "ReviewRole" ADD VALUE 'GATE_SECURITY';
ALTER TYPE "ReviewRole" ADD VALUE 'CUSTOMER_CONTACT';

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "overallScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "DriverScore" DROP COLUMN "behaviourScore",
DROP COLUMN "damageScore",
DROP COLUMN "fuelScore",
ADD COLUMN     "customerScore" DOUBLE PRECISION,
ADD COLUMN     "dispatcherScore" DOUBLE PRECISION,
ADD COLUMN     "fleetManagerScore" DOUBLE PRECISION,
ADD COLUMN     "mileageScore" DOUBLE PRECISION,
ADD COLUMN     "securityScore" DOUBLE PRECISION,
ADD COLUMN     "workshopScore" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "TripReview_companyId_tripId_reviewerRole_idx" ON "TripReview"("companyId", "tripId", "reviewerRole");

