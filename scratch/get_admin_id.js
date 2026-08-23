const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@parilink.com' } });
  console.log(user.id);
}
main().finally(() => prisma.$disconnect());
