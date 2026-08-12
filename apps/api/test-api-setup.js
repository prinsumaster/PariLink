const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const JWT_SECRET = 'e48257e0a9b0fdabd798936563fe6f105b8948d64ec6ee4b2a954a1fc4797b47a6b45f350e7f09fd50a94068641589a93eba9605c690149befa0d7cd9893cea0';

function createToken(userId, companyId) {
  return jwt.sign({ sub: userId, cid: companyId, rid: 'USER' }, JWT_SECRET, { algorithm: 'HS512', expiresIn: '1h' });
}

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
    const fs = require('fs');
    const envData = fs.readFileSync('/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc10-final-evidence/RC10-test-tenants.txt', 'utf8');
    const getVal = (key) => {
      const match = envData.match(new RegExp(`${key}=(.*)`));
      return match ? match[1] : null;
    };
    
    const tenantA = getVal('TENANT_A');
    const tenantB = getVal('TENANT_B');
    const bUser = getVal('B_USER');
    
    // Update B User to ACTIVE
    await extendedPrisma.runAsSystem(async (tx) => {
       await tx.user.update({
         where: { id: bUser },
         data: { status: 'ACTIVE' }
       });
    });

    // Create an A User
    const aUser = await extendedPrisma.runAsSystem(async (tx) => {
       return tx.user.create({
         data: {
           email: 'rc10a_' + Date.now() + '@example.com',
           firstName: 'Tenant',
           lastName: 'A',
           password: 'dummy',
           companyId: tenantA,
           status: 'ACTIVE'
         }
       });
    });
    
    // Create an Inbox Thread in Tenant B
    const bThread = await extendedPrisma.runAsSystem(async (tx) => {
       return tx.inboxThread.create({
         data: {
           subject: 'Secret B Thread',
           companyId: tenantB,
           participantIds: [bUser, aUser.id] // Inject A user into B's thread participant list
         }
       });
    });
    
    // Create an Inbox Thread in Tenant A
    const aThread = await extendedPrisma.runAsSystem(async (tx) => {
       return tx.inboxThread.create({
         data: {
           subject: 'Secret A Thread',
           companyId: tenantA,
           participantIds: [aUser.id]
         }
       });
    });

    const tokenA = createToken(aUser.id, tenantA);
    const tokenB = createToken(bUser, tenantB);
    
    console.log(`export TOKEN_A="${tokenA}"`);
    console.log(`export TOKEN_B="${tokenB}"`);
    console.log(`export THREAD_B="${bThread.id}"`);
    console.log(`export THREAD_A="${aThread.id}"`);
    console.log(`export USER_A="${aUser.id}"`);
    console.log(`export USER_B="${bUser}"`);
    
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
