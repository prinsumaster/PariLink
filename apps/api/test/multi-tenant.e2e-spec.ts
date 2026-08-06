import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Multi-Tenant Isolation (e2e)', () => {
  let app: INestApplication;
  let tenantAToken: string;
  let tenantBToken: string;
  let tenantALoadId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const prisma = app.get(PrismaService);
    // Ensure test data exists
    await prisma.company.upsert({
      where: { id: 'tenant-a' },
      update: {},
      create: { id: 'tenant-a', name: 'Tenant A' },
    });
    await prisma.company.upsert({
      where: { id: 'tenant-b' },
      update: {},
      create: { id: 'tenant-b', name: 'Tenant B' },
    });

    // Create a mock customer for tenant-a
    await prisma.customer.upsert({
      where: { id: 'c123d2ca-1122-3344-5566-778899aabbcc' },
      update: {},
      create: {
        id: 'c123d2ca-1122-3344-5566-778899aabbcc',
        name: 'Customer A',
        companyId: 'tenant-a',
      },
    });

    // We must hash the password as the auth service expects bcrypt
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password', 10);
    const roleA = await prisma.role.upsert({
      where: { id: 'role-a' },
      update: {},
      create: {
        id: 'role-a',
        name: 'Admin',
        permissions: ['*'],
        companyId: 'tenant-a',
      },
    });
    const roleB = await prisma.role.upsert({
      where: { id: 'role-b' },
      update: {},
      create: {
        id: 'role-b',
        name: 'Admin',
        permissions: ['*'],
        companyId: 'tenant-b',
      },
    });

    await prisma.user.upsert({
      where: { email: 'admin_a@parilink.com' },
      update: { password: hash },
      create: {
        email: 'admin_a@parilink.com',
        password: hash,
        firstName: 'Admin',
        lastName: 'A',
        companyId: 'tenant-a',
        roleId: roleA.id,
      },
    });
    await prisma.user.upsert({
      where: { email: 'admin_b@parilink.com' },
      update: { password: hash },
      create: {
        email: 'admin_b@parilink.com',
        password: hash,
        firstName: 'Admin',
        lastName: 'B',
        companyId: 'tenant-b',
        roleId: roleB.id,
      },
    });

    // Setup: Login as Tenant A
    const loginA = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin_a@parilink.com',
      password: 'password',
      companyId: 'tenant-a',
    });
    console.log('Login A response:', loginA.body);
    tenantAToken = loginA.body.access_token;

    // Setup: Login as Tenant B
    const loginB = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'admin_b@parilink.com',
      password: 'password',
      companyId: 'tenant-b',
    });
    console.log('Login B response:', loginB.body);
    tenantBToken = loginB.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Tenant A can create a load', async () => {
    const res = await request(app.getHttpServer())
      .post('/loads')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({
        customerId: 'c123d2ca-1122-3344-5566-778899aabbcc',
        referenceNumber: 'LD-A-001',
        originAddress: '123 Main',
        originCity: 'LA',
        originState: 'CA',
        destinationAddress: '456 Oak',
        destinationCity: 'SF',
        destinationState: 'CA',
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date().toISOString(),
        rate: 1000,
      });
    expect(res.status).toBe(201);
    tenantALoadId = res.body.id;
  });

  it('Tenant B CANNOT read Tenant A load (BOLA/IDOR)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/loads/${tenantALoadId}`)
      .set('Authorization', `Bearer ${tenantBToken}`);
    expect(res.status).toBe(404); // Not found because companyId boundary blocked it
  });

  it('Tenant B CANNOT update Tenant A load', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/loads/${tenantALoadId}`)
      .set('Authorization', `Bearer ${tenantBToken}`)
      .send({ rate: 5000 });
    expect(res.status).toBe(404);
  });

  it('Tenant B CANNOT delete Tenant A load', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/loads/${tenantALoadId}`)
      .set('Authorization', `Bearer ${tenantBToken}`);
    expect(res.status).toBe(404);
  });
});
