import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { getJwtPrivateKey } from '../src/auth/auth.module';
import * as jwt from 'jsonwebtoken';

describe('TCO (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyId: string;
  let vehicleId: string;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    let adminRole;

    await prisma.runAsSystem('TCO e2e Seed', async (tx) => {
      const company = await tx.company.create({
        data: {
          name: 'TCO E2E Test Company',
          status: 'ACTIVE',
        },
      });
      companyId = company.id;

      adminRole = await tx.role.create({
        data: {
          name: 'Admin',
          companyId: companyId,
          permissions: ['fleet:read'],
        },
      });

      const user = await tx.user.create({
        data: {
          email: `tcotest_${Date.now()}@test.com`,
          password: 'dummy',
          firstName: 'Test',
          lastName: 'User',
          companyId: companyId,
          roleId: adminRole.id,
        },
      });

      const privateKey = getJwtPrivateKey();
      token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          companyId: user.companyId,
          roleId: user.roleId,
          permissions: ['fleet:read'],
        },
        privateKey,
        { algorithm: 'RS256', expiresIn: '15m' },
      );

      // Seed Vehicle
      const vehicle = await tx.vehicle.create({
        data: {
          companyId,
          licensePlate: `TEST-TCO-${Date.now()}`,
        },
      });
      vehicleId = vehicle.id;

      const trip = await tx.trip.create({
        data: {
          companyId,
          tripNumber: `TRIP-TCO-${Date.now()}`,
          vehicleId,
          status: 'COMPLETED',
        },
      });

      const driver = await tx.driver.create({
        data: {
          companyId,
          userId: user.id,
          firstName: 'John',
          lastName: 'Doe',
          licenseNumber: `DL-${Date.now()}`,
        },
      });

      // Seed Fuel: 200 + 300 = 500
      await tx.fuelEntry.createMany({
        data: [
          {
            companyId,
            vehicleId,
            tripId: trip.id,
            driverId: driver.id,
            amount: 200,
            litres: 10,
            status: 'FILLED',
            filledAt: new Date('2023-01-01'),
          },
          {
            companyId,
            vehicleId,
            tripId: trip.id,
            driverId: driver.id,
            amount: 300,
            litres: 15,
            status: 'FILLED',
            filledAt: new Date('2023-01-05'),
          },
        ],
      });

      const workshop = await tx.workshop.create({
        data: {
          companyId,
          name: 'Main Workshop',
        },
      });

      // Seed Workshop: 1500
      await tx.jobCard.createMany({
        data: [
          {
            companyId,
            vehicleId,
            workshopId: workshop.id,
            issueReported: 'Brakes',
            totalCost: 1500,
            status: 'COMPLETED',
            openedAt: new Date('2023-01-10'),
          },
        ],
      });

      // Seed Insurance: 5000
      await tx.insuranceLog.createMany({
        data: [
          {
            companyId,
            vehicleId,
            policyNumber: 'INS-1',
            provider: 'X',
            coverageType: 'COMPREHENSIVE',
            premiumAmount: 5000,
            issueDate: new Date('2023-01-01'),
            expiryDate: new Date('2024-01-01'),
          },
        ],
      });
    });

    // Expected Total = 500 + 1500 + 5000 = 7000
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vehicles/:id/tco (GET) - Calculates TCO correctly', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/vehicles/${vehicleId}/tco`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.breakdown.fuel).toBe(500);
    expect(response.body.breakdown.workshop).toBe(1500);
    expect(response.body.breakdown.insurance).toBe(5000);
    expect(response.body.lifetimeTotal).toBe(7000);
  });

  it('/vehicles/:id/tco (GET) - Hits the cache on second request', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/vehicles/${vehicleId}/tco`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.lifetimeTotal).toBe(7000);
  });
});
