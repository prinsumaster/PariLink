import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Executing Customer 1 (ABC Logistics) Dry Run ---');
  const c1 = await prisma.company.upsert({
    where: { domain: 'abc.parilink.com' },
    update: {},
    create: {
      name: 'ABC Logistics',
      domain: 'abc.parilink.com',
      licenseTier: 'STARTER',
      maxTrucks: 20
    }
  });

  const d1 = await prisma.department.create({
    data: { name: 'Dispatch', companyId: c1.id }
  });

  console.log('Customer 1 Provisioned:', c1.name);

  console.log('--- Executing Customer 2 (XYZ Freight) Dry Run ---');
  const c2 = await prisma.company.upsert({
    where: { domain: 'xyz.parilink.com' },
    update: {},
    create: {
      name: 'XYZ Freight',
      domain: 'xyz.parilink.com',
      licenseTier: 'GROWTH',
      maxTrucks: 50
    }
  });

  const d2 = await prisma.department.create({
    data: { name: 'Logistics', companyId: c2.id }
  });

  console.log('Customer 2 Provisioned:', c2.name);

  console.log('--- Verifying Tenant Isolation ---');
  const c1Depts = await prisma.department.findMany({ where: { companyId: c1.id } });
  const c2Depts = await prisma.department.findMany({ where: { companyId: c2.id } });

  if (c1Depts.length === 1 && c1Depts[0].name === 'Dispatch' && 
      c2Depts.length === 1 && c2Depts[0].name === 'Logistics') {
    console.log('✅ Multi-Tenant Isolation Verified Flawlessly.');
  } else {
    console.error('❌ Data Bleed Detected!');
    process.exit(1);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
