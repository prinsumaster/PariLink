import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../apps/api/src/app.module';

describe('Security Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Rejects requests with missing JWT token', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/loads');
    expect(res.status).toBe(401);
  });

  it('Rejects requests with tampered JWT token', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/loads')
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature`);
    expect(res.status).toBe(401);
  });

  it('Blocks malformed JSON (Injection attempt)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send(`{"email": "admin@parilink.com", "password": "pass", "companyId": {"$ne": null}}`); // MongoDB style injection

    // NestJS ValidationPipe strips or rejects this
    expect(res.status).toBeGreaterThanOrEqual(400); 
  });

  it('Blocks Mass Assignment on protected fields via ValidationPipe whitelist', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password', companyId: 'tenant-a' });
    const token = login.body.accessToken;

    const res = await request(app.getHttpServer())
      .post('/api/v1/roles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Normal User',
        permissions: ['READ_ONLY'],
        isAdmin: true, // Malicious mass assignment injection
      });

    // forbidNonWhitelisted should throw 400 Bad Request
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('property isAdmin should not exist');
  });
});
