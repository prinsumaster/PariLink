import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Helper to setup admin tenant for calling demo endpoints
async function setupAdminTenant(prisma: PrismaService, jwt: JwtService, config: ConfigService) {
  const companyId = `sales-admin-co-${Date.now()}`;
  const userId = `sales-admin-user-${Date.now()}`;
  
  await prisma.runAsSystem('setup', async (tx) => {
    const company = await tx.company.create({
      data: {
        id: companyId,
        name: 'Sales Admin Co',
        status: 'ACTIVE'
      }
    });

    const role = await tx.role.create({
      data: {
        id: `role-${companyId}`,
        companyId,
        name: 'Admin',
        permissions: ['admin:manage']
      }
    });

    await tx.user.create({
      data: {
        id: userId,
        companyId,
        email: `admin-${companyId}@test.com`,
        password: 'test',
        firstName: 'Test',
        lastName: 'Admin',
        roleId: role.id,
        status: 'ACTIVE'
      }
    });
  });

  const payload = { sub: userId, companyId };
  const secret = config.get('JWT_SECRET');
  const token = jwt.sign(payload, { secret });

  return { companyId, userId, token };
}

describe('Sales Demo Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;
  let admin: any;
  let createdDemoTenantId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);

    admin = await setupAdminTenant(prisma, jwt, config);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /saas/demo/seed - should provision a demo tenant', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/saas/demo/seed')
      .set('Authorization', `Bearer ${admin.token}`)
      .set('X-Tenant-ID', admin.companyId)
      .send({ size: 'STARTER' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.companyId).toBeDefined();
    createdDemoTenantId = res.body.companyId;

    // Verify rows exist
    await prisma.runAsSystem('verify', async (tx) => {
      const vehicles = await tx.vehicle.count({ where: { companyId: createdDemoTenantId } });
      expect(vehicles).toBe(3); // Based on our seed script
      
      const loads = await tx.load.count({ where: { companyId: createdDemoTenantId } });
      expect(loads).toBe(2);
    });
  });

  it('DELETE /saas/demo/:tenantId - should destroy a demo tenant', async () => {
    expect(createdDemoTenantId).toBeDefined();

    const res = await request(app.getHttpServer())
      .delete(`/api/v1/saas/demo/${createdDemoTenantId}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .set('X-Tenant-ID', admin.companyId)
      .expect(200);

    expect(res.body.success).toBe(true);

    // Verify rows are gone
    await prisma.runAsSystem('verify-destroy', async (tx) => {
      const company = await tx.company.findUnique({ where: { id: createdDemoTenantId } });
      expect(company).toBeNull();

      const vehicles = await tx.vehicle.count({ where: { companyId: createdDemoTenantId } });
      expect(vehicles).toBe(0);
    });
  });
});
