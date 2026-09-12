import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Restoring admin...');
  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL app.bypass_rls = 'on';`);
    await tx.$executeRawUnsafe(`SET LOCAL app.reason = 'Zero Trust Expiry Test';`);
    
    const admin: any[] = await tx.$queryRawUnsafe(`SELECT id FROM "User" WHERE email = 'admin@parilink.com' LIMIT 1;`);
    
    if (admin.length > 0) {
      await tx.$executeRawUnsafe(`UPDATE "User" SET status = 'ACTIVE' WHERE id = '${admin[0].id}';`);
      console.log('Admin restored successfully');
    } else {
      console.log('Admin not found!');
    }
  });
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
