import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../src/app.module';
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
        permissions: ['warehouse:read', 'warehouse:write'],
      },
    }),
  );
  const user = await prisma.runAsSystem('e2e-setup', (tx) =>
    tx.user.create({
      data: {
        email: `crossdock_e2e_${company.id}@example.com`,
        password: 'hashed',
        firstName: 'Cross',
        lastName: 'Dock',
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

describe('Cross-Docking Engine (e2e)', () => {
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

    tenant = await setupTenant(prisma, jwt, config, 'CrossDock Inc');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /warehouse/cross-dock/process-asn - should process URGENT ASN and persist CrossDockAssignment', async () => {
    const warehouse = await prisma.runAsTenant(tenant.company.id, (tx) =>
      tx.warehouse.create({
        data: {
          companyId: tenant.company.id,
          name: 'Main WH',
          code: 'WH-1',
          address: '123 Main St',
          city: 'City',
          state: 'State',
        }
      })
    );
    const dock = await prisma.runAsTenant(tenant.company.id, (tx) =>
      tx.yardDock.create({
        data: {
          warehouseId: warehouse.id,
          name: 'Dock 1',
          type: 'INBOUND',
          status: 'AVAILABLE',
        }
      })
    );

    const uniqueSuffix = Date.now().toString();
    const payload = {
      asnId: 'ASN-' + uniqueSuffix,
      priority: 'URGENT',
      targetOutboundOrder: 'ORD-' + uniqueSuffix,
      dockId: dock.id,
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/warehouse/cross-dock/process-asn')
      .set('Authorization', `Bearer ${tenant.token}`)
      .send(payload)
      .expect(201);

    expect(response.body.isCrossDock).toBe(true);
    expect(response.body.crossDockAssignmentId).toBeDefined();

    // Verify Prisma persistence
    const assignment = await prisma.runAsTenant(tenant.company.id, (tx) => 
      tx.crossDockAssignment.findUnique({
        where: { id: response.body.crossDockAssignmentId }
      })
    );
    
    expect(assignment).toBeDefined();
    expect(assignment?.companyId).toBe(tenant.company.id);
    expect(assignment?.asnId).toBe(payload.asnId);
    expect(assignment?.outboundOrderId).toBe(payload.targetOutboundOrder);
    expect(assignment?.matchScore).toBe(0.98);
    expect(assignment?.status).toBe('PENDING');
  });

  it('POST /warehouse/cross-dock/generate-pick-wave - should generate and persist PickWave', async () => {
    const payload = {
      orderIds: ['ORD-1', 'ORD-2'],
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/warehouse/cross-dock/generate-pick-wave')
      .set('Authorization', `Bearer ${tenant.token}`)
      .send(payload)
      .expect(201);

    expect(response.body.waveId).toBeDefined();
    expect(response.body.waveNumber).toBeDefined();

    // Verify Prisma persistence
    const wave = await prisma.runAsTenant(tenant.company.id, (tx) => 
      tx.pickWave.findUnique({
        where: { id: response.body.waveId }
      })
    );
    
    expect(wave).toBeDefined();
    expect(wave?.companyId).toBe(tenant.company.id);
    expect(wave?.orderIds).toEqual(['ORD-1', 'ORD-2']);
    expect(wave?.status).toBe('PLANNED');
  });
});
