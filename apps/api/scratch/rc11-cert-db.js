const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const evidenceDir = '/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc11-certification-evidence';

function save(filename, data) {
  fs.writeFileSync(path.join(evidenceDir, filename), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
}

async function main() {
  const envData = fs.readFileSync('/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc10-final-evidence/RC10-P06-api-env.sh', 'utf8');
  const getVal = (key) => {
    const match = envData.match(new RegExp(`${key}="(.*)"`));
    return match ? match[1] : null;
  };
  
  const tokenA = getVal('TOKEN_A');
  const tokenB = getVal('TOKEN_B');
  const threadA = getVal('THREAD_A');
  const threadB = getVal('THREAD_B');

  const payloadA = jwt.decode(tokenA);
  const payloadB = jwt.decode(tokenB);
  
  const compA = payloadA.cid;
  const compB = payloadB.cid;

  // PHASE 3: RLS Default-Deny Verification
  console.log("PHASE 3: RLS Default Deny");

  const getThreadA = async (tx) => {
    const res = await tx.$queryRaw`SELECT id, "companyId" FROM "InboxThread" WHERE id = ${threadA}`;
    return res;
  };
  const getThreadB = async (tx) => {
    const res = await tx.$queryRaw`SELECT id, "companyId" FROM "InboxThread" WHERE id = ${threadB}`;
    return res;
  };

  const defaultDenyA = await prisma.$transaction(async (tx) => getThreadA(tx));
  const defaultDenyB = await prisma.$transaction(async (tx) => getThreadB(tx));
  
  const compACtx = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_company_id', ${compA}, true)`;
    return {
      threadA: await getThreadA(tx),
      threadB: await getThreadB(tx)
    };
  });

  const compBCtx = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_company_id', ${compB}, true)`;
    return {
      threadA: await getThreadA(tx),
      threadB: await getThreadB(tx)
    };
  });

  const phase3Evidence = {
    defaultDeny: {
      threadA: defaultDenyA.length,
      threadB: defaultDenyB.length
    },
    compA_context: {
      seesThreadA: compACtx.threadA.length > 0,
      seesThreadB: compACtx.threadB.length > 0
    },
    compB_context: {
      seesThreadA: compBCtx.threadA.length > 0,
      seesThreadB: compBCtx.threadB.length > 0
    }
  };
  
  save('RC11-P05-default-deny.txt', phase3Evidence);
  save('RC11-P06-tenant-context-isolation.txt', phase3Evidence);

  // PHASE 13: DB Integrity verification
  const attackRows = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return tx.inboxMessage.findMany({
      where: {
        OR: [
          { content: { contains: "ATTACK" } },
          { content: { contains: "FORGERY" } }
        ]
      }
    });
  });
  save('RC11-P17-post-attack-db-integrity.txt', { maliciousRows: attackRows.length });

  console.log("DB script complete");
}

main().catch(console.error).finally(() => prisma.$disconnect());
