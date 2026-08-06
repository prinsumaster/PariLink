const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.load.deleteMany({ where: { customerId: 'cust-a' } });
  await prisma.customer.deleteMany({ where: { id: 'cust-a' } });
  console.log('Deleted cust-a and its loads');
}
main().catch(console.error).finally(() => prisma.$disconnect());
