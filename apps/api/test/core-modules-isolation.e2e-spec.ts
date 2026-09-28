import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('Core Modules Tenant Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  let tenantA: string;
  let tenantB: string;
  let tokenB: string;

  // Tenant A data
  let vehicleA: string;
  let driverA: string;
  let vendorA: string;
  let jobCardA: string;
  let lrA: string;
  let customerA: string;
  let tripA: string;
  let loadA: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    const jwt = app.get<JwtService>(JwtService);

    const ts = Date.now();
    const pwhash = require('bcrypt').hashSync('password123', 10);

    // 1. Setup Tenant A
    const { company: compA, vehicle, driver, vendor, jobCard, lorryReceipt, customer, trip } = await prisma.runAsSystem('setup', async (tx) => {
      const c = await tx.company.create({ data: { name: `Tenant A Fleet ${ts}`, status: 'ACTIVE' } });
      const r = await tx.role.create({ data: { companyId: c.id, name: 'Admin', permissions: ['trips:create', 'trips:update', 'billing:write', 'fleet:write', 'workshop:mechanic', 'documents:create', 'lr:share', 'documents:read'] } });
      await tx.user.create({ data: { companyId: c.id, roleId: r.id, email: `admin_a_${ts}@test.com`, password: pwhash, firstName: 'A', lastName: 'A', status: 'ACTIVE' } });

      const veh = await tx.vehicle.create({ data: { companyId: c.id, make: 'Volvo', model: 'VNL', year: 2024, licensePlate: 'A-123', type: 'TRUCK', status: 'IN_SERVICE' } });
      const drv = await tx.driver.create({ data: { companyId: c.id, firstName: 'Alice', lastName: 'A', licenseNumber: 'DL-A', phone: '111', status: 'AVAILABLE' } });
      const vnd = await tx.vendor.create({ data: { companyId: c.id, name: 'Vendor A', type: 'PARTS' } });
      const ws = await tx.workshop.create({ data: { companyId: c.id, name: 'Main Workshop' } });
      const jc = await tx.jobCard.create({ data: { companyId: c.id, vehicleId: veh.id, workshopId: ws.id, issueReported: 'Fix brakes', status: 'OPEN' } });
      const trip = await tx.trip.create({ data: { companyId: c.id, tripNumber: 'TRP-A', vehicleId: veh.id, driverId: drv.id, status: 'COMPLETED' } });
      const lr = await tx.lorryReceipt.create({ data: { companyId: c.id, tripId: trip.id, vehicleId: veh.id, driverId: drv.id, lrNumber: 'LR-A', consignorName: 'C1', consigneeName: 'C2', product: 'Steel', grossWeight: 1000, tareWeight: 100, netWeight: 900 } });
      const cust = await tx.customer.create({ data: { companyId: c.id, name: 'Customer A' } });
      const load = await tx.load.create({ data: { companyId: c.id, customerId: cust.id, loadNumber: 'LD-A', status: 'UNASSIGNED', origin: 'A', destination: 'B', pickupDate: new Date(), deliveryDate: new Date() } });

      return { company: c, vehicle: veh, driver: drv, vendor: vnd, jobCard: jc, lorryReceipt: lr, customer: cust, trip, load };
    });

    tenantA = compA.id;
    vehicleA = vehicle.id;
    driverA = driver.id;
    vendorA = vendor.id;
    jobCardA = jobCard.id;
    lrA = lorryReceipt.id;
    customerA = customer.id;
    tripA = trip.id;
    loadA = load.id;

    // 2. Setup Tenant B
    const compB = await prisma.runAsSystem('setup', async (tx) => {
      const c = await tx.company.create({ data: { name: `Tenant B Fleet ${ts}`, status: 'ACTIVE' } });
      const r = await tx.role.create({ data: { companyId: c.id, name: 'Admin', permissions: ['trips:create', 'trips:update', 'billing:write', 'fleet:write', 'workshop:mechanic', 'documents:create', 'lr:share', 'documents:read'] } });
      await tx.user.create({ data: { companyId: c.id, roleId: r.id, email: `admin_b_${ts}@test.com`, password: pwhash, firstName: 'B', lastName: 'B', status: 'ACTIVE' } });
      
      const vehB = await tx.vehicle.create({ data: { companyId: c.id, make: 'Volvo', model: 'VNL', year: 2024, licensePlate: 'B-123', type: 'TRUCK', status: 'IN_SERVICE' } });
      const drvB = await tx.driver.create({ data: { companyId: c.id, firstName: 'Bob', lastName: 'B', licenseNumber: 'DL-B', phone: '222', status: 'AVAILABLE' } });
      const tripB = await tx.trip.create({ data: { companyId: c.id, tripNumber: 'TRP-B', vehicleId: vehB.id, driverId: drvB.id, status: 'COMPLETED' } });
      
      // Seed a valid LR in Tenant B to test the driver foreign key check
      await tx.lorryReceipt.create({ data: { companyId: c.id, tripId: tripB.id, vehicleId: vehB.id, driverId: drvB.id, lrNumber: 'LR-B', consignorName: 'C1', consigneeName: 'C2', product: 'Wood', grossWeight: 1000, tareWeight: 100, netWeight: 900 } });
      
      return c;
    });
    tenantB = compB.id;

    const userB = await prisma.runAsSystem('setup token', tx => tx.user.findFirst({ where: { email: `admin_b_${ts}@test.com` }, include: { role: true } }));
    tokenB = jwt.sign({
      sub: userB.id,
      email: userB.email,
      companyId: tenantB,
      roleId: userB.roleId,
      permissions: userB.role.permissions,
    });
  });

  afterAll(async () => {
    // Delete in correct order
    await prisma.runAsSystem('teardown', async (tx) => {
      const tenants = [tenantA, tenantB].filter(Boolean);
      if (tenants.length === 0) return;
      await tx.jobPart.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.tyreLog.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.jobCardStatusHistory.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.jobCard.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.workshop.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.part.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.vendor.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.lorryReceipt.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.tripDesk.deleteMany({ where: { trip: { companyId: { in: tenants } } } });
      await tx.trip.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.load.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.customer.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.vehicle.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.driver.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.user.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.role.deleteMany({ where: { companyId: { in: tenants } } });
      await tx.company.deleteMany({ where: { id: { in: tenants } } });
    });
    await app.close();
  });

  it('Workshop: Tenant B should NOT be able to create a JobCard for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/workshop/job-cards')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ vehicleId: vehicleA, workshopId: '00000000-0000-0000-0000-000000000000', issueReported: 'Brakes' });
    expect(res.status).toBe(404); // Should fail
  });

  it('Workshop: Tenant B should NOT be able to create a TyreLog for Tenant A vehicle', async () => {
    const res = await request(app.getHttpServer())
      .post('/workshop/tyre-logs')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ vehicleId: vehicleA, tyreId: '00000000-0000-0000-0000-000000000000', action: 'REPLACE', details: 'test' });
    expect(res.status).toBe(404); // Should fail
  });

  it('Workshop: Tenant B should NOT be able to create a Part with Tenant A vendor', async () => {
    const res = await request(app.getHttpServer())
      .post('/workshop/parts')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'Oil Filter', vendorId: vendorA, unitCost: 100, quantity: 10 });
    expect(res.status).toBe(404); // Should fail
  });

  it('LorryReceipts: Tenant B should NOT be able to share LR using Tenant A driver', async () => {
    // Fetch the LR created in Tenant B during setup
    const lrB = await prisma.runAsSystem('setup lr for test', tx => tx.lorryReceipt.findFirst({ where: { companyId: tenantB } }));
    const res = await request(app.getHttpServer())
      .post(`/lorry-receipts/${lrB.id}/share`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ driverId: driverA });
    expect(res.status).toBe(404); // Should fail
  });

  it('Trip: Tenant B should NOT be able to create Trip for Tenant A vehicle/driver', async () => {
    const res = await request(app.getHttpServer())
      .post('/trips')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ vehicleId: vehicleA, driverId: driverA, status: 'PLANNED' });
    expect(res.status).toBe(409); // Driver/Vehicle not available or not found. The service throws 409 if not found, which is safe.
  });

  it('Workshop: Tenant B should NOT be able to create JobPart for Tenant A Part/JobCard', async () => {
    const res = await request(app.getHttpServer())
      .post('/workshop/job-parts')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ jobCardId: jobCardA, partId: 'some-part-id', qty: 1, unitCost: 10 });
    // Expect 404 because jobCard doesn't belong to Tenant B.
    // We use a dummy partId, but jobCard check should fail first.
    expect(res.status).toBe(404);
  });

  it('Billing: Tenant B should NOT be able to create RateCard for Tenant A Customer', async () => {
    const res = await request(app.getHttpServer())
      .post('/billing/rate-cards')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ customerId: customerA, type: 'FLAT_RATE', rate: 100 });
    expect(res.status).toBe(404);
  });

  it('Billing: Tenant B should NOT be able to generate invoice for Tenant A customer/trips', async () => {
    const res = await request(app.getHttpServer())
      .post('/billing/invoices/generate-from-trips')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ customerId: customerA, tripIds: [tripA] });
    expect(res.status).toBe(400); // Because "Company or Customer not found" or trip not found. Safe.
  });

  it('Dispatch: Tenant B should NOT be able to move Tenant A load on board', async () => {
    const res = await request(app.getHttpServer())
      .put('/dispatch/board/move')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ loadId: loadA, newStatus: 'IN_TRANSIT', boardPosition: 2 });
    expect(res.status).toBe(400); // The service currently throws BadRequestException('Load not found') if not found in tenant. Safe.
  });

});
