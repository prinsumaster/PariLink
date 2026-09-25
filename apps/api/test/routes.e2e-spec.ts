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

    it('should create a route with mocked defaults when distance/tolls omitted, falling back to heuristic', async () => {
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
      // Heuristic fallback should generate a deterministic distance > 0
      expect(res.body.distance).toBeGreaterThan(0);
      expect(res.body.estimatedTolls).toBe(res.body.distance * 2.0); // 2.0 per km
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
    it('should return heuristic fallback for an unknown route pair', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/routes/toll-estimate?originCity=NonExistCity&destinationCity=AlsoFake')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200); // Now it returns heuristic, not 404
      expect(res.body.estimateType).toBe('HEURISTIC_FALLBACK');
      expect(res.body.distanceKm).toBeGreaterThan(0);
      expect(res.body.fastagCost).toBe(res.body.distanceKm * 2.0);
    });
    
    it('should return dictionary exact match for known hub pair', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/routes/toll-estimate?originCity=Mumbai&destinationCity=Pune')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.estimateType).toBe('EXACT_DICTIONARY');
      expect(res.body.distanceKm).toBe(150);
      expect(res.body.fastagCost).toBe(300);
    });
  });

  describe('POST /routes/:id/attach-to-trip — Attach to Trip', () => {
    let tripId: string;
    
    beforeAll(async () => {
      const prisma = app.get(require('../src/prisma/prisma.service').PrismaService);
      const companyId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';
      
      await prisma.runAsTenant(companyId, async (tx: any) => {
        const trip = await tx.trip.create({
          data: {
            id: 'route-test-trip-' + Date.now(),
            companyId,
            tripNumber: 'RT-' + Date.now(),
            status: 'IN_TRANSIT',
            rate: 500,
          },
        });
        tripId = trip.id;
      });
    });

    it('should attach the route to the trip', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/routes/${createdRouteId}/attach-to-trip`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ tripId });

      expect(res.status).toBe(201);
      expect(res.body.route.id).toBe(createdRouteId);
    });
  });
});
