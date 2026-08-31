import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { IntegrationAuthService } from '../src/integration/auth/auth.service';

/**
 * Integrations/EDI Security Regression Suite
 *
 * Covers the five critical/high findings from the AI0-AI3 audit:
 *   1. Credential leak via GET /integration/hub/installed
 *   2. Cross-tenant connection mutation (enable/disable)
 *   3. Unsigned webhook writes on /webhooks/v1/incoming
 *   4. Unbounded event replay on POST /integration/events/replay
 *   5. Export crash on empty payload POST /integration/export/execute
 */
describe('Integrations Security Regression (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: IntegrationAuthService;
  let tokenA: string;
  let tokenB: string;
  const uuid = crypto.randomUUID().substring(0, 8);
  const COMPANY_A_ID = `e2e-cmp-a-${uuid}`;
  const COMPANY_B_ID = `e2e-cmp-b-${uuid}`;
  const CONN_A_ID = `e2e-conn-a-${uuid}`;
  const CONN_B_ID = `e2e-conn-b-${uuid}`;
  const USER_A_ID = `e2e-usr-a-${uuid}`;
  const USER_B_ID = `e2e-usr-b-${uuid}`;
  const CONNECTOR_ID = `e2e-connctr-${uuid}`;
  const EMAIL_A = `integtest-a-${uuid}@test.com`;
  const EMAIL_B = `integtest-b-${uuid}@test.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<IntegrationAuthService>(IntegrationAuthService);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        stopAtFirstError: false,
      }),
    );
    await app.init();

    // Seed test data
    const passwordHash = await bcrypt.hash('password123', 10);

    // Clean up first
    await prisma.runAsSystem('e2e test cleanup', async (tx) => {
      await tx.webhookDelivery.deleteMany({ where: { companyId: { in: [COMPANY_A_ID, COMPANY_B_ID] } } });
      await tx.integrationConnection.deleteMany({ where: { id: { in: [CONN_A_ID, CONN_B_ID] } } });
      await tx.integrationConnector.deleteMany({ where: { id: CONNECTOR_ID } });
      await tx.user.deleteMany({ where: { id: { in: [USER_A_ID, USER_B_ID] } } });
      await tx.role.deleteMany({ where: { companyId: { in: [COMPANY_A_ID, COMPANY_B_ID] } } });
      await tx.company.deleteMany({ where: { id: { in: [COMPANY_A_ID, COMPANY_B_ID] } } });
    });

    // Companies
    await prisma.runAsSystem('e2e test seed', async (tx) => {
      await tx.company.createMany({
        data: [
          { id: COMPANY_A_ID, name: 'IntegTestA', status: 'ACTIVE' },
          { id: COMPANY_B_ID, name: 'IntegTestB', status: 'ACTIVE' },
        ],
        skipDuplicates: true,
      });
    });

    // Roles — create per-company ADMIN roles with wildcard permissions.
    // Under non-superuser RLS the IAM engine does runAsTenant(companyId) when
    // loading permissions, so the role MUST belong to the same company as the
    // user. Reusing a role from a different company would return null and cause
    // 403 for every protected endpoint.
    const ROLE_A_ID = `e2e-role-a-${uuid}`;
    const ROLE_B_ID = `e2e-role-b-${uuid}`;
    await prisma.runAsSystem('e2e test seed: roles', async (tx) => {
      await tx.role.createMany({
        data: [
          {
            id: ROLE_A_ID,
            name: 'E2E Admin A',
            companyId: COMPANY_A_ID,
            permissions: ['*'],
          },
          {
            id: ROLE_B_ID,
            name: 'E2E Admin B',
            companyId: COMPANY_B_ID,
            permissions: ['*'],
          },
        ],
        skipDuplicates: true,
      });
    });

    // Users — assign each user the role for their own company
    await prisma.runAsSystem('e2e test seed', async (tx) => {
      await tx.user.createMany({
        data: [
          {
            id: USER_A_ID,
            email: EMAIL_A,
            password: passwordHash,
            firstName: 'IntegA',
            lastName: 'User',
            companyId: COMPANY_A_ID,
            roleId: ROLE_A_ID,
            status: 'ACTIVE',
          },
          {
            id: USER_B_ID,
            email: EMAIL_B,
            password: passwordHash,
            firstName: 'IntegB',
            lastName: 'User',
            companyId: COMPANY_B_ID,
            roleId: ROLE_B_ID,
            status: 'ACTIVE',
          },
        ],
        skipDuplicates: true,
      });
    });

    // Connector
    await prisma.runAsSystem('e2e test seed', async (tx) => {
      await tx.integrationConnector.upsert({
        where: { id: CONNECTOR_ID },
        create: {
          id: CONNECTOR_ID,
          provider: 'E2E_TEST_CONNECTOR',
          version: '1.0.0',
          authType: 'OAUTH2',
          status: 'ACTIVE',
        },
        update: {},
      });
    });

    // Connections with fake secrets
    await prisma.runAsSystem('e2e test seed', async (tx) => {
      await tx.integrationConnection.createMany({
        data: [
          {
            id: CONN_A_ID,
            companyId: COMPANY_A_ID,
            connectorId: CONNECTOR_ID,
            credentials: '{"iv":"ecdea2a5e7936ce04d72faf87b1c3380","content":"01fb4ad13911e18e2d920f4c35b0a2be71cac959a32fa2423aa2ed0371a29069e3e06b78a4c05c041273abc1068b70bbc7ae8e0ee43ebfd18515d5b1f2ab2850399ceff44917f5aebeb8ef3bb44432791b556b1d12daee398df8dafd22ebc75e69b1ed2417a9b3b780ffcb6b97945e5d0f6a3c5219e3066274bfa676af","tag":"a2c0f03abc86d3eac76d50a412bc4032"}',
            settings: {},
            status: 'ENABLED',
          },
          {
            id: CONN_B_ID,
            companyId: COMPANY_B_ID,
            connectorId: CONNECTOR_ID,
            credentials: '{"iv":"098efaa791d6795393f8b1f81fb8069c","content":"8e8e45dd56d8d7cf9deb66368a17156fcdf190f9a19e938c9e05602c7ebfcec0f19df8d5a23c3e6a2f04438c4e338e5394e10311f61d37f523a608774655b9f25ab15191e90ac0b1e7bc5a5ad559e897be82d6da9c60c68bb0d08a294dee54e8a73afa9dd1ae442a0a3a716959f923fe0cb343371e49ce65677bf2854af53f91bed6cafc","tag":"6bc877cdab4ccc1bc5e58f7e25a3ef07"}',
            settings: {},
            status: 'ENABLED',
          },
        ],
        skipDuplicates: true,
      });
    });

    // Login both tenants
    const loginA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: EMAIL_A, password: 'password123' });
    tokenA = loginA.body.access_token || loginA.body.data?.access_token;

    const loginB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: EMAIL_B, password: 'password123' });
    tokenB = loginB.body.access_token || loginB.body.data?.access_token;
  }, 60000);

  afterAll(async () => {
    // Scoped cleanup
    await prisma.runAsSystem('e2e test cleanup', async (tx) => {
      // Delete webhook deliveries that may have been created
      await tx.webhookDelivery.deleteMany({
        where: { companyId: { in: [COMPANY_A_ID, COMPANY_B_ID] } },
      });
      // Delete connections
      await tx.integrationConnection.deleteMany({
        where: { id: { in: [CONN_A_ID, CONN_B_ID] } },
      });
      // Delete connector
      await tx.integrationConnector.deleteMany({
        where: { id: CONNECTOR_ID },
      });
      // Delete users
      await tx.user.deleteMany({
        where: { id: { in: [USER_A_ID, USER_B_ID] } },
      });
      // Delete roles
      await tx.role.deleteMany({
        where: { companyId: { in: [COMPANY_A_ID, COMPANY_B_ID] } },
      });
      // Delete companies
      await tx.company.deleteMany({
        where: { id: { in: [COMPANY_A_ID, COMPANY_B_ID] } },
      });
    });


    if (app) {
      await app.close();
    }
    if (prisma) {
      await prisma.$disconnect();
    }
  }, 30000);

  // ─── AI2(a): Credential Leak ──────────────────────────────
  describe('Credential leak prevention', () => {
    it('GET /integration/hub/installed should NOT return plaintext credentials', async () => {
      const res = await request(app.getHttpServer())
        .get('/integration/hub/installed')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      const body = JSON.stringify(res.body);
      console.log('\n--- AJ0 INSTALLED FULL BODY ---');
      console.log(body);
      console.log('SUPER_SECRET count:', (body.match(/SUPER_SECRET/g) || []).length);
      console.log('-------------------------------\n');

      // These secret values must never appear in the API response
      expect(body).not.toContain('SECRET_A_DO_NOT_LEAK');
      expect(body).not.toContain('token-a-secret');
      // The field itself should either be absent or masked
      if (res.body.length > 0) {
        for (const conn of res.body) {
          if (conn.credentials) {
            // If credentials are present, they should be masked (e.g., "••••")
            const creds = JSON.stringify(conn.credentials);
            expect(creds).not.toContain('SECRET_A_DO_NOT_LEAK');
            expect(creds).not.toContain('token-a-secret');
          }
        }
      }
    });
  });

  // ─── AI2(c): Cross-tenant connection mutation ─────────────
  describe('Cross-tenant connection isolation', () => {
    it('Tenant A cannot enable Tenant B connection (must be 403 or 404)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/integration/hub/connections/${CONN_B_ID}/enable`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send();
      console.log('\n--- AJ1 A enables B connection ---');
      console.log('Status:', res.status);
      console.log('----------------------------------\n');
      expect([403, 404]).toContain(res.status);
    });

    it('Tenant B cannot disable Tenant A connection (must be 403 or 404)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/integration/hub/connections/${CONN_A_ID}/disable`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send();

      expect([403, 404]).toContain(res.status);
    });

    it('Tenant A CAN enable own connection (positive control)', async () => {
      const res = await request(app.getHttpServer())
        .post(`/integration/hub/connections/${CONN_A_ID}/enable`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send();

      console.log('\n--- AJ1 A enables OWN connection ---');
      console.log('Status:', res.status);
      console.log('------------------------------------\n');
      expect(res.status).toBeLessThan(300);
    });
  });

  // ─── AI1(c): Unsigned webhook writes ──────────────────────
  describe('Webhook signature enforcement', () => {
    it('POST /webhooks/v1/incoming with no signature must NOT return 2xx', async () => {
      const res = await request(app.getHttpServer())
        .post(`/webhooks/v1/incoming/quickbooks/${CONN_A_ID}`)
        .send({ payload: { data: 'test' } })
        .set('Content-Type', 'application/json');

      console.log('\n--- AJ2 no signature ---');
      console.log('Status:', res.status);
      console.log('------------------------\n');
      expect(res.status).toBe(401);
    });

    it('POST /webhooks/v1/incoming with wrong signature must NOT return 2xx', async () => {
      const payload = { payload: { event_type: 'test.event', data: {} } };
      const res = await request(app.getHttpServer())
        .post(`/webhooks/v1/incoming/quickbooks/${CONN_A_ID}`)
        .send(payload)
        .set('x-webhook-signature', 'wrong-signature')
        .set('Content-Type', 'application/json');

      console.log('\n--- AJ2 wrong signature ---');
      console.log('Status:', res.status);
      console.log('---------------------------\n');
      expect(res.status).toBe(401);
    });

    it('POST /webhooks/v1/incoming with valid signature MUST return 201', async () => {
      const payload = { payload: { event_type: 'test.event', data: {} } };
      const signatureA = crypto.createHmac('sha256', 'hmac-secret-123').update(JSON.stringify(payload)).digest('hex');
      const res = await request(app.getHttpServer())
        .post(`/webhooks/v1/incoming/E2E_TEST_CONNECTOR/${CONN_A_ID}`)
        .set('x-webhook-signature', signatureA)
        .send(payload);

      expect(res.status).toBe(201);
    });

    it('POST /webhooks/v1/incoming with signature A for connection B MUST return 401', async () => {
      const payload = { payload: { event_type: 'test.event', data: {} } };
      const signatureA = crypto.createHmac('sha256', 'hmac-secret-123').update(JSON.stringify(payload)).digest('hex');
      const res = await request(app.getHttpServer())
        .post(`/webhooks/v1/incoming/quickbooks/${CONN_B_ID}`)
        .send(payload)
        .set('x-webhook-signature', signatureA)
        .set('Content-Type', 'application/json');

      console.log('\n--- AJ2 valid-sig-for-A against B ---');
      console.log('Status:', res.status);
      console.log('-------------------------------------\n');
      expect(res.status).toBe(401);
    });
  });

  // ─── AI1(b): Event replay with empty payload ──────────────
  describe('Event replay input validation', () => {
    it('POST /integration/events/replay with {} must return 400, not replay all events', async () => {
      const res = await request(app.getHttpServer())
        .post('/integration/events/replay')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({});

      console.log('\n--- AJ3 replay {} ---');
      console.log('Status:', res.status);
      console.log('---------------------\n');
      expect(res.status).toBe(400);
    });
  });

  // ─── AI1(b): Export crash on empty payload ────────────────
  describe('Export execute input validation', () => {
    it('POST /integration/export/execute with {} must return 400, not 500', async () => {
      const res = await request(app.getHttpServer())
        .post('/integration/export/execute')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({});

      console.log('\n--- AJ3 export {} ---');
      console.log('Status:', res.status);
      console.log('---------------------\n');
      expect(res.status).toBe(400);
    });
  });
});
