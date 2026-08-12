const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const extendedPrisma = prisma.$extends({
  client: {
    async runAsSystem(callback) {
      return prisma.$transaction(async (tx) => {
        await tx.$executeRawUnsafe(`SELECT set_config('app.bypass_rls', 'on', true)`);
        return callback(tx);
      });
    },
  },
});

async function run() {
  try {
    const res = await extendedPrisma.runAsSystem(async (tx) => {
      const tenantA = await tx.company.create({ data: { name: 'RC10 Tenant A' } });
      const tenantB = await tx.company.create({ data: { name: 'RC10 Tenant B' } });
      
      const bUser = await tx.user.create({
        data: {
          email: 'rc10b_' + Date.now() + '@example.com',
          firstName: 'Tenant',
          lastName: 'B',
          password: 'dummy',
          companyId: tenantB.id
        }
      });

      const bCustomer = await tx.customer.create({
        data: {
          name: 'Tenant B Customer',
          companyId: tenantB.id,
          email: 'customerb_' + Date.now() + '@example.com'
        }
      });
      
      return { tenantA, tenantB, bUser, bCustomer };
    });
    
    const out = `TENANT_A=${res.tenantA.id}\nTENANT_B=${res.tenantB.id}\nB_USER=${res.bUser.id}\nB_CUSTOMER=${res.bCustomer.id}\n`;
    const fs = require('fs');
    fs.writeFileSync('/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc10-final-evidence/RC10-test-tenants.txt', out);
    console.log('Test tenants created successfully.');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
