import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('GUC Attack', () => {
  let prisma: PrismaService;
  let app;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => { await app.close(); });

  it('attempts repoint', async () => {
    const tenants = await prisma.company.findMany({ take: 2 });
    if (tenants.length < 2) {
      console.log("Insufficient tenants for test");
      return;
    }
    const tA = tenants[0].id;
    const tB = tenants[1].id;

    await prisma.runAsTenant(tA, async (tx) => {
       console.log("--> TX OPEN FOR TENANT A:", tA);
       try {
          await tx.$executeRawUnsafe(`SELECT set_config('app.current_company_id', '${tB}', true)`);
          console.log("--> REPOINT SUCCESSFUL");
       } catch(e) {
          console.log("--> REPOINT FAILED:", e.message);
       }
       const trips = await tx.trip.findMany();
       console.log("--> TRIPS FOUND AFTER REPOINT ATTEMPT:", trips.length);
       if (trips.length > 0) {
           console.log("--> TRIP COMPANY IDS:", trips.map(t => t.companyId).join(', '));
       }
    });
  });
});
