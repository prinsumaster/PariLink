import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('CP3 Anomaly Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tenantAId: string;
  let tenantBId: string;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    
    tenantAId = 'cp3-company-a-' + Date.now();
    tenantBId = 'cp3-company-b-' + Date.now();

    await prisma.runAsSystem('setup CP3 HTTP', async (tx) => {
      const companyA = await tx.company.create({ data: { id: tenantAId, name: 'CP3 Tenant A', email: 'a@example.com', taxId: 'TAX-A' } });
      const companyB = await tx.company.create({ data: { id: tenantBId, name: 'CP3 Tenant B', email: 'b@example.com', taxId: 'TAX-B' } });

      const roleA = await tx.role.create({ data: { name: 'Admin', companyId: tenantAId, permissions: ['*'] } });
      const roleB = await tx.role.create({ data: { name: 'Admin', companyId: tenantBId, permissions: ['*'] } });

      const userA = await tx.user.create({ data: { email: `a-${Date.now()}@example.com`, password: 'test', firstName: 'A', lastName: 'A', companyId: tenantAId, roleId: roleA.id, status: 'ACTIVE' } });
      const userB = await tx.user.create({ data: { email: `b-${Date.now()}@example.com`, password: 'test', firstName: 'B', lastName: 'B', companyId: tenantBId, roleId: roleB.id, status: 'ACTIVE' } });

      const driverA = await tx.driver.create({ data: { userId: userA.id, companyId: tenantAId, status: 'ACTIVE', licenseNumber: 'DL-A', licenseExpiry: new Date('2030-01-01'), firstName: 'Driver', lastName: 'A' } });
      const vehicleA = await tx.vehicle.create({ data: { licensePlate: 'VA-1', make: 'M', model: 'M', year: 2020, status: 'ACTIVE', type: 'TRUCK', companyId: tenantAId } });
      const tripA = await tx.trip.create({ data: { tripNumber: `TRIPA-${Date.now()}`, companyId: tenantAId, status: 'DRAFT', vehicleId: vehicleA.id, driverId: driverA.id } });
      const fuelA = await tx.fuelEntry.create({
        data: { trip: { connect: { id: tripA.id } }, vehicle: { connect: { id: vehicleA.id } }, driver: { connect: { id: driverA.id } }, company: { connect: { id: tenantAId } }, litres: 100, amount: 100, variancePct: 35, filledAt: new Date() }
      });

      const driverB = await tx.driver.create({ data: { userId: userB.id, companyId: tenantBId, status: 'ACTIVE', licenseNumber: 'DL-B', licenseExpiry: new Date('2030-01-01'), firstName: 'Driver', lastName: 'B' } });
      const vehicleB = await tx.vehicle.create({ data: { licensePlate: 'VB-1', make: 'M', model: 'M', year: 2020, status: 'ACTIVE', type: 'TRUCK', companyId: tenantBId } });
      const tripB = await tx.trip.create({ data: { tripNumber: `TRIPB-${Date.now()}`, companyId: tenantBId, status: 'DRAFT', vehicleId: vehicleB.id, driverId: driverB.id } });
      const fuelB = await tx.fuelEntry.create({
        data: { trip: { connect: { id: tripB.id } }, vehicle: { connect: { id: vehicleB.id } }, driver: { connect: { id: driverB.id } }, company: { connect: { id: tenantBId } }, litres: 100, amount: 100, variancePct: 45, filledAt: new Date() }
      });
      const jwt = require('jsonwebtoken');
      let privateKey = process.env.JWT_PRIVATE_KEY || '';
      if (!privateKey?.includes('BEGIN PRIVATE KEY')) {
        privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
      }
      tokenA = jwt.sign({ sub: userA.id, cid: tenantAId, rid: roleA.id }, privateKey, { algorithm: 'RS256' });
      tokenB = jwt.sign({ sub: userB.id, cid: tenantBId, rid: roleB.id }, privateKey, { algorithm: 'RS256' });
    });
  });

  afterAll(async () => {
    await prisma.runAsSystem('cleanup CP3', async (tx) => {
      await tx.fuelEntry.deleteMany({ where: { companyId: { in: [tenantAId, tenantBId] } } });
      await tx.trip.deleteMany({ where: { companyId: { in: [tenantAId, tenantBId] } } });
      await tx.vehicle.deleteMany({ where: { companyId: { in: [tenantAId, tenantBId] } } });
      await tx.user.deleteMany({ where: { companyId: { in: [tenantAId, tenantBId] } } });
      await tx.role.deleteMany({ where: { companyId: { in: [tenantAId, tenantBId] } } });
      await tx.company.deleteMany({ where: { id: { in: [tenantAId, tenantBId] } } });
    });
    await app.close();
  });

  it('Tenant A should see only Tenant A anomalies via HTTP', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/anomalies')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    const body = res.body;
    console.log('HTTP Response for Tenant A:\\n', JSON.stringify(body, null, 2));
    
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    // All anomalies returned must belong to Tenant A (either implicitly by ID or by checking the variance)
    body.forEach((anomaly: any) => {
      expect(anomaly.variancePct).toBe(35); // Since A's fuel entry had 35% variance
    });
  });

  it('Tenant B should see only Tenant B anomalies via HTTP', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/anomalies')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    const body = res.body;
    console.log('HTTP Response for Tenant B:\\n', JSON.stringify(body, null, 2));
    
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    body.forEach((anomaly: any) => {
      expect(anomaly.variancePct).toBe(45); // Since B's fuel entry had 45% variance
    });
  });
});
