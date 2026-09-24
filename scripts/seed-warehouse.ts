import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany({ take: 2 });
  if (companies.length < 2) {
    console.log("Not enough companies found");
    return;
  }
  
  const companyA = companies[0];
  const companyB = companies[1];
  
  console.log(`Seeding Warehouse for ${companyA.name} and ${companyB.name}`);
  
  await prisma.warehouse.create({
    data: {
      companyId: companyA.id,
      name: `${companyA.name} Main Warehouse`,
      code: 'MAIN-A',
      address: '123 A Street',
      city: 'A City',
      state: 'ST',
    }
  });
  
  await prisma.warehouse.create({
    data: {
      companyId: companyB.id,
      name: `${companyB.name} Logistics Center`,
      code: 'LOG-B',
      address: '456 B Blvd',
      city: 'B City',
      state: 'ST',
    }
  });
  
  console.log("Seeding done.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
