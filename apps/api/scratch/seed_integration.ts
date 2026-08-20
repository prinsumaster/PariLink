import { PrismaClient } from '@prisma/client';
import { IntegrationAuthService } from '../src/integration/auth/auth.service';

const prisma = new PrismaClient();
const authService = new IntegrationAuthService();

(async () => {
  // Get an existing company
  const company = await prisma.company.findFirst();
  if (!company) {
    console.log("No company found!");
    return;
  }
  const companyId = company.id;
  const provider = 'ENTERPRISE_PAYMENTS';
  
  console.log("Using companyId:", companyId);
  
  // Ensure Connector exists
  const connector = await prisma.integrationConnector.upsert({
    where: { provider: provider },
    update: {},
    create: {
      id: provider,
      provider: provider,
      version: '2.0.0',
      status: 'ACTIVE',
      authType: 'API_KEY'
    }
  });
  
  // Encrypt the credentials
  const credentials = authService.encryptCredentials({
    webhookSecret: 'my_super_secret_key_123'
  });
  
  const connection = await prisma.integrationConnection.create({
    data: {
      companyId,
      connectorId: connector.id,
      status: 'CONFIGURED',
      credentials: credentials
    }
  });
  console.log("Seeded connection:", connection.id);
  await prisma.$disconnect();
})();
