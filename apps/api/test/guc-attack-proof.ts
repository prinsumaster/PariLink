import { PrismaService } from '../src/prisma/prisma.service';

async function run() {
  console.log('--- GUC Attack Proof ---');
  const prisma = new PrismaService();
  try {
    await prisma.onModuleInit();
    
    // Seed some data using system bypass
    await prisma.runAsSystem('[GucAttackTest] Seed Data', async (tx) => {
      await tx.company.upsert({
        where: { id: 'tenant-a' },
        update: {},
        create: { id: 'tenant-a', name: 'Tenant A' }
      });
      await tx.company.upsert({
        where: { id: 'tenant-b' },
        update: {},
        create: { id: 'tenant-b', name: 'Tenant B' }
      });
      await tx.customer.upsert({
        where: { id: 'cust-b' },
        update: {},
        create: { id: 'cust-b', name: 'Customer B', companyId: 'tenant-b' }
      });
    });

    console.log('Running as tenant-a...');
    await prisma.runAsTenant('tenant-a', async (tx) => {
      console.log('Attempting to inject set_config to tenant-b...');
      try {
        await tx.$executeRawUnsafe(`SELECT set_config('app.current_company_id', 'tenant-b', true)`);
        console.log('ATTACK SUCCEEDED: The interceptor failed to block set_config.');
        
        const victims = await (tx as any).customer.findMany();
        console.log('Stolen data:', victims);
        process.exit(1);
      } catch (err: any) {
        console.log('ATTACK BLOCKED:', err.message);
        if (err.message.includes('Forbidden raw query pattern')) {
          console.log('Proof successful: Interceptor correctly blocked the attack.');
        } else {
          console.log('Unexpected error:', err);
          process.exit(1);
        }
      }
    });

    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  } finally {
    await prisma.onModuleDestroy();
  }
}

run();
