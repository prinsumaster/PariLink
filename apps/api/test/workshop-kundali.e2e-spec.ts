import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';

describe('Workshop Kundali RLS (e2e)', () => {
  let app: INestApplication;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    // 1. Genuinely log in as admin@parilink.com
    const loginA = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'devpassword' });
    tokenA = loginA.body?.access_token;
    if (!tokenA) {
      throw new Error('TOKEN A IS UNDEFINED. Response: ' + JSON.stringify(loginA.body));
    }

    // 2. Genuinely log in as admin_b@parilink.com
    const loginB = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin_b@parilink.com', password: 'devpassword' });
    tokenB = loginB.body?.access_token;
    if (!tokenB) {
      throw new Error('TOKEN B IS UNDEFINED. Response: ' + JSON.stringify(loginB.body));
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('proves RLS blocks Tenant B from fetching Tenant A Part (404 Not Found)', async () => {
    // Tenant A creates a Part
    const createPart = await request(app.getHttpServer())
      .post('/api/v1/workshop/parts')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'RLS Isolation Test Part', quantity: 5, unitCost: 150, reorderLevel: 2 });
    
    expect(createPart.status).toBe(201);
    const partId = createPart.body.id;
    
    // Check Tenant A can fetch it
    const fetchA = await request(app.getHttpServer())
      .get(`/api/v1/workshop/parts/${partId}`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(fetchA.status).toBe(200);

    // Check Tenant B CANNOT fetch it, should get 404 because RLS hides the row
    const fetchB = await request(app.getHttpServer())
      .get(`/api/v1/workshop/parts/${partId}`)
      .set('Authorization', `Bearer ${tokenB}`);
    
    expect(fetchB.status).toBe(404); // NOT an empty array, it's a 404!
  });
});
