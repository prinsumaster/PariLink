import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('Cross-Tenant Entity Isolation (e2e)', () => {
  let app: INestApplication;
  let tenantAToken: string;
  let tenantBToken: string;

  let tenantACustomerId: string;
  let tenantAVehicleId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableShutdownHooks();
    await app.init();

    const prisma = app.get(PrismaService);
    const hash = await bcrypt.hash('password', 10);

    // Self-seed: companies, roles, users for tenant-a and tenant-b
    await prisma.runAsSystem('cross-tenant e2e: seed companies', async (tx) => {
      await tx.company.upsert({
        where: { id: 'tenant-a' },
        update: {},
        create: { id: 'tenant-a', name: 'Tenant A' },
      });
      await tx.company.upsert({
        where: { id: 'tenant-b' },
        update: {},
        create: { id: 'tenant-b', name: 'Tenant B' },
      });
    });

    await prisma.runAsSystem('cross-tenant e2e: seed roles', async (tx) => {
      await tx.role.upsert({
        where: { id: 'ct-role-a' },
        update: {},
        create: { id: 'ct-role-a', name: 'Admin', permissions: ['*'], companyId: 'tenant-a' },
      });
      await tx.role.upsert({
        where: { id: 'ct-role-b' },
        update: {},
        create: { id: 'ct-role-b', name: 'Admin', permissions: ['*'], companyId: 'tenant-b' },
      });
    });

    await prisma.runAsSystem('cross-tenant e2e: seed users', async (tx) => {
      await tx.user.upsert({
        where: { email: 'ct_admin_a@parilink.com' },
        update: { password: hash },
        create: {
          email: 'ct_admin_a@parilink.com',
          password: hash,
          firstName: 'CT Admin',
          lastName: 'A',
          companyId: 'tenant-a',
          roleId: 'ct-role-a',
        },
      });
      await tx.user.upsert({
        where: { email: 'ct_admin_b@parilink.com' },
        update: { password: hash },
        create: {
          email: 'ct_admin_b@parilink.com',
          password: hash,
          firstName: 'CT Admin',
          lastName: 'B',
          companyId: 'tenant-b',
          roleId: 'ct-role-b',
        },
      });
    });

    // Login as Tenant A
    const loginA = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'ct_admin_a@parilink.com',
      password: 'password',
      companyId: 'tenant-a',
    });
    tenantAToken = loginA.body.access_token || loginA.body.data?.access_token;

    // Login as Tenant B
    const loginB = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'ct_admin_b@parilink.com',
      password: 'password',
      companyId: 'tenant-b',
    });
    tenantBToken = loginB.body.access_token || loginB.body.data?.access_token;
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  it('Tenant A can create a customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({
        name: 'Cross Tenant Customer A',
        email: `crosstenantA_${Date.now()}@example.com`,
      });
    expect(res.status).toBe(201);
    tenantACustomerId = res.body.id;
  });

  it('Tenant B CANNOT read Tenant A customer (BOLA/IDOR)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/customers/${tenantACustomerId}`)
      .set('Authorization', `Bearer ${tenantBToken}`);
    expect(res.status).toBe(404);
  });

  it('Tenant A can create a vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({
        make: 'Tata',
        model: 'Prima 4928',
        licensePlate: `CT-A-${Date.now().toString().slice(-6)}`,
        type: 'TRUCK',
        status: 'IN_SERVICE',
      });
    expect(res.status).toBe(201);
    tenantAVehicleId = res.body.id;
  });

  it('Tenant B CANNOT update Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/vehicles/${tenantAVehicleId}`)
      .set('Authorization', `Bearer ${tenantBToken}`)
      .send({ make: 'Ashok Leyland' });
    expect(res.status).toBe(404);
  });

  it('Tenant B CANNOT delete Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/vehicles/${tenantAVehicleId}`)
      .set('Authorization', `Bearer ${tenantBToken}`);
    expect(res.status).toBe(404);
  });
});
