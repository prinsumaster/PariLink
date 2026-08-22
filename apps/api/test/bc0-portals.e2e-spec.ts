import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe, INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('BC0 - Portals Security (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let tenantA_id: string;
  let tenantB_id: string;
  
  let custA1_id: string;
  let custA2_id: string;
  let custB1_id: string;
  
  let loadA1_id: string;
  let loadA2_id: string;
  let loadB1_id: string;
  
  let tokenA1: string;
  let tokenB1: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));
    prisma = app.get(PrismaService);
    await app.init();

    // 1. Create Tenants
    const tenantA = await prisma.company.create({ data: { name: 'Tenant A', status: 'ACTIVE' }});
    const tenantB = await prisma.company.create({ data: { name: 'Tenant B', status: 'ACTIVE' }});
    tenantA_id = tenantA.id;
    tenantB_id = tenantB.id;

    // 2. Create Customers
    const custA1 = await prisma.customer.create({ data: { name: 'Cust A1', email: `a1-${Date.now()}@test.com`, companyId: tenantA_id, status: 'ACTIVE', paymentTerms: 'NET_30' }});
    const custA2 = await prisma.customer.create({ data: { name: 'Cust A2', email: `a2-${Date.now()}@test.com`, companyId: tenantA_id, status: 'ACTIVE', paymentTerms: 'NET_30' }});
    const custB1 = await prisma.customer.create({ data: { name: 'Cust B1', email: `b1-${Date.now()}@test.com`, companyId: tenantB_id, status: 'ACTIVE', paymentTerms: 'NET_30' }});
    custA1_id = custA1.id;
    custA2_id = custA2.id;
    custB1_id = custB1.id;

    // 3. Create Loads
    const loadA1 = await prisma.load.create({ data: { referenceNumber: 'REF-A1', companyId: tenantA_id, customerId: custA1_id, status: 'OPEN', originAddress: 'A', originCity: 'CityA', originState: 'StateA', destinationAddress: 'B', destinationCity: 'CityB', destinationState: 'StateB', rate: 100, pickupDate: new Date(), deliveryDate: new Date() }});
    const loadA2 = await prisma.load.create({ data: { referenceNumber: 'REF-A2', companyId: tenantA_id, customerId: custA2_id, status: 'OPEN', originAddress: 'A', originCity: 'CityA', originState: 'StateA', destinationAddress: 'B', destinationCity: 'CityB', destinationState: 'StateB', rate: 100, pickupDate: new Date(), deliveryDate: new Date() }});
    const loadB1 = await prisma.load.create({ data: { referenceNumber: 'REF-B1', companyId: tenantB_id, customerId: custB1_id, status: 'OPEN', originAddress: 'A', originCity: 'CityA', originState: 'StateA', destinationAddress: 'B', destinationCity: 'CityB', destinationState: 'StateB', rate: 100, pickupDate: new Date(), deliveryDate: new Date() }});
    loadA1_id = loadA1.id;
    loadA2_id = loadA2.id;
    loadB1_id = loadB1.id;

    // 3.5 Create Role with portals:access
    const portalsRole = await prisma.role.create({
      data: {
        name: 'Portal User Role',
        companyId: tenantA_id,
        permissions: ['portals:access', 'portals:write', 'portals:read', 'claims:write']
      }
    });
    const portalsRoleB = await prisma.role.create({
      data: {
        name: 'Portal User Role B',
        companyId: tenantB_id,
        permissions: ['portals:access', 'portals:write', 'portals:read', 'claims:write']
      }
    });

    // 4. Create Users for Customers and Login
    const hashed = await bcrypt.hash('password123', 10);
    const userA1 = await prisma.user.create({ data: { email: `usera1-${Date.now()}@test.com`, password: hashed, firstName: 'A1', lastName: 'User', companyId: tenantA_id, customerId: custA1_id, status: 'ACTIVE', roleId: portalsRole.id }});
    const userB1 = await prisma.user.create({ data: { email: `userb1-${Date.now()}@test.com`, password: hashed, firstName: 'B1', lastName: 'User', companyId: tenantB_id, customerId: custB1_id, status: 'ACTIVE', roleId: portalsRoleB.id }});

    const loginA1 = await request(app.getHttpServer()).post('/auth/login').send({ email: userA1.email, password: 'password123' });
    if (loginA1.status !== 200) console.error('LOGIN A1 FAILED:', loginA1.body);
    expect(loginA1.status).toBe(200);
    tokenA1 = loginA1.body.access_token;
    
    const loginB1 = await request(app.getHttpServer()).post('/auth/login').send({ email: userB1.email, password: 'password123' });
    if (loginB1.status !== 200) console.error('LOGIN B1 FAILED:', loginB1.body);
    expect(loginB1.status).toBe(200);
    tokenB1 = loginB1.body.access_token;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.load.deleteMany({ where: { id: { in: [loadA1_id, loadA2_id, loadB1_id].filter(Boolean) } } });
    await prisma.user.deleteMany({ where: { customerId: { in: [custA1_id, custB1_id].filter(Boolean) } } });
    await prisma.customer.deleteMany({ where: { id: { in: [custA1_id, custA2_id, custB1_id].filter(Boolean) } } });
    await prisma.company.deleteMany({ where: { id: { in: [tenantA_id, tenantB_id].filter(Boolean) } } });
    await new Promise(r => setTimeout(r, 200));
    await app.close();
  });

  it('b) Verify tenant scoping on /customer-portal/tracking/:loadId', async () => {
    console.log(`\n--- Tenant Scoping Test (Customer A1) ---`);
    
    // Positive Control: Own load
    const ownRes = await request(app.getHttpServer())
      .get(`/customer-portal/tracking/${loadA1_id}`)
      .set('Authorization', `Bearer ${tokenA1}`);
    console.log(`Own load response status: ${ownRes.status}`);
    expect(ownRes.status).toBe(200);

    // Negative Control: Same tenant, other customer's load
    const sameTenantRes = await request(app.getHttpServer())
      .get(`/customer-portal/tracking/${loadA2_id}`)
      .set('Authorization', `Bearer ${tokenA1}`);
    console.log(`Same tenant, other customer load response status: ${sameTenantRes.status}`);
    expect([403, 404]).toContain(sameTenantRes.status);

    // Negative Control: Other tenant's load
    const otherTenantRes = await request(app.getHttpServer())
      .get(`/customer-portal/tracking/${loadB1_id}`)
      .set('Authorization', `Bearer ${tokenA1}`);
    console.log(`Other tenant load response status: ${otherTenantRes.status}`);
    expect([403, 404]).toContain(otherTenantRes.status);
  });

  it('c) POST {} to every write endpoint. Expect 400.', async () => {
    const endpoints = [
      { path: '/driver-portal/telemetry/location', method: 'post' },
      { path: `/driver-portal/expenses/trips/test-id`, method: 'post' },
      { path: `/driver-portal/checklists/trips/test-id`, method: 'post' },
      { path: `/driver-portal/trips/test-id/status`, method: 'patch' },
      { path: '/portals/support-tickets', method: 'post' },
      { path: '/portals/leave-requests', method: 'post' },
      { path: `/vendor-portal/marketplace/tenders/test-id/bid`, method: 'post' },
      { path: `/vendor-portal/operations/assigned/test-id/pod`, method: 'post' },
      { path: '/portals/customer/claims', method: 'post' },
      { path: `/portals/customer/claims/test-id/status`, method: 'patch' },
    ];

    console.log(`\n--- Empty POST/PATCH Validation ---`);
    for (const ep of endpoints) {
      const res = await request(app.getHttpServer())
        [ep.method](ep.path)
        .set('Authorization', `Bearer ${tokenA1}`)
        .send({});
      
      console.log(`${ep.method.toUpperCase()} ${ep.path} -> Status: ${res.status}`);
      expect(res.status).toBe(400);
    }
  });
});
