import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Stable IDs for idempotent upserts
const DEV_SAMSARA_ID  = 'seed-dev-samsara-001';
const DEV_INTUIT_ID   = 'seed-dev-intuit-001';
const DEV_PARILINK_ID = 'seed-dev-parilink-001';

async function main() {
  console.log('Seeding Marketplace Data...');

  await prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;

  // 1. Categories (have @@unique on name)
  const telematicsCat = await prisma.marketplaceCategory.upsert({
    where:  { name: 'Telematics' },
    update: {},
    create: { name: 'Telematics', description: 'GPS tracking and ELD integrations' },
  });
  const financeCat = await prisma.marketplaceCategory.upsert({
    where:  { name: 'Finance' },
    update: {},
    create: { name: 'Finance', description: 'Accounting and ERP integrations' },
  });
  const aiCat = await prisma.marketplaceCategory.upsert({
    where:  { name: 'AI' },
    update: {},
    create: { name: 'AI', description: 'Artificial Intelligence and Automation' },
  });

  // 2. Developers (no unique on name — use stable id)
  const samsaraDev = await prisma.marketplaceDeveloper.upsert({
    where:  { id: DEV_SAMSARA_ID },
    update: {},
    create: { id: DEV_SAMSARA_ID,  name: 'Samsara',  isVerified: true, website: 'https://samsara.com' },
  });
  const intuitDev = await prisma.marketplaceDeveloper.upsert({
    where:  { id: DEV_INTUIT_ID },
    update: {},
    create: { id: DEV_INTUIT_ID,   name: 'Intuit',   isVerified: true, website: 'https://intuit.com' },
  });
  const parilinkDev = await prisma.marketplaceDeveloper.upsert({
    where:  { id: DEV_PARILINK_ID },
    update: {},
    create: { id: DEV_PARILINK_ID, name: 'PariLink', isVerified: true, website: 'https://parilink.com' },
  });

  // 3. Apps (have @@unique on name)
  await prisma.marketplaceApp.upsert({
    where:  { name: 'Samsara Sync' },
    update: {},
    create: {
      name: 'Samsara Sync',
      provider: 'samsara-fleet',
      categoryId: telematicsCat.id,
      developerId: samsaraDev.id,
      description: 'Real-time ELD and dashcam syncing for heavy duty vehicles.',
      status: 'ACTIVE',
      logoUrl: 'https://ui-avatars.com/api/?name=SA&background=1e1e1e&color=fff',
      price: 10.0,
      licenseType: 'PAID',
      authType: 'API_KEY',
      isFirstParty: false,
      websiteUrl: 'https://samsara.com',
      versions: { create: [
        { version: '2.1.0', releaseNotes: 'Added dashcam event synchronization.', isLatest: true },
        { version: '2.0.5', releaseNotes: 'Bug fixes for GPS mapping sync failures.', isLatest: false },
      ]},
      permissions: { create: [
        { scope: 'READ:VEHICLES',  description: 'Access vehicle master data.',              isRequired: true  },
        { scope: 'WRITE:LOCATION', description: 'Push real-time GPS pings.',                isRequired: true  },
        { scope: 'READ:DRIVERS',   description: 'Access driver profiles for HOS sync.',    isRequired: true  },
        { scope: 'WRITE:ALERTS',   description: 'Create notifications for dashcam events.', isRequired: false },
      ]},
      screenshots: { create: [
        { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', order: 1 },
        { url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80', order: 2 },
      ]},
    },
  });

  await prisma.marketplaceApp.upsert({
    where:  { name: 'QuickBooks Online' },
    update: {},
    create: {
      name: 'QuickBooks Online',
      provider: 'quickbooks-finance',
      categoryId: financeCat.id,
      developerId: intuitDev.id,
      description: 'Automatically sync invoices, vendor bills, and expenses to QBO.',
      status: 'ACTIVE',
      logoUrl: 'https://ui-avatars.com/api/?name=QB&background=2ca01c&color=fff',
      price: 0,
      licenseType: 'FREE',
      authType: 'OAUTH2',
      isFirstParty: false,
      versions:    { create: [{ version: '1.5.0', releaseNotes: 'Initial release', isLatest: true }] },
      permissions: { create: [
        { scope: 'READ:INVOICES',  description: 'Read invoices',             isRequired: true },
        { scope: 'WRITE:PAYMENTS', description: 'Sync payments back to QBO', isRequired: true },
      ]},
    },
  });

  await prisma.marketplaceApp.upsert({
    where:  { name: 'PariLink Copilot' },
    update: {},
    create: {
      name: 'PariLink Copilot',
      provider: 'pari-ai-copilot',
      categoryId: aiCat.id,
      developerId: parilinkDev.id,
      description: 'First-party AI assistant for autonomous dispatch and routing.',
      status: 'ACTIVE',
      logoUrl: 'https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff',
      price: 0,
      licenseType: 'ENTERPRISE',
      authType: 'OAUTH2',
      isFirstParty: true,
      versions: { create: [{ version: '3.0.0', releaseNotes: 'V3.0.0 release', isLatest: true }] },
    },
  });

  console.log('Marketplace seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
