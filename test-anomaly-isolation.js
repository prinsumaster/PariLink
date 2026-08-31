const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({datasources:{db:{url:'postgresql://parilink:devpassword@localhost:5433/parilink_db?schema=public'}}});

async function main() {
  // Find or create Tenant A and Tenant B
  let tenantA = await p.company.findFirst({ where: { name: 'Tenant A' } });
  if (!tenantA) tenantA = await p.company.create({ data: { name: 'Tenant A' } });
  
  let tenantB = await p.company.findFirst({ where: { name: 'Tenant B' } });
  if (!tenantB) tenantB = await p.company.create({ data: { name: 'Tenant B' } });

  // Create an anomaly for Tenant B
  // Anomaly is based on variancePct > 25 in FuelEntry
  const veh = await p.vehicle.create({ data: { companyId: tenantB.id, licensePlate: 'B-VEH-123', type: 'TRUCK',  status: 'ACTIVE' } });
  const drv = await p.driver.create({ data: { companyId: tenantB.id, firstName: 'B', lastName: 'Driver', licenseNumber: 'B-LIC', status: 'ACTIVE' } });
  
  await p.fuelEntry.create({
    data: {
      companyId: tenantB.id,
      vehicleId: veh.id,
      driverId: drv.id,
      litres: 100,
      amount: 1000,
      pump: 'Test Pump',
      expectedLitres: 50,
      variancePct: 50 // > 25 is an anomaly
    }
  });

  console.log('Seeded Tenant B anomaly.');

  // We will query using the service method directly to prove isolation
  const FuelIntelligenceService = require('./apps/api/dist/src/intelligence/fuel/fuel-intelligence.service').FuelIntelligenceService;
  
  // Need to mock PrismaService for FuelIntelligenceService
  const service = new FuelIntelligenceService({ runAsTenant: (cid, fn) => fn(p) });
  
  const aRes = await service.getAnomalies(tenantA.id);
  console.log('Tenant A anomalies:', aRes);

  const bRes = await service.getAnomalies(tenantB.id);
  console.log('Tenant B anomalies:', bRes);
}

main().catch(console.error).finally(() => p.$disconnect());
