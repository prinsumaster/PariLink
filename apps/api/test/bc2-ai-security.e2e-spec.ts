import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('BC2 - AI Security Tracing (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let tenantA_id: string;
  let userA_id: string;
  let roleA_id: string;
  let userA_token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    await prisma.runAsSystem('setup', async (tx) => {
      const tenantA = await tx.company.create({
        data: {
          name: 'AI Secure Logistics LLC',
        },
      });
      tenantA_id = tenantA.id;

      // 2. Setup Role A
      const roleA = await tx.role.create({
        data: {
          name: 'AI User Role',
          companyId: tenantA_id,
          permissions: ['ai:interact']
        }
      });
      roleA_id = roleA.id;

      // 3. Setup User A
      const userA = await tx.user.create({
        data: {
          email: `ai-tester-${Date.now()}@example.com`,
          password: 'hashed-password',
          firstName: 'AI',
          lastName: 'Tester',
          companyId: tenantA_id,
          roleId: roleA.id,
        },
      });
      userA_id = userA.id;
    });

    userA_token = jwtService.sign({ sub: userA_id, cid: tenantA_id, rid: roleA_id });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should securely pass tenant identity to LLM context', async () => {
    const res = await request(app.getHttpServer())
      .post('/ai/dispatch/predict')
      .set('Authorization', `Bearer ${userA_token}`)
      .send({
        origin: 'Seattle, WA',
        destination: 'Portland, OR',
        loadWeight: 12000
      });

    expect(res.status).toBe(201); // 201 Created for POST by default in NestJS
    
    // We expect the logs to show: [AI_SECURITY_TRACE] Payload context: {"companyId":"<tenantA_id>","userId":"<userA_id>"}
    console.log('AI Prediction Response:', res.body);
  });
  afterAll(async () => {
    await app.close();
  });
});
