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
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    // Create throwaway company
    const company = await prisma.runAsSystem('e2e-setup', async (tx: any) => tx.company.create({
      data: { name: 'Unlock Test Corp' }
    }));

    // Create throwaway role
    const role = await prisma.runAsSystem('e2e-setup', async (tx: any) => tx.role.create({
      data: { name: 'Unlock Admin Role', permissions: ['*'], companyId: company.id }
    }));

    // Create throwaway admin
    const password = await bcrypt.hash('password123', 10);
    const testUser = await prisma.runAsSystem('e2e-setup', async (tx: any) => tx.user.create({
      data: {
        email: `temp-admin-unlock-${Date.now()}@parilink.com`,
        password,
        firstName: 'Temp',
        lastName: 'Admin',
        status: 'ACTIVE',
        companyId: company?.id, // Use valid company or it might fail RLS
        roleId: role.id
    }
  }));

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: 'password123' });
    
    console.log('LOGIN RES STATUS:', loginRes.status);
    console.log('LOGIN RES BODY:', loginRes.body);
    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await prisma.runAsSystem('e2e-setup', async tx => tx.user.deleteMany({ where: { email: { contains: 'temp-admin-unlock' } } }));
    await prisma.runAsSystem('e2e-setup', async tx => tx.company.deleteMany({ where: { name: 'Unlock Test Corp' } }));
    await app.close();
  });

  it('should unlock the admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/users/74ff9369-6337-46e4-961f-7eb5be2a399b/unlock')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    
    console.log('UNLOCK CALL STATUS:', res.status);
    console.log('UNLOCK CALL BODY:', res.body);
  });
});
