import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../apps/api/src/app.module';

describe('Fleet Operations Workflow (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let loadId: string;
  let tripId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'dispatcher@parilink.com', password: 'password', companyId: 'tenant-fleet' });
    token = login.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Create a Load', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/loads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerId: 'cust-1',
        referenceNumber: 'WF-LD-001',
        originAddress: '123 A', originCity: 'A', originState: 'TX',
        destinationAddress: '456 B', destinationCity: 'B', destinationState: 'TX',
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date().toISOString(),
        rate: 2500,
      });
    expect(res.status).toBe(201);
    loadId = res.body.id;
  });

  it('2. Create a Trip and Assign Load', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tripNumber: 'WF-TRP-001',
        driverId: 'drv-1',
        vehicleId: 'veh-1',
        trailerId: 'trl-1',
        status: 'PLANNED',
      });
    expect(res.status).toBe(201);
    tripId = res.body.id;

    // Attach Load to Trip (Assume API exists or handled via trip update)
    const assignRes = await request(app.getHttpServer())
      .patch(`/api/v1/loads/${loadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ tripId, status: 'ASSIGNED' });
    expect(assignRes.status).toBe(200);
  });

  it('3. Dispatch Trip', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'DISPATCHED' });
    expect(res.status).toBe(200);
  });

  it('4. Complete Trip', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/trips/${tripId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'COMPLETED' });
    expect(res.status).toBe(200);

    // Load should also auto-complete or be manually updated
    const loadRes = await request(app.getHttpServer())
      .patch(`/api/v1/loads/${loadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'DELIVERED' });
    expect(loadRes.status).toBe(200);
  });
});
