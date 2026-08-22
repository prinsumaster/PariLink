import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('Driver Drill Down', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' })
      .expect(200);
      
    adminToken = loginRes.body.access_token;
  });

  it('should return 404 or 200 for deleted driver', async () => {
    const driverRes = await request(app.getHttpServer())
      .post('/drivers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Test',
        lastName: 'Driver',
        email: `test-${Date.now()}@driver.com`,
        licenseNumber: `DL-${Date.now()}`,
        status: 'AVAILABLE'
      })
      .expect(201);
      
    const driverId = driverRes.body.id;

    await request(app.getHttpServer())
      .delete(`/drivers/${driverId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const getRes = await request(app.getHttpServer())
      .get(`/drivers/${driverId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    console.log('GET STATUS:', getRes.status);
    console.log('GET BODY:', getRes.body);
  });

  afterAll(async () => {
    await app.close();
  });
});
