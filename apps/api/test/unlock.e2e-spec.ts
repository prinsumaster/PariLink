import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

describe('Unlock Admin', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookies: string[];
  let csrfToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    // Get company
    const company = await prisma.company.findFirst();

    // Create throwaway admin
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const testUser = await prisma.user.create({
      data: {
        email: 'temp-admin-unlock@parilink.com',
        passwordHash,
        firstName: 'Temp',
        lastName: 'Admin',
        role: 'COMPANY_ADMIN',
        companyId: company.id,
      },
    });

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'temp-admin-unlock@parilink.com', password: 'Password123!' });
    
    cookies = loginRes.get('Set-Cookie');
    
    const csrfRes = await request(app.getHttpServer())
      .get('/auth/csrf')
      .set('Cookie', cookies);
    csrfToken = csrfRes.body.csrfToken;
  });

  it('should unlock the admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/users/74ff9369-6337-46e4-961f-7eb5be2a399b/unlock')
      .set('Cookie', cookies)
      .set('x-csrf-token', csrfToken)
      .send();
    
    console.log('UNLOCK CALL STATUS:', res.status);
    console.log('UNLOCK CALL BODY:', res.body);
  });
});
