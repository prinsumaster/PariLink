// @ts-nocheck
/**
 * prisma/seed.ts — Idempotent demo seed (INDIAN DATA)
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

async function main() {
  console.log('🌱 Seeding database with Indian Demo Data...');

  await prisma.$transaction(async (tx: any) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;

    // ── 1. Company ─────────────────────────────────────────────────────────
    const primaryCompany = await findOrCreate(
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
      where:  { companyId: primaryCompany.id },
      update: { currency: 'INR', timezone: 'Asia/Kolkata' },
      create: { companyId: primaryCompany.id, onboardingCompleted: true, timezone: 'Asia/Kolkata', currency: 'INR' },
    });

    // ── 2. Branches ────────────────────────────────────────────────────────
    const branch1 = await findOrCreate(
      () => tx.branch.findFirst({ where: { code: 'MUM-HQ', companyId: primaryCompany.id } }),
      () => tx.branch.create({ data: { companyId: primaryCompany.id, name: 'Mumbai HQ', code: 'MUM-HQ', city: 'Mumbai', state: 'Maharashtra', country: 'India' } })
    );
    const branch2 = await findOrCreate(
      () => tx.branch.findFirst({ where: { code: 'DEL-01', companyId: primaryCompany.id } }),
      () => tx.branch.create({ data: { companyId: primaryCompany.id, name: 'Delhi NCR Hub', code: 'DEL-01', city: 'New Delhi', state: 'Delhi', country: 'India' } })
    );

    // ── 3. Role ────────────────────────────────────────────────────────────
    const adminRole = await findOrCreate(
      () => tx.role.findFirst({ where: { companyId: primaryCompany.id, name: 'SUPER_ADMIN' } }),
      () => tx.role.create({
        data: { name: 'SUPER_ADMIN', description: 'Full system access', permissions: ['*'], companyId: primaryCompany.id },
      }),
    );

    // ── 4. Admin User ──────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('password123', 10);
    await tx.user.upsert({
      where:  { email: 'admin@parilink.in' },
      update: { password: hashedPassword },
      create: {
        email: 'admin@parilink.in', password: hashedPassword,
        firstName: 'Vikram', lastName: 'Singh',
        roleId: adminRole.id, companyId: primaryCompany.id,
      },
    });

    // ── 5. Customers ───────────────────────────────────────────────────────
    const customer1 = await findOrCreate(
      () => tx.customer.findFirst({ where: { email: 'logistics@tatamotors.com', companyId: primaryCompany.id } }),
      () => tx.customer.create({ data: { name: 'Tata Motors', companyId: primaryCompany.id, email: 'logistics@tatamotors.com', phone: '+91-2266658282', status: 'ACTIVE' } }),
    );
    const customer2 = await findOrCreate(
      () => tx.customer.findFirst({ where: { email: 'supplychain@reliance.in', companyId: primaryCompany.id } }),
      () => tx.customer.create({ data: { name: 'Reliance Retail', companyId: primaryCompany.id, email: 'supplychain@reliance.in', phone: '+91-2222716000', status: 'ACTIVE' } }),
    );

    // ── 6. Vendors ─────────────────────────────────────────────────────────
    const vendor1 = await findOrCreate(
      () => tx.vendor.findFirst({ where: { email: 'vendor@sharmatransport.com', companyId: primaryCompany.id } }),
      () => tx.vendor.create({ data: { name: 'Sharma Transport Co.', companyId: primaryCompany.id, email: 'vendor@sharmatransport.com', phone: '+91-9988776655', type: 'CARRIER', status: 'ACTIVE' } }),
    );

    // ── 7. Drivers ─────────────────────────────────────────────────────────
    const driver1 = await findOrCreate(
      () => tx.driver.findFirst({ where: { licenseNumber: 'MH-04-2015-1234567', companyId: primaryCompany.id } }),
      () => tx.driver.create({ data: { firstName: 'Raju', lastName: 'Yadav', licenseNumber: 'MH-04-2015-1234567', status: 'ON_TRIP', companyId: primaryCompany.id } }),
    );
    const driver2 = await findOrCreate(
      () => tx.driver.findFirst({ where: { licenseNumber: 'DL-01-2018-7654321', companyId: primaryCompany.id } }),
      () => tx.driver.create({ data: { firstName: 'Amit', lastName: 'Kumar', licenseNumber: 'DL-01-2018-7654321', status: 'AVAILABLE', companyId: primaryCompany.id } }),
    );

    // ── 8. Vehicles ────────────────────────────────────────────────────────
    const vehicle1 = await findOrCreate(
      () => tx.vehicle.findFirst({ where: { licensePlate: 'MH-04-AB-1234', companyId: primaryCompany.id } }),
      () => tx.vehicle.create({ data: { make: 'Tata', model: 'Prima 4028.S', year: 2023, vin: 'TATAPRIMA1234567', licensePlate: 'MH-04-AB-1234', status: 'IN_SERVICE', type: 'TRUCK', companyId: primaryCompany.id } }),
    );
    const vehicle2 = await findOrCreate(
      () => tx.vehicle.findFirst({ where: { licensePlate: 'DL-1L-BC-9876', companyId: primaryCompany.id } }),
      () => tx.vehicle.create({ data: { make: 'Ashok Leyland', model: 'Dost+', year: 2022, vin: 'ASHOKDOST9876543', licensePlate: 'DL-1L-BC-9876', status: 'AVAILABLE', type: 'TRUCK', companyId: primaryCompany.id } }),
    );

    // ── 9. Trips ───────────────────────────────────────────────────────────
    const trip1 = await tx.trip.upsert({
      where:  { tripNumber: 'TRP-IND-1001' },
      update: {},
      create: { tripNumber: 'TRP-IND-1001', status: 'IN_TRANSIT', driverId: driver1.id, vehicleId: vehicle1.id, companyId: primaryCompany.id, startDate: new Date() },
    });

    // ── 10. Loads ──────────────────────────────────────────────────────────
    const load1 = await findOrCreate(
      () => tx.load.findFirst({ where: { referenceNumber: 'LOD-IND-1001', companyId: primaryCompany.id } }),
      () => tx.load.create({
        data: {
          referenceNumber: 'LOD-IND-1001', tripId: trip1.id, customerId: customer1.id, companyId: primaryCompany.id,
          originAddress: 'MIDC', originCity: 'Pune', originState: 'Maharashtra',
          destinationAddress: 'Okhla Ind Area', destinationCity: 'New Delhi', destinationState: 'Delhi',
          pickupDate: new Date(), deliveryDate: new Date(Date.now() + 86400000 * 2), rate: 45000.00, status: 'IN_TRANSIT',
        },
      }),
    );

    // ── 11. Invoices ───────────────────────────────────────────────────────
    await tx.invoice.upsert({
      where:  { companyId_invoiceNumber: { companyId: primaryCompany.id, invoiceNumber: 'INV-IND-1001' } },
      update: {},
      create: { invoiceNumber: 'INV-IND-1001', amount: 45000.00, status: 'ISSUED', dueDate: new Date(Date.now() + 15 * 86400000), loadId: load1.id, customerId: customer1.id, companyId: primaryCompany.id },
    });

    // ── 12. Lorry Receipts (LR) & Sequence ─────────────────────────────────
    let sequence = await tx.lrSequence.findFirst({ where: { companyId: primaryCompany.id } });
    if (!sequence) {
      sequence = await tx.lrSequence.create({ data: { companyId: primaryCompany.id, lastNumber: 999, financialYear: '2024-25' } });
    }
    const lr1 = await findOrCreate(
      () => tx.lorryReceipt.findFirst({ where: { lrNumber: 'LR-1000', companyId: primaryCompany.id } }),
      () => tx.lorryReceipt.create({
        data: {
          lrNumber: 'LR-1000',
          companyId: primaryCompany.id,
          loadId: load1.id,
          date: new Date(),
          consignorName: 'Tata Motors Pune',
          consigneeName: 'Tata Motors Delhi',
          fromStation: 'Pune',
          toStation: 'New Delhi',
          goodsDescription: 'Auto Parts',
          packagesCount: 150,
          freightAmount: 40000.00,
          hamaliCharges: 1000.00,
          otherCharges: 500.00,
          gstAmount: 3500.00,
          paymentType: 'TO_PAY',
          totalAmount: 45000.00,
          status: 'GENERATED'
        }
      })
    );

    // ── 13. Dev OAuthClient ────────────────────────────────────────────────
    await tx.oAuthClient.upsert({
      where:  { clientId: DEV_CLIENT_ID },
      update: {},
      create: {
        companyId:    primaryCompany.id,
        clientId:     DEV_CLIENT_ID,
        clientSecret: sha256(DEV_CLIENT_SECRET),
        name:         'Dev Local Client (seed)',
        description:  'Created by seed.ts for local development.',
        scopes:       ['loads:read', 'loads:write', 'fleet:read'],
        redirectUris: [],
        grantTypes:   ['client_credentials'],
        isActive:     true,
      },
    });

    console.log('✅ Indian Demo Data Seeded Successfully');
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
