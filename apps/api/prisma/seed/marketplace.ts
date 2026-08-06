import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Marketplace Data...');

  // 1. Categories
  const telematicsCat = await prisma.marketplaceCategory.upsert({
    where: { name: 'Telematics' },
    update: {},
    create: { name: 'Telematics', description: 'GPS tracking and ELD integrations' },
  });

  const financeCat = await prisma.marketplaceCategory.upsert({
    where: { name: 'Finance' },
    update: {},
    create: { name: 'Finance', description: 'Accounting and ERP integrations' },
  });

  const aiCat = await prisma.marketplaceCategory.upsert({
    where: { name: 'AI' },
    update: {},
    create: { name: 'AI', description: 'Artificial Intelligence and Automation' },
  });

  // 2. Developers
  const samsaraDev = await prisma.marketplaceDeveloper.create({
    data: { name: 'Samsara', isVerified: true, website: 'https://samsara.com' }
  });

  const intuitDev = await prisma.marketplaceDeveloper.create({
    data: { name: 'Intuit', isVerified: true, website: 'https://intuit.com' }
  });

  const parilinkDev = await prisma.marketplaceDeveloper.create({
    data: { name: 'PariLink', isVerified: true, website: 'https://parilink.com' }
  });

  // 3. Apps
  const samsaraApp = await prisma.marketplaceApp.upsert({
    where: { name: 'Samsara Sync' },
    update: {},
    create: {
      name: 'Samsara Sync',
      provider: 'samsara-fleet',
      categoryId: telematicsCat.id,
      developerId: samsaraDev.id,
      description: 'Real-time ELD and dashcam syncing for heavy duty vehicles. Integrate your PariLink workspace directly with Samsara to sync Hours of Service (HOS), real-time GPS tracking, and dashcam events instantly.',
      status: 'ACTIVE',
      logoUrl: 'https://ui-avatars.com/api/?name=SA&background=1e1e1e&color=fff',
      price: 10.0,
      licenseType: 'PAID',
      authType: 'API_KEY',
      isFirstParty: false,
      websiteUrl: 'https://samsara.com',
      versions: {
        create: [
          { version: '2.1.0', releaseNotes: 'Added dashcam event synchronization.', isLatest: true },
          { version: '2.0.5', releaseNotes: 'Bug fixes for GPS mapping sync failures.', isLatest: false },
        ]
      },
      permissions: {
        create: [
          { scope: 'READ:VEHICLES', description: 'Access vehicle master data.', isRequired: true },
          { scope: 'WRITE:LOCATION', description: 'Push real-time GPS pings.', isRequired: true },
          { scope: 'READ:DRIVERS', description: 'Access driver profiles for HOS sync.', isRequired: true },
          { scope: 'WRITE:ALERTS', description: 'Create notifications for dashcam events.', isRequired: false },
        ]
      },
      screenshots: {
        create: [
          { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', order: 1 },
          { url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80', order: 2 }
        ]
      }
    }
  });

  const qboApp = await prisma.marketplaceApp.upsert({
    where: { name: 'QuickBooks Online' },
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
      versions: {
        create: [
          { version: '1.5.0', releaseNotes: 'Initial release', isLatest: true }
        ]
      },
      permissions: {
        create: [
          { scope: 'READ:INVOICES', description: 'Read invoices', isRequired: true },
          { scope: 'WRITE:PAYMENTS', description: 'Sync payments back to QBO', isRequired: true }
        ]
      }
    }
  });

  const copilotApp = await prisma.marketplaceApp.upsert({
    where: { name: 'PariLink Copilot' },
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
      versions: {
        create: [
          { version: '3.0.0', releaseNotes: 'V30.0 release integration', isLatest: true }
        ]
      }
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
