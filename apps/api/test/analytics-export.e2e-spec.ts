import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function setupAnalyticsTenant(prisma: PrismaService, jwt: JwtService, config: ConfigService) {
  const companyId = `analytics-co-${Date.now()}`;
  const userId = `analytics-user-${Date.now()}`;
  
  await prisma.runAsSystem('setup', async (tx) => {
    const company = await tx.company.create({
      data: {
        id: companyId,
        name: 'Analytics Co',
        status: 'ACTIVE'
      }
    });

    const role = await tx.role.create({
      data: {
        id: `role-${companyId}`,
        companyId,
        name: 'Admin',
        permissions: ['analytics:read', 'analytics:write']
      }
    });

    await tx.user.create({
      data: {
        id: userId,
        companyId,
        email: `analytics-${companyId}@test.com`,
        password: 'test',
        firstName: 'Test',
        lastName: 'Admin',
        roleId: role.id,
        status: 'ACTIVE'
      }
    });

    // Seed some snapshots
    await tx.analyticsSnapshot.createMany({
      data: [
        {
          companyId,
          metricKey: 'DAILY_REVENUE',
          metricValue: 1000,
          periodStart: new Date(),
          periodEnd: new Date(),
          resolution: 'DAILY',
        },
        {
          companyId,
          metricKey: 'DAILY_TRIPS_COMPLETED',
          metricValue: 5,
          periodStart: new Date(),
          periodEnd: new Date(),
          resolution: 'DAILY',
        }
      ]
    });
  });

  const payload = { sub: userId, companyId };
  const secret = config.get('JWT_SECRET');
  const token = jwt.sign(payload, { secret });

  return { companyId, userId, token };
}

describe('Analytics Export (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;
  let tenant: any;

  beforeAll(async () => {
    process.env.MINIO_ENDPOINT = '127.0.0.1';
    process.env.S3_ENDPOINT = 'http://127.0.0.1:9000';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);

    tenant = await setupAnalyticsTenant(prisma, jwt, config);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /analytics/reports/export - should successfully upload CSV to Minio and return presigned URL', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/analytics/reports/export')
      .set('Authorization', `Bearer ${tenant.token}`)
      .set('X-Tenant-ID', tenant.companyId)
      .send({ reportType: 'snapshots', format: 'CSV' })
      .expect(201);

    expect(res.body.status).toBe('COMPLETED');
    expect(res.body.downloadUrl).toBeDefined();

    const originalUrl = res.body.downloadUrl as string;
    
    // Fetch the presigned URL
    const downloadRes = await fetch(originalUrl);
    
    expect(downloadRes.status).toBe(200);
    const text = await downloadRes.text();
    
    // Check CSV contents
    expect(text).toContain('DAILY_REVENUE');
    expect(text).toContain('DAILY_TRIPS_COMPLETED');
    expect(text).toContain('1000');
    expect(text).toContain('5');
  });

  it('POST /analytics/reports/export - should return 503 if cloud storage fails', async () => {
    // Temporarily mess up Minio endpoint in process.env to simulate failure
    const originalEndpoint = process.env.MINIO_ENDPOINT;
    const originalS3Endpoint = process.env.S3_ENDPOINT;
    
    process.env.MINIO_ENDPOINT = 'invalid-host';
    process.env.S3_ENDPOINT = '';
    
    const res = await request(app.getHttpServer())
      .post('/api/v1/analytics/reports/export')
      .set('Authorization', `Bearer ${tenant.token}`)
      .set('X-Tenant-ID', tenant.companyId)
      .send({ reportType: 'snapshots', format: 'CSV' })
      .expect(503);
      
    expect(res.body.message).toContain('Failed to export report to cloud storage');

    // Restore
    process.env.MINIO_ENDPOINT = originalEndpoint;
    process.env.S3_ENDPOINT = originalS3Endpoint;
  });
});
