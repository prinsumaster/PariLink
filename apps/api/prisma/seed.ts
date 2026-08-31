// @ts-nocheck
/**
 * prisma/seed.ts — Idempotent demo seed (INDIAN DATA — RICH)
 * Run: npx prisma db seed
 * Safe to run twice — all upserts / findOrCreate.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const DEV_CLIENT_ID     = 'client_parilink_dev_local';
const DEV_CLIENT_SECRET = 'secret_parilink_dev_local_changeme';

function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

async function findOrCreate<T>(
  findFn: () => Promise<T | null>,
  createFn: () => Promise<T>,
): Promise<T> {
  const existing = await findFn();
  return existing ?? (await createFn());
}

const d = (daysOffset: number) => new Date(Date.now() + daysOffset * 86_400_000);

async function main() {
  console.log('🌱 Seeding database with rich Indian Demo Data...');

  await prisma.$transaction(
    async (tx: any) => {
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;

      // ── 1. Company ──────────────────────────────────────────────────────────
      const co = await findOrCreate(
        () => tx.company.findFirst({ where: { email: 'billing@parilink.in' } }),
        () => tx.company.create({
          data: {
            name: 'PariLink India Logistics', taxId: '27AADCB2230M1Z2',
            address: 'Bandra Kurla Complex', city: 'Mumbai', state: 'Maharashtra',
            country: 'India', postalCode: '400051',
            email: 'billing@parilink.in', phone: '+91-9876543210',
            website: 'www.parilink.in', status: 'ACTIVE',
          },
        }),
      );

      await tx.tenantConfiguration.upsert({
        where:  { companyId: co.id },
        update: { currency: 'INR', timezone: 'Asia/Kolkata' },
        create: { companyId: co.id, onboardingCompleted: true, timezone: 'Asia/Kolkata', currency: 'INR' },
      });

      // ── 2. Branches ─────────────────────────────────────────────────────────
      await findOrCreate(
        () => tx.branch.findFirst({ where: { code: 'MUM-HQ', companyId: co.id } }),
        () => tx.branch.create({ data: { companyId: co.id, name: 'Mumbai HQ', code: 'MUM-HQ', city: 'Mumbai', state: 'Maharashtra', country: 'India' } }),
      );
      await findOrCreate(
        () => tx.branch.findFirst({ where: { code: 'DEL-01', companyId: co.id } }),
        () => tx.branch.create({ data: { companyId: co.id, name: 'Delhi NCR Hub', code: 'DEL-01', city: 'New Delhi', state: 'Delhi', country: 'India' } }),
      );
      await findOrCreate(
        () => tx.branch.findFirst({ where: { code: 'CHN-01', companyId: co.id } }),
        () => tx.branch.create({ data: { companyId: co.id, name: 'Chennai South Hub', code: 'CHN-01', city: 'Chennai', state: 'Tamil Nadu', country: 'India' } }),
      );

      // ── 3. Role & Admin User ────────────────────────────────────────────────
      const adminRole = await findOrCreate(
        () => tx.role.findFirst({ where: { companyId: co.id, name: 'SUPER_ADMIN' } }),
        () => tx.role.create({ data: { name: 'SUPER_ADMIN', description: 'Full system access', permissions: ['*'], companyId: co.id } }),
      );

      const hashedPassword = await bcrypt.hash('password123', 10);
      const adminUser = await tx.user.upsert({
        where:  { email: 'admin@parilink.in' },
        update: { password: hashedPassword },
        create: {
          email: 'admin@parilink.in', password: hashedPassword,
          firstName: 'Vikram', lastName: 'Singh',
          roleId: adminRole.id, companyId: co.id,
        },
      });

      // ── 4. Customers (5) ────────────────────────────────────────────────────
      const cust1 = await findOrCreate(
        () => tx.customer.findFirst({ where: { email: 'logistics@tatamotors.com', companyId: co.id } }),
        () => tx.customer.create({ data: { name: 'Tata Motors Ltd', companyId: co.id, email: 'logistics@tatamotors.com', phone: '+91-2266658282', taxId: '27AAACT2727Q1ZY', status: 'ACTIVE', creditLimit: 5000000 } }),
      );
      const cust2 = await findOrCreate(
        () => tx.customer.findFirst({ where: { email: 'supplychain@reliance.in', companyId: co.id } }),
        () => tx.customer.create({ data: { name: 'Reliance Retail Ltd', companyId: co.id, email: 'supplychain@reliance.in', phone: '+91-2222716000', taxId: '27AAJCR5778M1ZR', status: 'ACTIVE', creditLimit: 10000000 } }),
      );
      const cust3 = await findOrCreate(
        () => tx.customer.findFirst({ where: { email: 'logistics@amul.coop', companyId: co.id } }),
        () => tx.customer.create({ data: { name: 'Amul (GCMMF)', companyId: co.id, email: 'logistics@amul.coop', phone: '+91-2692258506', taxId: '24AAACG4756D1ZU', status: 'ACTIVE', creditLimit: 3000000 } }),
      );
      const cust4 = await findOrCreate(
        () => tx.customer.findFirst({ where: { email: 'dispatch@asianpaints.com', companyId: co.id } }),
        () => tx.customer.create({ data: { name: 'Asian Paints Ltd', companyId: co.id, email: 'dispatch@asianpaints.com', phone: '+91-2239818000', taxId: '27AAACA7798Q1ZY', status: 'ACTIVE', creditLimit: 4000000 } }),
      );
      const cust5 = await findOrCreate(
        () => tx.customer.findFirst({ where: { email: 'scm@havells.com', companyId: co.id } }),
        () => tx.customer.create({ data: { name: 'Havells India Ltd', companyId: co.id, email: 'scm@havells.com', phone: '+91-1204331234', taxId: '07AABCH1003D1Z3', status: 'ACTIVE', creditLimit: 2500000 } }),
      );

      // ── 5. Vendors (5) ──────────────────────────────────────────────────────
      const vend1 = await findOrCreate(
        () => tx.vendor.findFirst({ where: { email: 'vendor@sharmatransport.com', companyId: co.id } }),
        () => tx.vendor.create({ data: { name: 'Sharma Transport Co.', companyId: co.id, email: 'vendor@sharmatransport.com', phone: '+91-9988776655', type: 'CARRIER', status: 'ACTIVE', taxId: '09AACFS8432M1ZY' } }),
      );
      const vend2 = await findOrCreate(
        () => tx.vendor.findFirst({ where: { email: 'ops@speedways.in', companyId: co.id } }),
        () => tx.vendor.create({ data: { name: 'Speedways Logistics Pvt Ltd', companyId: co.id, email: 'ops@speedways.in', phone: '+91-9876543211', type: 'CARRIER', status: 'ACTIVE', taxId: '27AACCS9999A1ZX' } }),
      );
      const vend3 = await findOrCreate(
        () => tx.vendor.findFirst({ where: { email: 'billing@rajmovers.com', companyId: co.id } }),
        () => tx.vendor.create({ data: { name: 'Raj Movers & Packers', companyId: co.id, email: 'billing@rajmovers.com', phone: '+91-9811122334', type: 'CARRIER', status: 'ACTIVE', taxId: '07AABCR4567F1Z5' } }),
      );
      const vend4 = await findOrCreate(
        () => tx.vendor.findFirst({ where: { email: 'accounts@krishnatrucks.in', companyId: co.id } }),
        () => tx.vendor.create({ data: { name: 'Krishna Trucking Services', companyId: co.id, email: 'accounts@krishnatrucks.in', phone: '+91-9944556677', type: 'CARRIER', status: 'ACTIVE', taxId: '33AABCK7812L1ZK' } }),
      );
      await findOrCreate(
        () => tx.vendor.findFirst({ where: { email: 'freight@aggarwalgroup.com', companyId: co.id } }),
        () => tx.vendor.create({ data: { name: 'Aggarwal Freight Corporation', companyId: co.id, email: 'freight@aggarwalgroup.com', phone: '+91-1124356789', type: 'BROKER', status: 'ACTIVE', taxId: '07AACCA5432N1ZJ' } }),
      );

      // ── 6. Drivers (6) ──────────────────────────────────────────────────────
      const drv1 = await findOrCreate(
        () => tx.driver.findFirst({ where: { licenseNumber: 'MH-04-2015-1234567', companyId: co.id } }),
        () => tx.driver.create({ data: { firstName: 'Raju', lastName: 'Yadav', phone: '+91-9876501234', licenseNumber: 'MH-04-2015-1234567', licenseState: 'Maharashtra', licenseExpiry: d(365), status: 'ON_TRIP', companyId: co.id } }),
      );
      const drv2 = await findOrCreate(
        () => tx.driver.findFirst({ where: { licenseNumber: 'DL-01-2018-7654321', companyId: co.id } }),
        () => tx.driver.create({ data: { firstName: 'Amit', lastName: 'Kumar', phone: '+91-9876502345', licenseNumber: 'DL-01-2018-7654321', licenseState: 'Delhi', licenseExpiry: d(200), status: 'ON_TRIP', companyId: co.id } }),
      );
      const drv3 = await findOrCreate(
        () => tx.driver.findFirst({ where: { licenseNumber: 'GJ-01-2020-9988776', companyId: co.id } }),
        () => tx.driver.create({ data: { firstName: 'Bhavesh', lastName: 'Patel', phone: '+91-9876503456', licenseNumber: 'GJ-01-2020-9988776', licenseState: 'Gujarat', licenseExpiry: d(400), status: 'AVAILABLE', companyId: co.id } }),
      );
      const drv4 = await findOrCreate(
        () => tx.driver.findFirst({ where: { licenseNumber: 'RJ-14-2019-1122334', companyId: co.id } }),
        () => tx.driver.create({ data: { firstName: 'Suresh', lastName: 'Meena', phone: '+91-9876504567', licenseNumber: 'RJ-14-2019-1122334', licenseState: 'Rajasthan', licenseExpiry: d(280), status: 'ON_TRIP', companyId: co.id } }),
      );
      const drv5 = await findOrCreate(
        () => tx.driver.findFirst({ where: { licenseNumber: 'TN-22-2017-5544332', companyId: co.id } }),
        () => tx.driver.create({ data: { firstName: 'Murugan', lastName: 'Pillai', phone: '+91-9876505678', licenseNumber: 'TN-22-2017-5544332', licenseState: 'Tamil Nadu', licenseExpiry: d(150), status: 'AVAILABLE', companyId: co.id } }),
      );
      const drv6 = await findOrCreate(
        () => tx.driver.findFirst({ where: { licenseNumber: 'KA-01-2021-7766554', companyId: co.id } }),
        () => tx.driver.create({ data: { firstName: 'Naveen', lastName: 'Gowda', phone: '+91-9876506789', licenseNumber: 'KA-01-2021-7766554', licenseState: 'Karnataka', licenseExpiry: d(500), status: 'ON_LEAVE', companyId: co.id } }),
      );

      // ── 7. Vehicles (6) ─────────────────────────────────────────────────────
      const veh1 = await findOrCreate(
        () => tx.vehicle.findFirst({ where: { licensePlate: 'MH-04-AB-1234', companyId: co.id } }),
        () => tx.vehicle.create({ data: { make: 'Tata', model: 'Prima 4028.S', year: 2023, vin: 'TATAPRIMA12345670', licensePlate: 'MH-04-AB-1234', status: 'IN_SERVICE', type: 'TRUCK', capacityWeight: 25000, companyId: co.id } }),
      );
      const veh2 = await findOrCreate(
        () => tx.vehicle.findFirst({ where: { licensePlate: 'DL-1L-BC-9876', companyId: co.id } }),
        () => tx.vehicle.create({ data: { make: 'Ashok Leyland', model: '4923 HT', year: 2022, vin: 'ASHOKLEYL98765430', licensePlate: 'DL-1L-BC-9876', status: 'IN_SERVICE', type: 'TRUCK', capacityWeight: 23000, companyId: co.id } }),
      );
      const veh3 = await findOrCreate(
        () => tx.vehicle.findFirst({ where: { licensePlate: 'GJ-01-AB-5678', companyId: co.id } }),
        () => tx.vehicle.create({ data: { make: 'Tata', model: 'LPT 3518', year: 2021, vin: 'TATALPT356789010', licensePlate: 'GJ-01-AB-5678', status: 'IN_SERVICE', type: 'TRUCK', capacityWeight: 35000, companyId: co.id } }),
      );
      const veh4 = await findOrCreate(
        () => tx.vehicle.findFirst({ where: { licensePlate: 'RJ-14-CD-2233', companyId: co.id } }),
        () => tx.vehicle.create({ data: { make: 'Eicher', model: 'Pro 6031', year: 2023, vin: 'EICHERPRO60310002', licensePlate: 'RJ-14-CD-2233', status: 'IN_SERVICE', type: 'TRUCK', capacityWeight: 31000, companyId: co.id } }),
      );
      const veh5 = await findOrCreate(
        () => tx.vehicle.findFirst({ where: { licensePlate: 'TN-22-EF-9900', companyId: co.id } }),
        () => tx.vehicle.create({ data: { make: 'BharatBenz', model: '3523R', year: 2022, vin: 'BHARATBENZ352300X', licensePlate: 'TN-22-EF-9900', status: 'AVAILABLE', type: 'TRUCK', capacityWeight: 23000, companyId: co.id } }),
      );
      const veh6 = await findOrCreate(
        () => tx.vehicle.findFirst({ where: { licensePlate: 'KA-01-GH-7711', companyId: co.id } }),
        () => tx.vehicle.create({ data: { make: 'Mahindra', model: 'Blazo X 35', year: 2024, vin: 'MAHINDRA3500BLZ01', licensePlate: 'KA-01-GH-7711', status: 'AVAILABLE', type: 'TRUCK', capacityWeight: 35000, companyId: co.id } }),
      );

      // ── 8. Trips (8) ────────────────────────────────────────────────────────
      const trip1 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1001' }, update: {}, create: { tripNumber: 'TRP-IND-1001', status: 'IN_TRANSIT', driverId: drv1.id, vehicleId: veh1.id, companyId: co.id, startDate: d(-1), eta: d(1), fuelExpenses: 8500, otherExpenses: 2000, estimatedDistance: 1450 } });
      const trip2 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1002' }, update: {}, create: { tripNumber: 'TRP-IND-1002', status: 'COMPLETED', driverId: drv2.id, vehicleId: veh2.id, companyId: co.id, startDate: d(-5), endDate: d(-3), fuelExpenses: 7200, otherExpenses: 1800, estimatedDistance: 980 } });
      const trip3 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1003' }, update: {}, create: { tripNumber: 'TRP-IND-1003', status: 'IN_TRANSIT', driverId: drv3.id, vehicleId: veh3.id, companyId: co.id, startDate: d(-2), eta: d(1), fuelExpenses: 12000, otherExpenses: 3500, estimatedDistance: 1850 } });
      const trip4 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1004' }, update: {}, create: { tripNumber: 'TRP-IND-1004', status: 'COMPLETED', driverId: drv4.id, vehicleId: veh4.id, companyId: co.id, startDate: d(-8), endDate: d(-6), fuelExpenses: 5500, otherExpenses: 1200, estimatedDistance: 275 } });
      // LOSS-MAKING trip: Pune→Nagpur, rate=18000 but costs=26000
      const trip5 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1005' }, update: {}, create: { tripNumber: 'TRP-IND-1005', status: 'COMPLETED', driverId: drv5.id, vehicleId: veh5.id, companyId: co.id, startDate: d(-10), endDate: d(-9), fuelExpenses: 16000, otherExpenses: 10000, estimatedDistance: 720 } });
      const trip6 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1006' }, update: {}, create: { tripNumber: 'TRP-IND-1006', status: 'PLANNED', driverId: drv6.id, vehicleId: veh6.id, companyId: co.id, startDate: d(2), eta: d(4), estimatedDistance: 600 } });
      const trip7 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1007' }, update: {}, create: { tripNumber: 'TRP-IND-1007', status: 'COMPLETED', driverId: drv1.id, vehicleId: veh1.id, companyId: co.id, startDate: d(-15), endDate: d(-12), fuelExpenses: 9800, otherExpenses: 2400, estimatedDistance: 1100 } });
      const trip8 = await tx.trip.upsert({ where: { tripNumber: 'TRP-IND-1008' }, update: {}, create: { tripNumber: 'TRP-IND-1008', status: 'IN_TRANSIT', driverId: drv4.id, vehicleId: veh4.id, companyId: co.id, startDate: d(-1), eta: d(2), fuelExpenses: 6500, otherExpenses: 1500, estimatedDistance: 890 } });

      // ── 9. Loads (8) — real Indian lanes ─────────────────────────────────────
      const load1 = await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1001', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1001', tripId: trip1.id, customerId: cust1.id, companyId: co.id, consignor: 'Tata Motors Pune', consignee: 'Tata Motors Delhi', originAddress: 'MIDC Bhosari', originCity: 'Pune', originState: 'Maharashtra', destinationAddress: 'Okhla Industrial Area', destinationCity: 'New Delhi', destinationState: 'Delhi', pickupDate: d(-1), deliveryDate: d(1), rate: 45000, status: 'IN_TRANSIT', weight: 18000 } }),
      );
      const load2 = await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1002', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1002', tripId: trip2.id, customerId: cust2.id, companyId: co.id, consignor: 'Reliance Mumbai', consignee: 'Reliance Bengaluru', originAddress: 'Navi Mumbai APMC', originCity: 'Mumbai', originState: 'Maharashtra', destinationAddress: 'Whitefield', destinationCity: 'Bengaluru', destinationState: 'Karnataka', pickupDate: d(-5), deliveryDate: d(-3), rate: 72000, status: 'DELIVERED', weight: 22000 } }),
      );
      const load3 = await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1003', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1003', tripId: trip3.id, customerId: cust3.id, companyId: co.id, consignor: 'Amul Anand', consignee: 'Amul Delhi', originAddress: 'Amul Dairy Complex', originCity: 'Anand', originState: 'Gujarat', destinationAddress: 'Motibagh', destinationCity: 'New Delhi', destinationState: 'Delhi', pickupDate: d(-2), deliveryDate: d(1), rate: 55000, status: 'IN_TRANSIT', weight: 20000 } }),
      );
      const load4 = await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1004', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1004', tripId: trip4.id, customerId: cust4.id, companyId: co.id, consignor: 'Asian Paints Jaipur', consignee: 'Asian Paints Delhi', originAddress: 'Sitapura Industrial', originCity: 'Jaipur', originState: 'Rajasthan', destinationAddress: 'Sahibabad', destinationCity: 'New Delhi', destinationState: 'Delhi', pickupDate: d(-8), deliveryDate: d(-6), rate: 38000, status: 'DELIVERED', weight: 15000 } }),
      );
      // LOSS-MAKING: Pune->Nagpur, rate=18000, costs=26000
      const load5 = await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1005', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1005', tripId: trip5.id, customerId: cust5.id, companyId: co.id, consignor: 'Havells Pune', consignee: 'Havells Nagpur', originAddress: 'Pimpri-Chinchwad MIDC', originCity: 'Pune', originState: 'Maharashtra', destinationAddress: 'Nagpur MIDC Butibori', destinationCity: 'Nagpur', destinationState: 'Maharashtra', pickupDate: d(-10), deliveryDate: d(-9), rate: 18000, cost: 26000, status: 'DELIVERED', weight: 12000, notes: 'Emergency booking — underpriced lane. Net loss: Rs.8000' } }),
      );
      await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1006', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1006', tripId: trip6.id, customerId: cust1.id, companyId: co.id, consignor: 'Tata Chennai', consignee: 'Tata Bengaluru', originAddress: 'Ambattur Industrial Estate', originCity: 'Chennai', originState: 'Tamil Nadu', destinationAddress: 'Peenya Industrial Area', destinationCity: 'Bengaluru', destinationState: 'Karnataka', pickupDate: d(2), deliveryDate: d(4), rate: 32000, status: 'PENDING', weight: 14000 } }),
      );
      const load7 = await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1007', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1007', tripId: trip7.id, customerId: cust2.id, companyId: co.id, consignor: 'Reliance Ahmedabad', consignee: 'Reliance Surat', originAddress: 'Vatva GIDC', originCity: 'Ahmedabad', originState: 'Gujarat', destinationAddress: 'Sachin GIDC', destinationCity: 'Surat', destinationState: 'Gujarat', pickupDate: d(-15), deliveryDate: d(-12), rate: 85000, status: 'DELIVERED', weight: 30000 } }),
      );
      await findOrCreate(
        () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1008', companyId: co.id } }),
        () => tx.load.create({ data: { referenceNumber: 'LOD-IND-1008', tripId: trip8.id, customerId: cust3.id, companyId: co.id, consignor: 'Amul Rajkot', consignee: 'Amul Jaipur', originAddress: 'Rajkot Gujarat', originCity: 'Rajkot', originState: 'Gujarat', destinationAddress: 'Jaipur Rajasthan', destinationCity: 'Jaipur', destinationState: 'Rajasthan', pickupDate: d(-1), deliveryDate: d(2), rate: 42000, status: 'IN_TRANSIT', weight: 16000 } }),
      );

      // ── 10. Invoices (6) & Line Items ──────────────────────────────────────
      const inv1 = await tx.invoice.upsert({
        where: { companyId_invoiceNumber: { companyId: co.id, invoiceNumber: 'INV-IND-1001' } },
        update: { amount: 45000, status: 'PAID', notes: 'GST 5% GTA Services (SAC 9965) - Reverse Charge Applicable' },
        create: { invoiceNumber: 'INV-IND-1001', amount: 45000, status: 'PAID', dueDate: d(-20), loadId: load1.id, customerId: cust1.id, companyId: co.id, notes: 'GST 5% GTA Services (SAC 9965) - Reverse Charge Applicable' },
      });
      const inv2 = await tx.invoice.upsert({
        where: { companyId_invoiceNumber: { companyId: co.id, invoiceNumber: 'INV-IND-1002' } },
        update: { amount: 72000, status: 'PAID', notes: 'GST 5% GTA Services (SAC 9965)' },
        create: { invoiceNumber: 'INV-IND-1002', amount: 72000, status: 'PAID', dueDate: d(-15), loadId: load2.id, customerId: cust2.id, companyId: co.id, notes: 'GST 5% GTA Services (SAC 9965)' },
      });
      const inv3 = await tx.invoice.upsert({
        where: { companyId_invoiceNumber: { companyId: co.id, invoiceNumber: 'INV-IND-1003' } },
        update: { amount: 55000, status: 'ISSUED', notes: 'GST 5% GTA Cold Chain Services (SAC 9965)' },
        create: { invoiceNumber: 'INV-IND-1003', amount: 55000, status: 'ISSUED', dueDate: d(15), loadId: load3.id, customerId: cust3.id, companyId: co.id, notes: 'GST 5% GTA Cold Chain Services (SAC 9965)' },
      });
      const inv4 = await tx.invoice.upsert({
        where: { companyId_invoiceNumber: { companyId: co.id, invoiceNumber: 'INV-IND-1004' } },
        update: { amount: 38000, status: 'OVERDUE', notes: 'GST 5% GTA Hazardous Cargo (SAC 9965)' },
        create: { invoiceNumber: 'INV-IND-1004', amount: 38000, status: 'OVERDUE', dueDate: d(-5), loadId: load4.id, customerId: cust4.id, companyId: co.id, notes: 'GST 5% GTA Hazardous Cargo (SAC 9965)' },
      });
      const inv5 = await tx.invoice.upsert({
        where: { companyId_invoiceNumber: { companyId: co.id, invoiceNumber: 'INV-IND-1005' } },
        update: { amount: 18000, status: 'ISSUED', notes: 'GST 5% GTA Switchgear Haulage (SAC 9965)' },
        create: { invoiceNumber: 'INV-IND-1005', amount: 18000, status: 'ISSUED', dueDate: d(10), loadId: load5.id, customerId: cust5.id, companyId: co.id, notes: 'GST 5% GTA Switchgear Haulage (SAC 9965)' },
      });
      const inv6 = await tx.invoice.upsert({
        where: { companyId_invoiceNumber: { companyId: co.id, invoiceNumber: 'INV-IND-1006' } },
        update: { amount: 85000, status: 'PAID', notes: 'GST 5% GTA Heavy Commercial Transport (SAC 9965)' },
        create: { invoiceNumber: 'INV-IND-1006', amount: 85000, status: 'PAID', dueDate: d(-10), loadId: load7.id, customerId: cust2.id, companyId: co.id, notes: 'GST 5% GTA Heavy Commercial Transport (SAC 9965)' },
      });

      // Line Items per invoice
      const invoiceLineItemsMap = [
        { inv: inv1, items: [
          { description: 'Primary Freight Haulage: Pune to Delhi (18 MT)', quantity: 1, unitPrice: 40000, amount: 40000, type: 'LINE_HAUL' },
          { description: 'Loading & Hamali Charges at Origin MIDC', quantity: 1, unitPrice: 2000, amount: 2000, type: 'HANDLING' },
          { description: 'Transit Toll Surcharge (NH-48)', quantity: 1, unitPrice: 857, amount: 857, type: 'SURCHARGE' },
          { description: 'Goods & Services Tax (5% GTA SAC 9965)', quantity: 1, unitPrice: 2143, amount: 2143, type: 'TAX' },
        ]},
        { inv: inv2, items: [
          { description: 'Primary Freight Haulage: Mumbai to Bengaluru (22 MT)', quantity: 1, unitPrice: 64000, amount: 64000, type: 'LINE_HAUL' },
          { description: 'Cross-docking & Warehousing at Hub', quantity: 1, unitPrice: 3000, amount: 3000, type: 'STORAGE' },
          { description: 'FASTag Toll & Green Tax Surcharge', quantity: 1, unitPrice: 1571, amount: 1571, type: 'SURCHARGE' },
          { description: 'Goods & Services Tax (5% GTA SAC 9965)', quantity: 1, unitPrice: 3429, amount: 3429, type: 'TAX' },
        ]},
        { inv: inv3, items: [
          { description: 'Reefer Freight Haulage: Anand to Delhi (20 MT)', quantity: 1, unitPrice: 49000, amount: 49000, type: 'LINE_HAUL' },
          { description: 'Cold Chain Temperature Monitoring (-18°C)', quantity: 1, unitPrice: 2500, amount: 2500, type: 'VALUE_ADD' },
          { description: 'Chilled Loading & Pallet Strapping', quantity: 1, unitPrice: 881, amount: 881, type: 'HANDLING' },
          { description: 'Goods & Services Tax (5% GTA SAC 9965)', quantity: 1, unitPrice: 2619, amount: 2619, type: 'TAX' },
        ]},
        { inv: inv4, items: [
          { description: 'Primary Freight Haulage: Jaipur to Delhi (15 MT)', quantity: 1, unitPrice: 34000, amount: 34000, type: 'LINE_HAUL' },
          { description: 'Specialized Industrial Cargo Packaging', quantity: 1, unitPrice: 1500, amount: 1500, type: 'PACKAGING' },
          { description: 'Toll & Green Corridor Surcharge', quantity: 1, unitPrice: 690, amount: 690, type: 'SURCHARGE' },
          { description: 'Goods & Services Tax (5% GTA SAC 9965)', quantity: 1, unitPrice: 1810, amount: 1810, type: 'TAX' },
        ]},
        { inv: inv5, items: [
          { description: 'Primary Freight Haulage: Pune to Nagpur (12 MT)', quantity: 1, unitPrice: 16000, amount: 16000, type: 'LINE_HAUL' },
          { description: 'Loading & Switchgear Securing Charges', quantity: 1, unitPrice: 1143, amount: 1143, type: 'HANDLING' },
          { description: 'Goods & Services Tax (5% GTA SAC 9965)', quantity: 1, unitPrice: 857, amount: 857, type: 'TAX' },
        ]},
        { inv: inv6, items: [
          { description: 'Primary Freight Haulage: Ahmedabad to Surat (30 MT)', quantity: 1, unitPrice: 76000, amount: 76000, type: 'LINE_HAUL' },
          { description: 'Multi-axle Heavy Transport Permit Fee', quantity: 1, unitPrice: 3500, amount: 3500, type: 'PERMIT' },
          { description: 'Port Delivery & Yard Staging', quantity: 1, unitPrice: 1452, amount: 1452, type: 'VALUE_ADD' },
          { description: 'Goods & Services Tax (5% GTA SAC 9965)', quantity: 1, unitPrice: 4048, amount: 4048, type: 'TAX' },
        ]},
      ];

      for (const { inv, items } of invoiceLineItemsMap) {
        const existingLines = await tx.invoiceLineItem.findMany({ where: { invoiceId: inv.id } });
        if (existingLines.length === 0) {
          for (const item of items) {
            await tx.invoiceLineItem.create({
              data: {
                invoiceId: inv.id,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.amount,
                type: item.type,
              },
            });
          }
        }
        
        let subtotal = 0;
        let tax = 0;
        for (const item of items) {
          if (item.type === 'TAX') tax += item.amount;
          else subtotal += item.amount;
        }
        const grandTotal = subtotal + tax;
        const amountPaid = inv.status === 'PAID' ? grandTotal : 0;
        const balanceDue = grandTotal - amountPaid;

        await tx.invoice.update({
          where: { id: inv.id },
          data: {
            subtotal,
            tax,
            grandTotal,
            amountPaid,
            balanceDue,
            amount: grandTotal,
          }
        });
      }

      // ── 11. Payments for PAID invoices ──────────────────────────────────────
      for (const [invObj, amt, method, ref, daysAgo] of [
        [inv1, 45000, 'NEFT', 'NEFT2024101001', -18],
        [inv2, 72000, 'RTGS', 'RTGS2024092501', -14],
        [inv6, 85000, 'RTGS', 'RTGS2024091801', -8],
      ] as const) {
        const exists = await tx.payment.findFirst({ where: { invoiceId: invObj.id, companyId: co.id } });
        if (!exists) {
          await tx.payment.create({ data: { companyId: co.id, invoiceId: invObj.id, amount: amt, method, referenceNumber: ref, paymentDate: d(daysAgo as number) } });
        }
      }

      // ── 12. Lorry Receipts (6) ──────────────────────────────────────────────
      let seq = await tx.lrSequence.findFirst({ where: { companyId: co.id } });
      if (!seq) {
        seq = await tx.lrSequence.create({ data: { companyId: co.id, lastNumber: 999, financialYear: '2024-25' } });
      }

      const lrData = [
        { lrNum: 'LR-1000', loadId: load1.id, vehicleId: veh1.id, consignor: 'Tata Motors Pune', consignee: 'Tata Motors Delhi', from: 'Pune', to: 'New Delhi', goods: 'Auto Parts & Accessories', pkgs: 150, freight: 40000, hamali: 1000, other: 500, gst: 3500, total: 45000, payType: 'TO_PAY', vNum: 'MH-04-AB-1234' },
        { lrNum: 'LR-1001', loadId: load2.id, vehicleId: veh2.id, consignor: 'Reliance Mumbai DC', consignee: 'Reliance Bengaluru DC', from: 'Mumbai', to: 'Bengaluru', goods: 'FMCG & General Merchandise', pkgs: 300, freight: 64000, hamali: 2000, other: 1000, gst: 5000, total: 72000, payType: 'PAID', vNum: 'DL-1L-BC-9876' },
        { lrNum: 'LR-1002', loadId: load3.id, vehicleId: veh3.id, consignor: 'Amul Anand', consignee: 'Amul Delhi', from: 'Anand', to: 'New Delhi', goods: 'Dairy Products (Chilled)', pkgs: 200, freight: 49000, hamali: 1500, other: 800, gst: 3700, total: 55000, payType: 'TO_PAY', vNum: 'GJ-01-AB-5678' },
        { lrNum: 'LR-1003', loadId: load4.id, vehicleId: veh4.id, consignor: 'Asian Paints Jaipur', consignee: 'Asian Paints Delhi', from: 'Jaipur', to: 'New Delhi', goods: 'Paints & Coatings', pkgs: 80, freight: 34000, hamali: 800, other: 400, gst: 2800, total: 38000, payType: 'PAID', vNum: 'RJ-14-CD-2233' },
        { lrNum: 'LR-1004', loadId: load5.id, vehicleId: veh5.id, consignor: 'Havells Pune', consignee: 'Havells Nagpur', from: 'Pune', to: 'Nagpur', goods: 'Electrical Switchgear', pkgs: 60, freight: 16000, hamali: 500, other: 300, gst: 1200, total: 18000, payType: 'TO_PAY', vNum: 'TN-22-EF-9900' },
        { lrNum: 'LR-1005', loadId: load7.id, vehicleId: veh1.id, consignor: 'Reliance Ahmedabad', consignee: 'Reliance Surat', from: 'Ahmedabad', to: 'Surat', goods: 'Textile & Garments', pkgs: 450, freight: 76000, hamali: 2500, other: 1200, gst: 5300, total: 85000, payType: 'PAID', vNum: 'MH-04-AB-1234' },
      ];
      for (const lr of lrData) {
        await findOrCreate(
          () => tx.lorryReceipt.findFirst({ where: { lrNumber: lr.lrNum, companyId: co.id } }),
          () => tx.lorryReceipt.create({ data: { lrNumber: lr.lrNum, companyId: co.id, loadId: lr.loadId, vehicleId: lr.vehicleId, vehicleNumber: lr.vNum, consignorName: lr.consignor, consigneeName: lr.consignee, fromStation: lr.from, toStation: lr.to, goodsDescription: lr.goods, packagesCount: lr.pkgs, freightAmount: lr.freight, hamaliCharges: lr.hamali, otherCharges: lr.other, gstAmount: lr.gst, totalAmount: lr.total, paymentType: lr.payType, status: 'GENERATED' } }),
        );
      }

      // ── 13. Expenses per trip ───────────────────────────────────────────────
      const expensesData = [
        { tripId: trip1.id, driverId: drv1.id, type: 'FUEL', amount: 8500, date: d(-1) },
        { tripId: trip1.id, driverId: drv1.id, type: 'TOLL', amount: 1200, date: d(-1) },
        { tripId: trip2.id, driverId: drv2.id, type: 'FUEL', amount: 7200, date: d(-5) },
        { tripId: trip2.id, driverId: drv2.id, type: 'TOLL', amount: 2400, date: d(-5) },
        { tripId: trip3.id, driverId: drv3.id, type: 'FUEL', amount: 12000, date: d(-2) },
        { tripId: trip3.id, driverId: drv3.id, type: 'TOLL', amount: 1800, date: d(-2) },
        { tripId: trip5.id, driverId: drv5.id, type: 'FUEL', amount: 16000, date: d(-10) },
        { tripId: trip5.id, driverId: drv5.id, type: 'REPAIR', amount: 8500, date: d(-9) },
        { tripId: trip5.id, driverId: drv5.id, type: 'OTHER', amount: 1500, date: d(-9) },
        { tripId: trip7.id, driverId: drv1.id, type: 'FUEL', amount: 9800, date: d(-15) },
        { tripId: trip7.id, driverId: drv1.id, type: 'TOLL', amount: 3200, date: d(-15) },
        { tripId: trip8.id, driverId: drv4.id, type: 'FUEL', amount: 6500, date: d(-1) },
      ];
      for (const exp of expensesData) {
        const { driverId, ...rest } = exp;
        const existing = await tx.expense.findFirst({ where: { tripId: exp.tripId, type: exp.type, amount: exp.amount, companyId: co.id } });
        if (!existing) {
          await tx.expense.create({ data: { companyId: co.id, driverId, ...rest, status: 'APPROVED' } });
        }
      }

      // ── 14. Location History ────────────────────────────────────────────────
      const locData = [
        { tripId: trip1.id, driverId: drv1.id, lat: 18.5204, lng: 73.8567, speed: 78 },
        { tripId: trip1.id, driverId: drv1.id, lat: 20.0059, lng: 76.1085, speed: 82 },
        { tripId: trip1.id, driverId: drv1.id, lat: 22.7196, lng: 75.8577, speed: 75 },
        { tripId: trip3.id, driverId: drv3.id, lat: 22.3072, lng: 73.1812, speed: 88 },
        { tripId: trip3.id, driverId: drv3.id, lat: 25.4484, lng: 74.6399, speed: 80 },
        { tripId: trip8.id, driverId: drv4.id, lat: 22.2999, lng: 70.8022, speed: 70 },
        { tripId: trip8.id, driverId: drv4.id, lat: 23.6945, lng: 72.3398, speed: 85 },
      ];
      for (const loc of locData) {
        const existing = await tx.locationHistory.findFirst({ where: { tripId: loc.tripId, driverId: loc.driverId, latitude: loc.lat } });
        if (!existing) {
          await tx.locationHistory.create({ data: { companyId: co.id, tripId: loc.tripId, driverId: loc.driverId, latitude: loc.lat, longitude: loc.lng, speed: loc.speed, heading: 5, accuracy: 5 } });
        }
      }

      // ── 15. Fuel Transactions ───────────────────────────────────────────────
      const fuelData = [
        { vehicleId: veh1.id, driverId: drv1.id, stationName: 'BPCL Pune Bypass', gallons: 150, totalCost: 13500, pricePerGallon: 90, odometer: 45200 },
        { vehicleId: veh2.id, driverId: drv2.id, stationName: 'HP Nashik Highway', gallons: 130, totalCost: 11700, pricePerGallon: 90, odometer: 38900 },
        { vehicleId: veh3.id, driverId: drv3.id, stationName: 'IOC Ahmedabad', gallons: 200, totalCost: 18000, pricePerGallon: 90, odometer: 62100 },
        { vehicleId: veh5.id, driverId: drv5.id, stationName: 'BPCL Pune Nagar Rd', gallons: 178, totalCost: 16000, pricePerGallon: 90, odometer: 29800 },
        { vehicleId: veh4.id, driverId: drv4.id, stationName: 'HP Jaipur Bypass', gallons: 110, totalCost: 9900, pricePerGallon: 90, odometer: 51000 },
      ];
      for (const f of fuelData) {
        const existing = await tx.fuelTransaction.findFirst({ where: { vehicleId: f.vehicleId, stationName: f.stationName, companyId: co.id } });
        if (!existing) {
          await tx.fuelTransaction.create({ data: { companyId: co.id, vehicleId: f.vehicleId, driverId: f.driverId, stationName: f.stationName, gallons: f.gallons, totalCost: f.totalCost, pricePerGallon: f.pricePerGallon, odometer: f.odometer, transactionTime: d(-3), anomalyDetected: false } });
        }
      }

      // ── 16. Maintenance & Tyres (Phase 2) ─────────────────────────────────────────
      const maintJobs = [
        { vehicleId: veh1.id, type: 'PREVENTIVE', status: 'COMPLETED', openedAt: d(-30), closedAt: d(-28), labourCost: 2500, odometer: 42000, itemDesc: 'Oil change + filter', itemCost: 6000 },
        { vehicleId: veh5.id, type: 'BREAKDOWN', status: 'COMPLETED', openedAt: d(-9), closedAt: d(-9), labourCost: 4000, odometer: 29500, itemDesc: 'Emergency brake repair', itemCost: 14500 },
      ];
      for (const mj of maintJobs) {
        const existing = await tx.maintenanceJob.findFirst({ where: { vehicleId: mj.vehicleId, type: mj.type, companyId: co.id } });
        if (!existing) {
          const newMj = await tx.maintenanceJob.create({ data: { companyId: co.id, vehicleId: mj.vehicleId, type: mj.type, status: mj.status, openedAt: mj.openedAt, closedAt: mj.closedAt, labourCost: mj.labourCost, odometer: mj.odometer } });
          await tx.jobPart.create({ data: { companyId: co.id, maintenanceJobId: newMj.id, name: mj.itemDesc, qty: 1, unitCost: mj.itemCost, amount: mj.itemCost } });
        }
      }

      const tyres = [
        { vehicleId: veh1.id, position: 'FL', serialNo: 'TYR-MRF-1001', brand: 'MRF', fittedAtKm: 10000, expectedLifeKm: 80000, cost: 15000 },
        { vehicleId: veh1.id, position: 'FR', serialNo: 'TYR-APL-1002', brand: 'Apollo', fittedAtKm: 12000, expectedLifeKm: 80000, cost: 14500 },
        { vehicleId: veh2.id, position: 'RL1', serialNo: 'TYR-CEAT-2001', brand: 'CEAT', fittedAtKm: 5000, expectedLifeKm: 75000, cost: 16000 },
      ];
      for (const tyr of tyres) {
        await tx.tyre.upsert({
          where: { serialNo: tyr.serialNo },
          update: { companyId: co.id, vehicleId: tyr.vehicleId, position: tyr.position, brand: tyr.brand, fittedAtKm: tyr.fittedAtKm, expectedLifeKm: tyr.expectedLifeKm, cost: tyr.cost },
          create: { companyId: co.id, vehicleId: tyr.vehicleId, position: tyr.position, serialNo: tyr.serialNo, brand: tyr.brand, fittedAtKm: tyr.fittedAtKm, expectedLifeKm: tyr.expectedLifeKm, cost: tyr.cost }
        });
      }

      // ── 16.5 Phase 2 Module Seed (TripDesk, FuelEntry, LoadingEvent, TripExpense) ─
      const tripDesks = [
        { tripId: trip1.id, desk: 'DISPATCH', status: 'DONE', notes: 'Dispatched on time' },
        { tripId: trip2.id, desk: 'DOCS', status: 'DONE', notes: 'POD received and verified' },
        { tripId: trip3.id, desk: 'FASTAG', status: 'PENDING', notes: 'Toll top-up required' },
      ];
      for (const td of tripDesks) {
        await tx.tripDesk.create({ data: { companyId: co.id, tripId: td.tripId, desk: td.desk, status: td.status, notes: td.notes } });
      }

      const fuelEntries = [
        { tripId: trip1.id, vehicleId: veh1.id, driverId: drv1.id, litres: 150, amount: 13500, pump: 'BPCL Pune Bypass', expectedLitres: 145, variancePct: 3.4 },
        { tripId: trip2.id, vehicleId: veh2.id, driverId: drv2.id, litres: 130, amount: 11700, pump: 'HP Nashik Highway', expectedLitres: 130, variancePct: 0 },
      ];
      for (const fe of fuelEntries) {
        await tx.fuelEntry.create({ data: { companyId: co.id, tripId: fe.tripId, vehicleId: fe.vehicleId, driverId: fe.driverId, litres: fe.litres, amount: fe.amount, pump: fe.pump, expectedLitres: fe.expectedLitres, variancePct: fe.variancePct } });
      }

      const loadEvents = [
        { tripId: trip1.id, type: 'LOAD', point: 'Tata Motors Pune', timeIn: d(-1), timeOut: d(-1), weightIn: 18.5, weightOut: 18.5, hamaliCost: 500, detentionHrs: 1.5, detentionCharge: 0 },
        { tripId: trip2.id, type: 'UNLOAD', point: 'Reliance BLR', timeIn: d(-3), timeOut: d(-3), weightIn: 14.0, weightOut: 14.0, hamaliCost: 800, detentionHrs: 2, detentionCharge: 1500 },
      ];
      for (const le of loadEvents) {
        await tx.loadingEvent.create({ data: { companyId: co.id, tripId: le.tripId, type: le.type, point: le.point, timeIn: le.timeIn, timeOut: le.timeOut, weightIn: le.weightIn, weightOut: le.weightOut, hamaliCost: le.hamaliCost, detentionHrs: le.detentionHrs, detentionCharge: le.detentionCharge } });
      }

      const tripExpenses = [
        { tripId: trip1.id, category: 'BHATTA', amount: 2000, note: 'Driver daily allowance' },
        { tripId: trip2.id, category: 'TOLL', amount: 1800, note: 'FASTag toll charges' },
      ];
      for (const te of tripExpenses) {
        await tx.tripExpense.create({ data: { companyId: co.id, tripId: te.tripId, category: te.category, amount: te.amount, note: te.note } });
      }

      // ── 17. Vehicle Permits ─────────────────────────────────────────────────
      const permitData = [
        { vehicleId: veh1.id, permitType: 'NATIONAL_PERMIT', permitNumber: 'NP-MH-2024-00123', issuedDate: d(-180), expiryDate: d(185), issuingAuthority: 'Maharashtra RTO' },
        { vehicleId: veh2.id, permitType: 'NATIONAL_PERMIT', permitNumber: 'NP-DL-2024-00456', issuedDate: d(-90), expiryDate: d(275), issuingAuthority: 'Delhi RTO' },
        { vehicleId: veh3.id, permitType: 'NATIONAL_PERMIT', permitNumber: 'NP-GJ-2024-00789', issuedDate: d(-60), expiryDate: d(305), issuingAuthority: 'Gujarat RTO' },
        { vehicleId: veh4.id, permitType: 'STATE_PERMIT', permitNumber: 'SP-RJ-2024-00111', issuedDate: d(-120), expiryDate: d(245), issuingAuthority: 'Rajasthan RTO' },
        { vehicleId: veh1.id, permitType: 'FITNESS_CERTIFICATE', permitNumber: 'FC-MH-2024-55001', issuedDate: d(-30), expiryDate: d(335), issuingAuthority: 'Maharashtra Motor Vehicles Dept' },
      ];
      for (const p of permitData) {
        const existing = await tx.vehiclePermit.findFirst({ where: { vehicleId: p.vehicleId, permitNumber: p.permitNumber, companyId: co.id } });
        if (!existing) {
          await tx.vehiclePermit.create({ data: { companyId: co.id, vehicleId: p.vehicleId, permitType: p.permitType, permitNumber: p.permitNumber, issuedDate: p.issuedDate, expiryDate: p.expiryDate, issuingAuthority: p.issuingAuthority, status: 'ACTIVE' } });
        }
      }

      // ── 18. FastTag Account + Toll Transactions ─────────────────────────────
      const tollAccount = await findOrCreate(
        () => tx.tollAccount.findFirst({ where: { companyId: co.id } }),
        () => tx.tollAccount.create({ data: { companyId: co.id, provider: 'ICICI FASTag', accountNumber: 'FTAG-ICICI-2024-001', walletBalance: 45000, isActive: true } }),
      );
      const tollTxData = [
        { vehicleId: veh1.id, tripId: trip1.id, tollPlazaName: 'Khopoli Toll', amount: 285, transactionDate: d(-1), referenceNo: 'FTAG2024100100001' },
        { vehicleId: veh1.id, tripId: trip1.id, tollPlazaName: 'Surjapur Toll', amount: 340, transactionDate: d(-1), referenceNo: 'FTAG2024100100002' },
        { vehicleId: veh3.id, tripId: trip3.id, tollPlazaName: 'Vadodara Toll', amount: 225, transactionDate: d(-2), referenceNo: 'FTAG2024100200001' },
        { vehicleId: veh4.id, tripId: trip4.id, tollPlazaName: 'Jaipur-Delhi NH', amount: 195, transactionDate: d(-8), referenceNo: 'FTAG2024092500001' },
        { vehicleId: veh5.id, tripId: trip5.id, tollPlazaName: 'Pune-Nagpur Expressway', amount: 520, transactionDate: d(-10), referenceNo: 'FTAG2024092300001' },
      ];
      for (const tt of tollTxData) {
        const existing = await tx.tollTransaction.findFirst({ where: { referenceNo: tt.referenceNo, companyId: co.id } });
        if (!existing) {
          await tx.tollTransaction.create({ data: { companyId: co.id, accountId: tollAccount.id, vehicleId: tt.vehicleId, tripId: tt.tripId, tollPlazaName: tt.tollPlazaName, amount: tt.amount, transactionDate: tt.transactionDate, referenceNo: tt.referenceNo } });
        }
      }

      // ── 19. GST Tax Rules ────────────────────────────────────────────────────
      const gstRules = [
        { hsnSacCode: '9965', description: 'Goods Transport by Road (GTA)', cgstRate: 2.5, sgstRate: 2.5, igstRate: 5, effectiveFrom: new Date('2024-04-01') },
        { hsnSacCode: '9965-FCM', description: 'GTA Forward Charge Mechanism', cgstRate: 6, sgstRate: 6, igstRate: 12, effectiveFrom: new Date('2024-04-01') },
        { hsnSacCode: '9997', description: 'Warehousing & Storage Services', cgstRate: 9, sgstRate: 9, igstRate: 18, effectiveFrom: new Date('2024-04-01') },
        { hsnSacCode: '8704', description: 'Commercial Vehicles (Goods Transport)', cgstRate: 14, sgstRate: 14, igstRate: 28, effectiveFrom: new Date('2024-04-01') },
      ];
      for (const rule of gstRules) {
        const existing = await tx.gstTaxRule.findFirst({ where: { companyId: co.id, hsnSacCode: rule.hsnSacCode } });
        if (!existing) {
          await tx.gstTaxRule.create({ data: { companyId: co.id, hsnSacCode: rule.hsnSacCode, description: rule.description, cgstRate: rule.cgstRate, sgstRate: rule.sgstRate, igstRate: rule.igstRate, effectiveFrom: rule.effectiveFrom } });
        }
      }

      // ── 20. Warehouse + Inventory ───────────────────────────────────────────
      const warehouse = await findOrCreate(
        () => tx.warehouse.findFirst({ where: { code: 'WH-MUM-001', companyId: co.id } }),
        () => tx.warehouse.create({ data: { companyId: co.id, name: 'Mumbai Central Warehouse', code: 'WH-MUM-001', address: 'MIDC Andheri', city: 'Mumbai', state: 'Maharashtra', capacityPallets: 2000, operatingHours: '06:00-22:00', active: true } }),
      );
      const invItems = [
        { sku: 'SKU-AUTO-001', description: 'Tata Motors Spare Parts', qty: 450, uom: 'CARTON' },
        { sku: 'SKU-FMCG-001', description: 'Reliance FMCG Packs', qty: 1200, uom: 'CARTON' },
        { sku: 'SKU-DAIRY-001', description: 'Amul Butter & Cheese (Chilled)', qty: 300, uom: 'CARTON' },
        { sku: 'SKU-PAINT-001', description: 'Asian Paints Tins', qty: 180, uom: 'PALLET' },
        { sku: 'SKU-ELEC-001', description: 'Havells Switchgear Boxes', qty: 220, uom: 'CARTON' },
      ];
      for (const item of invItems) {
        const existing = await tx.inventoryItem.findFirst({ where: { sku: item.sku, warehouseId: warehouse.id } });
        if (!existing) {
          await tx.inventoryItem.create({ data: { companyId: co.id, warehouseId: warehouse.id, sku: item.sku, description: item.description, quantity: item.qty, unitOfMeasure: item.uom, status: 'AVAILABLE', receivedAt: d(-5) } });
        }
      }

      // ── 21. Vendor Bills ────────────────────────────────────────────────────
      const billData = [
        { vendorId: vend1.id, billNumber: 'VB-SHARMA-001', amount: 38000, dueDate: d(10), status: 'PENDING' },
        { vendorId: vend2.id, billNumber: 'VB-SPEEDWAY-001', amount: 65000, dueDate: d(-5), status: 'OVERDUE' },
        { vendorId: vend3.id, billNumber: 'VB-RAJMOV-001', amount: 22000, dueDate: d(20), status: 'PAID' },
        { vendorId: vend4.id, billNumber: 'VB-KRISHNA-001', amount: 41000, dueDate: d(15), status: 'PENDING' },
      ];
      for (const b of billData) {
        const existing = await tx.vendorBill.findFirst({ where: { billNumber: b.billNumber, companyId: co.id } });
        if (!existing) {
          await tx.vendorBill.create({ data: { companyId: co.id, vendorId: b.vendorId, billNumber: b.billNumber, amount: b.amount, dueDate: b.dueDate, status: b.status } });
        }
      }

      // ── 22. Documents (POD + E-Way Bills) ───────────────────────────────────
      const docData = [
        { loadId: load2.id, type: 'POD', fileName: 'pod-lod-1002-reliance.pdf', fileUrl: 'https://storage.parilink.in/docs/pod-lod-1002.pdf' },
        { loadId: load4.id, type: 'POD', fileName: 'pod-lod-1004-asianpaints.pdf', fileUrl: 'https://storage.parilink.in/docs/pod-lod-1004.pdf' },
        { loadId: load5.id, type: 'POD', fileName: 'pod-lod-1005-havells.pdf', fileUrl: 'https://storage.parilink.in/docs/pod-lod-1005.pdf' },
        { loadId: load1.id, type: 'EWAY_BILL', fileName: 'ewb-lod-1001.pdf', fileUrl: 'https://storage.parilink.in/docs/ewb-lod-1001.pdf' },
        { loadId: load3.id, type: 'EWAY_BILL', fileName: 'ewb-lod-1003.pdf', fileUrl: 'https://storage.parilink.in/docs/ewb-lod-1003.pdf' },
      ];
      for (const doc of docData) {
        const existing = await tx.document.findFirst({ where: { loadId: doc.loadId, type: doc.type, companyId: co.id } });
        if (!existing) {
          await tx.document.create({ data: { companyId: co.id, loadId: doc.loadId, type: doc.type, fileName: doc.fileName, fileUrl: doc.fileUrl, uploadedById: adminUser.id, mimeType: 'application/pdf', sizeBytes: 45000, status: 'ACTIVE' } });
        }
      }

      // ── 23. Notifications ────────────────────────────────────────────────────
      const notifData = [
        { type: 'FINANCE', priority: 'HIGH', title: 'Invoice INV-IND-1004 OVERDUE', body: 'Asian Paints invoice of Rs.38,000 is 5 days overdue. Action required.', entityType: 'Invoice', entityId: inv4.id, actionUrl: '/payments' },
        { type: 'DISPATCH', priority: 'HIGH', title: 'TRP-IND-1001 Approaching Delhi', body: 'Vehicle MH-04-AB-1234 (Raju Yadav) is 80 km from Delhi destination. ETA 2hrs.', entityType: 'Trip', entityId: trip1.id, actionUrl: '/tracking' },
        { type: 'FLEET', priority: 'NORMAL', title: 'Vehicle TN-22-EF-9900 Service Due', body: 'Preventive maintenance scheduled for TN-22-EF-9900 in 5 days.', entityType: 'Vehicle', entityId: veh5.id, actionUrl: '/fleet-health' },
        { type: 'SYSTEM', priority: 'NORMAL', title: 'Fuel Anomaly Detected on TRP-IND-1005', body: 'Unusually high fuel consumption on TRP-IND-1005 (Pune to Nagpur). Please review.', entityType: 'Trip', entityId: trip5.id, actionUrl: '/fleet-health' },
        { type: 'FINANCE', priority: 'NORMAL', title: 'Payment Received INV-IND-1006', body: 'Reliance Retail paid Rs.85,000 via RTGS. Ledger updated.', entityType: 'Invoice', entityId: inv6.id, actionUrl: '/ledger' },
      ];
      for (const n of notifData) {
        const existing = await tx.notification.findFirst({ where: { companyId: co.id, title: n.title, userId: adminUser.id } });
        if (!existing) {
          await tx.notification.create({ data: { companyId: co.id, userId: adminUser.id, isRead: false, type: n.type, priority: n.priority, title: n.title, body: n.body, entityType: n.entityType, entityId: n.entityId, actionUrl: n.actionUrl } });
        }
      }

      // ── 24. Announcements ────────────────────────────────────────────────────
      const annData = [
        { title: 'Diwali Bonus Policy FY2024-25', content: 'All drivers and operations staff eligible for performance bonus before Diwali. Check payroll module for details.', priority: 'HIGH', status: 'PUBLISHED' },
        { title: 'New Ahmedabad-Surat Express Lane Launched', content: 'PariLink now covers direct Ahmedabad to Surat corridor with 6-hour guaranteed delivery. Rates effective 1 Nov 2024.', priority: 'NORMAL', status: 'PUBLISHED' },
        { title: 'Mandatory EV Driver Training Dec 2024', content: 'All drivers must complete the EV operations training module before 31 December 2024.', priority: 'NORMAL', status: 'PUBLISHED' },
      ];
      for (const a of annData) {
        const existing = await tx.announcement.findFirst({ where: { companyId: co.id, title: a.title } });
        if (!existing) {
          await tx.announcement.create({ data: { companyId: co.id, title: a.title, content: a.content, priority: a.priority, status: a.status } });
        }
      }

      // ── 25. Driver Attendance (last 7 days) ─────────────────────────────────
      const allDrivers = [drv1, drv2, drv3, drv4, drv5, drv6];
      for (const drv of allDrivers) {
        for (let i = 6; i >= 0; i--) {
          const date = d(-i);
          const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const existing = await tx.driverAttendance.findFirst({ where: { driverId: drv.id, companyId: co.id, date: dateOnly } });
          if (!existing) {
            await tx.driverAttendance.create({
              data: {
                companyId: co.id, driverId: drv.id, date: dateOnly,
                status: i === 4 ? 'ABSENT' : 'PRESENT',
                checkInTime: i === 4 ? null : new Date(dateOnly.getTime() + 6 * 3600000),
                checkOutTime: i === 4 ? null : new Date(dateOnly.getTime() + 18 * 3600000),
              },
            });
          }
        }
      }

      // ── 26. Inbox Thread + Message ──────────────────────────────────────────
      const inboxThread = await findOrCreate(
        () => tx.inboxThread.findFirst({ where: { companyId: co.id } }),
        () => tx.inboxThread.create({ data: { companyId: co.id, subject: 'Asian Paints Invoice INV-IND-1004 Payment Follow-up', participantIds: [adminUser.id] } }),
      );
      const msgExists = await tx.inboxMessage.findFirst({ where: { threadId: inboxThread.id } });
      if (!msgExists) {
        await tx.inboxMessage.create({ data: { threadId: inboxThread.id, senderId: adminUser.id, content: 'Hi team, following up on the overdue invoice INV-IND-1004 for Rs.38,000 from Asian Paints. Please ensure payment is cleared by EOD today.', readBy: [] } });
      }

      // ── 27. Dev OAuthClient ─────────────────────────────────────────────────
      await tx.oAuthClient.upsert({
        where:  { clientId: DEV_CLIENT_ID },
        update: {},
        create: {
          companyId: co.id, clientId: DEV_CLIENT_ID, clientSecret: sha256(DEV_CLIENT_SECRET),
          name: 'Dev Local Client (seed)', description: 'Created by seed.ts for local development.',
          scopes: ['loads:read', 'loads:write', 'fleet:read'],
          redirectUris: [], grantTypes: ['client_credentials'], isActive: true,
        },
      });

      // ── 28. Chart of Accounts & General Ledger Journal Entries ───────────────
      const accountsDef = [
        { code: '1000', name: 'HDFC Current Account (Bank)', type: 'ASSET' },
        { code: '1010', name: 'Petty Cash & Driver Imprest', type: 'ASSET' },
        { code: '1200', name: 'Accounts Receivable (Trade Debtors)', type: 'ASSET' },
        { code: '2000', name: 'Accounts Payable (Trade Creditors)', type: 'LIABILITY' },
        { code: '2100', name: 'GST Output Liability (5% GTA Payable)', type: 'LIABILITY' },
        { code: '3000', name: 'Retained Earnings & Owner Equity', type: 'EQUITY' },
        { code: '4000', name: 'Freight Haulage Revenue', type: 'REVENUE' },
        { code: '4100', name: 'Handling & Value-Add Revenue', type: 'REVENUE' },
        { code: '5000', name: 'Diesel & Fuel Expenses', type: 'EXPENSE' },
        { code: '5100', name: 'NHAI FASTag Toll Expenses', type: 'EXPENSE' },
        { code: '5200', name: 'Fleet Maintenance & Repairs', type: 'EXPENSE' },
        { code: '5300', name: 'Driver Trip Allowance & Bata', type: 'EXPENSE' },
      ];

      const acctMap: Record<string, any> = {};
      for (const a of accountsDef) {
        acctMap[a.code] = await tx.account.upsert({
          where: { companyId_code: { companyId: co.id, code: a.code } },
          update: { name: a.name, type: a.type },
          create: { companyId: co.id, code: a.code, name: a.name, type: a.type },
        });
      }

      // Initial Balance: Capital / Cash Injection
      const existingCap = await tx.journalEntry.findFirst({ where: { companyId: co.id, referenceType: 'CAPITAL' } });
      if (!existingCap) {
        await tx.journalEntry.create({
          data: {
            companyId: co.id,
            description: 'Opening Capital & Working Capital Reserve',
            referenceType: 'CAPITAL',
            date: d(-60),
            status: 'POSTED',
            lines: {
              create: [
                { companyId: co.id, accountId: acctMap['1000'].id, debit: 500000, credit: 0, description: 'Bank Opening Balance' },
                { companyId: co.id, accountId: acctMap['3000'].id, debit: 0, credit: 500000, description: 'Shareholders Equity' },
              ],
            },
          },
        });
      }

      // Post Invoices to General Ledger
      const invoiceJournals = [
        { inv: inv1, subtotal: 42857, tax: 2143, date: d(-20) },
        { inv: inv2, subtotal: 68571, tax: 3429, date: d(-15) },
        { inv: inv3, subtotal: 52381, tax: 2619, date: d(-5) },
        { inv: inv4, subtotal: 36190, tax: 1810, date: d(-12) },
        { inv: inv5, subtotal: 17143, tax: 857, date: d(-10) },
        { inv: inv6, subtotal: 80952, tax: 4048, date: d(-14) },
      ];

      for (const ij of invoiceJournals) {
        const existingJ = await tx.journalEntry.findFirst({ where: { companyId: co.id, referenceType: 'INVOICE', referenceId: ij.inv.id } });
        if (!existingJ) {
          await tx.journalEntry.create({
            data: {
              companyId: co.id,
              referenceType: 'INVOICE',
              referenceId: ij.inv.id,
              description: `Sales Invoice ${ij.inv.invoiceNumber} freight billing`,
              date: ij.date,
              status: 'POSTED',
              lines: {
                create: [
                  { companyId: co.id, accountId: acctMap['1200'].id, debit: ij.inv.amount, credit: 0, description: 'Trade Debtors' },
                  { companyId: co.id, accountId: acctMap['4000'].id, debit: 0, credit: ij.subtotal, description: 'Freight Haulage Revenue' },
                  { companyId: co.id, accountId: acctMap['2100'].id, debit: 0, credit: ij.tax, description: 'GST 5% GTA Output Payable' },
                ],
              },
            },
          });
        }
      }

      // Post Payment Receipts to General Ledger
      const paymentJournals = [
        { inv: inv1, amount: 45000, date: d(-18), ref: 'NEFT2024101001' },
        { inv: inv2, amount: 72000, date: d(-14), ref: 'RTGS2024092501' },
        { inv: inv6, amount: 85000, date: d(-8), ref: 'RTGS2024091801' },
      ];

      for (const pj of paymentJournals) {
        const existingP = await tx.journalEntry.findFirst({ where: { companyId: co.id, referenceType: 'PAYMENT', description: { contains: pj.inv.invoiceNumber } } });
        if (!existingP) {
          await tx.journalEntry.create({
            data: {
              companyId: co.id,
              referenceType: 'PAYMENT',
              referenceId: pj.inv.id,
              description: `Payment clearance for ${pj.inv.invoiceNumber} (Ref: ${pj.ref})`,
              date: pj.date,
              status: 'POSTED',
              lines: {
                create: [
                  { companyId: co.id, accountId: acctMap['1000'].id, debit: pj.amount, credit: 0, description: 'HDFC Bank Receipt' },
                  { companyId: co.id, accountId: acctMap['1200'].id, debit: 0, credit: pj.amount, description: 'AR Account Clearance' },
                ],
              },
            },
          });
        }
      }

      // Post Operational Expenses to General Ledger
      const glExpenses = [
        { code: '5000', amount: 8500, desc: 'Trip 1001 BPCL Diesel', date: d(-1) },
        { code: '5100', amount: 1200, desc: 'Trip 1001 FASTag Toll', date: d(-1) },
        { code: '5000', amount: 7200, desc: 'Trip 1002 HPCL Diesel', date: d(-5) },
        { code: '5100', amount: 2400, desc: 'Trip 1002 FASTag Toll', date: d(-5) },
        { code: '5000', amount: 12000, desc: 'Trip 1003 IOCL Diesel', date: d(-2) },
        { code: '5100', amount: 1800, desc: 'Trip 1003 FASTag Toll', date: d(-2) },
        { code: '5000', amount: 16000, desc: 'Trip 1005 Express Diesel', date: d(-10) },
        { code: '5200', amount: 8500, desc: 'Trip 1005 Emergency Brake & Tyre Repair', date: d(-9) },
        { code: '5300', amount: 3500, desc: 'Trip 1005 Driver Bata & Night Halt', date: d(-9) },
        { code: '5000', amount: 9800, desc: 'Trip 1007 Diesel Ahmedabad-Surat', date: d(-15) },
        { code: '5100', amount: 3200, desc: 'Trip 1007 Express Toll', date: d(-15) },
        { code: '5000', amount: 6500, desc: 'Trip 1008 Fuel Rajkot-Jaipur', date: d(-1) },
      ];

      for (const [idx, ge] of glExpenses.entries()) {
        const existingExpJ = await tx.journalEntry.findFirst({ where: { companyId: co.id, referenceType: 'EXPENSE', description: ge.desc } });
        if (!existingExpJ) {
          await tx.journalEntry.create({
            data: {
              companyId: co.id,
              referenceType: 'EXPENSE',
              referenceId: `EXP-SEED-${idx + 1}`,
              description: ge.desc,
              date: ge.date,
              status: 'POSTED',
              lines: {
                create: [
                  { companyId: co.id, accountId: acctMap[ge.code].id, debit: ge.amount, credit: 0, description: ge.desc },
                  { companyId: co.id, accountId: acctMap['1000'].id, debit: 0, credit: ge.amount, description: 'Bank Settlement' },
                ],
              },
            },
          });
        }
      }

      // ── 29. Driver Scores ───────────────────────────────────────────────────
      const driverScores = [
        { driverId: drv1.id, tripId: trip2.id, onTime: true, podUploaded: true, fuelScore: 95, damageScore: 100, behaviourScore: 90, total: 95 },
        { driverId: drv2.id, tripId: trip4.id, onTime: false, podUploaded: true, fuelScore: 88, damageScore: 95, behaviourScore: 85, total: 89 },
        { driverId: drv4.id, tripId: trip5.id, onTime: true, podUploaded: false, fuelScore: 92, damageScore: 90, behaviourScore: 88, total: 90 },
      ];
      for (const ds of driverScores) {
        await tx.driverScore.create({ data: { companyId: co.id, driverId: ds.driverId, tripId: ds.tripId, onTime: ds.onTime, podUploaded: ds.podUploaded, fuelScore: ds.fuelScore, damageScore: ds.damageScore, behaviourScore: ds.behaviourScore, total: ds.total } });
      }

      // ── 30. Vehicle Telemetry & Live Locations ──────────────────────────────
      const vehicleTelemetryData = [
        { veh: veh1, lat: 28.5355, lng: 77.3910, speed: 58, heading: 350, odo: 452800, fuel: 72, engHrs: 6850, battery: 13.6, temp: 84 },
        { veh: veh2, lat: 13.0827, lng: 77.5877, speed: 0, heading: 180, odo: 389400, fuel: 84, engHrs: 5420, battery: 13.4, temp: 78 },
        { veh: veh3, lat: 26.9124, lng: 75.7873, speed: 64, heading: 45, odo: 621500, fuel: 61, engHrs: 9200, battery: 13.8, temp: 86 },
        { veh: veh4, lat: 28.6139, lng: 77.2090, speed: 0, heading: 90, odo: 512300, fuel: 78, engHrs: 7100, battery: 13.5, temp: 80 },
        { veh: veh5, lat: 21.1458, lng: 79.0882, speed: 0, heading: 270, odo: 298900, fuel: 52, engHrs: 3980, battery: 13.2, temp: 79 },
        { veh: veh6, lat: 12.9716, lng: 77.5946, speed: 48, heading: 220, odo: 245100, fuel: 88, engHrs: 2840, battery: 13.7, temp: 82 },
      ];

      for (const vt of vehicleTelemetryData) {
        // VehicleLocation
        const existingLoc = await tx.vehicleLocation.findFirst({ where: { vehicleId: vt.veh.id, companyId: co.id } });
        if (!existingLoc) {
          await tx.vehicleLocation.create({
            data: {
              companyId: co.id,
              vehicleId: vt.veh.id,
              provider: 'TELTONIKA_FMB',
              providerVehicleId: vt.veh.licensePlate,
              latitude: vt.lat,
              longitude: vt.lng,
              speed: vt.speed,
              heading: vt.heading,
              odometer: vt.odo,
              fuel: vt.fuel,
              engineHours: vt.engHrs,
              ignition: vt.speed > 0,
              gpsTimestamp: new Date(),
            },
          });
        }
        // VehicleTelemetry
        const existingTelem = await tx.vehicleTelemetry.findFirst({ where: { vehicleId: vt.veh.id, companyId: co.id } });
        if (!existingTelem) {
          await tx.vehicleTelemetry.create({
            data: {
              companyId: co.id,
              vehicleId: vt.veh.id,
              odometer: vt.odo,
              fuelLevel: vt.fuel,
              engineHours: vt.engHrs,
              batteryVolts: vt.battery,
              coolantTemp: vt.temp,
              ignition: vt.speed > 0,
              timestamp: new Date(),
            },
          });
        }
      }

      console.log(`
✅ SEEDED SUCCESSFULLY:
   Company:         1
   Branches:        3
   Customers:       5  (Tata Motors, Reliance, Amul, Asian Paints, Havells)
   Vendors:         5
   Drivers:         6
   Vehicles:        6  (Tata Prima, Ashok Leyland, Eicher, BharatBenz, Mahindra)
   Trips:           8  (3 IN_TRANSIT, 3 COMPLETED, 1 PLANNED, 1 COMPLETED-LOSS)
   Loads:           8  (lanes: Pune->Delhi, Mumbai->BLR, Anand->Delhi, Jaipur->Delhi, Pune->Nagpur LOSS, Chennai->BLR, Ahm->Surat, Rajkot->Jaipur)
   Invoices:        6  (PAID x3, ISSUED x2, OVERDUE x1)
   Payments:        3
   Lorry Receipts:  6
   Expenses:        12
   Fuel Tx:         5
   Work Orders:     4  (1 breakdown on loss trip veh)
   Vehicle Permits: 5
   FASTag Txns:     5
   GST Rules:       4
   Warehouse:       1  (WH-MUM-001, 5 inventory items)
   Vendor Bills:    4  (1 OVERDUE)
   Documents/POD:   5
   Notifications:   5
   Announcements:   3
   Attendance:      6 drivers x 7 days = 42 rows
   Inbox Thread:    1  (+1 message)
`);
    },
    { timeout: 90000 },
  );
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
