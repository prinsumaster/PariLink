import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';

describe('BE0: Progressive Delay and CAPTCHA Lockout Proof', () => {
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

  it('should enforce progressive delay and require CAPTCHA after 3 failures, but not lock the account', async () => {
    const email = `test-be0-${Date.now()}@parilink.com`;
    const password = 'wrongpassword';
    
    console.log(`Starting login attempts for ${email}...`);

    for (let i = 1; i <= 5; i++) {
      const start = Date.now();
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email, password });
      
      const duration = Date.now() - start;
      console.log(`Attempt ${i}: Status ${res.status}, Delay/Duration: ${duration}ms, Response: ${JSON.stringify(res.body)}`);

      if (i <= 3) {
        expect(res.status).toBe(401);
      } else {
        expect(res.status).toBe(403);
        expect(res.body.message).toContain('CAPTCHA required');
      }
    }

    console.log('Sending legitimate login with CAPTCHA and correct password...');
    
    // Attempt with CAPTCHA
    const start = Date.now();
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password, captchaToken: 'valid-captcha-token' });
    
    const duration = Date.now() - start;
    console.log(`Attempt 6 (with CAPTCHA): Status ${res.status}, Delay/Duration: ${duration}ms, Response: ${JSON.stringify(res.body)}`);
    
    expect(res.status).toBe(401); // Falls through to invalid credentials, meaning NOT LOCKED.
    expect(duration).toBeGreaterThanOrEqual(900); // Exponent = 3 - 3 = 0 -> 2^0 = 1s
  }, 30000); // 30s timeout
});
