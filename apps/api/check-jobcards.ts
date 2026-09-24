import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const jobCards = await prisma.jobCard.findMany({ include: { parts: true }, take: 1 });
  console.log(JSON.stringify(jobCards, null, 2));
}
main();
