import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.load.count();
  console.log('Total Loads:', count);
  const assigned = await prisma.load.findMany({
    where: { status: 'ASSIGNED' },
    select: { referenceNumber: true }
  });
  console.log('Assigned loads:', assigned);
  await prisma.$disconnect();
}
main();
