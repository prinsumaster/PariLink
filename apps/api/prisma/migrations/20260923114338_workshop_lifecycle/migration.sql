-- DropIndex
DROP INDEX "JobCard_companyId_vehicleId_idx";

-- AlterTable
ALTER TABLE "JobCard" ADD COLUMN     "gateInOdometer" DOUBLE PRECISION,
ADD COLUMN     "gateInPhotoUrl" TEXT,
ADD COLUMN     "gateInTime" TIMESTAMP(3),
ADD COLUMN     "gateOutOdometer" DOUBLE PRECISION,
ADD COLUMN     "gateOutPhotoUrl" TEXT,
ADD COLUMN     "gateOutTime" TIMESTAMP(3),
ADD COLUMN     "ownerApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qcApprovedAt" TIMESTAMP(3),
ADD COLUMN     "qcApprovedById" TEXT;

-- CreateTable
CREATE TABLE "JobCardStatusHistory" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "durationMs" DOUBLE PRECISION,

    CONSTRAINT "JobCardStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobCardStatusHistory_companyId_jobCardId_idx" ON "JobCardStatusHistory"("companyId", "jobCardId");

-- CreateIndex
CREATE INDEX "JobCard_companyId_vehicleId_openedAt_idx" ON "JobCard"("companyId", "vehicleId", "openedAt");

-- CreateIndex
CREATE INDEX "Part_companyId_quantity_idx" ON "Part"("companyId", "quantity");

-- AddForeignKey
ALTER TABLE "JobCardStatusHistory" ADD CONSTRAINT "JobCardStatusHistory_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCardStatusHistory" ADD CONSTRAINT "JobCardStatusHistory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

