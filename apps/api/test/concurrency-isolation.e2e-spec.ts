import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('Concurrency Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tenants: string[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    await app.init();
    
    prisma = app.get(PrismaService);
    
    tenants = Array.from({ length: 20 }, () => uuidv4());
    await prisma.runAsSystem('test_seed', async (tx) => {
      await tx.company.createMany({
        data: tenants.map((t, i) => ({
          id: t,
          name: `Preseeded Company ${i}`
        }))
      });
    });
  });

  afterAll(async () => {
    await prisma.runAsSystem('test_cleanup', async (tx) => {
      await tx.company.deleteMany({
        where: { id: { in: tenants } }
      });
    });
    await app.close();
  });

  it('maintains connection isolation for concurrent runAsSystem calls', async () => {
    const promises = tenants.map(async (tenantId, index) => {
      const uniqueScratchValue = `call_${index}_${tenantId}`;
      
      return prisma.runAsSystem(`Concurrency test ${index}`, async (tx) => {
        try {
          await tx.$executeRaw`SELECT set_config('app.scratch_test', ${uniqueScratchValue}, false)`;
        } catch (e) {}
        
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
        
        let readValue = null;
        try {
          const configResult = await tx.$queryRaw<{ current_setting: string }[]>`SELECT current_setting('app.scratch_test', true)`;
          readValue = configResult[0]?.current_setting;
        } catch (e) {}
        
        const companies = await tx.company.findMany();
        
        return {
          index,
          expectedScratch: uniqueScratchValue,
          actualScratch: readValue,
          companiesCount: companies.length,
          isolationMaintained: readValue === uniqueScratchValue,
          bypassMaintained: companies.length >= 20
        };
      });
    });

    const results = await Promise.all(promises);
    
    for (const r of results) {
      expect(r.isolationMaintained).toBe(true);
      expect(r.bypassMaintained).toBe(true);
    }
  });
});
