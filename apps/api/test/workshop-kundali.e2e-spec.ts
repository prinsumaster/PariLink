import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';

describe('Workshop Kundali RLS (e2e)', () => {
  let app: INestApplication;
  let tokenA: string;
  let tokenB: string;

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

    const { PrismaService } = require('../src/prisma/prisma.service');
    const prisma = app.get(PrismaService);
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('test_password_123', 10);

    // 1. Setup Tenant A
    const companyA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.company.create({ data: { name: 'Kundali Tenant A' } }),
    );
    const roleA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.role.create({
        data: { name: 'Admin A', companyId: companyA.id, permissions: ['*'] },
      }),
    );
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
      .send({ email: userA.email, password: 'test_password_123' });
    tokenA = loginA.body?.access_token;
    if (!tokenA) {
      throw new Error(
        'TOKEN A IS UNDEFINED. Response: ' + JSON.stringify(loginA.body),
      );
    }

    // 2. Setup Tenant B
    const companyB = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.company.create({ data: { name: 'Kundali Tenant B' } }),
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
      .send({ email: userB.email, password: 'test_password_123' });
    tokenB = loginB.body?.access_token;
    if (!tokenB) {
      throw new Error(
        'TOKEN B IS UNDEFINED. Response: ' + JSON.stringify(loginB.body),
      );
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('proves RLS blocks Tenant B from fetching Tenant A Part (404 Not Found)', async () => {
    // Tenant A creates a Part
    const createPart = await request(app.getHttpServer())
      .post('/api/v1/workshop/parts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        name: 'RLS Isolation Test Part',
        quantity: 5,
        unitCost: 150,
        reorderLevel: 2,
      });

    expect(createPart.status).toBe(201);
    const partId = createPart.body.id;

    // Check Tenant A can fetch it
    const fetchA = await request(app.getHttpServer())
      .get(`/api/v1/workshop/parts/${partId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(fetchA.status).toBe(200);

    // Check Tenant B CANNOT fetch it, should get 404 because RLS hides the row
    const fetchB = await request(app.getHttpServer())
      .get(`/api/v1/workshop/parts/${partId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(fetchB.status).toBe(404); // NOT an empty array, it's a 404!
  });
});
