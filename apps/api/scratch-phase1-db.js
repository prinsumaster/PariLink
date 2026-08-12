const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.$connect();
  
  const roleInfo = await prisma.$queryRaw`
    SELECT rolname, rolsuper, rolbypassrls
    FROM pg_roles
    WHERE rolname = current_user;
  `;
  
  console.log("ROLE INFO:", roleInfo);

  // Check RLS status of a table, e.g., Customer
  const tableInfo = await prisma.$queryRaw`
    SELECT relname, relrowsecurity, relforcerowsecurity 
    FROM pg_class 
    WHERE relname = 'Customer';
  `;
  console.log("TABLE INFO:", tableInfo);

  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
