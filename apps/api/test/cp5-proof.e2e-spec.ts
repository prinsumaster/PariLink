import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CP5 Clean', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true, forbidUnknownValues: true, stopAtFirstError: false }));
    
    // Silence logger
    app.useLogger(false);
    
    await app.init();

    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginRes.body.access_token || loginRes.body.data?.access_token;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  const endpoints = [
    '/fuel/cards', '/fuel/stations', '/fuel/transactions',
    '/tyre/vehicles/v123/tyres', '/tyre/tyres/t123/remove',
    '/ai/chat', '/ai/workflow/execute', '/ai/workflow/generate',
    '/ai/recommend/dispatch/123', '/ai/interact', '/ai/copilot/sessions',
    '/ai/dispatch/predict', '/ai/workflow/execution/123/reject/456',
    '/ai/memory/workspace', '/ai/feedback', '/ai/report-hallucination'
  ];

  it('prints cleanly', async () => {
    console.log("--- EMPTY PAYLOADS ---");
    for (const ep of endpoints) {
      const res = await request(app.getHttpServer()).post(ep).set('Authorization', `Bearer ${adminToken}`).send({});
      console.log(`POST ${ep} -> ${res.status}`);
    }

    console.log("--- VALID PAYLOADS ---");
    const valid = {
      '/fuel/cards': { cardNumber: '1234', provider: 'HDFC', companyId: '5f302208-e523-439a-9698-178e8924a7fc' },
      '/fuel/stations': { name: 'Station A', location: 'Location A', companyId: '5f302208-e523-439a-9698-178e8924a7fc' },
      '/fuel/transactions': { amount: 100, date: new Date().toISOString(), cardId: 'c123', vehicleId: 'v123', odometer: 1000 },
      '/tyre/vehicles/v123/tyres': { position: 'FL', serialNumber: 'SN123', brand: 'MRF', model: 'M1', treadDepth: 10, pressure: 100, cost: 100 },
      '/tyre/tyres/t123/remove': { reason: 'WORN_OUT', removedAt: new Date().toISOString(), odometerAtRemoval: 1000, remainingTreadDepth: 2 },
      '/ai/chat': { message: 'Hello' },
      '/ai/workflow/execute': { workflowId: 'wf1', inputData: { test: true } },
      '/ai/workflow/generate': { prompt: 'Generate workflow' },
      '/ai/recommend/dispatch/123': { context: { a: 1 } },
      '/ai/interact': { query: 'Show me trips' },
      '/ai/copilot/sessions': { title: 'Session 1' },
      '/ai/dispatch/predict': { source: 'A', destination: 'B', loadWeight: 10, vehicleType: 'TRUCK' },
      '/ai/workflow/execution/123/reject/456': { reason: 'Wrong' },
      '/ai/memory/workspace': { type: 'NOTE', content: 'Test note' },
      '/ai/feedback': { interactionId: 'int1', rating: 5 },
      '/ai/report-hallucination': { interactionId: 'int1', description: 'Test hallucination', severity: 'LOW' }
    };

    for (const ep of endpoints) {
      const res = await request(app.getHttpServer()).post(ep).set('Authorization', `Bearer ${adminToken}`).send((valid as Record<string, any>)[ep] || {});
      console.log(`POST ${ep} (valid) -> ${res.status}`);
    }
  });
});
