import { PrismaService } from '../src/prisma/prisma.service';

describe('A1 Lock Monitor (Real Database RLS)', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    // Drop NestJS mocks and connect directly to the real database
    prisma = new PrismaService();
    await prisma.onModuleInit();
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  it('runAsTenant should strictly isolate data via Postgres RLS', async () => {
    // 1. Seed test data using system bypass
    await prisma.runAsSystem('[IsolationTest] Seed Data', async (tx) => {
      await tx.company.upsert({
        where: { id: 'tenant-a' },
        update: {},
        create: { id: 'tenant-a', name: 'Tenant A' },
      });
      await tx.company.upsert({
        where: { id: 'tenant-b' },
        update: {},
        create: { id: 'tenant-b', name: 'Tenant B' },
      });
      await tx.customer.upsert({
        where: { id: 'cust-a-123' },
        update: {},
        create: { id: 'cust-a-123', name: 'Cust A', companyId: 'tenant-a' },
      });
      await tx.customer.upsert({
        where: { id: 'cust-b-456' },
        update: {},
        create: { id: 'cust-b-456', name: 'Cust B', companyId: 'tenant-b' },
      });
    });

    // 2. Test runAsTenant with tenant-a
    await prisma.runAsTenant('tenant-a', async (tx) => {
      // Verify app.current_company_id is set
      const rlsCheck = await tx.$queryRaw<any>`SELECT current_setting('app.current_company_id', true) as cid`;
      expect(rlsCheck[0].cid).toBe('tenant-a');

      // Attempt to read own data (Should Succeed)
      const custA = await (tx as any).customer.findUnique({
        where: { id: 'cust-a-123' },
      });
      expect(custA).toBeDefined();
      expect(custA?.id).toBe('cust-a-123');

      // ORM CROSS-TENANT READ (Should Fail/Return Null)
      const custB = await (tx as any).customer.findUnique({
        where: { id: 'cust-b-456' },
      });
      expect(custB).toBeNull();

      // RAW SQL CROSS-TENANT READ (Should Return 0 rows due to RLS)
      const rawCustB = await tx.$queryRaw<any>`SELECT * FROM "Customer" WHERE id = 'cust-b-456'`;
      expect(rawCustB.length).toBe(0);

      // GUC RE-POINT ATTACK (Should trigger Interceptor Exception)
      expect(() => {
        tx.$executeRawUnsafe(`SELECT set_config('app.current_company_id', 'tenant-b', true)`)
      }).toThrow('Forbidden raw query pattern');
    });

    // 3. Test runAsTenant with tenant-b
    await prisma.runAsTenant('tenant-b', async (tx) => {
      const custA = await (tx as any).customer.findUnique({
        where: { id: 'cust-a-123' },
      });
      expect(custA).toBeNull();
    });
  });
});
