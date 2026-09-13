import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('A1 Lock Monitor (Prisma runAsTenant)', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('runAsTenant should restrict visibility to only the given tenant (RLS lock)', async () => {
    await prisma.runAsSystem('Setup dummy tenants', async (tx) => {
      await tx.company.upsert({
        where: { id: 'tenant-x' },
        update: {},
        create: { id: 'tenant-x', name: 'Tenant X' },
      });
      await tx.company.upsert({
        where: { id: 'tenant-y' },
        update: {},
        create: { id: 'tenant-y', name: 'Tenant Y' },
      });
    });

    // 2. Insert records using system bypass
    await prisma.runAsSystem('Seeding test data for isolation test', async (tx) => {
      await tx.customer.upsert({
        where: { id: 'cust-x-123' },
        update: {},
        create: { id: 'cust-x-123', name: 'Cust X', companyId: 'tenant-x' },
      });
      await tx.customer.upsert({
        where: { id: 'cust-y-456' },
        update: {},
        create: { id: 'cust-y-456', name: 'Cust Y', companyId: 'tenant-y' },
      });
    });

    // 3. Test runAsTenant with tenant-x
    await prisma.runAsTenant('tenant-x', async (tx) => {
      const rlsCheck = await tx.$queryRaw<any>`SELECT current_setting('app.current_company_id', true) as cid`;
      // Assert that runAsTenant correctly sets app.current_company_id — this
      // is the live mechanism all 219 tenant_isolation_policy rows enforce.
      // The bypass_rls GUC was removed from all policies in migration
      // 20260902000000_drop_bypass_rls; reading it here always returns '' and
      // proved nothing.
      expect(rlsCheck[0].cid).toBe('tenant-x');


      // Try findMany
      const allCustomers = await tx.customer.findMany();
      console.log('findMany allCustomers:', allCustomers);

      const custY = await tx.customer.findUnique({
        where: { id: 'cust-y-456' },
      });
      console.log('custY:', custY);
      expect(custY).toBeNull(); // The core isolation check

      const custX = await tx.customer.findUnique({
        where: { id: 'cust-x-123' },
      });
      expect(custX).toBeDefined();
      expect(custX?.id).toBe('cust-x-123');
    });

    // 4. Test runAsTenant with tenant-y
    await prisma.runAsTenant('tenant-y', async (tx) => {
      const custX = await tx.customer.findUnique({
        where: { id: 'cust-x-123' },
      });
      expect(custX).toBeNull();
    });
  });
});
