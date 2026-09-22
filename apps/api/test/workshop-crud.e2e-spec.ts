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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    
    prisma = app.get(PrismaService);

    // 1. Token A (Tenant A)
    const loginA = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    tokenA = loginA.body?.access_token;

    // 2. Token B (Tenant B)
    const loginB = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin_b@parilink.com', password: 'password123' });
    tokenB = loginB.body?.access_token;

    // 3. Token No Perm (Tenant A User but without fleet read/write)
    // Create a temporary user with no role to test 403
    const companyA = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';
    noPermUserId = require('crypto').randomUUID();
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    
    await prisma.runAsSystem('E2E Setup', async (tx) => {
      await tx.user.create({
        data: {
          id: noPermUserId,
          email: 'noperm@parilink.com',
          password: hash,
          firstName: 'No',
          lastName: 'Perm',
          companyId: companyA,
          status: 'ACTIVE',
        }
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
        await request(app.getHttpServer()).get(`/api/v1/workshop/${resource}`).expect(401);
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
