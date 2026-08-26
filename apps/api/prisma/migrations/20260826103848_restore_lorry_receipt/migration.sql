-- CreateTable
CREATE TABLE "LorryReceipt" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "loadId" TEXT NOT NULL,
    "lrNumber" TEXT NOT NULL,
    "consignorName" TEXT NOT NULL,
    "consignorGstin" TEXT,
    "consignorAddress" TEXT,
    "consigneeName" TEXT NOT NULL,
    "consigneeGstin" TEXT,
    "consigneeAddress" TEXT,
    "fromStation" TEXT NOT NULL,
    "toStation" TEXT NOT NULL,
    "vehicleId" TEXT,
    "vehicleNumber" TEXT,
    "goodsDescription" TEXT NOT NULL,
    "packagesCount" INTEGER NOT NULL,
    "packingType" TEXT,
    "actualWeightKg" DOUBLE PRECISION,
    "chargedWeightKg" DOUBLE PRECISION,
    "invoiceValue" DOUBLE PRECISION,
    "freightAmount" DOUBLE PRECISION NOT NULL,
    "hamaliCharges" DOUBLE PRECISION NOT NULL,
    "otherCharges" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentType" TEXT NOT NULL,
    "ewayBillNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'GENERATED',
    "podDocumentId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LorryReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LrSequence" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL,

    CONSTRAINT "LrSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LrSequence_companyId_financialYear_key" ON "LrSequence"("companyId", "financialYear");

-- AddForeignKey
ALTER TABLE "LorryReceipt" ADD CONSTRAINT "LorryReceipt_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorryReceipt" ADD CONSTRAINT "LorryReceipt_loadId_fkey" FOREIGN KEY ("loadId") REFERENCES "Load"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorryReceipt" ADD CONSTRAINT "LorryReceipt_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LrSequence" ADD CONSTRAINT "LrSequence_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
