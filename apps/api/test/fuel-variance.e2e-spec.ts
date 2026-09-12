/**
 * STEP 6: E2E — Fuel Variance Root-Cause Analysis
 *
 * Five tests:
 *   1. DRIVER isolation
 *   2. MECHANICAL isolation
 *   3. ROUTE isolation
 *   4. INSUFFICIENT_DATA — single entry, no comparison group
 *   5. Cross-tenant isolation — tenant B entries invisible to tenant A
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// ── helpers ──────────────────────────────────────────────────────────────────

async function setupTenant(
  prisma: PrismaService,
  jwt: JwtService,
  config: ConfigService,
  tag: string,
): Promise<{
  companyId: string;
  token: string;
  vehicleId: string;
  vehicle2Id: string;
  vehicle3Id: string;
  driverId: string;
  driver2Id: string;
  driver3Id: string;
}> {
  const company = await prisma.runAsSystem('e2e-setup', tx =>
    tx.company.create({ data: { name: `FuelVariance-E2E-${tag}` } }),
  );
  const cid = company.id;

  const role = await prisma.runAsSystem('e2e-setup', tx =>
    tx.role.create({ data: { companyId: cid, name: 'OPS', permissions: ['reports:read'] } }),
  );
  const user = await prisma.runAsSystem('e2e-setup', tx =>
    tx.user.create({
      data: {
        companyId: cid, roleId: role.id,
        email: `fuel-e2e-${tag}-${Date.now()}@example.com`,
        password: 'x', firstName: 'Test', lastName: 'User',
      },
    }),
  );

  const token = jwt.sign(
    { sub: user.id, email: user.email, companyId: cid, permissions: ['reports:read'] },
    { secret: config.get('JWT_SECRET') },
  );

  const v1 = await prisma.runAsSystem('e2e-setup', tx =>
    tx.vehicle.create({ data: { companyId: cid, licensePlate: `V1-${tag}`, type: 'TRUCK' } }),
  );
  const v2 = await prisma.runAsSystem('e2e-setup', tx =>
    tx.vehicle.create({ data: { companyId: cid, licensePlate: `V2-${tag}`, type: 'TRUCK' } }),
  );

  const v3 = await prisma.runAsSystem('e2e-setup', tx =>
    tx.vehicle.create({ data: { companyId: cid, licensePlate: `V3-${tag}`, type: 'TRUCK' } }),
  );

  const dUserA = await prisma.runAsSystem('e2e-setup', tx =>
    tx.user.create({
      data: {
        companyId: cid, roleId: role.id,
        email: `da-${tag}-${Date.now()}@example.com`,
        password: 'x', firstName: 'Amit', lastName: 'Shah',
      },
    }),
  );
  const dUserB = await prisma.runAsSystem('e2e-setup', tx =>
    tx.user.create({
      data: {
        companyId: cid, roleId: role.id,
        email: `db-${tag}-${Date.now()}@example.com`,
        password: 'x', firstName: 'Ravi', lastName: 'Kumar',
      },
    }),
  );
  const dUserC = await prisma.runAsSystem('e2e-setup', tx =>
    tx.user.create({
      data: {
        companyId: cid, roleId: role.id,
        email: `dc-${tag}-${Date.now()}@example.com`,
        password: 'x', firstName: 'Suresh', lastName: 'Patel',
      },
    }),
  );

  const d1 = await prisma.runAsSystem('e2e-setup', tx =>
    tx.driver.create({
      data: {
        companyId: cid, userId: dUserA.id,
        firstName: 'Amit', lastName: 'Shah',
        phone: `900${tag.slice(0,7)}1`, status: 'ACTIVE', licenseNumber: `LA-${tag}`,
      },
    }),
  );
  const d2 = await prisma.runAsSystem('e2e-setup', tx =>
    tx.driver.create({
      data: {
        companyId: cid, userId: dUserB.id,
        firstName: 'Ravi', lastName: 'Kumar',
        phone: `900${tag.slice(0,7)}2`, status: 'ACTIVE', licenseNumber: `LB-${tag}`,
      },
    }),
  );
  const d3 = await prisma.runAsSystem('e2e-setup', tx =>
    tx.driver.create({
      data: {
        companyId: cid, userId: dUserC.id,
        firstName: 'Suresh', lastName: 'Patel',
        phone: `900${tag.slice(0,7)}3`, status: 'ACTIVE', licenseNumber: `LC-${tag}`,
      },
    }),
  );

  return { companyId: cid, token, vehicleId: v1.id, vehicle2Id: v2.id, vehicle3Id: v3.id, driverId: d1.id, driver2Id: d2.id, driver3Id: d3.id };
}

async function seedTrip(
  prisma: PrismaService, cid: string, vehicleId: string, driverId: string, distance = 1000,
) {
  return prisma.runAsSystem('e2e-setup', async tx => {
    const t = await tx.trip.create({
      data: {
        companyId: cid, vehicleId, driverId,
        tripNumber: `T-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        status: 'COMPLETED', estimatedDistance: distance, actualDistance: distance,
      },
    });
    return t.id;
  });
}

async function seedFuel(
  prisma: PrismaService,
  cid: string, tripId: string, vehicleId: string, driverId: string,
  litres: number, expectedLitres: number, originCity: string, destinationCity: string,
) {
  const variancePct = ((litres - expectedLitres) / expectedLitres) * 100;
  return prisma.runAsSystem('e2e-setup', tx =>
    tx.fuelEntry.create({
      data: {
        companyId: cid, tripId, vehicleId, driverId,
        litres, amount: litres * 85, expectedLitres, variancePct,
        originCity, destinationCity,
      },
    }),
  );
}

// ── Test Suite ────────────────────────────────────────────────────────────────

describe('Fuel Variance Root-Cause (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;

  let tenantA: Awaited<ReturnType<typeof setupTenant>>;
  let tenantB: Awaited<ReturnType<typeof setupTenant>>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);

    const stamp = Date.now().toString().slice(-6);
    tenantA = await setupTenant(prisma, jwt, config, `A${stamp}`);
    tenantB = await setupTenant(prisma, jwt, config, `B${stamp}`);
  }, 60000);

  afterAll(async () => {
    // Cascade delete via FuelEntry -> Trip -> Driver/Vehicle, then Company
    for (const cid of [tenantA?.companyId, tenantB?.companyId].filter(Boolean)) {
      try {
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "FuelEntry" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "TripExpense" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "Trip" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "Driver" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "Vehicle" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "User" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.$executeRawUnsafe(`DELETE FROM "Role" WHERE "companyId" = '${cid}'`),
        );
        await prisma.runAsSystem('e2e-cleanup', tx =>
          tx.company.delete({ where: { id: cid } }),
        );
      } catch (_) { /* best-effort */ }
    }
    await app.close();
  });

  // ── 1. DRIVER isolation ──────────────────────────────────────────────────
  it('1. DRIVER isolation — same vehicle+route, higher driver gets DRIVER', async () => {
    const { companyId: cid, token, vehicleId, driverId, driver2Id } = tenantA;

    const tA = await seedTrip(prisma, cid, vehicleId, driverId, 1000);
    const tB = await seedTrip(prisma, cid, vehicleId, driver2Id, 1000);

    // Driver A: -20% (normal); Driver B: +32% (DRIVER)
    await seedFuel(prisma, cid, tA, vehicleId, driverId, 200, 250, 'Mumbai', 'Nagpur');
    await seedFuel(prisma, cid, tB, vehicleId, driver2Id, 330, 250, 'Mumbai', 'Nagpur');

    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/root-cause')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const driverCases = res.body.filter((r: any) => r.rootCause === 'DRIVER');
    expect(driverCases.length).toBeGreaterThanOrEqual(1);
    expect(driverCases[0].comparisonGroupSize).toBeGreaterThanOrEqual(2);
    expect(driverCases[0].confidence).toBe('HIGH');

    console.log(`\n✅ DRIVER: ${driverCases[0].driverName} variance=${driverCases[0].variancePct}%`);
    console.log(`   ${driverCases[0].explanation}`);
  });

  // ── 2. MECHANICAL isolation ──────────────────────────────────────────────
  it('2. MECHANICAL isolation — same driver+route, higher vehicle gets MECHANICAL', async () => {
    const { companyId: cid, token, vehicleId, vehicle2Id, driverId } = tenantA;

    const tC = await seedTrip(prisma, cid, vehicleId, driverId, 500);
    const tD = await seedTrip(prisma, cid, vehicle2Id, driverId, 500);

    // Vehicle 1: +68%; Vehicle 2: +4%
    await seedFuel(prisma, cid, tC, vehicleId, driverId, 210, 125, 'Mumbai', 'Pune');
    await seedFuel(prisma, cid, tD, vehicle2Id, driverId, 130, 125, 'Mumbai', 'Pune');

    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/root-cause')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const mechCases = res.body.filter((r: any) => r.rootCause === 'MECHANICAL');
    expect(mechCases.length).toBeGreaterThanOrEqual(1);

    console.log(`\n✅ MECHANICAL: ${mechCases[0].licensePlate} variance=${mechCases[0].variancePct}%`);
    console.log(`   ${mechCases[0].explanation}`);
  });

  // ── 3. ROUTE isolation ───────────────────────────────────────────────────
  it('3. ROUTE isolation — same driver+vehicle, higher route gets ROUTE', async () => {
    const { companyId: cid, token, vehicle3Id, driver3Id } = tenantA;

    const tE = await seedTrip(prisma, cid, vehicle3Id, driver3Id, 300);
    const tF = await seedTrip(prisma, cid, vehicle3Id, driver3Id, 1000);

    // Surat: +4%; Nagpur: +52%
    await seedFuel(prisma, cid, tE, vehicle3Id, driver3Id, 78, 75, 'Mumbai', 'Surat');
    await seedFuel(prisma, cid, tF, vehicle3Id, driver3Id, 380, 250, 'Mumbai', 'Nagpur');

    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/root-cause')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const routeCases = res.body.filter((r: any) => r.rootCause === 'ROUTE');
    expect(routeCases.length).toBeGreaterThanOrEqual(1);

    console.log(`\n✅ ROUTE: ${routeCases[0].routeKey} variance=${routeCases[0].variancePct}%`);
    console.log(`   ${routeCases[0].explanation}`);
  });

  // ── 4. INSUFFICIENT_DATA ─────────────────────────────────────────────────
  it('4. INSUFFICIENT_DATA — single entry, no comparison group', async () => {
    const { companyId: cid, token, vehicleId, driverId } = tenantB;

    // Tenant B has NO other fuel entries — single entry must → INSUFFICIENT_DATA
    const tSolo = await seedTrip(prisma, cid, vehicleId, driverId, 500);
    await seedFuel(prisma, cid, tSolo, vehicleId, driverId, 130, 125, 'Chennai', 'Bangalore');

    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/root-cause')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const insufficientCases = res.body.filter((r: any) => r.rootCause === 'INSUFFICIENT_DATA');
    expect(insufficientCases.length).toBeGreaterThanOrEqual(1);
    expect(insufficientCases[0].comparisonGroupSize).toBe(1);

    console.log(`\n✅ INSUFFICIENT_DATA: ${insufficientCases[0].explanation}`);
  });

  // ── 4b. NORMAL isolation ─────────────────────────────────────────────────
  it('5. NORMAL isolation — variance <15% with a valid baseline group gets NORMAL', async () => {
    const { companyId: cid, token, vehicleId, driverId } = tenantA;

    // Seed a baseline group on a new route (Delhi -> Agra)
    const tG = await seedTrip(prisma, cid, vehicleId, driverId, 200);
    const tH = await seedTrip(prisma, cid, vehicleId, driverId, 200);

    // Baseline: +2% (Normal), Another trip: -5% (Normal) -> Both <15%, and group size >= 2
    await seedFuel(prisma, cid, tG, vehicleId, driverId, 51, 50, 'Delhi', 'Agra');
    await seedFuel(prisma, cid, tH, vehicleId, driverId, 47, 50, 'Delhi', 'Agra');

    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/root-cause')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    // Find the Delhi:Agra entries
    const normalCases = res.body.filter((r: any) => r.routeKey === 'Delhi:Agra');
    expect(normalCases.length).toBe(2);

    for (const c of normalCases) {
      expect(c.rootCause).toBe('NORMAL');
      expect(c.comparisonGroupSize).toBeGreaterThanOrEqual(2);
    }

    console.log(`\n✅ NORMAL: ${normalCases[0].explanation}`);
  });

  // ── 6. Cross-tenant isolation ─────────────────────────────────────────────
  it('5. Cross-tenant — Tenant A cannot see Tenant B route entries', async () => {
    // Tenant B has a Chennai:Bangalore entry — Tenant A must not see it
    const res = await request(app.getHttpServer())
      .get('/api/v1/intelligence/fuel/root-cause')
      .set('Authorization', `Bearer ${tenantA.token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const leaked = res.body.find((r: any) => r.routeKey === 'Chennai:Bangalore');
    expect(leaked).toBeUndefined();

    console.log(`\n✅ Cross-tenant: Tenant A sees ${res.body.length} entries; Chennai:Bangalore NOT present`);
  });
});
