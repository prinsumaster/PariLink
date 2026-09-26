import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('New Modules - Tenant Isolation & Validation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let tenantAToken: string;
  let tenantBToken: string;
  let tenantACompanyId: string;
  let tenantA_VehicleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);

    // 1. Provision Tenant A via Demo Seed (simulated or real endpoint)
    // To be safe, we'll hit the /saas/demo/seed endpoint as an admin, or just create it directly in DB
    // Actually, we can just use Prisma to create test tenants.
    
    const ts = Date.now();
    const emailA = `a_${ts}@test.com`;
    const emailB = `b_${ts}@test.com`;

    // Seed Tenant A
    const coA = await prisma.runAsSystem('test-setup', async (tx) => {
      const co = await tx.company.create({ data: { name: `Tenant A ${ts}`, status: 'ACTIVE' } });
      const role = await tx.role.create({ data: { companyId: co.id, name: 'Admin', permissions: ['admin:manage', 'vehicles:read', 'vehicles:write', 'warehouse:write'] } });
      await tx.user.create({ data: { companyId: co.id, roleId: role.id, email: emailA, password: 'hash', firstName: 'A', lastName: 'A', status: 'ACTIVE' } });
      return co;
    });
    tenantACompanyId = coA.id;
    
    // Seed Tenant B
    const coB = await prisma.runAsSystem('test-setup', async (tx) => {
      const co = await tx.company.create({ data: { name: `Tenant B ${ts}`, status: 'ACTIVE' } });
      const role = await tx.role.create({ data: { companyId: co.id, name: 'Admin', permissions: ['admin:manage', 'vehicles:read', 'vehicles:write', 'warehouse:write'] } });
      await tx.user.create({ data: { companyId: co.id, roleId: role.id, email: emailB, password: 'hash', firstName: 'B', lastName: 'B', status: 'ACTIVE' } });
      return co;
    });
    
    // Get Tokens via API
    const loginA = await request(app.getHttpServer()).post('/auth/login').send({ email: emailA, password: 'hash' });
    tenantAToken = loginA.body.accessToken;

    const loginB = await request(app.getHttpServer()).post('/auth/login').send({ email: emailB, password: 'hash' });
    tenantBToken = loginB.body.accessToken;

    // Create a vehicle in Tenant A
    const vehA = await prisma.runAsTenant(coA.id, async (tx) => tx.vehicle.create({
      data: {
        companyId: coA.id,
        make: 'Volvo',
        model: 'VNL',
        licensePlate: 'ABC-123',
        type: 'TRUCK',
        status: 'AVAILABLE'
      }
    }));
    tenantA_VehicleId = vehA.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.runAsSystem('test-cleanup', async (tx) => {
      try {
        await tx.vehicle.deleteMany({ where: { licensePlate: 'ABC-123' }});
        await tx.user.deleteMany({ where: { email: { in: ['a@test.com', 'b@test.com'] } } });
        await tx.role.deleteMany({ where: { name: 'Admin' } });
        await tx.company.deleteMany({ where: { name: { in: ['Tenant A', 'Tenant B'] } } });
      } catch (e) {
        // ignore cleanup errors for e2e test
      }
    });
    await app.close();
  });

  it('Fuel: Tenant B cannot use Tenant A vehicleId to log fuel transaction', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles/fuel/transactions')
      .set('Authorization', `Bearer ${tenantBToken}`)
      .send({
        vehicleId: tenantA_VehicleId, // Tenant A's vehicle
        stationName: 'Test',
        gallons: 50,
        totalCost: 150,
        pricePerGallon: 3,
        odometer: 1000
      });
    
    // Should be a 404 or 403 or some DB error, NOT a 201
    expect(res.status).not.toBe(201);
  });
});
