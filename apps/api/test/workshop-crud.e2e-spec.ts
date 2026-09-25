import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('WorkshopController (e2e)', () => {
  let app: INestApplication;
  let tokenA: string;
  let tokenB: string;
  let tokenNoPerm: string;
  let prisma: PrismaService;
  let noPermUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    // 1. Setup Tenant A
    const companyA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.company.create({ data: { name: 'Tenant A Workshop' } }),
    );
    const roleA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.role.create({
        data: { name: 'Admin A', companyId: companyA.id, permissions: ['*'] },
      }),
    );
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    const userA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.user.create({
        data: {
          email: `admin_a_${Date.now()}@parilink.com`,
          password: hash,
          firstName: 'A',
          lastName: 'A',
          companyId: companyA.id,
          roleId: roleA.id,
          status: 'ACTIVE',
        },
      }),
    );

    const loginA = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: userA.email, password: 'password123' });
    tokenA = loginA.body?.access_token;

    // 2. Setup Tenant B
    const companyB = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.company.create({ data: { name: 'Tenant B Workshop' } }),
    );
    const roleB = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.role.create({
        data: { name: 'Admin B', companyId: companyB.id, permissions: ['*'] },
      }),
    );
    const userB = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.user.create({
        data: {
          email: `admin_b_${Date.now()}@parilink.com`,
          password: hash,
          firstName: 'B',
          lastName: 'B',
          companyId: companyB.id,
          roleId: roleB.id,
          status: 'ACTIVE',
        },
      }),
    );

    const loginB = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: userB.email, password: 'password123' });
    tokenB = loginB.body?.access_token;

    // 3. Token No Perm (Tenant A User but without fleet read/write)
    noPermUserId = require('crypto').randomUUID();

    await prisma.runAsSystem('E2E Setup', async (tx) => {
      await tx.user.create({
        data: {
          id: noPermUserId,
          email: 'noperm@parilink.com',
          password: hash,
          firstName: 'No',
          lastName: 'Perm',
          companyId: companyA.id,
          status: 'ACTIVE',
        },
      });
    });

    const loginNoPerm = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'noperm@parilink.com', password: 'password123' });
    tokenNoPerm = loginNoPerm.body?.access_token;
  });

  afterAll(async () => {
    if (noPermUserId) {
      await prisma.runAsSystem('E2E Teardown', async (tx) => {
        await tx.user.delete({ where: { id: noPermUserId } });
      });
    }
    await app.close();
  });

  const resources = ['job-cards', 'parts', 'vendors', 'tyre-logs', 'job-parts'];

  resources.forEach((resource) => {
    describe(`/${resource}`, () => {
      it('should return 401 if unauthorized (no token)', async () => {
        await request(app.getHttpServer())
          .get(`/api/v1/workshop/${resource}`)
          .expect(401);
      });

      it('should return 403 if missing permissions', async () => {
        await request(app.getHttpServer())
          .get(`/api/v1/workshop/${resource}`)
          .set('Authorization', `Bearer ${tokenNoPerm}`)
          .expect(403);
      });

      it('should return 400 for empty body on POST', async () => {
        await request(app.getHttpServer())
          .post(`/api/v1/workshop/${resource}`)
          .set('Authorization', `Bearer ${tokenA}`)
          .send({})
          .expect(400);
      });

      it('should enforce cross-tenant isolation (404)', async () => {
        // Find an item from Tenant A
        const getA = await request(app.getHttpServer())
          .get(`/api/v1/workshop/${resource}`)
          .set('Authorization', `Bearer ${tokenA}`);

        // If Tenant A has items, Tenant B should get 404 for them
        if (getA.body && getA.body.length > 0) {
          const itemA = getA.body[0];
          await request(app.getHttpServer())
            .get(`/api/v1/workshop/${resource}/${itemA.id}`)
            .set('Authorization', `Bearer ${tokenB}`)
            .expect(404);
        }
      });
    });
  });
});
