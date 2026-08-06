const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const isSuperAdmin = false;
    const companyId = "17c47413-9668-4c09-a583-16d82d33b483";
    const whereTenant = (!isSuperAdmin || companyId !== 'GLOBAL') ? { companyId } : {};
    
    await prisma.tenantConfig.findFirst({ where: whereTenant });
    
  } catch (e) {
    console.error(e.message);
  }
  await prisma.$disconnect();
}
main();
