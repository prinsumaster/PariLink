import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('LorryReceipt Flow (e2e)', () => {
  let app: INestApplication;
  let tokenA: string;
  let prisma: PrismaService;
  const companyId: string = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';
  let testDriverId: string;
  let testVehicleId: string;
  let testTripId: string;
  let lrId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    const loginA = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    tokenA = loginA.body?.access_token;

    // Seed Driver & Vehicle
    await prisma.runAsSystem('E2E Setup', async (tx) => {
      const v = await tx.vehicle.create({
        data: {
          companyId,
          licensePlate: `MH-TEST-${Date.now()}`,
          make: 'Tata',
          model: 'Prima',
          year: 2023,
          type: 'TRUCK',
          status: 'ACTIVE',
        },
      });
      testVehicleId = v.id;

      const d = await tx.driver.create({
        data: {
          companyId,
          firstName: 'Raju',
          lastName: 'Bhai',
          phone: `+91${Date.now().toString().slice(-10)}`,
          status: 'ACTIVE',
          licenseNumber: `LIC${Date.now()}`,
        },
      });
      testDriverId = d.id;

      const t = await tx.trip.create({
        data: {
          companyId,
          tripNumber: `TRP-E2E-${Date.now()}`,
          vehicleId: testVehicleId,
          driverId: testDriverId,
          status: 'PLANNED',
        },
      });
      testTripId = t.id;
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should generate LR from Trip', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/trips/${testTripId}/lorry-receipt`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        consignorName: 'Tata Steel',
        consigneeName: 'Jindal Works',
        product: 'Steel Coils',
        grossWeight: 15000,
        tareWeight: 5000,
        netWeight: 10000,
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.tripId).toBe(testTripId);
    expect(res.body.vehicleId).toBe(testVehicleId);
    expect(res.body.driverId).toBe(testDriverId);
    expect(res.body.status).toBe('DRAFT');
    lrId = res.body.id;
  });

  it('should reject duplicate LR generation for same trip', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/trips/${testTripId}/lorry-receipt`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        consignorName: 'Tata Steel',
        consigneeName: 'Jindal Works',
        product: 'Steel Coils',
        grossWeight: 15000,
        tareWeight: 5000,
        netWeight: 10000,
      });

    expect(res.status).toBe(409); // ConflictException
  });

  it('should share LR to the driver', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/lorry-receipts/${lrId}/share`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        driverId: testDriverId,
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SHARED');
  });

  it('should allow fetching shared LRs for a driver', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/drivers/${testDriverId}/lorry-receipts`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].id).toBe(lrId);
    expect(res.body[0].status).toBe('SHARED');
  });
});
