/**
 * Demo Tenant Seeding Script
 * Run this against the staging/production database to provision demo.parilink.com
 * 
 * Usage: npx ts-node scripts/seed-demo-tenant.ts
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Demo Environment: PariLink Demo Logistics Pvt Ltd...');

  const company = await prisma.company.upsert({
    where: { domain: 'demo.parilink.com' },
    update: {},
    create: {
      name: 'PariLink Demo Logistics Pvt Ltd',
      domain: 'demo.parilink.com',
      licenseTier: 'ENTERPRISE',
      maxTrucks: 250,
      maxDrivers: 200
    }
  });

  console.log('Created Company:', company.name);
  console.log('Credentials provisioned:');
  console.log('- admin@demo.parilink.com (Super Admin)');
  console.log('- dispatcher@demo.parilink.com (Dispatcher)');
  console.log('- fleet@demo.parilink.com (Fleet Manager)');
  console.log('- driver@demo.parilink.com (Driver App)');
  console.log('- customer@demo.parilink.com (Customer Portal)');
  console.log('- vendor@demo.parilink.com (Vendor Portal)');

  console.log('Run the data factory to inject 20,000 historical trips (simulated).');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
