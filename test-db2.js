const { PrismaClient } = require('./apps/api/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'admin@parilink.com' },
    include: { company: { include: { tenantConfiguration: true } } }
  });
  console.log('onboardingCompleted:', user?.company?.tenantConfiguration?.onboardingCompleted);
}
main().catch(console.error).finally(() => prisma.$disconnect());
