import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Fuel Module (e2e) — CRUD + OTP Workflow', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  const companyId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';

  let vehicleId: string;
  let driverId: string;
  let tripId: string;
  let customerId: string;
  let fuelLogId: string;
  let fuelCardId: string;
  let otp: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginRes.body?.access_token || loginRes.body?.accessToken;
    expect(adminToken).toBeDefined();

    // Create prerequisite vehicle, driver, customer and trip
    await prisma.runAsTenant(companyId, async (tx) => {
      const driver = await tx.driver.create({
        data: {
          id: 'fuel-drv-' + Date.now(),
          companyId,
          firstName: 'Fuel',
          lastName: 'Test',
          phone: '9' + Date.now().toString().slice(-9),
          status: 'ACTIVE',
          licenseNumber: 'FUEL-LIC-' + Date.now(),
          licenseExpiry: new Date(Date.now() + 86400000 * 365),
        },
      });
      driverId = driver.id;

      const vehicle = await tx.vehicle.create({
        data: {
          id: 'fuel-veh-' + Date.now(),
          companyId,
          licensePlate: 'FUEL-' + Date.now(),
          type: 'TRUCK',
          status: 'ACTIVE',
        },
      });
      vehicleId = vehicle.id;

      const customer = await tx.customer.create({
        data: { id: 'fuel-cust-' + Date.now(), companyId, name: 'Fuel Customer', state: 'Maharashtra' },
      });
      customerId = customer.id;

      const trip = await tx.trip.create({
        data: {
          id: 'fuel-trip-' + Date.now(),
          companyId,
          tripNumber: 'FT-' + Date.now(),
          status: 'IN_TRANSIT',
          rate: 500,
          loads: {
            create: [{
              customerId: customer.id,
              referenceNumber: 'FL-' + Date.now(),
              originAddress: 'Mumbai',
              originCity: 'Mumbai',
              originState: 'Maharashtra',
              destinationAddress: 'Pune',
              destinationCity: 'Pune',
              destinationState: 'Maharashtra',
              pickupDate: new Date(),
              deliveryDate: new Date(),
              rate: 500,
              companyId,
            }],
          },
        },
      });
      tripId = trip.id;
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Fuel Card Flow', () => {
    it('should create a fuel card with last 4 masking and hashed reference', async () => {
      const uniqueNum = Date.now().toString().slice(-4);
      const res = await request(app.getHttpServer())
        .post('/api/v1/fuel-cards')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          cardNumber: `123456781234${uniqueNum}`, // Full number sent
          provider: 'BPCL',
          vehicleId,
          driverId,
          dailyLimit: 5000,
          dueDate: new Date(Date.now() - 86400000 * 5), // Overdue by 5 days
        });

      expect(res.status).toBe(201);
      expect(res.body.cardNumber).toBe(uniqueNum); // masked
      expect(res.body.hashedRef).toBeDefined(); // hashed ref stored
      fuelCardId = res.body.id;
    });

    it('should check fuel card billing status and return OVERDUE', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/fuel-cards/${fuelCardId}/billing-status`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OVERDUE');
    });
  });

  describe('Fuel Log OTP Flow', () => {
    it('should create a fuel log with PENDING status (driver requests fuel)', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/fuel-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleId,
          driverId,
          tripId,
          fuelCardId,
          litres: 120.5,
          amount: 10480,
          pump: 'BPCL Station, NH-4',
          slipNo: 'SLIP-' + Date.now(),
          billingCustomerId: customerId,
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('PENDING');
      fuelLogId = res.body.id;
    });

    it('should approve fuel log and generate OTP (dispatcher approves)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/fuel-logs/${fuelLogId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.otp).toBeDefined();
      otp = res.body.otp; // Capture generated OTP
    });

    it('should reject filling with an invalid OTP', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/fuel-logs/${fuelLogId}/fill`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ otp: '000000' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid OTP');
    });

    it('should reject filling with an expired OTP', async () => {
      // Manually expire the OTP in DB for this test
      await prisma.runAsTenant(companyId, async (tx) => {
        await tx.fuelEntry.update({
          where: { id: fuelLogId },
          data: { otpExpiry: new Date(Date.now() - 60000) } // Expired 1 min ago
        });
      });

      const res = await request(app.getHttpServer())
        .post(`/api/v1/fuel-logs/${fuelLogId}/fill`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ otp });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('OTP has expired');

      // Reset expiry so the rest of the flow can continue
      await prisma.runAsTenant(companyId, async (tx) => {
        await tx.fuelEntry.update({
          where: { id: fuelLogId },
          data: { otpExpiry: new Date(Date.now() + 60 * 60 * 1000) }
        });
      });
    });

    it('should complete filling with correct OTP (driver fills at pump) and create invoice line item', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/fuel-logs/${fuelLogId}/fill`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ otp });

      expect(res.status).toBe(201); // 201 for POST
      expect(res.body.status).toBe('FILLED');

      // Verify invoice line item was created
      await prisma.runAsTenant(companyId, async (tx) => {
        const invoiceCheck = await tx.invoiceLineItem.findFirst({
          where: { fuelEntryId: fuelLogId }
        });
        expect(invoiceCheck).toBeDefined();
        expect(invoiceCheck).not.toBeNull();
        expect(invoiceCheck?.amount).toBe(10480);
        expect(invoiceCheck?.type).toBe('FUEL');
      });
    });
  });
});
