import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('Warehouse (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let config: ConfigService;

  let tenantA: any;
  let tenantB: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();

    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);
    config = app.get(ConfigService);

    tenantA = await setupTenant(prisma, jwt, config, 'Warehouse Tenant A');
    tenantB = await setupTenant(prisma, jwt, config, 'Warehouse Tenant B');
  });

  afterAll(async () => {
    await prisma.runAsSystem('e2e-teardown', async (tx) => {
      await tx.company.deleteMany({
        where: { id: { in: [tenantA.companyId, tenantB.companyId] } }
      });
    });
    await app.close();
  });

  let warehouseA: string;
  let zoneA: string;
  let binA: string;

  it('1. Create Warehouse Topology (Tenant A)', async () => {
    // 1. Create Warehouse
    const whRes = await request(app.getHttpServer())
      .post('/api/v1/warehouse')
      .set('Authorization', `Bearer ${tenantA.token}`)
      .send({ 
        name: 'Central Hub', 
        code: 'CH-01',
        address: '123 Main St',
        city: 'New York',
        state: 'NY'
      });
    
    if (whRes.status !== 201) {
      console.log('WAREHOUSE CREATE ERROR:', whRes.body);
    }
    
    expect(whRes.status).toBe(201);
    
    warehouseA = whRes.body.id;
    expect(warehouseA).toBeDefined();

    // 2. Create Zone
    const zoneRes = await request(app.getHttpServer())
      .post(`/api/v1/warehouse/${warehouseA}/zones`)
      .set('Authorization', `Bearer ${tenantA.token}`)
      .send({ name: 'Receiving', code: 'RCV', type: 'STAGING' })
      .expect(201);
    
    zoneA = zoneRes.body.id;
    expect(zoneA).toBeDefined();

    // 3. Create Bin
    const binRes = await request(app.getHttpServer())
      .post(`/api/v1/warehouse/zones/${zoneA}/bins`)
      .set('Authorization', `Bearer ${tenantA.token}`)
      .send({ code: 'RCV-01', status: 'AVAILABLE' })
      .expect(201);
    
    binA = binRes.body.id;
    expect(binA).toBeDefined();
  });

  let receiptId: string;
  let itemId: string;

  it('2. Inbound Stock Flow (Tenant A)', async () => {
    // 1. Create ASN
    const asnRes = await request(app.getHttpServer())
      .post('/api/v1/warehouse/inbound/asn')
      .set('Authorization', `Bearer ${tenantA.token}`)
      .send({
        warehouseId: warehouseA,
        reference: 'ASN-1234',
        asnNumber: 'ASN-1234',
        expectedDate: new Date().toISOString(),
        items: [{ sku: 'SKU-001', expectedQty: 100 }]
      });
    
    if (asnRes.status !== 201) {
      console.log('ASN ERROR:', asnRes.body);
    }
    expect(asnRes.status).toBe(201);
    receiptId = asnRes.body.id;
    itemId = asnRes.body.items[0].id;

    // 2. Receive Goods
    const recRes = await request(app.getHttpServer())
      .post(`/api/v1/warehouse/inbound/${receiptId}/receive`)
      .set('Authorization', `Bearer ${tenantA.token}`)
      .send({
        stagingBinId: binA,
        items: [{ itemId: itemId, qty: 100, damagedQty: 0 }]
      });

    if (recRes.status !== 201) {
      console.log('RECEIVE ERROR:', recRes.body);
    }
    expect(recRes.status).toBe(201);
  });

  it('3. Outbound Stock Flow (Tenant A)', async () => {
    // 1. Create Outbound Order
    const outRes = await request(app.getHttpServer())
      .post('/api/v1/warehouse/outbound/order')
      .set('Authorization', `Bearer ${tenantA.token}`)
      .send({
        orderNumber: 'OUT-1001',
        items: [{ sku: 'SKU-001', requestedQty: 50 }]
      });
    
    if (outRes.status !== 201) {
      console.log('OUTBOUND ERROR:', outRes.body);
    }
    expect(outRes.status).toBe(201);
  });

  it('4. Tenant Isolation - Tenant B cannot see Tenant A warehouse', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/warehouse/${warehouseA}/topology`)
      .set('Authorization', `Bearer ${tenantB.token}`)
      .send();

    expect(res.status).toBe(404);
  });
});

async function setupTenant(prisma: PrismaService, jwt: JwtService, config: ConfigService, name: string) {
  const company = await prisma.runAsSystem('e2e-setup', (tx) => 
    tx.company.create({ data: { name } })
  );
  const role = await prisma.runAsSystem('e2e-setup', (tx) => 
    tx.role.create({ data: { name: 'Admin', companyId: company.id, permissions: ['warehouse:read', 'warehouse:write'] } })
  );
  const user = await prisma.runAsSystem('e2e-setup', (tx) => 
    tx.user.create({
      data: {
        email: `wh_e2e_${company.id}@example.com`,
        password: 'hashed',
        firstName: 'Admin',
        lastName: 'User',
        companyId: company.id,
        roleId: role.id
      }
    })
  );
  const token = jwt.sign(
    { sub: user.id, email: user.email, companyId: company.id, permissions: ['warehouse:read', 'warehouse:write'] },
    { secret: config.get('JWT_SECRET') }
  );

  return { companyId: company.id, token };
}
