const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$use(async (params, next) => {
  console.log("params.model:", params.model);
  return next(params);
});
async function main() {
  await prisma.tenantConfig.findFirst({ where: {} });
  await prisma.$disconnect();
}
main();
