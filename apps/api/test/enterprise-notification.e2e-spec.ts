import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('Enterprise Notification & Multi-Channel Alerting (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let companyId: string;
  let userId: string;
  let templateId: string;
  const testEmail = `notif_admin_${Date.now()}@parilink.com`;

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
      data: { name: 'Notification Enterprise Test Corp' },
    });
    companyId = comp.id;

    const role = await prisma.role.create({
      data: {
        name: 'Notification Admin Role',
        permissions: ['*'],
        companyId,
      },
    });

    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        firstName: 'Notif',
        lastName: 'Admin',
        companyId,
        roleId: role.id,
      },
    });
    userId = user.id;

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

  it('1. Create notification template rule', async () => {
    const res = await request(app.getHttpServer())
      .post('/notifications/enterprise/templates')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Urgent Load Alert Template',
        eventType: 'load.urgent',
        channel: 'EMAIL',
        subject: 'Urgent: Load #{{loadNumber}} requires attention',
        body: 'Hello {{driverName}}, load #{{loadNumber}} is departing from {{origin}} at {{time}}.',
      });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Urgent Load Alert Template');
    templateId = res.body.id;
  });

  it('2. List notification templates', async () => {
    const res = await request(app.getHttpServer())
      .get('/notifications/enterprise/templates')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t: any) => t.id === templateId)).toBe(true);
  });

  it('3. Dispatch multi-channel alert with variable interpolation', async () => {
    const res = await request(app.getHttpServer())
      .post('/notifications/enterprise/dispatch')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        targetUserId: userId,
        eventType: 'load.urgent',
        priority: 'URGENT',
        title: 'Urgent Load Dispatch',
        templateData: {
          loadNumber: 'LD-9999',
          driverName: 'Notif Admin',
          origin: 'Chicago, IL',
          time: '14:00 EST',
        },
        channels: ['IN_APP', 'EMAIL'],
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.results.length).toBeGreaterThanOrEqual(1);
  });

  it('4. Get real-time notification metrics', async () => {
    const res = await request(app.getHttpServer())
      .get('/notifications/enterprise/metrics')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.total).toBeGreaterThanOrEqual(1);
  });

  it('5. Batch retry failed deliveries', async () => {
    const res = await request(app.getHttpServer())
      .post('/notifications/enterprise/retry-failed')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(res.status).toBe(200);
    if (res.body.success) {
      expect(res.body.success).toBe(true);
    } else {
      expect(res.body.message).toBeDefined();
    }
    expect(typeof res.body.requeuedCount).toBe('number');
  });

  it('6. Delete notification template rule', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/notifications/enterprise/templates/${templateId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
