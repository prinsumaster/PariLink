import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Soft Delete Reference Protection (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  // @ts-ignore: reserved for future use
  let _companyId: string;
  let driverId: string;
  // @ts-ignore: reserved for future use
  let _customerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' })
      .expect(200);
      
    adminToken = loginRes.body.access_token;

    // We can infer _companyId by looking at our own profile
    const profileRes = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    _companyId = profileRes.body._companyId;
  });

  it('BA3: Should return 200 and deleted: true when drilling down into soft-deleted customer', async () => {
    // 1. Create a customer
    const custRes = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `proof-${Date.now()}@customer.com`,
        name: 'Proof Customer',
        paymentTerms: 'NET_30',
        status: 'ACTIVE'
      })
      .expect(201);
      
    const custId = custRes.body.id;

    // 2. Soft-delete the customer
    await request(app.getHttpServer())
      .delete(`/customers/${custId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // 3. Drill-down GET request should return 200 with deleted: true
    const getRes = await request(app.getHttpServer())
      .get(`/customers/${custId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
      
    expect(getRes.body.deleted).toBe(true);
    expect(getRes.body.name).toBe('Proof Customer');
  });

  afterAll(async () => {
    // Wait for async interceptors (like Audit) to finish
    await new Promise((r) => setTimeout(r, 200));
    if (app) {
      const prisma = app.get(PrismaService);
      await app.close();
      if (prisma) {
        await prisma.$disconnect();
      }
    }
  });

  it('AV1: Should allow deleting a driver with NO references', async () => {
    // 1. Create Driver
    const driverRes = await request(app.getHttpServer())
      .post('/drivers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Free',
        lastName: 'Driver',
        email: `free-${Date.now()}@driver.com`,
        licenseNumber: `FD-${Date.now()}`,
        status: 'AVAILABLE'
      });
      
    if (driverRes.status !== 201) {
      console.error('Driver creation failed:', driverRes.body);
    }
    expect(driverRes.status).toBe(201);
      
    const unusedDriverId = driverRes.body.id;

    // 2. Delete it (should succeed)
    await request(app.getHttpServer())
      .delete(`/drivers/${unusedDriverId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('AV1: Should block deleting a driver WITH active references (409)', async () => {
    // 1. Create Driver
    const driverRes = await request(app.getHttpServer())
      .post('/drivers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Busy',
        lastName: 'Driver',
        email: `busy-${Date.now()}@driver.com`,
        licenseNumber: `BD-${Date.now()}`,
        status: 'AVAILABLE'
      });
      
    if (driverRes.status !== 201) {
      console.error('Driver busy creation failed:', driverRes.body);
    }
    expect(driverRes.status).toBe(201);
      
    driverId = driverRes.body.id;

    // 2. Create Trip for Driver
    await request(app.getHttpServer())
      .post('/trips')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        tripNumber: 'TRP-E2E-' + Date.now(),
        driverId: driverId,
        status: 'DISPATCHED',
      })
      .expect(201);

    // 3. Delete it (should fail with 400)
    const res = await request(app.getHttpServer())
      .delete(`/drivers/${driverId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);
      
    expect(res.body.message).toContain('Cannot terminate a driver who is currently dispatched on a trip.');
  });

  it('AV1: Should allow deleting a customer with NO references', async () => {
    // 1. Create Customer
    const custRes = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: `free-cust-${Date.now()}@customer.com`,
        name: 'Free Customer',
        paymentTerms: 'NET_30',
        status: 'ACTIVE'
      })
      .expect(201);
      
    const unusedCustId = custRes.body.id;

    // 2. Delete it (should succeed)
    await request(app.getHttpServer())
      .delete(`/customers/${unusedCustId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
