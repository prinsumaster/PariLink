import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('BC Tests - Security Audit', () => {
  let app: INestApplication;
  let adminToken: string;

  let customer1Token: string;
  let customer2Token: string;
  let loadForCustomer1: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Enable ValidationPipe to accurately reflect production empty POST behavior
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    // Log in as admin
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' })
      .expect(200);
    adminToken = loginRes.body.access_token;
    
    // Create Customer 1
    const cust1Res = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Customer 1 ${Date.now()}`,
        email: `c1-${Date.now()}@customer.com`,
        status: 'ACTIVE'
      })
      .expect(201);
    const customerId1 = cust1Res.body.id;

    // Create Customer 2
    const cust2Res = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Customer 2 ${Date.now()}`,
        email: `c2-${Date.now()}@customer.com`,
        status: 'ACTIVE'
      })
      .expect(201);
    const customerId2 = cust2Res.body.id;

    // Create Load for Customer 1
    const loadRes = await request(app.getHttpServer())
      .post('/loads')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customerId1,
        referenceNumber: `LD-${Date.now()}`,
        status: 'IN_TRANSIT',
        originCity: 'New York',
        originState: 'NY',
        destinationCity: 'Los Angeles',
        destinationState: 'CA',
        rate: 5000,
        originAddress: "123 Main St", destinationAddress: "456 Oak St", pickupDate: new Date().toISOString(), deliveryDate: new Date().toISOString()
      })
      .expect(201);
    loadForCustomer1 = loadRes.body.id;

    const { PrismaService } = require('./../src/prisma/prisma.service');
    const prisma = app.get(PrismaService);
    
    const u1Res = await request(app.getHttpServer())
      .post('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `u1-${Date.now()}@test.com`,
        password: 'password123',
        firstName: 'User',
        lastName: 'One',
      })
      .expect(201);
      
    await prisma.user.update({
      where: { id: u1Res.body.id },
      data: { customerId: customerId1 }
    });
      
    const l1Res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: u1Res.body.email, password: 'password123' })
      .expect(200);
    customer1Token = l1Res.body.access_token;

    const u2Res = await request(app.getHttpServer())
      .post('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `u2-${Date.now()}@test.com`,
        password: 'password123',
        firstName: 'User',
        lastName: 'Two',
      })
      .expect(201);
      
    await prisma.user.update({
      where: { id: u2Res.body.id },
      data: { customerId: customerId2 }
    });
      
    const l2Res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: u2Res.body.email, password: 'password123' })
      .expect(200);
    customer2Token = l2Res.body.access_token;
  });

  it('BC0(b) - Customer 1 tracking their own load (200)', async () => {
    await request(app.getHttpServer())
      .get(`/customer-portal/tracking/${loadForCustomer1}`)
      .set('Authorization', `Bearer ${customer1Token}`)
      .expect(200);
  });

  it('BC0(b) - Customer 2 tracking Customer 1s load (404/403)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/customer-portal/tracking/${loadForCustomer1}`)
      .set('Authorization', `Bearer ${customer2Token}`);
      
    expect([403, 404]).toContain(res.status);
  });

  it('BC0(c) - Empty POST tests on write endpoints', async () => {
    // Array of endpoints to test empty POST {}
    const endpoints = [
      '/driver-portal/expenses/trips/mock-id',
      '/driver-portal/telemetry/location',
      '/driver-portal/checklists/trips/mock-id',
      '/portals/support-tickets',
      '/portals/leave-requests',
      '/vendor-portal/marketplace/tenders/mock-id/bid',
      '/vendor-portal/operations/assigned/mock-id/pod',
      '/portals/customer/claims'
    ];

    for (const ep of endpoints) {
      const res = await request(app.getHttpServer())
        .post(ep)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      console.log(`[Portals] POST ${ep} -> ${res.status}`);
      // We expect 400 Bad Request
      if (res.status === 201 || res.status === 200) {
        throw new Error(`Endpoint ${ep} is vulnerable to empty POST (returned ${res.status})`);
      }
    }
  });
  
  it('BC1 - Empty POST tests on WMS and CRM', async () => {
    const endpoints = [
      '/wms/barcode/scan',
      '/crm/leads',
    ];

    for (const ep of endpoints) {
      const res = await request(app.getHttpServer())
        .post(ep)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      console.log(`[WMS/CRM] POST ${ep} -> ${res.status}`);
      if (res.status === 201 || res.status === 200) {
        throw new Error(`Endpoint ${ep} is vulnerable to empty POST (returned ${res.status})`);
      }
    }
  });

  afterAll(async () => {
    const { PrismaService } = require('./../src/prisma/prisma.service');
    const prisma = app.get(PrismaService);
    await prisma.$disconnect();
    await app.close();
  });
});
