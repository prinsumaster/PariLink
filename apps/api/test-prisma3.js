const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.tenantConfig.findFirst({ where: {} });
    console.log("Success with empty where");
  } catch (e) {
    console.error(e.message);
  }
  await prisma.$disconnect();
}
main();
