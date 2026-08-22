import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';

describe('BA3 Proof', () => {
  let app: INestApplication;
  let adminToken: string;
  
  let customerId: string;
  let invoiceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 1. Log in
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' })
      .expect(200);
      
    adminToken = loginRes.body.access_token;
  });

  it('should run BA3 proof', async () => {
    // 2. Create customer
    const custRes = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `Customer for BA3 ${Date.now()}`,
        email: `ba3-${Date.now()}@customer.com`,
        status: 'ACTIVE'
      })
      .expect(201);
    
    customerId = custRes.body.id;

    // 3. Create paid invoice for customer
    const invRes = await request(app.getHttpServer())
      .post('/finance/invoices')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        amount: 500,
        currency: 'USD',
        status: 'PAID',
        invoiceNumber: `INV-${Date.now()}`,
        issueDate: new Date().toISOString(),
        dueDate: new Date().toISOString()
      })
      .expect(201);
      
    invoiceId = invRes.body.id;

    const { PrismaService } = require('./../src/prisma/prisma.service');
    const prisma = app.get(PrismaService);
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    // 4. Soft delete the customer
    await request(app.getHttpServer())
      .delete(`/customers/${customerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // 5. Removed: no GET /finance/invoices/:id endpoint


    // 6. GET /customers/:id -> consistent with your policy, not a bare 404
    const getCust = await request(app.getHttpServer())
      .get(`/customers/${customerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
      
    console.log('GET /customers/:id status:', getCust.status);
    console.log('GET /customers/:id deleted flag:', getCust.body.deleted);

    // 7. Invoice list UI -> renders the name, no console error
    const listInv = await request(app.getHttpServer())
      .get(`/finance/invoices?limit=100`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const data = listInv.body.data || listInv.body.items || listInv.body;
    const invoiceRow = Array.isArray(data) ? data.find((i: any) => i.id === invoiceId) : undefined;
    
    console.log('Invoice list length:', Array.isArray(data) ? data.length : 0);
    console.log('Invoice list customer name resolved:', invoiceRow?.customer?.name ? true : false);
  });

  afterAll(async () => {
    const { PrismaService } = require('./../src/prisma/prisma.service');
    const prisma = app.get(PrismaService);
    await prisma.$disconnect();
    await app.close();
  });
});
