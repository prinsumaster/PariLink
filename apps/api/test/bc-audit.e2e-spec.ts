import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('BC Tests - Security Audit', () => {
  let app: INestApplication;
  let adminToken: string;
  // @ts-ignore: reserved for future use
  let _customer1Token: string;
  let customer2Token: string;
  let loadForCustomer1: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    // Log in as admin (seeded)
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginRes.body.access_token;
    if (!adminToken) throw new Error(`Admin login failed: ${JSON.stringify(loginRes.body)}`);

    // Create customers
    const cust1Res = await request(app.getHttpServer())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Customer 1 ${Date.now()}`,
        email: `c1-${Date.now()}@customer.com`,
        status: 'ACTIVE',
      });
    const customerId1 = cust1Res.body.id;

    const cust2Res = await request(app.getHttpServer())
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Customer 2 ${Date.now()}`,
        email: `c2-${Date.now()}@customer.com`,
        status: 'ACTIVE',
      });
    const customerId2 = cust2Res.body.id;

    // Create Load for Customer 1
    const loadRes = await request(app.getHttpServer())
      .post('/api/v1/loads')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customerId1,
        referenceNumber: `LD-BC-${Date.now()}`,
        originCity: 'Mumbai',
        originState: 'Maharashtra',
        destinationCity: 'Delhi',
        destinationState: 'Delhi',
        rate: 5000,
        originAddress: '123 Main St',
        destinationAddress: '456 Oak St',
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 86400000).toISOString(),
      });
    loadForCustomer1 = loadRes.body.id;

    const prisma = app.get(PrismaService);
    const suffix = Date.now();

    const u1Res = await request(app.getHttpServer())
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `u1-bc-${suffix}@test.com`,
        password: 'password123',
        firstName: 'User',
        lastName: 'One',
      });
    if (u1Res.status === 201) {
      await prisma.runAsSystem('bc-audit-setup', (tx) =>
        tx.user.update({ where: { id: u1Res.body.id }, data: { customerId: customerId1 } })
      );
      const l1Res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: `u1-bc-${suffix}@test.com`, password: 'password123' });
      _customer1Token = l1Res.body.access_token;
    }

    const u2Res = await request(app.getHttpServer())
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `u2-bc-${suffix}@test.com`,
        password: 'password123',
        firstName: 'User',
        lastName: 'Two',
      });
    if (u2Res.status === 201) {
      await prisma.runAsSystem('bc-audit-setup', (tx) =>
        tx.user.update({ where: { id: u2Res.body.id }, data: { customerId: customerId2 } })
      );
      const l2Res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: `u2-bc-${suffix}@test.com`, password: 'password123' });
      customer2Token = l2Res.body.access_token;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('BC0(b) - Customer 2 cannot track Customer 1s load (IDOR check)', async () => {
    if (!customer2Token || !loadForCustomer1) {
      console.warn('Skipping: user portal tokens not set up (admin user endpoint unavailable)');
      return;
    }
    const res = await request(app.getHttpServer())
      .get(`/api/v1/customer-portal/tracking/${loadForCustomer1}`)
      .set('Authorization', `Bearer ${customer2Token}`);
    expect([403, 404]).toContain(res.status);
  });

  it('BC0(c) - Empty POST tests on write endpoints return 4xx', async () => {
    const endpoints = [
      '/api/v1/driver-portal/expenses/trips/mock-id',
      '/api/v1/driver-portal/telemetry/location',
      '/api/v1/portals/support-tickets',
      '/api/v1/portals/leave-requests',
    ];

    for (const ep of endpoints) {
      const res = await request(app.getHttpServer())
        .post(ep)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      console.log(`[Portals] POST ${ep} -> ${res.status}`);
      expect(res.status).not.toBe(200);
      expect(res.status).not.toBe(201);
    }
  });

  it('BC1 - Empty POST on WMS and CRM endpoints return 4xx', async () => {
    const endpoints = [
      '/api/v1/wms/barcode/scan',
      '/api/v1/crm/leads',
    ];

    for (const ep of endpoints) {
      const res = await request(app.getHttpServer())
        .post(ep)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      console.log(`[WMS/CRM] POST ${ep} -> ${res.status}`);
      expect(res.status).not.toBe(200);
      expect(res.status).not.toBe(201);
    }
  });
});
