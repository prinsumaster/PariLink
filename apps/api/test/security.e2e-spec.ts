import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { getJwtPrivateKey } from '../src/auth/auth.module';
import * as jwt from 'jsonwebtoken';

describe('Security Audit (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let companyId: string;
  let privateKey: string;
  let userId: string;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    await prisma.runAsSystem('Security Setup', async (tx) => {
      const company = await tx.company.create({
        data: { name: 'Security Test Co', status: 'ACTIVE' },
      });
      companyId = company.id;

      const user = await tx.user.create({
        data: {
          email: `sec_test_${Date.now()}@test.com`,
          password: 'dummy',
          firstName: 'Sec',
          lastName: 'User',
          companyId: companyId,
        },
      });
      userId = user.id;
    });

    privateKey = getJwtPrivateKey();
  });

  afterAll(async () => {
    await prisma.runAsSystem('Security Teardown', async (tx) => {
      // Delete in FK dependency order: child rows first, then company
      await tx.user.deleteMany({ where: { companyId } });
      await tx.role.deleteMany({ where: { companyId } });
      await tx.company.delete({ where: { id: companyId } });
    });
    await app.close();
  });

  it('2.2 RBAC Rejection - Should return 403 when user lacks permissions', async () => {
    // Sign token WITH NO PERMISSIONS
    const noAccessRole = await prisma.runAsSystem('Create Role', async (tx) => {
      return tx.role.create({
        data: { name: 'NoAccess', companyId, permissions: [] }
      });
    });

    const token = jwt.sign(
      { sub: userId, cid: companyId, rid: noAccessRole.id, permissions: [] },
      privateKey,
      { algorithm: 'RS256', expiresIn: '15m' }
    );

    // Try to create a vehicle (requires fleet:write)
    const res = await request(app.getHttpServer())
      .post('/api/v1/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({ licensePlate: 'NO-ACCESS-123' });

    expect(res.status).toBe(403);
    
    // Cleanup role
    await prisma.runAsSystem('Delete Role', async (tx) => {
      await tx.role.delete({ where: { id: noAccessRole.id } });
    });
  });

  it('2.5 Token Expiry - Should reject an expired JWT', async () => {
    const expiredToken = jwt.sign(
      { sub: userId, cid: companyId, rid: 'some-role', permissions: ['fleet:read'] },
      privateKey,
      { algorithm: 'RS256', expiresIn: '-1h' } // Expired 1 hour ago
    );

    const res = await request(app.getHttpServer())
      .get('/api/v1/vehicles')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401); // Unauthorized
  });
});
