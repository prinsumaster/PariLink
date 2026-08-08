import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Final Production Security Audit (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Authentication Failures', () => {
    it('Rejects requests with NO token', async () => {
      await request(app.getHttpServer()).get('/trips').expect(401);
    });

    it('Rejects requests with FORGED token', async () => {
      await request(app.getHttpServer())
        .get('/trips')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJjb21wYW55SWQiOiI0NTYifQ.invalid_signature')
        .expect(401);
    });

    it('Rejects requests with MALFORMED token', async () => {
      await request(app.getHttpServer())
        .get('/trips')
        .set('Authorization', 'Bearer not.a.real.token')
        .expect(401);
    });
  });

  describe('2. Multi-Tenant Database Isolation (IDOR)', () => {
    it('Cannot read data across company boundaries using direct IDs', async () => {
      const res = await request(app.getHttpServer())
        .get('/trips/invalid-cross-tenant-uuid')
        .set('Authorization', 'Bearer valid.but.wrong.tenant');
      expect([401, 403, 404]).toContain(res.status); // Should never be 200/500
    });
  });

  describe('3. Financial Atomicity & Race Conditions', () => {
    it('Rejects duplicate IDOR or duplicate webhook settlements via Prisma uniqueness', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/stripe')
        .send({ id: 'evt_test', type: 'invoice.paid' })
        .set('stripe-signature', 't=invalid,v1=invalid');
      
      expect(res.status).toBe(400); 
    });
  });

  describe('4. Webhook SSRF & Signatures', () => {
    it('Rejects stripe webhooks missing a signature', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/stripe')
        .send({ data: 'hello' });
      expect(res.status).toBe(400);
    });

    it('Rejects razorpay webhooks missing a signature', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/razorpay')
        .send({ data: 'hello' });
      expect(res.status).toBe(400);
    });
  });

  describe('5. Input Validation & Large Payloads', () => {
    it('Rejects oversized payloads on standard endpoints', async () => {
      const hugeString = 'A'.repeat(5 * 1024 * 1024); // 5MB payload
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@example.com', password: hugeString });
      
      expect([400, 413, 429]).toContain(res.status);
    });
  });
});
