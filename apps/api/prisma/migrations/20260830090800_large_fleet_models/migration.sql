/*
  Warnings:

  - You are about to drop the column `efficiencyScore` on the `DriverScore` table. All the data in the column will be lost.
  - You are about to drop the column `healthScore` on the `DriverScore` table. All the data in the column will be lost.
  - You are about to drop the column `onTimePercent` on the `DriverScore` table. All the data in the column will be lost.
  - You are about to drop the column `safetyScore` on the `DriverScore` table. All the data in the column will be lost.
  - You are about to drop the column `currentPosition` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `currentVehicleId` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `installedOdo` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `modelName` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseCost` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `removedOdo` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `scrapValue` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `serialNumber` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Tyre` table. All the data in the column will be lost.
  - You are about to drop the `WorkOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serialNo]` on the table `Tyre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tripId` to the `DriverScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Tyre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedLifeKm` to the `Tyre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fittedAtKm` to the `Tyre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Tyre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serialNo` to the `Tyre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleId` to the `Tyre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_companyId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrderItem" DROP CONSTRAINT "WorkOrderItem_workOrderId_fkey";

-- DropIndex
DROP INDEX "DriverScore_companyId_idx";

-- DropIndex
DROP INDEX "DriverScore_driverId_key";

-- DropIndex
DROP INDEX "Tyre_companyId_currentVehicleId_idx";

-- DropIndex
DROP INDEX "Tyre_serialNumber_key";

-- AlterTable
ALTER TABLE "DriverScore" DROP COLUMN "efficiencyScore",
DROP COLUMN "healthScore",
DROP COLUMN "onTimePercent",
DROP COLUMN "safetyScore",
ADD COLUMN     "behaviourScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "damageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "fuelScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "onTime" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "podUploaded" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ratedAt" TIMESTAMP(3),
ADD COLUMN     "ratedBy" TEXT,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "tripId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "balanceDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tyre" DROP COLUMN "currentPosition",
DROP COLUMN "currentVehicleId",
DROP COLUMN "installedOdo",
DROP COLUMN "modelName",
DROP COLUMN "purchaseCost",
DROP COLUMN "purchaseDate",
DROP COLUMN "removedOdo",
DROP COLUMN "scrapValue",
DROP COLUMN "serialNumber",
DROP COLUMN "size",
DROP COLUMN "type",
ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expectedLifeKm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fittedAtKm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "position" TEXT NOT NULL,
ADD COLUMN     "removedAtKm" DOUBLE PRECISION,
ADD COLUMN     "serialNo" TEXT NOT NULL,
ADD COLUMN     "vehicleId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "WorkOrder";

-- DropTable
DROP TABLE "WorkOrderItem";

-- CreateTable
CREATE TABLE "TruckProfitability" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fuelCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tollCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maintCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driverCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TruckProfitability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceJob" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "tripId" TEXT,
    "type" TEXT NOT NULL,
    "vendorId" TEXT,
    "labourCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "odometer" DOUBLE PRECISION,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPart" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "maintenanceJobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorId" TEXT,
    "jobCardId" TEXT,

    CONSTRAINT "JobPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripDesk" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "desk" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripDesk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelEntry" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "litres" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "pump" TEXT,
    "slipNo" TEXT,
    "expectedLitres" DOUBLE PRECISION,
    "variancePct" DOUBLE PRECISION,
    "filledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadingEvent" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "point" TEXT NOT NULL,
    "timeIn" TIMESTAMP(3),
    "timeOut" TIMESTAMP(3),
    "weightIn" DOUBLE PRECISION,
    "weightOut" DOUBLE PRECISION,
    "hamaliCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detentionHrs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "detentionCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loadId" TEXT,

    CONSTRAINT "LoadingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripExpense" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripExpense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TruckProfitability_companyId_vehicleId_idx" ON "TruckProfitability"("companyId", "vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "TruckProfitability_companyId_vehicleId_month_key" ON "TruckProfitability"("companyId", "vehicleId", "month");

-- CreateIndex
CREATE INDEX "MaintenanceJob_companyId_idx" ON "MaintenanceJob"("companyId");

-- CreateIndex
CREATE INDEX "MaintenanceJob_vehicleId_idx" ON "MaintenanceJob"("vehicleId");

-- CreateIndex
CREATE INDEX "MaintenanceJob_tripId_idx" ON "MaintenanceJob"("tripId");

-- CreateIndex
CREATE INDEX "JobPart_companyId_maintenanceJobId_idx" ON "JobPart"("companyId", "maintenanceJobId");

-- CreateIndex
CREATE INDEX "TripDesk_companyId_tripId_idx" ON "TripDesk"("companyId", "tripId");

-- CreateIndex
CREATE INDEX "TripDesk_companyId_desk_idx" ON "TripDesk"("companyId", "desk");

-- CreateIndex
CREATE INDEX "FuelEntry_companyId_tripId_idx" ON "FuelEntry"("companyId", "tripId");

-- CreateIndex
CREATE INDEX "FuelEntry_companyId_vehicleId_idx" ON "FuelEntry"("companyId", "vehicleId");

-- CreateIndex
CREATE INDEX "LoadingEvent_companyId_tripId_idx" ON "LoadingEvent"("companyId", "tripId");

-- CreateIndex
CREATE INDEX "TripExpense_companyId_tripId_idx" ON "TripExpense"("companyId", "tripId");

-- CreateIndex
CREATE INDEX "DriverScore_companyId_driverId_idx" ON "DriverScore"("companyId", "driverId");

-- CreateIndex
CREATE INDEX "DriverScore_companyId_tripId_idx" ON "DriverScore"("companyId", "tripId");

-- CreateIndex
CREATE UNIQUE INDEX "Tyre_serialNo_key" ON "Tyre"("serialNo");

-- CreateIndex
CREATE INDEX "Tyre_companyId_vehicleId_idx" ON "Tyre"("companyId", "vehicleId");

-- AddForeignKey
ALTER TABLE "TruckProfitability" ADD CONSTRAINT "TruckProfitability_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckProfitability" ADD CONSTRAINT "TruckProfitability_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceJob" ADD CONSTRAINT "MaintenanceJob_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceJob" ADD CONSTRAINT "MaintenanceJob_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceJob" ADD CONSTRAINT "MaintenanceJob_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceJob" ADD CONSTRAINT "MaintenanceJob_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPart" ADD CONSTRAINT "JobPart_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPart" ADD CONSTRAINT "JobPart_maintenanceJobId_fkey" FOREIGN KEY ("maintenanceJobId") REFERENCES "MaintenanceJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPart" ADD CONSTRAINT "JobPart_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPart" ADD CONSTRAINT "JobPart_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverScore" ADD CONSTRAINT "DriverScore_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tyre" ADD CONSTRAINT "Tyre_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripDesk" ADD CONSTRAINT "TripDesk_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripDesk" ADD CONSTRAINT "TripDesk_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelEntry" ADD CONSTRAINT "FuelEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelEntry" ADD CONSTRAINT "FuelEntry_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelEntry" ADD CONSTRAINT "FuelEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelEntry" ADD CONSTRAINT "FuelEntry_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingEvent" ADD CONSTRAINT "LoadingEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingEvent" ADD CONSTRAINT "LoadingEvent_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadingEvent" ADD CONSTRAINT "LoadingEvent_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "Load"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripExpense" ADD CONSTRAINT "TripExpense_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripExpense" ADD CONSTRAINT "TripExpense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
