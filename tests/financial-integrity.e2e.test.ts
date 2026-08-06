import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../apps/api/src/app.module';

describe('Financial Integrity & Concurrency (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let draftInvoiceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'finance@parilink.com', password: 'password', companyId: 'tenant-finance' });
    token = login.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Concurrent Invoice Approval prevents double-entry ledger race conditions', async () => {
    // 1. Setup a DRAFT invoice
    const createRes = await request(app.getHttpServer())
      .post('/api/v1/billing/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        loadId: 'load-fin-1',
        amount: 5000,
      });
    draftInvoiceId = createRes.body.id;

    // 2. Blast 10 concurrent requests to approve the same invoice
    const promises = Array.from({ length: 10 }).map(() =>
      request(app.getHttpServer())
        .post(`/api/v1/billing/invoices/${draftInvoiceId}/approve`)
        .set('Authorization', `Bearer ${token}`)
    );

    const responses = await Promise.all(promises);

    // 3. Exactly ONE should succeed (200), the rest should fail (400)
    const successCount = responses.filter(r => r.status === 200).length;
    const failureCount = responses.filter(r => r.status === 400).length;

    expect(successCount).toBe(1);
    expect(failureCount).toBe(9);
  });
});
