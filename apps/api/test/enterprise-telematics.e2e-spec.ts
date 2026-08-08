import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('Enterprise Telematics & Geofence Intelligence Platform (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let companyId: string;
  let userId: string;
  let vehicleId: string;
  let geofenceId: string;
  let ruleId: string;
  let alertId: string;
  const testEmail = `telematics_admin_${Date.now()}@parilink.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.enableShutdownHooks();
    await app.init();

    prisma = app.get(PrismaService);

    const comp = await prisma.company.create({
      data: { name: 'Telematics Enterprise Test Corp' },
    });
    companyId = comp.id;

    const role = await prisma.role.create({
      data: {
        name: 'Telematics Admin Role',
        permissions: ['*'],
        companyId,
      },
    });

    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        firstName: 'Telematics',
        lastName: 'Admin',
        companyId,
        roleId: role.id,
      },
    });
    userId = user.id;

    const vehicle = await prisma.vehicle.create({
      data: {
        companyId,
        licensePlate: `TEL-${Date.now().toString().slice(-4)}`,
        make: 'Freightliner',
        model: 'Cascadia',
        year: 2024,
        status: 'ACTIVE',
      },
    });
    vehicleId = vehicle.id;

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testEmail,
        password: 'Password123!',
        companyId,
      });
    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await prisma.company.delete({ where: { id: companyId } }).catch(() => {});
    await app.close();
  });

  it('1. Create circular depot geofence', async () => {
    const res = await request(app.getHttpServer())
      .post('/tracking/enterprise/geofences')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Midwest Hub Depot',
        type: 'DEPOT',
        latitude: 41.8781,
        longitude: -87.6298,
        radiusMeters: 500,
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Midwest Hub Depot');
    geofenceId = res.body.id;
  });

  it('2. List geofences', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracking/enterprise/geofences')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((g: any) => g.id === geofenceId)).toBe(true);
  });

  it('3. Create speeding and engine temperature alert rules', async () => {
    const res = await request(app.getHttpServer())
      .post('/tracking/enterprise/alert-rules')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'High Speed Rule',
        type: 'SPEEDING',
        condition: 'EXCEEDS',
        threshold: 70,
        severity: 'HIGH',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('High Speed Rule');
    ruleId = res.body.id;
  });

  it('4. Ingest real-time CAN-bus telemetry and trigger speed alert', async () => {
    const res = await request(app.getHttpServer())
      .post('/tracking/enterprise/telemetry')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        vehicleId,
        speed: 78.5,
        rpm: 1650,
        coolantTemp: 195,
        fuelLevel: 65.0,
        batteryVolts: 14.1,
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.triggeredAlertsCount).toBeGreaterThanOrEqual(1);
    alertId = res.body.triggeredAlerts[0].id;
  });

  it('5. Evaluate vehicle GPS position inside geofence (ENTER transition)', async () => {
    const res = await request(app.getHttpServer())
      .post('/tracking/enterprise/geofences/evaluate')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        vehicleId,
        latitude: 41.8782,
        longitude: -87.6299,
      });
    expect(res.status).toBe(200);
    expect(res.body.eventsCreated.length).toBeGreaterThanOrEqual(1);
    expect(res.body.eventsCreated[0].eventType).toBe('ENTER');
  });

  it('6. View geofence transition history', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tracking/enterprise/geofence-events?geofenceId=${geofenceId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('7. Acknowledge and resolve triggered alert', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tracking/enterprise/alerts/${alertId}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'ACKNOWLEDGED',
        notes: 'Dispatch contacted driver to reduce speed.',
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ACKNOWLEDGED');
  });

  it('8. Get fleet health and safety analytics', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracking/enterprise/analytics')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.summary.vehicleCount).toBeGreaterThanOrEqual(1);
    expect(res.body.summary.totalAlerts).toBeGreaterThanOrEqual(1);
  });

  it('9. Delete alert rule and geofence', async () => {
    const delRule = await request(app.getHttpServer())
      .delete(`/tracking/enterprise/alert-rules/${ruleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(delRule.status).toBe(200);

    const delFence = await request(app.getHttpServer())
      .delete(`/tracking/enterprise/geofences/${geofenceId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(delFence.status).toBe(200);
  });
});
