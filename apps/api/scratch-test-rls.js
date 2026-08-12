const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.$connect();
  
  // Create a customer bypassing RLS
  const cust = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
      return tx.customer.create({
          data: {
              name: 'RLS TEST',
              email: `rls_${Date.now()}@test.com`,
              status: 'ACTIVE',
              companyId: 'd71b8a05-dd81-4838-8e80-f6c76408dfe6' // fake company
          }
      });
  });
  console.log('Created:', cust.id);

  // Now try to fetch it as a different tenant
  const found = await prisma.$transaction(async (tx) => {
      // Intentionally NOT bypassing RLS
      await tx.$executeRaw`SELECT set_config('app.current_company_id', 'some-other-id', true)`;
      return tx.customer.findFirst({
          where: { id: cust.id }
      });
  });

  console.log('Found with different tenant?', found ? found.id : null);
  
  // Check bypass_rls setting
  const setting = await prisma.$queryRaw`SELECT current_setting('app.bypass_rls', true) as bypass`;
  console.log('Global bypass setting:', setting);

  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
