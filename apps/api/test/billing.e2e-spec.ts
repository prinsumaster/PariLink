import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Billing & Invoicing (e2e) - Tax Invoice Format', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let noPermToken: string;
  let companyId: string = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';
  let intrastateCustomerId: string;
  let interstateCustomerId: string;
  
  let trip1Id: string; // intrastate, completed
  let trip2Id: string; // interstate, completed
  let trip3Id: string; // intrastate, planned (for rejection)
  let trip4Id: string; // intrastate, completed (for duplicate rejection)
  let trip5Id: string; // interstate, completed (for different customer rejection)

  let generatedInvoiceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginRes.body?.access_token || loginRes.body?.accessToken;

    // Login for user without billing:write permissions
    // I will use driver@parilink.com or similar if exists, but we can just create one
    let noPermUser = await prisma.runAsSystem('e2e-setup', (tx) => tx.user.findFirst({ where: { email: 'noperm_billing@parilink.com' } }));
    if (!noPermUser) {
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('password123', 10);
      noPermUser = await prisma.runAsSystem('e2e-setup', (tx) => tx.user.create({
        data: {
          id: require('crypto').randomUUID(),
          email: 'noperm_billing@parilink.com',
          password: hash,
          firstName: 'No',
          lastName: 'Perm',
          companyId,
          status: 'ACTIVE',
        }
      }));
    }

    const noPermLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'noperm_billing@parilink.com', password: 'password123' });
    noPermToken = noPermLogin.body?.access_token || noPermLogin.body?.accessToken;

    await prisma.runAsTenant(companyId, async (tx) => {
      // 1. Setup Company State for GST math
      await tx.company.update({
        where: { id: companyId },
        data: { state: 'Maharashtra' }
      });

      // 2. Setup Intrastate Customer (Maharashtra -> CGST+SGST)
      const c1 = await tx.customer.create({ 
        data: { id: 'cust-intra-' + Date.now(), companyId, name: 'Local Cust', state: 'Maharashtra' } 
      });
      intrastateCustomerId = c1.id;

      // 3. Setup Interstate Customer (Gujarat -> IGST)
      const c2 = await tx.customer.create({ 
        data: { id: 'cust-inter-' + Date.now(), companyId, name: 'Remote Cust', state: 'Gujarat' } 
      });
      interstateCustomerId = c2.id;

      // 4. Create Trips with linked Lorry Receipts
      const dummyDriver = await tx.driver.create({ data: { id: 'd-' + Date.now(), companyId, firstName: 'A', lastName: 'B', phone: '123' + Date.now(), status: 'ACTIVE', licenseNumber: 'DL-' + Date.now(), licenseExpiry: new Date() } });
      const dummyVehicle = await tx.vehicle.create({ data: { id: 'v-' + Date.now(), companyId, licensePlate: 'RN-' + Date.now(), type: 'TRUCK', status: 'ACTIVE' } });

      // Trip 1 (Intrastate) - Rate: 500, Qty (Net Weight): 10,000kg (10 tons) -> Amount = 500 * 10 = 5000
      const t1 = await tx.trip.create({
        data: { 
          id: 't1-' + Date.now(), companyId, tripNumber: 'T1-' + Date.now(), status: 'COMPLETED', rate: 500, 
          loads: { create: [{ customerId: intrastateCustomerId, referenceNumber: 'L1', originAddress: 'A', originCity: 'A', originState: 'Maharashtra', destinationAddress: 'B', destinationCity: 'B', destinationState: 'Maharashtra', pickupDate: new Date(), deliveryDate: new Date(), rate: 500, companyId }] },
          lorryReceipt: {
            create: { companyId, driverId: dummyDriver.id, vehicleId: dummyVehicle.id, lrNumber: 'LR-1-' + Date.now(), consignorName: 'Con A', consigneeName: 'Con B', product: 'Steel', grossWeight: 15000, tareWeight: 5000, netWeight: 10000, status: 'DRAFT' }
          }
        }
      });
      trip1Id = t1.id;

      // Trip 2 (Interstate) - Rate: 800, Qty (Net Weight): 20,000kg (20 tons) -> Amount = 800 * 20 = 16000
      const t2 = await tx.trip.create({
        data: { 
          id: 't2-' + Date.now(), companyId, tripNumber: 'T2-' + Date.now(), status: 'COMPLETED', rate: 800, 
          loads: { create: [{ customerId: interstateCustomerId, referenceNumber: 'L2', originAddress: 'A', originCity: 'A', originState: 'Maharashtra', destinationAddress: 'B', destinationCity: 'B', destinationState: 'Gujarat', pickupDate: new Date(), deliveryDate: new Date(), rate: 800, companyId }] },
          lorryReceipt: {
            create: { companyId, driverId: dummyDriver.id, vehicleId: dummyVehicle.id, lrNumber: 'LR-2-' + Date.now(), consignorName: 'Con A', consigneeName: 'Con B', product: 'Steel', grossWeight: 25000, tareWeight: 5000, netWeight: 20000, status: 'DRAFT' }
          }
        }
      });
      trip2Id = t2.id;

      // Trip 3 (Planned - should reject)
      const t3 = await tx.trip.create({
        data: { 
          id: 't3-' + Date.now(), companyId, tripNumber: 'T3-' + Date.now(), status: 'PLANNED', rate: 1000, 
          loads: { create: [{ customerId: intrastateCustomerId, referenceNumber: 'L3', originAddress: 'A', originCity: 'A', originState: 'Maharashtra', destinationAddress: 'B', destinationCity: 'B', destinationState: 'Maharashtra', pickupDate: new Date(), deliveryDate: new Date(), rate: 1000, companyId }] }
        }
      });
      trip3Id = t3.id;

      // Trip 4 (For duplicate invoicing test)
      const t4 = await tx.trip.create({
        data: { 
          id: 't4-' + Date.now(), companyId, tripNumber: 'T4-' + Date.now(), status: 'COMPLETED', rate: 600, 
          loads: { create: [{ customerId: intrastateCustomerId, referenceNumber: 'L4', originAddress: 'A', originCity: 'A', originState: 'Maharashtra', destinationAddress: 'B', destinationCity: 'B', destinationState: 'Maharashtra', pickupDate: new Date(), deliveryDate: new Date(), rate: 600, companyId }] },
          lorryReceipt: {
            create: { companyId, driverId: dummyDriver.id, vehicleId: dummyVehicle.id, lrNumber: 'LR-4-' + Date.now(), consignorName: 'Con A', consigneeName: 'Con B', product: 'Steel', grossWeight: 15000, tareWeight: 5000, netWeight: 10000, status: 'DRAFT' }
          }
        }
      });
      trip4Id = t4.id;

      // Trip 5 (For different customer rejection)
      const t5 = await tx.trip.create({
        data: { 
          id: 't5-' + Date.now(), companyId, tripNumber: 'T5-' + Date.now(), status: 'COMPLETED', rate: 700, 
          loads: { create: [{ customerId: interstateCustomerId, referenceNumber: 'L5', originAddress: 'A', originCity: 'A', originState: 'Maharashtra', destinationAddress: 'B', destinationCity: 'B', destinationState: 'Gujarat', pickupDate: new Date(), deliveryDate: new Date(), rate: 700, companyId }] },
          lorryReceipt: {
            create: { companyId, driverId: dummyDriver.id, vehicleId: dummyVehicle.id, lrNumber: 'LR-5-' + Date.now(), consignorName: 'Con A', consigneeName: 'Con B', product: 'Steel', grossWeight: 15000, tareWeight: 5000, netWeight: 10000, status: 'DRAFT' }
          }
        }
      });
      trip5Id = t5.id;
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Invoice Generation & GST Math', () => {
    it('should generate an Intrastate invoice and calculate CGST/SGST correctly based on QTY and Rate from LR', async () => {
      // Inputs:
      // Rate: 500
      // LR Net Weight: 10000 (10 tons)
      // Math: Amount = 500 * 10 = 5000
      // Tax: Intrastate (Maharashtra to Maharashtra) -> 9% CGST (450) + 9% SGST (450) = 900
      // Total: 5000 + 900 = 5900

      const res = await request(app.getHttpServer())
        .post('/api/v1/billing/invoices/generate-from-trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId: intrastateCustomerId,
          tripIds: [trip1Id]
        });

      expect(res.status).toBe(201);
      expect(res.body.subtotal).toBe(5000);
      expect(res.body.cgst).toBe(450);
      expect(res.body.sgst).toBe(450);
      expect(res.body.igst).toBe(0);
      expect(res.body.tax).toBe(900);
      expect(res.body.grandTotal).toBe(5900);
      
      expect(res.body.lineItems[0].unloadedQty).toBe(10); // 10 tons
      expect(res.body.lineItems[0].rate).toBe(500);
      expect(res.body.lineItems[0].amount).toBe(5000);
    });

    it('should generate an Interstate invoice and calculate IGST correctly', async () => {
      // Inputs:
      // Rate: 800
      // LR Net Weight: 20000 (20 tons)
      // Math: Amount = 800 * 20 = 16000
      // Tax: Interstate (Maharashtra to Gujarat) -> 18% IGST (2880)
      // Total: 16000 + 2880 = 18880

      const res = await request(app.getHttpServer())
        .post('/api/v1/billing/invoices/generate-from-trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId: interstateCustomerId,
          tripIds: [trip2Id]
        });

      expect(res.status).toBe(201);
      expect(res.body.subtotal).toBe(16000);
      expect(res.body.cgst).toBe(0);
      expect(res.body.sgst).toBe(0);
      expect(res.body.igst).toBe(2880);
      expect(res.body.tax).toBe(2880);
      expect(res.body.grandTotal).toBe(18880);
    });
  });

  describe('Rejection Cases', () => {
    it('should reject if trip belongs to a different customer', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/billing/invoices/generate-from-trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId: intrastateCustomerId,
          tripIds: [trip5Id] // trip5 belongs to interstateCustomer
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('different customer');
    });

    it('should reject if trip is not completed', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/billing/invoices/generate-from-trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId: intrastateCustomerId,
          tripIds: [trip3Id] // trip3 is PLANNED
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('is not COMPLETED');
    });

    it('should reject if trip is already invoiced', async () => {
      // 1. Generate successfully once
      const successRes = await request(app.getHttpServer())
        .post('/api/v1/billing/invoices/generate-from-trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId: intrastateCustomerId,
          tripIds: [trip4Id] 
        });
      expect(successRes.status).toBe(201);
      generatedInvoiceId = successRes.body.id;

      // 2. Try to generate again
      const failRes = await request(app.getHttpServer())
        .post('/api/v1/billing/invoices/generate-from-trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId: intrastateCustomerId,
          tripIds: [trip4Id] 
        });

      expect(failRes.status).toBe(400);
      expect(failRes.body.message).toContain('already been invoiced');
    });
  });

  describe('Status Transitions & Role Enforcement', () => {
    it('should block transition without billing:write permission', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/billing/invoices/${generatedInvoiceId}/status`)
        .set('Authorization', `Bearer ${noPermToken}`)
        .send({ status: 'SENT' });

      expect(res.status).toBe(403);
    });

    it('should allow admin to transition to SENT', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/billing/invoices/${generatedInvoiceId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'SENT' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SENT');
    });

    it('should allow admin to transition to PAID with paymentRef', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/billing/invoices/${generatedInvoiceId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PAID', paymentRef: 'TXN12345' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('PAID');
      expect(res.body.paymentRef).toBe('TXN12345');
      expect(res.body.balanceDue).toBe(0);
      expect(res.body.paidAt).toBeDefined();
    });
  });
});
