import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('TCO Dashboard (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let prisma: PrismaService;

  const companyId = 'tco-company-1';
  const vehicleId = 'tco-vehicle-1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableShutdownHooks();
    await app.init();
    prisma = app.get(PrismaService);
    const hash = await bcrypt.hash('password', 10);

    await prisma.runAsSystem('TCO e2e: seed setup', async (tx) => {
      // Create company
      await tx.company.upsert({
        where: { id: companyId },
        update: {},
        create: { id: companyId, name: 'TCO Company' }
      });
      // Create admin role
      await tx.role.upsert({
        where: { id: 'tco-role-admin' },
        update: {},
        create: { id: 'tco-role-admin', name: 'Admin', permissions: ['*'], companyId }
      });
      // Create user
      await tx.user.upsert({
        where: { email: 'admin@tco.com' },
        update: { password: hash },
        create: {
          email: 'admin@tco.com',
          password: hash,
          firstName: 'Admin',
          lastName: 'TCO',
          companyId,
          roleId: 'tco-role-admin'
        }
      });
      // Create a Workshop for JobCards
      await tx.workshop.upsert({
        where: { id: 'tco-workshop' },
        update: {},
        create: {
          id: 'tco-workshop',
          companyId,
          name: 'TCO Workshop',
          type: 'INTERNAL',
          location: 'Pune'
        }
      });
      // Create vehicle
      await tx.vehicle.upsert({
        where: { id: vehicleId },
        update: {},
        create: { id: vehicleId, companyId, make: 'Tata', model: 'Prima', licensePlate: 'MH12TCO123', type: 'TRUCK', status: 'IN_SERVICE' }
      });
      // Create driver
      await tx.driver.upsert({
        where: { id: 'tco-driver' },
        update: {},
        create: { id: 'tco-driver', companyId, firstName: 'TCO', lastName: 'Driver', status: 'ACTIVE' }
      });
      // Create trip
      await tx.trip.upsert({
        where: { id: 'tco-trip' },
        update: {},
        create: { id: 'tco-trip', companyId, tripNumber: 'TCO-TRP-1', status: 'IN_PROGRESS', route: {} }
      });

      // Clear any existing cost logs for this vehicle just in case
      await tx.fuelEntry.deleteMany({ where: { vehicleId } });
      await tx.jobCard.deleteMany({ where: { vehicleId } });
      await tx.insuranceLog.deleteMany({ where: { vehicleId } });

      // Seed EXACT known inputs
      // 1. Fuel costs: 2 entries, 1000 + 1500 = 2500
      await tx.fuelEntry.create({
        data: {
          companyId, vehicleId, tripId: 'tco-trip', driverId: 'tco-driver',
          amount: 1000, litres: 10, status: 'FILLED', filledAt: new Date('2026-09-01T10:00:00Z')
        }
      });
      await tx.fuelEntry.create({
        data: {
          companyId, vehicleId, tripId: 'tco-trip', driverId: 'tco-driver',
          amount: 1500, litres: 15, status: 'FILLED', filledAt: new Date('2026-09-05T10:00:00Z')
        }
      });

      // 2. Workshop costs: 1 job card, totalCost 4500
      await tx.jobCard.create({
        data: {
          companyId, vehicleId, workshopId: 'tco-workshop', issueReported: 'Brake pad change',
          totalCost: 4500, status: 'CLOSED', openedAt: new Date('2026-09-02T10:00:00Z')
        }
      });

      // 3. Insurance costs: 1 policy, premium 12000
      await tx.insuranceLog.create({
        data: {
          companyId, vehicleId, provider: 'HDFC Ergo', policyNumber: 'POL-123',
          coverageType: 'COMPREHENSIVE', premiumAmount: 12000,
          issueDate: new Date('2026-09-01T10:00:00Z'), expiryDate: new Date('2027-09-01T10:00:00Z')
        }
      });

      // TOTAL EXPECTED: 2500 (Fuel) + 4500 (Workshop) + 12000 (Insurance) = 19000
    });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tco.com', password: 'password', companyId });
    token = login.body.access_token || login.body.data?.access_token;
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  it('GET /vehicles/:id/tco - should return exact hand-calculated TCO rollup', async () => {
    const res = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}/tco`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(19000); // 2500 + 4500 + 12000
    expect(res.body.lifetimeTotal).toBe(19000);
    expect(res.body.breakdown.fuel).toBe(2500);
    expect(res.body.breakdown.workshop).toBe(4500);
    expect(res.body.breakdown.insurance).toBe(12000);
  });

  it('GET /vehicles/:id/tco?from=...&to=... - should filter correctly by date range', async () => {
    const res = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}/tco?from=2026-09-04T00:00:00Z&to=2026-09-10T00:00:00Z`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // In this date range, only the 2nd fuel entry (1500) matches. 
    // The 1st fuel entry, workshop (Sept 2), and insurance (Sept 1) are OUTSIDE the range.
    expect(res.body.total).toBe(1500);
    expect(res.body.lifetimeTotal).toBe(19000); // Lifetime shouldn't change
    expect(res.body.breakdown.fuel).toBe(1500);
    expect(res.body.breakdown.workshop).toBe(0);
    expect(res.body.breakdown.insurance).toBe(0);
  });
});
