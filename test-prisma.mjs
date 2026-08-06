import { PrismaClient } from './apps/api/node_modules/@prisma/client/index.js';
const prisma = new PrismaClient();
try {
  await prisma.load.findMany({
    where: { companyId: "abf642ff-1111-2222-3333-444455556666" },
    skip: 0,
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { customer: true }
  });
  console.log("Success");
} catch (e) {
  console.error("Failed:", e.message);
} finally {
  await prisma.$disconnect();
}
