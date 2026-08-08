-- DropIndex
DROP INDEX "Expense_companyId_referenceId_key";

-- DropIndex
DROP INDEX "Payment_companyId_referenceNumber_key";

-- DropIndex
DROP INDEX "Settlement_companyId_driverId_periodStart_periodEnd_key";

-- DropIndex
DROP INDEX "TollAccount_companyId_provider_accountNumber_key";

-- DropIndex
DROP INDEX "TollTransaction_companyId_referenceNo_key";

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "vendorId" TEXT,
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mechanic" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "skills" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mechanic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCard" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "mechanicId" TEXT,
    "issueReported" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "totalCost" DOUBLE PRECISION,
    "workDone" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCardPart" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "partId" TEXT,
    "partName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCardPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceSchedule" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "intervalDays" INTEGER,
    "intervalKm" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelCard" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "dailyLimit" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelStation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "network" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelTransaction" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "fuelCardId" TEXT,
    "stationName" TEXT,
    "gallons" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "pricePerGallon" DOUBLE PRECISION,
    "odometer" DOUBLE PRECISION,
    "transactionTime" TIMESTAMP(3),
    "anomalyDetected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tyre" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "modelName" TEXT,
    "serialNumber" TEXT NOT NULL,
    "size" TEXT,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "purchaseDate" TIMESTAMP(3),
    "purchaseCost" DOUBLE PRECISION,
    "currentVehicleId" TEXT,
    "currentPosition" TEXT,
    "installedOdo" DOUBLE PRECISION,
    "removedOdo" DOUBLE PRECISION,
    "scrapValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tyre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TyreLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tyreId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "action" TEXT NOT NULL,
    "oldPosition" TEXT,
    "newPosition" TEXT,
    "odometer" DOUBLE PRECISION,
    "treadDepthMm" DOUBLE PRECISION,
    "reason" TEXT,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TyreLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HosViolation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "violationTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HosViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DvirLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "defects" JSONB NOT NULL DEFAULT '[]',
    "inspectorName" TEXT,
    "signature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DvirLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "coverageType" TEXT NOT NULL,
    "premiumAmount" DOUBLE PRECISION NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoadBoardItem" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "tripId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoadBoardItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locale" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "namespace" TEXT,
    "localeId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "format" TEXT,
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSchedule" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "recipients" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportExecution" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMsg" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleRegistration" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "state" TEXT,
    "plateNumber" TEXT,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "poNumber" TEXT,
    "date" TIMESTAMP(3),
    "expectedDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "receivedQty" DOUBLE PRECISION,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalCarrier" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalCarrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierBid" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "loadBoardItemId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiDefinition" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomMetric" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrendReport" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workshop_companyId_idx" ON "Workshop"("companyId");

-- CreateIndex
CREATE INDEX "Mechanic_companyId_workshopId_idx" ON "Mechanic"("companyId", "workshopId");

-- CreateIndex
CREATE INDEX "JobCard_companyId_vehicleId_idx" ON "JobCard"("companyId", "vehicleId");

-- CreateIndex
CREATE INDEX "JobCard_companyId_status_idx" ON "JobCard"("companyId", "status");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_companyId_vehicleId_idx" ON "MaintenanceSchedule"("companyId", "vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "FuelCard_cardNumber_key" ON "FuelCard"("cardNumber");

-- CreateIndex
CREATE INDEX "FuelCard_companyId_idx" ON "FuelCard"("companyId");

-- CreateIndex
CREATE INDEX "FuelStation_companyId_idx" ON "FuelStation"("companyId");

-- CreateIndex
CREATE INDEX "FuelTransaction_companyId_vehicleId_idx" ON "FuelTransaction"("companyId", "vehicleId");

-- CreateIndex
CREATE UNIQUE INDEX "Tyre_serialNumber_key" ON "Tyre"("serialNumber");

-- CreateIndex
CREATE INDEX "Tyre_companyId_currentVehicleId_idx" ON "Tyre"("companyId", "currentVehicleId");

-- CreateIndex
CREATE INDEX "TyreLog_companyId_tyreId_idx" ON "TyreLog"("companyId", "tyreId");

-- CreateIndex
CREATE INDEX "HosViolation_companyId_driverId_idx" ON "HosViolation"("companyId", "driverId");

-- CreateIndex
CREATE INDEX "DvirLog_companyId_vehicleId_idx" ON "DvirLog"("companyId", "vehicleId");

-- CreateIndex
CREATE INDEX "InsuranceLog_companyId_vehicleId_idx" ON "InsuranceLog"("companyId", "vehicleId");

-- CreateIndex
CREATE INDEX "LoadBoardItem_companyId_idx" ON "LoadBoardItem"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Locale_code_key" ON "Locale"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_localeId_namespace_key_key" ON "Translation"("localeId", "namespace", "key");

-- CreateIndex
CREATE INDEX "ReportTemplate_companyId_idx" ON "ReportTemplate"("companyId");

-- CreateIndex
CREATE INDEX "ReportSchedule_companyId_templateId_idx" ON "ReportSchedule"("companyId", "templateId");

-- CreateIndex
CREATE INDEX "ReportExecution_companyId_templateId_idx" ON "ReportExecution"("companyId", "templateId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleRegistration_vehicleId_key" ON "VehicleRegistration"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleRegistration_companyId_vehicleId_idx" ON "VehicleRegistration"("companyId", "vehicleId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_companyId_vendorId_idx" ON "PurchaseOrder"("companyId", "vendorId");

-- CreateIndex
CREATE INDEX "ExternalCarrier_companyId_idx" ON "ExternalCarrier"("companyId");

-- CreateIndex
CREATE INDEX "CarrierBid_companyId_idx" ON "CarrierBid"("companyId");

-- CreateIndex
CREATE INDEX "KpiDefinition_companyId_idx" ON "KpiDefinition"("companyId");

-- CreateIndex
CREATE INDEX "CustomMetric_companyId_idx" ON "CustomMetric"("companyId");

-- CreateIndex
CREATE INDEX "TrendReport_companyId_idx" ON "TrendReport"("companyId");

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mechanic" ADD CONSTRAINT "Mechanic_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES "Mechanic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCardPart" ADD CONSTRAINT "JobCardPart_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedule" ADD CONSTRAINT "MaintenanceSchedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelCard" ADD CONSTRAINT "FuelCard_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelStation" ADD CONSTRAINT "FuelStation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelTransaction" ADD CONSTRAINT "FuelTransaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tyre" ADD CONSTRAINT "Tyre_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TyreLog" ADD CONSTRAINT "TyreLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HosViolation" ADD CONSTRAINT "HosViolation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DvirLog" ADD CONSTRAINT "DvirLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceLog" ADD CONSTRAINT "InsuranceLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoadBoardItem" ADD CONSTRAINT "LoadBoardItem_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTemplate" ADD CONSTRAINT "ReportTemplate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSchedule" ADD CONSTRAINT "ReportSchedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportExecution" ADD CONSTRAINT "ReportExecution_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportExecution" ADD CONSTRAINT "ReportExecution_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ReportTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleRegistration" ADD CONSTRAINT "VehicleRegistration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalCarrier" ADD CONSTRAINT "ExternalCarrier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierBid" ADD CONSTRAINT "CarrierBid_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiDefinition" ADD CONSTRAINT "KpiDefinition_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMetric" ADD CONSTRAINT "CustomMetric_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrendReport" ADD CONSTRAINT "TrendReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
