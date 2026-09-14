// GUC RE-POINT ATTACK PROOF — run from repo root where node_modules/@prisma/client exists
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://parilink_app:apppassword@localhost:5433/parilink_db'
});

const TENANT_A = 'tenant-a';
const TENANT_B = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
const TENANT_B_CUSTOMER_ID = 'd1845aca-21f2-4911-80cc-22085ee2df5e';

async function main() {
  console.log('=== GUC RE-POINT ATTACK via Prisma $transaction ===');
  const role = await prisma.$queryRawUnsafe(
    `SELECT current_user, current_setting('is_superuser') AS superuser, (SELECT rolbypassrls FROM pg_roles WHERE rolname=current_user) AS bypassrls`
  );
  console.log('Role:', JSON.stringify(role));

  const result = await prisma.$transaction(async (tx) => {
    // Simulate runAsTenant('tenant-a', ...)
    await tx.$executeRawUnsafe(`SELECT set_config('app.current_company_id', $1, true)`, TENANT_A);
    const gucBefore = await tx.$queryRawUnsafe(`SELECT current_setting('app.current_company_id', true) AS guc`);
    console.log('GUC set to Tenant A:', JSON.stringify(gucBefore));

    const countA = await tx.$queryRawUnsafe(`SELECT count(*)::int AS count FROM "Customer"`);
    console.log('Customer count scoped to Tenant A:', JSON.stringify(countA));

    // ATTACK: repoint GUC to Tenant B inside the same transaction
    await tx.$executeRawUnsafe(`SELECT set_config('app.current_company_id', $1, true)`, TENANT_B);
    const gucAfter = await tx.$queryRawUnsafe(`SELECT current_setting('app.current_company_id', true) AS guc`);
    console.log('GUC after repoint to Tenant B:', JSON.stringify(gucAfter));

    const tenantBRow = await tx.$queryRawUnsafe(
      `SELECT id, "companyId", name FROM "Customer" WHERE id = $1`,
      TENANT_B_CUSTOMER_ID
    );
    console.log('Tenant B row by id after repoint:', JSON.stringify(tenantBRow));

    const allVisible = await tx.$queryRawUnsafe(`SELECT id, "companyId", name FROM "Customer" LIMIT 3`);
    console.log('All visible after repoint (LIMIT 3):', JSON.stringify(allVisible));

    return tenantBRow;
  });

  console.log('\n=== VERDICT ===');
  if (result.length > 0) {
    console.log('ATTACK SUCCEEDED — Tenant B row visible after GUC repoint inside Tenant A transaction');
    console.log('Row returned:', JSON.stringify(result));
  } else {
    console.log('ATTACK FAILED — Tenant B row not visible');
  }
}

main()
  .catch(e => { console.error('ERROR:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
