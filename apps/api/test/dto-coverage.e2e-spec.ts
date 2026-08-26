import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

describe('DTO Coverage Regression (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let endpointsToTest: string[] = [];

  beforeAll(async () => {
    // Load OpenAPI spec
    const swaggerPath = path.join(__dirname, '../../docs/static/openapi.json');
    if (fs.existsSync(swaggerPath)) {
      const swaggerData = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
      
      // Extract all POST endpoints without path params
      for (const [routePath, methods] of Object.entries(swaggerData.paths)) {
        if ((methods as any).post && !routePath.includes('{')) {
          endpointsToTest.push(routePath);
        }
      }
    } else {
      console.warn(`Swagger JSON not found at ${swaggerPath}. Endpoints will be empty.`);
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
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

    // Login to get a valid token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin_a@parilink.com', password: 'password123' });
      
    adminToken = loginRes.body.access_token || loginRes.body.data?.access_token;
  }, 60000);

  afterAll(async () => {
    if (app) await app.close();
    if (prisma) await prisma.$disconnect();
  }, 30000);

  it('should have loaded endpoints from swagger', () => {
    expect(endpointsToTest.length).toBeGreaterThan(0);
  });

  describe('Empty POST payloads must not cause 500 errors', () => {
    it('should dynamically test all POST endpoints', async () => {
      if (!adminToken) {
        console.warn('No admin token found. Skipping endpoint tests.');
        return;
      }
      
      const failures: string[] = [];
      
      for (const endpoint of endpointsToTest) {
        // Many endpoints require a companyId or something, but `{}` shouldn't crash it with 500
        const res = await request(app.getHttpServer())
          .post(endpoint)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({});
          
        if (res.status === 500) {
          failures.push(`POST ${endpoint} returned 500 Internal Server Error`);
        }
      }
      
      expect(failures).toEqual([]);
    }, 120000);
  });
});
