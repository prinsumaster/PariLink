import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
describe('DTO Validation Regression (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Exact same ValidationPipe config as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        stopAtFirstError: false,
      }),
    );
    
    await app.init();
    prisma = app.get(PrismaService);

    // Login as the seeded admin to get a valid JWT
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' })
      .expect(200); // Wait, in nestjs post is 201 by default unless configured.
      // Actually auth.e2e-spec expects 200 for login.
      
    adminToken = loginRes.body.access_token || loginRes.body.data?.access_token;
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (prisma) {
      await prisma.$disconnect();
    }
  }, 30000);

  const endpoints = [
    // Original 7 create endpoints
    '/admin/users',
    '/companies',
    '/admin/roles',
    '/loads',
    '/branches',
    '/customers',
    '/billing/rate-cards',
    // Integrations/EDI write endpoints (AI1b)
    '/integrations/configure',
    '/integrations/sync',
    '/integration/hub/configure',
    '/integration/sync/schedules',
    '/integration/mapping/templates',
    '/integration/import/preview',
    '/integration/import/execute',
    '/integration/events/publish',
    '/integration/developer/oauth/clients',
    '/integration/developer/webhook/test',
    '/api-platform/webhooks',
  ];

  describe('Empty POST Payload Rejection', () => {
    for (const endpoint of endpoints) {
      it(`should reject empty POST payload to ${endpoint} with 400 Bad Request`, async () => {
        // We expect a 400 because required fields are missing
        const res = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({});
          
        expect(res.status).toBe(400);
      });
    }
  });
});
