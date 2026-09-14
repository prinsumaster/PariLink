import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import cookieParser from 'cookie-parser';

describe('Autonomous API Fuzzer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let company: any;
  let admin: any;
  let token: string;
  let tripId: string;
  let driverId: string;
  let vehicleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
    );
    app.enableShutdownHooks();
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    const hashedPassword = await bcrypt.hash('FuzzerPass123', 10);

    // Seed Data
    company = await prisma.runAsSystem('e2e-setup', async tx => tx.company.create({ data: { name: 'FUZZER_CORP', status: 'ACTIVE' } }));
    
    const role = await prisma.runAsSystem('e2e-setup', async tx => tx.role.create({
      data: { name: 'SUPER_ADMIN', permissions: ['*'], companyId: company.id },
    }));

    admin = await prisma.runAsSystem('e2e-setup', async tx => tx.user.create({
      data: {
        email: `fuzzer-${Date.now()}@example.com`,
        firstName: 'Fuzz', lastName: 'Master',
        password: hashedPassword,
        companyId: company.id,
        roleId: role.id,
        status: 'ACTIVE',
      },
    }));

    token = jwtService.sign({
      sub: admin.id,
      email: admin.email,
      companyId: company.id,
      role: 'SUPER_ADMIN',
      permissions: ['*'],
    });

    const driver = await prisma.runAsSystem('e2e-setup', async tx => tx.driver.create({
      data: { companyId: company.id, firstName: 'D', lastName: 'Fuzz' }
    }));
    driverId = driver.id;

    const vehicle = await prisma.runAsSystem('e2e-setup', async tx => tx.vehicle.create({
      data: { companyId: company.id, licensePlate: 'FUZZ01', vin: 'VIN1' }
    }));
    vehicleId = vehicle.id;

    const trip = await prisma.runAsSystem('e2e-setup', async tx => tx.trip.create({
      data: { companyId: company.id, tripNumber: `TRP-FUZZ-${Date.now()}` }
    }));
    tripId = trip.id;
  });

  afterAll(async () => {
    await app.close();
  });

  const endpoints = [
    { method: 'GET', path: '/api/v1/trips' },
    { method: 'GET', path: () => `/api/v1/trips/${tripId}` },
    { method: 'PATCH', path: () => `/api/v1/trips/${tripId}` },
    { method: 'POST', path: () => `/api/v1/trips/${tripId}/loads` },
    { method: 'POST', path: () => `/api/v1/trips/${tripId}/close` },
    { method: 'POST', path: () => `/api/v1/trips/${tripId}/driver-score` },
    { method: 'POST', path: () => `/api/v1/trips/${tripId}/reviews` },
    { method: 'GET', path: '/api/v1/drivers' },
    { method: 'GET', path: () => `/api/v1/drivers/${driverId}` },
    { method: 'PATCH', path: () => `/api/v1/drivers/${driverId}` },
    { method: 'GET', path: '/api/v1/vehicles' },
    { method: 'GET', path: () => `/api/v1/vehicles/${vehicleId}` },
    { method: 'PATCH', path: () => `/api/v1/vehicles/${vehicleId}` },
    { method: 'GET', path: '/api/v1/dashboard/kpis' },
  ];

  const adversarialPayloads = [
    {},
    { status: null },
    { id: 9999999999 },
    { date: 'invalid-date' },
    { unknownField: 'should-be-stripped' },
    { status: 'INVALID_STATUS' },
    { driverId: 'invalid-uuid' },
    { vehicleId: null },
    { notes: 12345 },
  ];

  const invalidIds = [
    'invalid-uuid',
    '12345',
    '99999999-9999-9999-9999-999999999999', // Valid format, non-existent
    'null',
    'undefined',
    "' OR '1'='1"
  ];

  describe('Fuzzing Endpoints for 500 Errors', () => {
    
    // Fuzz all endpoints with bad IDs
    for (const endpoint of endpoints) {
      if (typeof endpoint.path === 'function') {
        for (const badId of invalidIds) {
          it(`Should NOT return 500 for ${endpoint.method} ${endpoint.path.toString()} with ID ${badId}`, async () => {
             const basePath = (endpoint.path as any)();
             const pathWithBadId = basePath.replace(tripId, badId).replace(driverId, badId).replace(vehicleId, badId);
             
             const req = ((request(app.getHttpServer()) as any)[endpoint.method.toLowerCase()])(pathWithBadId)
               .set('Authorization', `Bearer ${token}`);
             
             if (endpoint.method === 'PATCH' || endpoint.method === 'POST') {
               req.send({ status: 'ACTIVE' });
             }

             const res = await req;
             expect(res.status).not.toBe(500);
          });
        }
      }
    }

    // Fuzz PATCH endpoints with bad payloads
    for (const endpoint of endpoints) {
      if (endpoint.method === 'PATCH' || endpoint.method === 'POST') {
        for (const payload of adversarialPayloads) {
          it(`Should NOT return 500 for ${endpoint.method} ${typeof endpoint.path === 'function' ? endpoint.path.toString() : endpoint.path} with payload ${JSON.stringify(payload)}`, async () => {
             const path = typeof endpoint.path === 'function' ? (endpoint.path as any)() : endpoint.path;
             const httpAgent = request(app.getHttpServer()) as any;
             const res = await httpAgent[endpoint.method.toLowerCase()](path)
               .set('Authorization', `Bearer ${token}`)
               .send(payload);
             
             expect(res.status).not.toBe(500);
          });
        }
      }
    }

    // Fuzz Query Parameters
    for (const endpoint of endpoints) {
      if (endpoint.method === 'GET') {
        it(`Should NOT return 500 for ${endpoint.method} ${typeof endpoint.path === 'function' ? endpoint.path.toString() : endpoint.path} with bad query params`, async () => {
           const path = typeof endpoint.path === 'function' ? (endpoint.path as any)() : endpoint.path;
           const res = await request(app.getHttpServer())
             .get(path)
             .query({ page: -1, limit: 'invalid', status: ['UNKNOWN'], search: { obj: true } })
             .set('Authorization', `Bearer ${token}`);
           
           expect(res.status).not.toBe(500);
        });
      }
    }

  });
});
