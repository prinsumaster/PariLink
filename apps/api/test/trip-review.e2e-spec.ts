import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Trip Review Workflow API', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let adminToken: string;
  let dispatcherToken: string;
  let fleetToken: string;
  let mechanicToken: string;
  let gateToken: string;
  let customerToken: string;
  let noPermToken: string;

  let companyId: string;
  let driverId: string;
  let tripId: string;

  let dispatcherEmail: string;
  let fleetEmail: string;
  let mechanicEmail: string;
  let gateEmail: string;
  let customerEmail: string;
  let noPermEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    prisma = app.get(PrismaService);
    await app.init();
    
    companyId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';

    // Login as existing admin
    const loginAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginAdmin.body?.access_token;

    // Seed roles and users
    await prisma.runAsSystem('E2E Setup', async (tx) => {
      const hash = await bcrypt.hash('password123', 10);
      const createRoleUser = async (name: string, email: string, resource: string, action: string) => {
        const role = await tx.role.create({
          data: {
            companyId,
            name,
            permissions: [{ resource, action }, { resource: 'trips', action: 'update' }]
          }
        });
        const user = await tx.user.create({
          data: {
            companyId,
            email,
            firstName: name,
            lastName: 'Test',
            password: hash,
            roleId: role.id,
            status: 'ACTIVE'
          }
        });
        return user;
      };

      const now = Date.now();
      dispatcherEmail = `dispatcher_${now}@parilink.com`;
      fleetEmail = `fleet_${now}@parilink.com`;
      mechanicEmail = `mechanic_${now}@parilink.com`;
      gateEmail = `gate_${now}@parilink.com`;
      customerEmail = `customer_${now}@parilink.com`;
      noPermEmail = `noperm_${now}@parilink.com`;

      await createRoleUser(`Dispatcher_${now}`, dispatcherEmail, 'dispatch', 'manage');
      await createRoleUser(`FleetManager_${now}`, fleetEmail, 'fleet', 'write');
      await createRoleUser(`Mechanic_${now}`, mechanicEmail, 'workshop', 'mechanic');
      await createRoleUser(`Gate_${now}`, gateEmail, 'workshop', 'gate');
      await createRoleUser(`Customer_${now}`, customerEmail, 'admin', 'manage');
      await createRoleUser(`NoPerm_${now}`, noPermEmail, 'dummy', 'read');

      // Create driver and trip
      const driver = await tx.driver.create({
        data: { companyId, firstName: 'John', lastName: 'Doe', licenseNumber: 'L-' + Date.now() }
      });
      driverId = driver.id;

      const trip = await tx.trip.create({
        data: {
          companyId,
          tripNumber: `TRP-E2E-${Date.now()}`,
          driverId,
          status: 'COMPLETED',
          actualDistance: 500,
          fuelExpenses: 100 // 500/100 = 5 km/L -> 100% score (5.0 points)
        }
      });
      tripId = trip.id;
    });

    const login = async (email: string) => {
      const res = await request(app.getHttpServer()).post('/api/v1/auth/login').send({ email, password: 'password123' });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(`Login failed for ${email}: ${res.status} ${JSON.stringify(res.body)}`);
      }
      return res.body.access_token;
    };

    dispatcherToken = await login(dispatcherEmail);
    fleetToken = await login(fleetEmail);
    mechanicToken = await login(mechanicEmail);
    gateToken = await login(gateEmail);
    customerToken = await login(customerEmail);
    noPermToken = await login(noPermEmail);

    console.log('Tokens:', { dispatcherToken, fleetToken, mechanicToken, gateToken, customerToken, noPermToken });
  });

  afterAll(async () => {
    // Cleanup seeded data
    await prisma.runAsSystem('E2E Teardown', async (tx) => {
      await tx.user.deleteMany({ where: { email: { contains: '@parilink.com' }, NOT: { email: 'admin@parilink.com' } } });
      await tx.role.deleteMany({ where: { name: { in: ['Dispatcher', 'FleetManager', 'Mechanic', 'Gate', 'Customer', 'NoPerm'] } } });
      await tx.tripReview.deleteMany({ where: { tripId } });
      await tx.driverScore.deleteMany({ where: { tripId } });
      await tx.trip.delete({ where: { id: tripId } });
      await tx.driver.delete({ where: { id: driverId } });
    });
    await app.close();
  });

  it('should reject review submission if user lacks role permission', async () => {
    // Dispatcher trying to submit a FLEET_MANAGER review
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/reviews`)
      .set('Authorization', `Bearer ${dispatcherToken}`)
      .send({ reviewerRole: 'FLEET_MANAGER', rating: 4, comment: 'Good' })
      .expect(403);

    // NoPerm trying to submit DISPATCHER review
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/reviews`)
      .set('Authorization', `Bearer ${noPermToken}`)
      .send({ reviewerRole: 'DISPATCHER', rating: 4, comment: 'Good' })
      .expect(403);
  });

  it('should allow authorized roles to submit their own reviews', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/reviews`)
      .set('Authorization', `Bearer ${dispatcherToken}`)
      .send({ reviewerRole: 'DISPATCHER', rating: 5, comment: 'Great communication' })
      .expect(201);
  });

  it('should reject duplicate review from same role', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/trips/${tripId}/reviews`)
      .set('Authorization', `Bearer ${dispatcherToken}`)
      .send({ reviewerRole: 'DISPATCHER', rating: 3, comment: 'Another review' })
      .expect(409);
  });

  it('should compute and update driver score upon 5th review', async () => {
    // Submit remaining 4 reviews
    await request(app.getHttpServer()).post(`/api/v1/trips/${tripId}/reviews`).set('Authorization', `Bearer ${fleetToken}`).send({ reviewerRole: 'FLEET_MANAGER', rating: 4 }).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/trips/${tripId}/reviews`).set('Authorization', `Bearer ${mechanicToken}`).send({ reviewerRole: 'WORKSHOP_MECHANIC', rating: 5 }).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/trips/${tripId}/reviews`).set('Authorization', `Bearer ${gateToken}`).send({ reviewerRole: 'GATE_SECURITY', rating: 5 }).expect(201);
    await request(app.getHttpServer()).post(`/api/v1/trips/${tripId}/reviews`).set('Authorization', `Bearer ${customerToken}`).send({ reviewerRole: 'CUSTOMER_CONTACT', rating: 4 }).expect(201);

    // Wait slightly for event emitter or immediate DB writes
    await new Promise(r => setTimeout(r, 200));

    // Assert driver score
    const res = await request(app.getHttpServer())
      .get(`/api/v1/drivers/${driverId}/score`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Total = avg of 5, 4, 5, 5, 4 = 4.6 (role avg).
    // Mileage score = 5.0 (since 5km/L).
    // Total = (4.6 * 0.7) + (5.0 * 0.3) = 3.22 + 1.5 = 4.72
    const scoreData = res.body;
    expect(scoreData.totalScore).toBeCloseTo(4.72, 2);
    expect(scoreData.dispatcherAvg).toBe(5);
    expect(scoreData.fleetManagerAvg).toBe(4);
    expect(scoreData.workshopAvg).toBe(5);
    expect(scoreData.securityAvg).toBe(5);
    expect(scoreData.customerAvg).toBe(4);
    expect(scoreData.mileageAvg).toBe(5);

    // Check overallScore on Driver
    const driver = await prisma.runAsSystem('E2E Test', async (tx) => tx.driver.findUnique({ where: { id: driverId } }));
    expect(driver?.overallScore).toBeCloseTo(4.72, 2);
  });
});
