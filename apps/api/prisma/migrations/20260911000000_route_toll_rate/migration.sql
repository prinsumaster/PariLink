CREATE TABLE "RouteTollRate" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "destinationCity" TEXT NOT NULL,
    "fastagCost" DOUBLE PRECISION NOT NULL,
    "cashCost" DOUBLE PRECISION,
    "distanceKm" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteTollRate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RouteTollRate_companyId_idx" ON "RouteTollRate"("companyId");

CREATE UNIQUE INDEX "RouteTollRate_companyId_originCity_destinationCity_key" ON "RouteTollRate"("companyId", "originCity", "destinationCity");

ALTER TABLE "RouteTollRate" ADD CONSTRAINT "RouteTollRate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RouteTollRate" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_isolation_policy" ON "RouteTollRate"
  FOR ALL
  USING ("companyId" = current_setting('app.current_company_id', true));
