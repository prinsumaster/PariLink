import { PrismaClient } from './apps/api/node_modules/@prisma/client/index.js';
const prisma = new PrismaClient();
try {
  await prisma.$transaction(async (tx) => {
    const where = { companyId: "abf642ff-c0af-4c56-aed7-372106055c36" };
    const skip = 0;
    const take = "10";
    console.log("Running query with string take...");
    const [data, total] = await Promise.all([
      tx.load.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { customer: true },
      }),
      tx.load.count({ where }),
    ]);
    console.log("Success data length:", data.length);
  });
} catch (e) {
  console.error("Failed:", e.message);
} finally {
  await prisma.$disconnect();
}
