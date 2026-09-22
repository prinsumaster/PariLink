-- AlterTable
ALTER TABLE "JobCard" ADD COLUMN     "odometer" DOUBLE PRECISION,
ADD COLUMN     "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "JobPart" ADD COLUMN     "partId" TEXT;

-- AlterTable
ALTER TABLE "MaintenanceJob" ADD COLUMN     "jobCardId" TEXT;

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "unitCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reorderLevel" DOUBLE PRECISION,
    "vendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Part_companyId_idx" ON "Part"("companyId");

-- CreateIndex
CREATE INDEX "Part_companyId_sku_idx" ON "Part"("companyId", "sku");

-- AddForeignKey
ALTER TABLE "MaintenanceJob" ADD CONSTRAINT "MaintenanceJob_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPart" ADD CONSTRAINT "JobPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS for Part
ALTER TABLE "Part" ENABLE ROW LEVEL SECURITY;

-- Create Policy for Part
CREATE POLICY "Tenant Isolation Policy for Part" ON "Part"
    FOR ALL
    USING ("companyId"::text = current_setting('app.current_tenant', true))
    WITH CHECK ("companyId"::text = current_setting('app.current_tenant', true));
