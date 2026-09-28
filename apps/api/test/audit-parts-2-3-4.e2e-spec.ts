import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Audit Parts 2, 3, 4 (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tokenAdmin: string;
  let tokenUnderPermissioned: string;
  let tenantId: string;
  let vehicleId: string;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    const jwt = app.get<JwtService>(JwtService);
    const ts = Date.now();
    const pwhash = require('bcrypt').hashSync('password123', 10);

    const comp = await prisma.runAsSystem('setup', async (tx) => {
      const c = await tx.company.create({ data: { name: `Audit Fleet ${ts}`, status: 'ACTIVE' } });
      const rAdmin = await tx.role.create({ data: { companyId: c.id, name: 'Admin', permissions: ['trips:create', 'trips:update', 'billing:write', 'fleet:write', 'workshop:mechanic', 'documents:create', 'lr:share', 'documents:read'] } });
      const rUnder = await tx.role.create({ data: { companyId: c.id, name: 'Viewer', permissions: ['trips:read'] } });
      
      await tx.user.create({ data: { companyId: c.id, roleId: rAdmin.id, email: `admin_${ts}@test.com`, password: pwhash, firstName: 'A', lastName: 'A', status: 'ACTIVE' } });
      await tx.user.create({ data: { companyId: c.id, roleId: rUnder.id, email: `viewer_${ts}@test.com`, password: pwhash, firstName: 'V', lastName: 'V', status: 'ACTIVE' } });

      const veh = await tx.vehicle.create({ data: { companyId: c.id, make: 'Volvo', model: 'VNL', year: 2024, licensePlate: 'V-123', type: 'TRUCK', status: 'IN_SERVICE' } });
      return { c, veh };
    });

    tenantId = comp.c.id;
    vehicleId = comp.veh.id;

    const userAdmin = await prisma.runAsSystem('token', tx => tx.user.findFirst({ where: { email: `admin_${ts}@test.com` }, include: { role: true } }));
    tokenAdmin = jwt.sign({ sub: userAdmin.id, email: userAdmin.email, companyId: tenantId, roleId: userAdmin.roleId, permissions: userAdmin.role.permissions });

    const userUnder = await prisma.runAsSystem('token', tx => tx.user.findFirst({ where: { email: `viewer_${ts}@test.com` }, include: { role: true } }));
    tokenUnderPermissioned = jwt.sign({ sub: userUnder.id, email: userUnder.email, companyId: tenantId, roleId: userUnder.roleId, permissions: userUnder.role.permissions });
  });

  afterAll(async () => {
    await prisma.runAsSystem('teardown', async (tx) => {
      await tx.vehicle.deleteMany({ where: { companyId: tenantId } });
      await tx.user.deleteMany({ where: { companyId: tenantId } });
      await tx.role.deleteMany({ where: { companyId: tenantId } });
      await tx.company.deleteMany({ where: { id: tenantId } });
    });
    await app.close();
  });

  describe('Part 2: Permission Gates', () => {
    it('Should reject mutating call to Fuel (create) for under-permissioned role', async () => {
      const res = await request(app.getHttpServer())
        .post('/fuel/entries')
        .set('Authorization', `Bearer ${tokenUnderPermissioned}`)
        .send({ vehicleId, date: new Date(), quantity: 100, cost: 500, type: 'DIESEL' });
      expect(res.status).toBe(403);
    });

    it('Should reject mutating call to Cross-Docking (create wave) for under-permissioned role', async () => {
      const res = await request(app.getHttpServer())
        .post('/inbound-outbound/outbound-waves')
        .set('Authorization', `Bearer ${tokenUnderPermissioned}`)
        .send({ waveNumber: 'W-1' });
      expect(res.status).toBe(403);
    });
  });

  describe('Part 3: Input Validation', () => {
    it('Should reject malformed payload to Fuel (missing required fields)', async () => {
      const res = await request(app.getHttpServer())
        .post('/fuel/entries')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ date: new Date() }); // Missing vehicleId, quantity, cost
      expect(res.status).toBe(400);
      expect(res.body.message).toBeInstanceOf(Array);
    });

    it('Should reject malformed payload to TCO (invalid date format)', async () => {
      const res = await request(app.getHttpServer())
        .post('/tco/assets/123/depreciation')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ periodStart: 'not-a-date', periodEnd: 'not-a-date' });
      expect(res.status).toBe(400);
    });
  });

  describe('Part 4: Analytics Path Traversal', () => {
    it('Should reject path traversal payload on export', async () => {
      const res = await request(app.getHttpServer())
        .get('/analytics/export')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .query({ format: '../../../etc/passwd' }); // Attempt traversal
      expect(res.status).toBe(400); // Or 404/500, but should reject and not return file contents
      expect(res.text).not.toContain('root:x:0:0');
    });
  });
});
