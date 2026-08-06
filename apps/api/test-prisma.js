const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.tenantConfig.findFirst({ where: { companyId: "17c47413-9668-4c09-a583-16d82d33b483" } });
    console.log("Success");
  } catch (e) {
    console.error(e.message);
  }
  await prisma.$disconnect();
}
main();
