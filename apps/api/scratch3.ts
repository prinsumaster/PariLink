import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const load = await prisma.load.findFirst({ where: { referenceNumber: 'LD-E2E-1785854635031' } });
  console.log('Load:', load);
  await prisma.$disconnect();
}
main();
