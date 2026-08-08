-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "settlementId" TEXT;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
