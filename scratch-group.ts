import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const loads = await prisma.load.groupBy({ by: ['companyId'], _count: { _all: true } });
  const invoices = await prisma.invoice.groupBy({ by: ['companyId'], _count: { _all: true } });
  const vehicles = await prisma.vehicle.groupBy({ by: ['companyId'], _count: { _all: true } });
  const users = await prisma.user.groupBy({ by: ['companyId'], _count: { _all: true } });

  console.log("Loads by company:", loads);
  console.log("Invoices by company:", invoices);
  console.log("Vehicles by company:", vehicles);
  console.log("Users by company:", users);
  await prisma.$disconnect();
}
main().catch(console.error);
