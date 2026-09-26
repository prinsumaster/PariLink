import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ModelRouterService } from '../src/ai/platform/model-router.service';
import { LlmManagerService } from '../src/ai/platform/llm-manager.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function setupTenant(
  prisma: PrismaService,
  jwt: JwtService,
  config: ConfigService,
  name: string,
) {
  const company = await prisma.runAsSystem('e2e-setup', (tx) =>
    tx.company.create({ data: { name } }),
  );
  const role = await prisma.runAsSystem('e2e-setup', (tx) =>
    tx.role.create({
      data: {
        name: 'Admin',
        companyId: company.id,
        permissions: ['ai:interact'],
      },
    }),
  );
  const user = await prisma.runAsSystem('e2e-setup', (tx) =>
    tx.user.create({
      data: {
        email: `ai_e2e_${company.id}@example.com`,
        password: 'hashed',
        firstName: 'AI',
        lastName: 'Admin',
        companyId: company.id,
        roleId: role.id,
      },
    }),
  );
  const token = jwt.sign(
    { sub: user.id, email: user.email, companyId: company.id },
    { secret: config.get('JWT_SECRET') },
  );

  return { company, user, token };
}

describe('AI Agent Dispatch (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;
  let tenant: Awaited<ReturnType<typeof setupTenant>>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);

    tenant = await setupTenant(prisma, jwt, config, 'AI Testing Inc');

    // Create a mock Agent to route to (for the second test)
    await prisma.runAsTenant(tenant.company.id, (tx) => 
      tx.aiAgent.create({
        data: {
          companyId: tenant.company.id,
          name: 'DispatcherAgent',
          role: 'Dispatcher',
          systemPrompt: 'You are a dispatcher.',
        }
      })
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /ai/copilot/sessions/:sessionId/chat - should fail with 503 when no AI model configured', async () => {
    // Ensure no models exist
    await prisma.runAsSystem('e2e-test-setup', tx => tx.aiModelConfig.deleteMany({}));
    await app.get(ModelRouterService).refreshModels();

    // Create a session
    const sessionRes = await request(app.getHttpServer())
      .post('/api/v1/ai/copilot/sessions')
      .set('Authorization', `Bearer ${tenant.token}`)
      .send({ title: 'Test Session' })
      .expect(201);
      
    const sessionId = sessionRes.body.id;

    // Chat should fail with 503 Service Unavailable
    const response = await request(app.getHttpServer())
      .post(`/api/v1/ai/copilot/sessions/${sessionId}/chat`)
      .set('Authorization', `Bearer ${tenant.token}`)
      .send({ message: 'Hello AI' });

    expect(response.status).toBe(503);
    expect(response.body.message).toContain('AI platform is not configured');
  });

  it('POST /ai/copilot/sessions/:sessionId/chat - should succeed and log interaction when API key configured', async () => {
    // Provide a valid config to pass the 503 check
    await prisma.runAsSystem('e2e-test-setup', tx => tx.aiModelConfig.create({
      data: {
        provider: 'OPENAI',
        modelName: 'gpt-4o-mini',
        priority: 100,
        isActive: true,
        config: { apiKey: 'sk-dummy-api-key-for-testing' },
      }
    }));
    
    // We need to re-init the model router because it loads models OnModuleInit
    const modelRouter = app.get(ModelRouterService);
    await modelRouter.refreshModels();

    // Spy on generateResponse to avoid actual API call but succeed
    const llmManager = app.get(LlmManagerService);
    jest.spyOn(llmManager, 'generateResponse').mockResolvedValue('Simulated successful response');

    const sessionRes = await request(app.getHttpServer())
      .post('/api/v1/ai/copilot/sessions')
      .set('Authorization', `Bearer ${tenant.token}`)
      .send({ title: 'Test Session 2' })
      .expect(201);
      
    const sessionId = sessionRes.body.id;

    // Send a message
    const response = await request(app.getHttpServer())
      .post(`/api/v1/ai/copilot/sessions/${sessionId}/chat`)
      .set('Authorization', `Bearer ${tenant.token}`)
      .send({ message: 'How many trucks are available?' })
      .expect(201);

    expect(response.body.content).toBeDefined();

    // Verify AiInteractionLog persistence
    const logs = await prisma.runAsTenant(tenant.company.id, tx => 
      tx.aiInteractionLog.findMany({
        where: { sessionId }
      })
    );

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].prompt).toContain('How many trucks');
    expect(logs[0].companyId).toBe(tenant.company.id);
  });
});
