import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const load = await prisma.load.findFirst({ where: { status: 'PENDING' }, select: { id: true } });
  console.log(load?.id || 'NOT_FOUND');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
