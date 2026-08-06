const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const companyId = undefined;
    const whereTenant = { companyId };
    await prisma.tenantConfig.findFirst({ where: whereTenant });
  } catch (e) {
    console.error(e.message);
  }
  await prisma.$disconnect();
}
main();
