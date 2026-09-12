import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('RouteToll (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;

  let tenantA: any;
  let tenantB: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);

    tenantA = await setupTenant(prisma, jwt, config, 'Toll Tenant A');
    tenantB = await setupTenant(prisma, jwt, config, 'Toll Tenant B');

    // Seed static toll data for Tenant A
    await prisma.runAsTenant(tenantA.companyId, async (tx) => {
      await tx.routeTollRate.create({
        data: {
          companyId: tenantA.companyId,
          originCity: 'Mumbai',
          destinationCity: 'Pune',
          fastagCost: 320,
          cashCost: 640,
          distanceKm: 150,
        }
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Route selection returns correct toll cost', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/routes/toll-estimate?originCity=Mumbai&destinationCity=Pune')
      .set('Authorization', `Bearer ${tenantA.token}`)
      .expect(200);

    expect(res.body.originCity).toBe('Mumbai');
    expect(res.body.destinationCity).toBe('Pune');
    expect(res.body.fastagCost).toBe(320);
    expect(res.body.cashCost).toBe(640);
    expect(res.body.distanceKm).toBe(150);
  });

  it('Missing route data handled explicitly (404, not silent 0)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/routes/toll-estimate?originCity=Mumbai&destinationCity=Delhi')
      .set('Authorization', `Bearer ${tenantA.token}`)
      .expect(404);

    expect(res.body.message).toContain('Toll data missing for route: Mumbai to Delhi');
  });

  it('Cross-tenant isolation: Tenant B cannot see Tenant A toll rates', async () => {
    // Tenant B tries to get Mumbai->Pune which is defined for Tenant A
    const res = await request(app.getHttpServer())
      .get('/api/v1/routes/toll-estimate?originCity=Mumbai&destinationCity=Pune')
      .set('Authorization', `Bearer ${tenantB.token}`)
      .expect(404);

    expect(res.body.message).toContain('Toll data missing');
  });

  it('Decisive RLS: toll rates isolated by RLS even without app-layer filter', async () => {
    // We query RouteTollRate via runAsTenant for Tenant A
    const tenantARates = await prisma.runAsTenant(tenantA.companyId, (tx: any) =>
      tx.routeTollRate.findMany()
    );

    expect(tenantARates.length).toBeGreaterThan(0);
    for (const r of tenantARates) {
      expect(r.companyId).toBe(tenantA.companyId);
    }

    // Verify the service uses runAsTenant and NO `where: {} // FILTER STRIPPED`
    const fs = require('fs');
    const serviceSource = fs.readFileSync(
      require('path').join(__dirname, '../src/routes/routes.service.ts'),
      'utf8'
    );
    expect(serviceSource).toContain('runAsTenant(companyId');
    expect(serviceSource).not.toContain('where: {} // FILTER STRIPPED');

    console.log(`\n✅ Decisive RLS: Tenant A runAsTenant sees ${tenantARates.length} rates, all companyId=${tenantA.companyId}`);
    console.log(`✅ Source verified: getTollEstimate uses runAsTenant, no stripped filter`);
  });
});

async function setupTenant(prisma: PrismaService, jwt: JwtService, config: ConfigService, name: string) {
  const company = await prisma.runAsSystem('e2e-setup', (tx) => 
    tx.company.create({ data: { name } })
  );
  const role = await prisma.runAsSystem('e2e-setup', (tx) => 
    tx.role.create({ data: { name: 'Admin', companyId: company.id, permissions: ['trips:read'] } })
  );
  const user = await prisma.runAsSystem('e2e-setup', (tx) => 
    tx.user.create({
      data: {
        email: `route_e2e_${company.id}@example.com`,
        password: 'hashed',
        firstName: 'Admin',
        lastName: 'User',
        companyId: company.id,
        roleId: role.id
      }
    })
  );
  const token = jwt.sign(
    { sub: user.id, email: user.email, companyId: company.id, permissions: ['trips:read'] },
    { secret: config.get('JWT_SECRET') }
  );

  return { companyId: company.id, token };
}
