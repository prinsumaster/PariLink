import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';

describe('Routes Module (e2e) — Route Planning', () => {
  let app: INestApplication;
  let adminToken: string;
  let createdRouteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginRes.body?.access_token || loginRes.body?.accessToken;
    expect(adminToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /routes — Create a route', () => {
    it('should create a route with explicit distance and tolls', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/routes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          origin: 'Mumbai',
          destination: 'Pune',
          distance: 148,
          estimatedTolls: 120,
        });

      expect(res.status).toBe(201);
      expect(res.body.origin).toBe('Mumbai');
      expect(res.body.destination).toBe('Pune');
      expect(res.body.distance).toBe(148);
      expect(res.body.estimatedTolls).toBe(120);
      createdRouteId = res.body.id;
      expect(createdRouteId).toBeDefined();
    });

    it('should create a route with mocked defaults when distance/tolls omitted', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/routes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          origin: 'Delhi',
          destination: 'Jaipur',
        });

      expect(res.status).toBe(201);
      expect(res.body.origin).toBe('Delhi');
      expect(res.body.destination).toBe('Jaipur');
      // Mocked defaults — explicitly noted as placeholders
      expect(res.body.distance).toBe(1000);
      expect(res.body.estimatedTolls).toBe(50);
    });
  });

  describe('GET /routes — List routes', () => {
    it('should list routes and include the created one', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/routes')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const found = res.body.find((r: any) => r.id === createdRouteId);
      expect(found).toBeDefined();
      expect(found.origin).toBe('Mumbai');
      expect(found.destination).toBe('Pune');
      expect(found.distance).toBe(148);
    });
  });

  describe('GET /routes/toll-estimate — Lookup from static toll table', () => {
    it('should return 404 for an unknown route pair', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/routes/toll-estimate?originCity=NonExistCity&destinationCity=AlsoFake')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});
