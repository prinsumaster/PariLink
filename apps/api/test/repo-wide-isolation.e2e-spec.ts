import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestModule from 'supertest';
const request = requestModule.default || requestModule;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Repo-wide Isolation', () => {
  jest.setTimeout(60000);
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let tokenB: string;
  let tokenAReadOnly: string;
  let tenantA: string;

  let vehicleA: string;
  let driverA: string;
  let vendorA: string;
  let customerA: string;
  let warehouseA: string;
  let invoiceA: string;
  let incidentA: string;
  let loadA: string;
  let bankAccountA: string;
  let trailerA: string;
  let jobCardA: string;
  let alertA: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);
    const ts = Date.now();
    const pwhash = require('bcrypt').hashSync('password123', 10);
    const perms = ['*'];

    // Setup Tenant A and entities
    const compA = await prisma.runAsSystem('setup', async (tx) => {
      const c = await tx.company.create({ data: { name: `Repo Tenant A ${ts}`, status: 'ACTIVE' } });
      const veh = await tx.vehicle.create({ data: { companyId: c.id, licensePlate: 'REPO-123', make: 'Volvo', model: 'V', year: 2024, type: 'TRUCK', status: 'IN_SERVICE' } });
      const drv = await tx.driver.create({ data: { companyId: c.id, firstName: 'A', lastName: 'B', licenseNumber: 'DL-REPO' } });
      const vnd = await tx.vendor.create({ data: { companyId: c.id, name: 'Repo Vendor', type: 'MAINTENANCE' } });
      const cust = await tx.customer.create({ data: { companyId: c.id, name: 'Repo Customer' } });
      const wh = await tx.warehouse.create({ data: { companyId: c.id, name: 'Repo Warehouse', code: 'WH-REPO', address: '123 Test St', city: 'City', state: 'State' } });
      const wkshp = await tx.workshop.create({ data: { companyId: c.id, name: 'Repo Workshop', location: '123 Workshop St', type: 'INTERNAL' } });
      const load = await tx.load.create({ data: { companyId: c.id, customerId: cust.id, status: 'UNASSIGNED', originAddress: 'A', originCity: 'A', originState: 'A', destinationAddress: 'B', destinationCity: 'B', destinationState: 'B', pickupDate: new Date(), deliveryDate: new Date(), referenceNumber: 'REF-123', rate: 100 } });
      const inv = await tx.invoice.create({ data: { companyId: c.id, customerId: cust.id, invoiceNumber: 'INV-REPO-1', amount: 100, status: 'DRAFT' } });
      const bankAcct = await tx.bankAccount.create({ data: { companyId: c.id, bankName: 'Repo Bank', accountNumber: 'ACCT-REPO-1', ifscCode: 'IFSC1234' } });
      const inc = await tx.incident.create({ data: { companyId: c.id, title: 'Test Incident', description: 'Test', severity: 'SEV1', status: 'INVESTIGATING', affectedServices: [] } });
      const trlr = await tx.vehicle.create({ data: { companyId: c.id, licensePlate: 'TRLR-123', make: 'TrailerMake', model: 'TrailerModel', year: 2024, type: 'TRAILER', status: 'IN_SERVICE' } });
      const jc = await tx.jobCard.create({ data: { companyId: c.id, workshopId: wkshp.id, vehicleId: veh.id, status: 'OPEN', issueReported: 'Test issue' } });
      const rule = await tx.alertRule.create({ data: { companyId: c.id, name: 'Test Rule', severity: 'HIGH', threshold: 1, condition: 'GREATER', isActive: true, type: 'CUSTOM' } });
      const alert = await tx.alert.create({ data: { companyId: c.id, ruleId: rule.id, severity: 'HIGH', message: 'Test Alert', status: 'NEW' } });

      return { company: c, vehicle: veh, driver: drv, vendor: vnd, customer: cust, warehouse: wh, workshop: wkshp, invoice: inv, load, bankAccount: bankAcct, incident: inc, trailer: trlr, jobCard: jc, alert };
    });

    tenantA = compA.company.id;
    vehicleA = compA.vehicle.id;
    driverA = compA.driver.id;
    vendorA = compA.vendor.id;
    customerA = compA.customer.id;
    warehouseA = compA.warehouse.id;
    invoiceA = compA.invoice.id;
    loadA = compA.load.id;
    bankAccountA = compA.bankAccount.id;
    incidentA = compA.incident.id;
    trailerA = compA.trailer.id;
    jobCardA = compA.jobCard.id;
    alertA = compA.alert.id;

    // Create a read-only user in Tenant A for BAC testing
    const readOnlyUserA = await prisma.runAsSystem('setup', async (tx) => {
      const r = await tx.role.create({ data: { companyId: compA.company.id, name: 'ReadOnly', permissions: ['read'] } });
      const u = await tx.user.create({ data: { companyId: compA.company.id, roleId: r.id, email: `readonly_a_${ts}@test.com`, password: pwhash, firstName: 'Read', lastName: 'Only', status: 'ACTIVE' } });
      return { user: u, role: r };
    });

    tokenAReadOnly = jwtService.sign({
      sub: readOnlyUserA.user.id,
      email: readOnlyUserA.user.email,
      companyId: compA.company.id,
      roleId: readOnlyUserA.role.id,
      permissions: readOnlyUserA.role.permissions,
    });

    // Setup Tenant B
    const compB = await prisma.runAsSystem('setup', async (tx) => {
      const c = await tx.company.create({ data: { name: `Repo Tenant B ${ts}`, status: 'ACTIVE' } });
      const r = await tx.role.create({ data: { companyId: c.id, name: 'Admin', permissions: perms } });
      const u = await tx.user.create({ data: { companyId: c.id, roleId: r.id, email: `admin_b_${ts}@test.com`, password: pwhash, firstName: 'B', lastName: 'B', status: 'ACTIVE' } });
      return { company: c, user: u, role: r };
    });

    tokenB = jwtService.sign({
      sub: compB.user.id,
      email: compB.user.email,
      companyId: compB.company.id,
      roleId: compB.role.id,
      permissions: compB.role.permissions,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('Yard: Tenant B should NOT be able to log gate entry with Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/yard/gate/entry')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ warehouseId: warehouseA, vehicleId: vehicleA, purpose: 'DELIVERY' });
    expect(res.status).toBe(404);
  });

  it('Finance: Tenant B should NOT be able to pay Tenant A invoice', async () => {
    const res = await request(app.getHttpServer())
      .post('/finance/payments')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ invoiceId: invoiceA, amount: 100, method: 'CASH', paymentDate: new Date() });
    expect(res.status).toBe(404);
  });

  it('Vehicles/Compliance: Tenant B should NOT be able to submit DVIR for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles/compliance/dvir')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ vehicleId: vehicleA, driverId: driverA, type: 'PRE_TRIP', status: 'SAFE' });
    expect(res.status).toBe(404);
  });
  
  it('Vehicles/Maintenance: Tenant B should NOT be able to create schedule for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles/maintenance/schedules')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ vehicleId: vehicleA, taskName: 'Oil Change', intervalDays: 30, intervalKm: 5000 });
    expect(res.status).toBe(404);
  });
  
  it('Vendor: Tenant B should NOT be able to create PO for Tenant A vendor', async () => {
    const res = await request(app.getHttpServer())
      .post('/vendors/purchase-orders')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ vendorId: vendorA, poNumber: 'PO-1', date: new Date(), items: [] });
    expect(res.status).toBe(404);
  });

  it('Factoring: Tenant B should NOT be able to submit Tenant A customer/load for factoring', async () => {
    const res = await request(app.getHttpServer())
      .post('/factoring/submit')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ customerId: customerA, loadId: loadA, invoiceNumber: 'INV-F-1', amount: 500, bolFileUrl: 'url', bolFileName: 'name' });
    expect(res.status).toBe(404);
  });

  it('Fastag Wallet: Tenant B should NOT be able to create toll account for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/fastag/accounts')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ accountNumber: 'F-123', vehicleId: vehicleA, provider: 'NHAI' });
    expect(res.status).toBe(404);
  });

  it('Warehouse/Inbound: Tenant B should NOT be able to create ASN for Tenant A warehouse/load', async () => {
    const res = await request(app.getHttpServer())
      .post('/warehouse/inbound/asn')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ warehouseId: warehouseA, loadId: loadA, asnNumber: 'ASN-1', expectedDate: new Date(), reference: 'REF-1', items: [{ sku: 'SKU1', expectedQty: 10 }] });
    expect(res.status).toBe(404);
  });

  it('Finance/BankStatement: Tenant B should NOT be able to sync statement for Tenant A bankAccount', async () => {
    const res = await request(app.getHttpServer())
      .post('/finance/bank-statements')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ accountId: bankAccountA, statementDate: new Date(), closingBalance: 1000 });
    expect(res.status).toBe(404);
  });

  it('Finance/DriverWallet: Tenant B should NOT be able to submit expense for Tenant A driver', async () => {
    const res = await request(app.getHttpServer())
      .post('/finance/wallet/expenses')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ driverId: driverA, type: 'FUEL', amount: 50, date: new Date(), notes: 'Test' });
    expect(res.status).toBe(404);
  });

  it('Fuel: Tenant B should NOT be able to create fuel card for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/fuel-cards')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ cardNumber: '1111222233334444', provider: 'FLEETCOR', vehicleId: vehicleA, dailyLimit: 500 });
    expect(res.status).toBe(404);
  });

  it('Operations/Incidents: Tenant B should NOT be able to add timeline event to Tenant A incident', async () => {
    const res = await request(app.getHttpServer())
      .post(`/operations/incidents/${incidentA}/timeline`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ eventType: 'NOTE', description: 'Hacked timeline event' });
    expect(res.status).toBe(404);
  });

  it('Portals/Claims: Tenant B should NOT be able to create claim for Tenant A customer/load', async () => {
    const res = await request(app.getHttpServer())
      .post('/portals/customer/claims')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ customerId: customerA, loadId: loadA, amount: 500, reason: 'Damaged goods' });
    expect(res.status).toBe(404);
  });

  it('Vehicles/Permits: Tenant B should NOT be able to create permit for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/vehicles/permits')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ payload: { vehicleId: vehicleA, permitType: 'STATE', permitNumber: 'ST-1234', issuedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 86400000).toISOString() } });
    expect(res.status).toBe(404);
  });

  it('Trailers (IDOR): Tenant B should NOT be able to read Tenant A trailer by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/trailers/${trailerA}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
  });

  it('Workshop (IDOR): Tenant B should NOT be able to read Tenant A jobCard by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/workshop/job-cards/${jobCardA}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
  });

  it('Operations/Alerts (IDOR): Tenant B should NOT be able to acknowledge Tenant A alert by ID', async () => {
    const res = await request(app.getHttpServer())
      .post(`/operations/alerts/${alertA}/ack`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
  });

  describe('Broken Access Control (BAC)', () => {
    it('CRM: Read-Only user should NOT be able to create a CRM lead', async () => {
      const res = await request(app.getHttpServer())
        .post('/crm/leads')
        .set('Authorization', `Bearer ${tokenAReadOnly}`)
        .send({ title: 'Test Lead', status: 'NEW' });
      expect(res.status).toBe(403);
    });

    it('CRM: Read-Only user should NOT be able to delete a CRM lead', async () => {
      const res = await request(app.getHttpServer())
        .delete('/crm/leads/some-fake-id')
        .set('Authorization', `Bearer ${tokenAReadOnly}`);
      expect(res.status).toBe(403);
    });
    it('Dashboard: Read-Only user should NOT be able to create a dashboard', async () => {
      const res = await request(app.getHttpServer())
        .post('/dashboard-builder')
        .set('Authorization', `Bearer ${tokenAReadOnly}`)
        .send({ name: 'Hacked Dashboard' });
      expect(res.status).toBe(403);
    });
    it('Communications: Read-Only user should NOT be able to create an announcement', async () => {
      const res = await request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${tokenAReadOnly}`)
        .send({ title: 'Hacked Announcement', content: 'You are hacked' });
      expect(res.status).toBe(403);
    });
    it('Drivers/Attendance: Read-Only user should NOT be able to create an attendance record', async () => {
      const res = await request(app.getHttpServer())
        .post('/drivers/attendance')
        .set('Authorization', `Bearer ${tokenAReadOnly}`)
        .send({ driverId: 'fake', date: new Date(), status: 'PRESENT' });
      expect(res.status).toBe(403);
    });
    it('Vehicles/Permit: Read-Only user should NOT be able to create a permit', async () => {
      const res = await request(app.getHttpServer())
        .post('/vehicles/permits')
        .set('Authorization', `Bearer ${tokenAReadOnly}`)
        .send({ payload: { type: 'NATIONAL', vehicleId: 'fake' } });
      expect(res.status).toBe(403);
    });
  });
});
