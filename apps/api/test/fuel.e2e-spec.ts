import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Fuel Module (e2e) — CRUD + Approval Workflow', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  const companyId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';

  let vehicleId: string;
  let driverId: string;
  let tripId: string;
  let fuelLogId: string;

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

    // Create prerequisite vehicle, driver, and trip
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

  describe('POST /fuel-logs — Create a fuel log', () => {
    it('should create a fuel log with PENDING status', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/fuel-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          vehicleId,
          driverId,
          tripId,
          litres: 120.5,
          amount: 10480,
          pump: 'BPCL Station, NH-4',
          slipNo: 'SLIP-' + Date.now(),
        });

      expect(res.status).toBe(201);
      expect(res.body.litres).toBe(120.5);
      expect(res.body.amount).toBe(10480);
      expect(res.body.pump).toBe('BPCL Station, NH-4');
      expect(res.body.status).toBe('PENDING');
      expect(res.body.companyId).toBe(companyId);
      fuelLogId = res.body.id;
      expect(fuelLogId).toBeDefined();
    });
  });

  describe('GET /fuel-logs — List fuel logs', () => {
    it('should list fuel logs and include the newly created one', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/fuel-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((f: any) => f.id === fuelLogId);
      expect(found).toBeDefined();
      expect(found.status).toBe('PENDING');
    });

    it('should filter fuel logs by status=PENDING', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/fuel-logs?status=PENDING')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.every((f: any) => f.status === 'PENDING')).toBe(true);
    });
  });

  describe('PATCH /fuel-logs/:id/status — Approval workflow', () => {
    it('should approve a PENDING fuel log by transitioning to APPROVED', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/fuel-logs/${fuelLogId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'APPROVED' });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(fuelLogId);
      expect(res.body.status).toBe('APPROVED');
    });

    it('should verify the status is now APPROVED when listing', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/fuel-logs?status=APPROVED')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const found = res.body.find((f: any) => f.id === fuelLogId);
      expect(found).toBeDefined();
      expect(found.status).toBe('APPROVED');
    });

    it('should reject status update for a non-existent fuel log', async () => {
      const res = await request(app.getHttpServer())
        .patch('/api/v1/fuel-logs/non-existent-id/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'APPROVED' });

      expect(res.status).toBe(404);
    });
  });
});
