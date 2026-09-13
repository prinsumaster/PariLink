import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
const request = require('supertest');

describe('Multi-Tenant Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tenantAToken: string;
  let tenantBToken: string;
  let tenantALoadId: string;
  let tenantACompanyId: string;
  let tenantACustomerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableShutdownHooks();
    await app.init();

    prisma = app.get(PrismaService);
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password', 10);

    // Create companies — let Postgres generate real UUIDs then capture them
    const coA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.company.create({ data: { name: `E2E-TenantA-${Date.now()}` } })
    );
    const coB = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.company.create({ data: { name: `E2E-TenantB-${Date.now()}` } })
    );
    tenantACompanyId = coA.id;

    // Customer for tenant-a (using real UUID)
    const cust = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.customer.create({ data: { name: 'Customer A', companyId: coA.id } })
    );
    tenantACustomerId = cust.id;

    // Roles & users for both tenants
    const roleA = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.role.create({ data: { name: 'Admin', permissions: ['*'], companyId: coA.id } })
    );
    const roleB = await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.role.create({ data: { name: 'Admin', permissions: ['*'], companyId: coB.id } })
    );

    const suffix = Date.now();
    await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.user.create({
        data: {
          email: `mt_admin_a_${suffix}@example.com`, password: hash,
          firstName: 'Admin', lastName: 'A',
          companyId: coA.id, roleId: roleA.id,
        },
      })
    );
    await prisma.runAsSystem('e2e-setup', (tx) =>
      tx.user.create({
        data: {
          email: `mt_admin_b_${suffix}@example.com`, password: hash,
          firstName: 'Admin', lastName: 'B',
          companyId: coB.id, roleId: roleB.id,
        },
      })
    );

    // Login as Tenant A
    const loginA = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: `mt_admin_a_${suffix}@example.com`, password: 'password' });
    tenantAToken = loginA.body.access_token;

    // Login as Tenant B
    const loginB = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: `mt_admin_b_${suffix}@example.com`, password: 'password' });
    tenantBToken = loginB.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Tenant A can create a load', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/loads')
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({
        customerId: tenantACustomerId,
        referenceNumber: `LD-MT-A-${Date.now()}`,
        originAddress: '123 Main St',
        originCity: 'Mumbai',
        originState: 'Maharashtra',
        destinationAddress: '456 Park Ave',
        destinationCity: 'Delhi',
        destinationState: 'Delhi',
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 86400000).toISOString(),
        rate: 1000,
      });
    expect(res.status).toBe(201);
    tenantALoadId = res.body.id;
  });

  it('Tenant B CANNOT read Tenant A load (BOLA/IDOR)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/loads/${tenantALoadId}`)
      .set('Authorization', `Bearer ${tenantBToken}`);
    expect(res.status).toBe(404);
  });

  it('Tenant B CANNOT update Tenant A load', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/loads/${tenantALoadId}`)
      .set('Authorization', `Bearer ${tenantBToken}`)
      .send({ rate: 5000 });
    expect(res.status).toBe(404);
  });

  it('Tenant B CANNOT delete Tenant A load', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/loads/${tenantALoadId}`)
      .set('Authorization', `Bearer ${tenantBToken}`);
    expect(res.status).toBe(404);
  });
});
