import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as crypto from 'crypto';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('Webhook HTTP E2E Security (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    app.enableShutdownHooks();
    await app.init();
    
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "WebhookDelivery" CASCADE`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Razorpay Webhook', () => {
    const validPayload = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { amount: 100 } } }
    });
    
    let validSignature: string;

    beforeAll(() => {
      const secret = configService.get<string>('RAZORPAY_WEBHOOK_SECRET') || 'secret';
      validSignature = crypto.createHmac('sha256', secret).update(validPayload).digest('hex');
    });

    it('should reject missing signature', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/razorpay')
        .send(validPayload)
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(400);
    });

    it('should reject invalid signature', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/razorpay')
        .send(validPayload)
        .set('x-razorpay-signature', 'invalid_signature_here')
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(400);
    });

    it('should reject tampered body with valid signature', async () => {
      const tamperedPayload = validPayload.replace('100', '1000');
      const res = await request(app.getHttpServer())
        .post('/webhooks/razorpay')
        .send(tamperedPayload)
        .set('x-razorpay-signature', validSignature)
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(400);
    });
  });

  describe('Stripe Webhook', () => {
    const payload = JSON.stringify({ id: 'evt_123', type: 'invoice.paid' });

    it('should reject missing signature', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/stripe')
        .send(payload)
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(400); 
    });

    it('should reject invalid signature', async () => {
      const res = await request(app.getHttpServer())
        .post('/webhooks/stripe')
        .send(payload)
        .set('stripe-signature', 't=123456,v1=invalid_sig')
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(400); 
    });
  });
});
