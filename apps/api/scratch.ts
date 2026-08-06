import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const load = await prisma.load.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(load);
  await prisma.$disconnect();
}
main();
