import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Billing & Invoicing (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let companyId: string;
  let customer1Id: string;
  let customer2Id: string;
  let trip1Id: string; // customer 1, completed
  let trip2Id: string; // customer 1, completed
  let trip3Id: string; // customer 2, completed
  let trip4Id: string; // customer 1, planned
  let trip5Id: string; // customer 1, completed
  let trip6Id: string; // customer 2, completed

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    companyId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    
    adminToken = loginRes.body?.access_token || loginRes.body?.accessToken;

    if (!adminToken) {
        throw new Error('Could not get admin token. Response: ' + JSON.stringify(loginRes.body));
    }

    // Since we have seeded data, let's just create raw trips directly into the database using an existing admin's tenant context
    const adminUser = await prisma.runAsSystem('e2e test setup', (tx) => tx.user.findUnique({ where: { email: 'admin@parilink.com' } }));
    
    if (!adminUser) throw new Error("Admin user not found");

    await prisma.runAsTenant(companyId, async (tx) => {
      // Create Customers
      const c1 = await tx.customer.create({ data: { id: 'cust1-b-' + Date.now(), companyId, name: 'Billing Cust 1' } });
      const c2 = await tx.customer.create({ data: { id: 'cust2-b-' + Date.now(), companyId, name: 'Billing Cust 2' } });
      customer1Id = c1.id;
      customer2Id = c2.id;

      // Create Trips & Loads
      const t1 = await tx.trip.create({
        data: { id: 't1-b-' + Date.now(), companyId, tripNumber: 'T1-B-' + Date.now(), status: 'COMPLETED', rate: 1000, loads: { create: [{ customerId: customer1Id, referenceNumber: 'L1', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), rate: 1000, companyId }] } }
      });
      trip1Id = t1.id;

      const t2 = await tx.trip.create({
        data: { id: 't2-b-' + Date.now(), companyId, tripNumber: 'T2-B-' + Date.now(), status: 'COMPLETED', rate: 2000, loads: { create: [{ customerId: customer1Id, referenceNumber: 'L2', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), rate: 2000, companyId }] } }
      });
      trip2Id = t2.id;

      const t3 = await tx.trip.create({
        data: { id: 't3-b-' + Date.now(), companyId, tripNumber: 'T3-B-' + Date.now(), status: 'COMPLETED', rate: 3000, loads: { create: [{ customerId: customer2Id, referenceNumber: 'L3', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), rate: 3000, companyId }] } }
      });
      trip3Id = t3.id;

      const t4 = await tx.trip.create({
        data: { id: 't4-b-' + Date.now(), companyId, tripNumber: 'T4-B-' + Date.now(), status: 'PLANNED', rate: 4000, loads: { create: [{ customerId: customer1Id, referenceNumber: 'L4', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), rate: 4000, companyId }] } }
      });
      trip4Id = t4.id;

      const t5 = await tx.trip.create({
        data: { id: 't5-b-' + Date.now(), companyId, tripNumber: 'T5-B-' + Date.now(), status: 'COMPLETED', rate: 5000, loads: { create: [{ customerId: customer1Id, referenceNumber: 'L5', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), rate: 5000, companyId }] } }
      });
      trip5Id = t5.id;

      const t6 = await tx.trip.create({
        data: { id: 't6-b-' + Date.now(), companyId, tripNumber: 'T6-B-' + Date.now(), status: 'COMPLETED', rate: 6000, loads: { create: [{ customerId: customer2Id, referenceNumber: 'L6', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), rate: 6000, companyId }] } }
      });
      trip6Id = t6.id;
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should generate an invoice from valid completed trips for the same customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/billing/invoices/generate-from-trips')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer1Id,
        tripIds: [trip1Id, trip2Id]
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.subtotal).toBe(3000); // 1000 + 2000
    
    // Check GST logic
    const expectedCgst = 3000 * 0.09; // 270
    const expectedSgst = 3000 * 0.09; // 270
    const expectedTotal = 3000 + 270 + 270; // 3540

    expect(res.body.cgst).toBe(expectedCgst);
    expect(res.body.sgst).toBe(expectedSgst);
    expect(res.body.grandTotal).toBe(expectedTotal);
    expect(res.body.status).toBe('DRAFT');
  });

  it('should reject if any trip is not completed', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/billing/invoices/generate-from-trips')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer1Id,
        tripIds: [trip5Id, trip4Id]
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('is not COMPLETED');
  });

  it('should reject if any trip belongs to a different customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/billing/invoices/generate-from-trips')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer1Id,
        tripIds: [trip5Id, trip6Id]
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('contains loads for a different customer');
  });

  it('should successfully update status of an invoice to SENT then PAID', async () => {
    const genRes = await request(app.getHttpServer())
      .post('/api/v1/billing/invoices/generate-from-trips')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: customer2Id,
        tripIds: [trip3Id]
      });
    
    expect(genRes.status).toBe(201);
    const invoiceId = genRes.body.id;

    const sentRes = await request(app.getHttpServer())
      .patch(`/api/v1/billing/invoices/${invoiceId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'SENT' });
    
    expect(sentRes.status).toBe(200);
    expect(sentRes.body.status).toBe('SENT');

    const paidRes = await request(app.getHttpServer())
      .patch(`/api/v1/billing/invoices/${invoiceId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PAID', paymentRef: 'TXN-12345' });
    
    expect(paidRes.status).toBe(200);
    expect(paidRes.body.status).toBe('PAID');
    expect(paidRes.body.paymentRef).toBe('TXN-12345');
    expect(paidRes.body.balanceDue).toBe(0);
  });
});
