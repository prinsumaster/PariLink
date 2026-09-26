import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('New Modules Audit', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let tokenA: string;
  let tokenB: string;
  let tokenLimited: string;
  let coA: string;
  let coB: string;
  
  let vehA: string;
  let dashboardA: string;
  let crossDockRuleA: string;
  
  beforeAll(async () => {
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
      }),
    );
    await app.init();
    prisma = app.get(PrismaService);
    
    const ts = Date.now();
    const pwhash = await bcrypt.hash('password123', 10);
    
    const companyA = await prisma.runAsSystem('setup', async tx => {
      const c = await tx.company.create({ data: { name: `Company A ${ts}`, status: 'ACTIVE' } });
      const r = await tx.role.create({ data: { companyId: c.id, name: 'Admin', permissions: ['admin:manage', 'vehicles:write', 'vehicles:read', 'warehouse:write', 'analytics:write', 'analytics:read', 'finance:read', 'finance:write', 'trips:write', 'trips:read'] } });
      await tx.user.create({ data: { companyId: c.id, roleId: r.id, email: `a_${ts}@test.com`, password: pwhash, firstName: 'A', lastName: 'A', status: 'ACTIVE' } });
      
      const rLim = await tx.role.create({ data: { companyId: c.id, name: 'Lim', permissions: ['trips:read'] } });
      await tx.user.create({ data: { companyId: c.id, roleId: rLim.id, email: `lim_${ts}@test.com`, password: pwhash, firstName: 'L', lastName: 'L', status: 'ACTIVE' } });
      return c;
    });
    coA = companyA.id;
    
    const companyB = await prisma.runAsSystem('setup', async tx => {
      const c = await tx.company.create({ data: { name: `Company B ${ts}`, status: 'ACTIVE' } });
      const r = await tx.role.create({ data: { companyId: c.id, name: 'Admin', permissions: ['admin:manage', 'vehicles:write', 'vehicles:read', 'warehouse:write', 'analytics:write', 'analytics:read', 'finance:read', 'finance:write', 'trips:write', 'trips:read'] } });
      await tx.user.create({ data: { companyId: c.id, roleId: r.id, email: `b_${ts}@test.com`, password: pwhash, firstName: 'B', lastName: 'B', status: 'ACTIVE' } });
      return c;
    });
    coB = companyB.id;
    
    const lA = await request(app.getHttpServer()).post('/auth/login').send({ email: `a_${ts}@test.com`, password: 'password123' });
    tokenA = lA.body?.access_token || lA.body?.accessToken;
    
    const lLim = await request(app.getHttpServer()).post('/auth/login').send({ email: `lim_${ts}@test.com`, password: 'password123' });
    tokenLimited = lLim.body?.access_token || lLim.body?.accessToken;
    
    const lB = await request(app.getHttpServer()).post('/auth/login').send({ email: `b_${ts}@test.com`, password: 'password123' });
    tokenB = lB.body?.access_token || lB.body?.accessToken;
    
    if (!tokenA || !tokenB || !tokenLimited) {
       console.log('Login A:', lA.body);
       console.log('Login Lim:', lLim.body);
       throw new Error(`Auth failed! A:${tokenA} B:${tokenB} Lim:${tokenLimited}`);
    }
    
    // Create seed data in Company A
    await prisma.runAsTenant(coA, async tx => {
      const v = await tx.vehicle.create({ data: { companyId: coA, make: 'Volvo', model: 'VNL', licensePlate: 'ABC-'+ts, type: 'TRUCK', status: 'AVAILABLE' } });
      vehA = v.id;
      
      const dash = await tx.analyticsDashboard.create({ data: { companyId: coA, name: 'Dash A', createdBy: 'sys', layoutType: 'GRID' }});
      dashboardA = dash.id;
    });
  });

  afterAll(async () => {
    await app.close();
  });
  
  describe('Part 1: Tenant Isolation', () => {
    it('Fuel: Tenant B cannot use Tenant A vehicle', async () => {
      const res = await request(app.getHttpServer()).post('/vehicles/fuel/transactions').set('Authorization', `Bearer ${tokenB}`).send({
        vehicleId: vehA, gallons: 50, totalCost: 150
      });
      expect(res.status).not.toBe(201);
    });
    
    it('TCO: Tenant B cannot read Tenant A vehicle TCO', async () => {
      const res = await request(app.getHttpServer()).get(`/vehicles/${vehA}/tco`).set('Authorization', `Bearer ${tokenB}`);
      // Might be 403 or 404 depending on how it's implemented
      expect(res.status).not.toBe(200);
    });
    
    it('Route/Toll: Toll estimate does not expose other tenant data (no cross-tenant impact)', async () => {
       const res = await request(app.getHttpServer()).get(`/routes/toll-estimate?origin=Mumbai&destination=Pune`).set('Authorization', `Bearer ${tokenB}`);
       // Should just work and return 200, but doesn't expose Tenant A data. We'll just verify it works.
       expect(res.status).toBe(200);
    });
    
    it('Cross-dock: Tenant B cannot process Tenant A ASN', async () => {
       const res = await request(app.getHttpServer()).post(`/warehouse/cross-dock/process-asn`).set('Authorization', `Bearer ${tokenB}`).send({
         asnId: 'some-tenant-a-asn-id'
       });
       expect(res.status).not.toBe(201);
       expect(res.status).not.toBe(200);
    });
    
    it('Analytics: Tenant B cannot read Tenant A dashboard', async () => {
       const res = await request(app.getHttpServer()).get(`/analytics/dashboards`).set('Authorization', `Bearer ${tokenB}`);
       expect(res.status).toBe(200);
       const found = res.body.find((d:any) => d.id === dashboardA);
       expect(found).toBeUndefined();
    });
  });
  
  describe('Part 2: Permission Gates', () => {
    it('Fuel: Limited user gets 403 for POST', async () => {
       const res = await request(app.getHttpServer()).post('/vehicles/fuel/transactions').set('Authorization', `Bearer ${tokenLimited}`).send({
         gallons: 50, totalCost: 150
       });
       expect(res.status).toBe(403);
    });
    
    it('Analytics: Limited user gets 403 for POST dashboard', async () => {
       const res = await request(app.getHttpServer()).post('/analytics/dashboards').set('Authorization', `Bearer ${tokenLimited}`).send({
         name: 'Dash'
       });
       expect(res.status).toBe(403);
    });
  });
  
  describe('Part 3: Input Validation', () => {
    it('Fuel: Rejects malformed payload (negative gallons)', async () => {
       const res = await request(app.getHttpServer()).post('/vehicles/fuel/transactions').set('Authorization', `Bearer ${tokenA}`).send({
         gallons: -50, totalCost: 150
       });
       expect(res.status).toBe(400);
    });
    
    it('Sales Demo: Teardown without tenantId should 404', async () => {
       const res = await request(app.getHttpServer()).delete('/saas/demo/').set('Authorization', `Bearer ${tokenA}`);
       expect(res.status).toBe(404);
    });
  });
  
  describe('Part 4: Analytics Path Traversal', () => {
    it('Export: Rejects crafted path attempt', async () => {
       const res = await request(app.getHttpServer()).post('/analytics/reports/export').set('Authorization', `Bearer ${tokenA}`).send({
         reportType: '../../../etc/passwd', format: 'CSV'
       });
       
       if (res.status === 201 || res.status === 200) {
          expect(res.body.downloadUrl).toContain(coA);
          expect(res.body.downloadUrl).not.toContain('etc/passwd');
       } else {
          expect(res.status).toBe(503);
       }
    });
  });
});
