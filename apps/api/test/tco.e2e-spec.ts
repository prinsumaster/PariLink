import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // Create a new isolated test company
    const adminRole = await prisma.role.findFirst({ where: { name: 'Admin' } });
    const company = await prisma.company.create({
      data: {
        name: 'TCO E2E Test Company',
        status: 'ACTIVE',
      }
    });
    companyId = company.id;

    // Create a test user and sign a token
    const user = await prisma.user.create({
      data: {
        email: `tcotest_${Date.now()}@test.com`,
        passwordHash: 'dummy',
        firstName: 'Test',
        lastName: 'User',
        companyId: companyId,
        roleId: adminRole.id,
      }
    });

    const privateKey = getJwtPrivateKey();
    token = jwt.sign(
      { sub: user.id, email: user.email, companyId: user.companyId, roleId: user.roleId },
      privateKey,
      { algorithm: 'RS256', expiresIn: '15m' }
    );

    // Seed Vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        companyId,
        registrationNumber: 'TEST-TCO-123',
        status: 'AVAILABLE',
        fuelType: 'DIESEL',
      }
    });
    vehicleId = vehicle.id;

    // Seed Fuel: 200 + 300 = 500
    await prisma.fuelEntry.createMany({
      data: [
        { companyId, vehicleId, amount: 200, status: 'FILLED', filledAt: new Date('2023-01-01') },
        { companyId, vehicleId, amount: 300, status: 'FILLED', filledAt: new Date('2023-01-05') }
      ]
    });

    // Seed Workshop: 1500
    await prisma.jobCard.createMany({
      data: [
        { companyId, vehicleId, title: 'Brakes', totalCost: 1500, status: 'COMPLETED', openedAt: new Date('2023-01-10') }
      ]
    });

    // Seed Insurance: 5000
    await prisma.insuranceLog.createMany({
      data: [
        { companyId, vehicleId, policyNumber: 'INS-1', provider: 'X', premiumAmount: 5000, issueDate: new Date('2023-01-01'), expiryDate: new Date('2024-01-01') }
      ]
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
});
