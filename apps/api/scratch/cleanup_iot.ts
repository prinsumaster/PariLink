import { PrismaClient } from '@prisma/client';

(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  
  const beforeVehicles = await prisma.vehicle.count();
  const beforeLocations = await prisma.vehicleLocation.count();
  const beforeConfigs = await prisma.integrationConfig.count();
  const beforeApiKeys = await prisma.apiKey.count();
  const beforeCompanies = await prisma.company.count();

  console.log(`Before: Vehicles=${beforeVehicles}, Locations=${beforeLocations}, Configs=${beforeConfigs}, ApiKeys=${beforeApiKeys}, Companies=${beforeCompanies}`);

  await prisma.vehicleLocation.deleteMany({ where: { vehicleId: 'V1' }});
  await prisma.vehicle.deleteMany({ where: { id: 'V1' }});
  await prisma.integrationConfig.deleteMany({ where: { companyId: 'SYSTEM', provider: 'IOT_PROVIDER' }});
  await prisma.apiKey.deleteMany({ where: { companyId: 'SYSTEM' }});
  await prisma.company.deleteMany({ where: { id: { in: ['SYSTEM', 'UNKNOWN_COMPANY'] } }});

  const afterVehicles = await prisma.vehicle.count();
  const afterLocations = await prisma.vehicleLocation.count();
  const afterConfigs = await prisma.integrationConfig.count();
  const afterApiKeys = await prisma.apiKey.count();
  const afterCompanies = await prisma.company.count();

  console.log(`After:  Vehicles=${afterVehicles}, Locations=${afterLocations}, Configs=${afterConfigs}, ApiKeys=${afterApiKeys}, Companies=${afterCompanies}`);

  await prisma.$disconnect();
})();
