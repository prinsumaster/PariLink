const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const comp = await prisma.company.findFirst({
    where: { name: 'PariLink Logistics LLC' },
    include: { tenantConfiguration: true }
  });
  console.log(JSON.stringify(comp, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
