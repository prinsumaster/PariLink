const request = require('supertest');
const { Test } = require('@nestjs/testing');
const { AppModule } = require('../src/app.module');
const { ValidationPipe } = require('@nestjs/common');

async function run() {
  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  await app.init();
  
  const token = (await app.get(require('../src/jwt/jwt.service').JwtService).signAsync({ sub: 'sys', companyId: 'sys', role: 'SUPER_ADMIN' })); // dummy token
  
  const res = await request(app.getHttpServer()).get('/api/v1/trips/invalid-uuid').set('Authorization', `Bearer ${token}`);
  console.log(res.status, res.body);
  await app.close();
}
run();
