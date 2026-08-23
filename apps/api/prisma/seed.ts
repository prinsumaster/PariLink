/**
 * prisma/seed.ts — Idempotent demo seed
 *
 * Strategy:
 *   - Entities with a DB-level @unique field: upsert on that field.
 *   - Entities without a usable unique field: findFirst by natural key,
 *     create only if absent.  Never blindly INSERT.
 *
 * Stable natural keys used:
 *   Company  : email = billing@parilink.com
 *   User     : email = admin@parilink.com        (@unique in schema)
 *   Trip     : tripNumber                        (@unique in schema)
 *   Invoice  : @@unique([companyId, invoiceNumber])
 *   Driver   : licenseNumber (natural, no schema unique — findFirst)
 *   Vehicle  : vin          (natural, no schema unique — findFirst)
 *   Customer : email        (natural, no schema unique — findFirst)
 *   Load     : referenceNumber + companyId       (no schema unique — findFirst)
 *   OAuthClient: clientId                        (@unique in schema)
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Dev OAuth client — documented plaintext for local dev only.
// DO NOT ship to production without rotating these values.
// client_id:     client_parilink_dev_local
// client_secret: secret_parilink_dev_local_changeme
const DEV_CLIENT_ID     = 'client_parilink_dev_local';
const DEV_CLIENT_SECRET = 'secret_parilink_dev_local_changeme';

function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

/** findFirst by where; create with createData if not found */
async function findOrCreate<T>(
  findFn: () => Promise<T | null>,
  createFn: () => Promise<T>,
): Promise<T> {
  const existing = await findFn();
  return existing ?? (await createFn());
}

async function main() {
  console.log('🌱 Seeding database (idempotent run)...');

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;

    // ── 1. Company ─────────────────────────────────────────────────────────
    const primaryCompany = await findOrCreate(
      () => tx.company.findFirst({ where: { email: 'billing@parilink.com' } }),
      () => tx.company.create({
        data: {
          name: 'PariLink Demo Logistics', taxId: 'US-987654321',
          address: '1000 Transport Way', city: 'Atlanta', state: 'GA',
          country: 'USA', postalCode: '30301',
          email: 'billing@parilink.com', phone: '+1-800-555-0199',
          website: 'www.parilink.com', status: 'ACTIVE',
        },
      }),
    );

    await tx.tenantConfiguration.upsert({
      where:  { companyId: primaryCompany.id },
      update: {},
      create: { companyId: primaryCompany.id, onboardingCompleted: true, timezone: 'UTC', currency: 'USD' },
    });

    // ── 2. Role ────────────────────────────────────────────────────────────
    // Role has no global unique — use findFirst scoped to this company
    const adminRole = await findOrCreate(
      () => tx.role.findFirst({ where: { companyId: primaryCompany.id, name: 'SUPER_ADMIN' } }),
      () => tx.role.create({
        data: { name: 'SUPER_ADMIN', description: 'Full system access', permissions: ['*'], companyId: primaryCompany.id },
      }),
    );

    // ── 3. Admin User (@unique on email) ───────────────────────────────────
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    await tx.user.upsert({
      where:  { email: 'admin@parilink.com' },
      update: { password: hashedPassword },
      create: {
        email: 'admin@parilink.com', password: hashedPassword,
        firstName: 'Demo', lastName: 'Administrator',
        roleId: adminRole.id, companyId: primaryCompany.id,
      },
    });
    console.log('✅ Core Org & Admin');

    // ── 4. Customers (no unique — findFirst by email + companyId) ──────────
    const customer1 = await findOrCreate(
      () => tx.customer.findFirst({ where: { email: 'billing@acmeglobal.com', companyId: primaryCompany.id } }),
      () => tx.customer.create({ data: { name: 'Acme Global Logistics', companyId: primaryCompany.id, email: 'billing@acmeglobal.com', phone: '+1234567890', status: 'ACTIVE' } }),
    );
    const customer2 = await findOrCreate(
      () => tx.customer.findFirst({ where: { email: 'ap@techtrans.net',        companyId: primaryCompany.id } }),
      () => tx.customer.create({ data: { name: 'TechTrans Supply',      companyId: primaryCompany.id, email: 'ap@techtrans.net',       phone: '+1987654321', status: 'ACTIVE' } }),
    );
    await findOrCreate(
      () => tx.customer.findFirst({ where: { email: 'finance@freshfoods.org', companyId: primaryCompany.id } }),
      () => tx.customer.create({ data: { name: 'Fresh Foods Dist',      companyId: primaryCompany.id, email: 'finance@freshfoods.org', phone: '+1122334455', status: 'ACTIVE' } }),
    );
    console.log('✅ Customers');

    // ── 5. Drivers (no unique — findFirst by licenseNumber + companyId) ────
    const driver1 = await findOrCreate(
      () => tx.driver.findFirst({ where: { licenseNumber: 'DL-987111', companyId: primaryCompany.id } }),
      () => tx.driver.create({ data: { firstName: 'Sarah',   lastName: 'Connor', licenseNumber: 'DL-987111', status: 'ON_TRIP',   companyId: primaryCompany.id } }),
    );
    const driver2 = await findOrCreate(
      () => tx.driver.findFirst({ where: { licenseNumber: 'DL-555222', companyId: primaryCompany.id } }),
      () => tx.driver.create({ data: { firstName: 'Michael', lastName: 'Chang',  licenseNumber: 'DL-555222', status: 'AVAILABLE', companyId: primaryCompany.id } }),
    );
    await findOrCreate(
      () => tx.driver.findFirst({ where: { licenseNumber: 'DL-444333', companyId: primaryCompany.id } }),
      () => tx.driver.create({ data: { firstName: 'David',   lastName: 'Miller', licenseNumber: 'DL-444333', status: 'ON_REST',   companyId: primaryCompany.id } }),
    );
    console.log('✅ Drivers');

    // ── 6. Vehicles (no unique — findFirst by vin + companyId) ─────────────
    const vehicle1 = await findOrCreate(
      () => tx.vehicle.findFirst({ where: { vin: '1ZV900000000001', companyId: primaryCompany.id } }),
      () => tx.vehicle.create({ data: { make: 'Volvo',       model: 'VNL',      year: 2023, vin: '1ZV900000000001', licensePlate: 'TX-12345', status: 'IN_SERVICE',  type: 'TRUCK', companyId: primaryCompany.id } }),
    );
    const vehicle2 = await findOrCreate(
      () => tx.vehicle.findFirst({ where: { vin: '1ZV900000000002', companyId: primaryCompany.id } }),
      () => tx.vehicle.create({ data: { make: 'Freightliner', model: 'Cascadia', year: 2022, vin: '1ZV900000000002', licensePlate: 'CA-99887', status: 'AVAILABLE',   type: 'TRUCK', companyId: primaryCompany.id } }),
    );
    await findOrCreate(
      () => tx.vehicle.findFirst({ where: { vin: '1ZV900000000003', companyId: primaryCompany.id } }),
      () => tx.vehicle.create({ data: { make: 'Ford',         model: 'Transit',  year: 2024, vin: '1ZV900000000003', licensePlate: 'NY-44556', status: 'MAINTENANCE', type: 'VAN',   companyId: primaryCompany.id } }),
    );
    console.log('✅ Vehicles');

    // ── 7. Trips (@unique on tripNumber) ───────────────────────────────────
    const trip1 = await tx.trip.upsert({
      where:  { tripNumber: 'TRP-1001' },
      update: {},
      create: { tripNumber: 'TRP-1001', status: 'IN_TRANSIT', driverId: driver1.id, vehicleId: vehicle1.id, companyId: primaryCompany.id, startDate: new Date() },
    });
    const trip2 = await tx.trip.upsert({
      where:  { tripNumber: 'TRP-1002' },
      update: {},
      create: { tripNumber: 'TRP-1002', status: 'COMPLETED', driverId: driver2.id, vehicleId: vehicle2.id, companyId: primaryCompany.id, startDate: new Date(Date.now() - 172800000), endDate: new Date(Date.now() - 86400000) },
    });

    // ── 8. Loads (no unique — findFirst by referenceNumber + companyId) ────
    const load1 = await findOrCreate(
      () => tx.load.findFirst({ where: { referenceNumber: 'LOD-1001', companyId: primaryCompany.id } }),
      () => tx.load.create({
        data: {
          referenceNumber: 'LOD-1001', tripId: trip1.id, customerId: customer1.id, companyId: primaryCompany.id,
          originAddress: '100 Main St', originCity: 'Dallas', originState: 'TX',
          destinationAddress: '200 Oak St', destinationCity: 'Austin', destinationState: 'TX',
          pickupDate: new Date(), deliveryDate: new Date(Date.now() + 86400000), rate: 850.50, status: 'IN_TRANSIT',
        },
      }),
    );
    const load2 = await findOrCreate(
      () => tx.load.findFirst({ where: { referenceNumber: 'LOD-1002', companyId: primaryCompany.id } }),
      () => tx.load.create({
        data: {
          referenceNumber: 'LOD-1002', tripId: trip2.id, customerId: customer2.id, companyId: primaryCompany.id,
          originAddress: '300 Pine St', originCity: 'Chicago', originState: 'IL',
          destinationAddress: '400 Elm St', destinationCity: 'Detroit', destinationState: 'MI',
          pickupDate: new Date(Date.now() - 172800000), deliveryDate: new Date(Date.now() - 86400000), rate: 1250.00, status: 'DELIVERED',
        },
      }),
    );
    console.log('✅ Trips & Loads');

    // ── 9. Invoices (@@unique on [companyId, invoiceNumber]) ───────────────
    await tx.invoice.upsert({
      where:  { companyId_invoiceNumber: { companyId: primaryCompany.id, invoiceNumber: 'INV-1001' } },
      update: {},
      create: { invoiceNumber: 'INV-1001', amount: 850.50,  status: 'PAID',   dueDate: new Date(Date.now() - 5 * 86400000),  loadId: load1.id, customerId: customer1.id, companyId: primaryCompany.id },
    });
    await tx.invoice.upsert({
      where:  { companyId_invoiceNumber: { companyId: primaryCompany.id, invoiceNumber: 'INV-1002' } },
      update: {},
      create: { invoiceNumber: 'INV-1002', amount: 1250.00, status: 'ISSUED', dueDate: new Date(Date.now() + 15 * 86400000), loadId: load2.id, customerId: customer2.id, companyId: primaryCompany.id },
    });
    console.log('✅ Invoices');

    // ── 10. Dev OAuthClient (@unique on clientId) ──────────────────────────
    // WARNING: DEV ONLY.  client_id / client_secret documented above.
    await tx.oAuthClient.upsert({
      where:  { clientId: DEV_CLIENT_ID },
      update: {},
      create: {
        companyId:    primaryCompany.id,
        clientId:     DEV_CLIENT_ID,
        clientSecret: sha256(DEV_CLIENT_SECRET),
        name:         'Dev Local Client (seed)',
        description:  'Created by seed.ts for local development. Remove or rotate before production.',
        scopes:       ['loads:read', 'loads:write', 'fleet:read'],
        redirectUris: [],
        grantTypes:   ['client_credentials'],
        isActive:     true,
      },
    });
    console.log('✅ Dev OAuthClient  client_id=client_parilink_dev_local  secret=secret_parilink_dev_local_changeme');

    // ── 11. IntegrationConnector & Connection ───────────────────────────────
    // (@unique on provider for connector)
    const connector = await tx.integrationConnector.upsert({
      where: { provider: 'DEV_LOCAL_CONNECTOR' },
      update: {},
      create: {
        provider: 'DEV_LOCAL_CONNECTOR',
        version: '1.0.0',
        status: 'ACTIVE',
        capabilities: ['SYNC'],
        supportedEvents: [],
        authType: 'API_KEY',
      }
    });

    // (no unique constraint on connection -> findFirst)
    await findOrCreate(
      () => tx.integrationConnection.findFirst({ where: { companyId: primaryCompany.id, connectorId: connector.id } }),
      () => tx.integrationConnection.create({
        data: {
          companyId: primaryCompany.id,
          connectorId: connector.id,
          status: 'CONFIGURED',
          credentials: { apiKey: 'dev_local_api_key' },
          settings: { syncInterval: 60 }
        }
      })
    );
    console.log('✅ IntegrationConnector & Connection');
  });

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
