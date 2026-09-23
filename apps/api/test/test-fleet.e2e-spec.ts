import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Fleet API Bug', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    const loginAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginAdmin.body?.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reproduce vehicle creation validation bug', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/vehicles')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        licensePlate: 'TEST-1234',
        make: 'Tata',
        model: 'Signa',
        type: 'TRUCK'
      });

    console.log(JSON.stringify(response.body, null, 2));
  });
});
