import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const loads = await prisma.load.groupBy({ by: ['companyId'], _count: { _all: true } });
  const invoices = await prisma.invoice.groupBy({ by: ['companyId'], _count: { _all: true } });
  const vehicles = await prisma.vehicle.groupBy({ by: ['companyId'], _count: { _all: true } });
  const users = await prisma.user.groupBy({ by: ['companyId'], _count: { _all: true } });

  console.log("Loads by company:", JSON.stringify(loads, null, 2));
  console.log("Invoices by company:", JSON.stringify(invoices, null, 2));
  console.log("Vehicles by company:", JSON.stringify(vehicles, null, 2));
  console.log("Users by company:", JSON.stringify(users, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
