import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import cookieParser from 'cookie-parser';

describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUser: any;
  let company: any;
  const testPassword = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    // Setup test data
    company = await prisma.company.create({
      data: { name: 'Test Corp' },
    });

    const hashedPassword = await bcrypt.hash(testPassword, 10);
    testUser = await prisma.user.create({
      data: {
        email: `testuser-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'User',
        password: hashedPassword,
        companyId: company.id,
        status: 'ACTIVE',
      },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (company) {
      await prisma.company
        .delete({ where: { id: company.id } })
        .catch(() => {});
    }
    // Clean up Redis handles safely via close hook
    if (app) {
      await app.close();
    }
  });

  describe('Password Login & Token Refresh', () => {
    let refreshTokenCookie: string;
    let accessToken: string;
    const deviceFingerprint = 'test-device-fp-123';

    it('should successfully login and set HttpOnly refresh token cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testPassword,
          deviceFingerprint,
        })
        .expect(200);

      expect(response.body.access_token).toBeDefined();
      accessToken = response.body.access_token;

      const cookies = [response.headers['set-cookie']].flat().filter(Boolean);
      expect(cookies.length).toBeGreaterThan(0);
      const refreshTokenSet = cookies.find((c: string) =>
        c.startsWith('refresh_token='),
      );
      expect(refreshTokenSet).toBeDefined();
      expect(refreshTokenSet).toContain('HttpOnly');

      refreshTokenCookie = refreshTokenSet?.split(';')[0] || '';
    });

    it('should refresh token using the cookie and rotate the token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', refreshTokenCookie)
        .send({ deviceFingerprint })
        .expect(201); // NestJS POST default is 201

      expect(response.body.access_token).toBeDefined();
      const newCookies = [response.headers['set-cookie']]
        .flat()
        .filter(Boolean);
      const newRefreshTokenSet = newCookies.find((c: string) =>
        c.startsWith('refresh_token='),
      );
      expect(newRefreshTokenSet).toBeDefined();
      expect(newRefreshTokenSet).not.toEqual(refreshTokenCookie);

      // Store the new cookie for replay attack test
      const oldCookie = refreshTokenCookie;
      refreshTokenCookie = newRefreshTokenSet?.split(';')[0] || '';

      // Replay Attack Detection
      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', oldCookie)
        .send({ deviceFingerprint })
        .expect(401);
    });

    it('should reject refresh with device fingerprint mismatch', async () => {
      // By default ENFORCEMENT is WARN if not set, but if we set it to ENFORCE, it should throw 401.
      // We will set process.env.DEVICE_BINDING_ENFORCEMENT = 'ENFORCE' for this test
      const originalEnforcement = process.env.DEVICE_BINDING_ENFORCEMENT;
      process.env.DEVICE_BINDING_ENFORCEMENT = 'ENFORCE';

      await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', refreshTokenCookie)
        .send({ deviceFingerprint: 'rogue-hacker-device' })
        .expect(401);

      process.env.DEVICE_BINDING_ENFORCEMENT = originalEnforcement;
    });

    it('should successfully logout', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', refreshTokenCookie)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201); // POST default 201
    });

    it('should successfully enforce logout-all', async () => {
      // Login again
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testPassword,
          deviceFingerprint,
        })
        .expect(200);

      const token = loginRes.body.access_token;

      await request(app.getHttpServer())
        .post('/auth/logout-all')
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      const dbTokens = await prisma.refreshToken.findMany({
        where: { userId: testUser.id },
      });
      expect(dbTokens.length).toBe(0);
    });
  });

  describe('Brute Force Lockout', () => {
    it('should soft lock after 5 failed attempts', async () => {
      const bruteUser = await prisma.user.create({
        data: {
          email: `brute-${Date.now()}@example.com`,
          firstName: 'Brute',
          lastName: 'Force',
          password: await bcrypt.hash('validpass', 10),
          companyId: company.id,
          status: 'ACTIVE',
        },
      });

      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: bruteUser.email, password: 'wrongpassword' })
          .expect(401);
      }

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: bruteUser.email, password: 'validpass' })
        .expect(403);

      expect(response.body.message).toContain('Account temporarily locked');

      await prisma.user.delete({ where: { id: bruteUser.id } });
    });
  });
});
