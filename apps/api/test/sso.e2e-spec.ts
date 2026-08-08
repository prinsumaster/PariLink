import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('SSO Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let company: any;
  let oidcIdp: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.enableShutdownHooks();
    await app.init();

    prisma = app.get(PrismaService);

    company = await prisma.company.create({
      data: { name: 'SSO Test Corp' },
    });

    oidcIdp = await prisma.identityProvider.create({
      data: {
        companyId: company.id,
        name: 'Test OIDC',
        type: 'OIDC',
        status: 'ACTIVE',
        issuer: 'http://localhost:8080/realms/test',
        clientId: 'test-client',
        clientSecret: 'secret',
        authorizationEndpoint: 'http://localhost:8080/auth',
        jitEnabled: true,
        domainValidation: 'test.com',
      },
    });
  });

  afterAll(async () => {
    if (company) {
      await prisma.company
        .delete({ where: { id: company.id } })
        .catch(() => {});
    }
    if (app) {
      await app.close();
    }
  });

  it('should redirect to IdP for OIDC login', async () => {
    const response = await request(app.getHttpServer()).get(
      `/auth/sso/login/${oidcIdp.id}`,
    );

    console.log(response.body);
    expect(response.status).toBe(302);

    expect(response.header.location).toContain('http://localhost:8080/auth');
    expect(response.header.location).toContain('client_id=test-client');
  });
});
