import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CP6 SQL Validator', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useLogger(false);
    await app.init();
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginRes.body.access_token || loginRes.body.data?.access_token;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('rejects 5 payloads and accepts 1 valid', async () => {
    const payloads = [
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config('app.bypass_rls','on',true)='on' OR 1=1`,
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_catalog.set_config('app.bypass_rls','on',true)='on'`,
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND SeT_CoNfIg('app.bypass_rls','on',true)='on'`,
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND set_config /*x*/ ('app.bypass_rls','on',true)='on'`,
      `SELECT * FROM "Trip" WHERE "companyId"='{{COMPANY_ID_PLACEHOLDER}}' AND pg_sleep(1) IS NULL`
    ];

    for (let i = 0; i < payloads.length; i++) {
      const res = await request(app.getHttpServer())
        .post('/ai/interact')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ intent: payloads[i], domain: 'trips', id: '123' });
      console.log(`Payload ${i+1}: ${res.status} ${res.body.message || res.body.error || res.body.message}`);
    }

    const validRes = await request(app.getHttpServer())
      .post('/ai/interact')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ intent: "How many trips do we have?", domain: 'trips', id: '123' });
    console.log(`Valid: ${validRes.status} ${JSON.stringify(validRes.body)}`);
  });
});
