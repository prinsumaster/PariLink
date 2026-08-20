import { PrismaClient } from '@prisma/client';
import { IntegrationAuthService } from '../src/integration/auth/auth.service';

const prisma = new PrismaClient();
const authService = new IntegrationAuthService();

(async () => {
  const companyId = '69430103-e17a-4b4a-a682-0a2c1c8f2f56';
  const provider = 'ENTERPRISE_PAYMENTS';
  
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
  
  const credentials = authService.encryptCredentials({
    webhookSecret: 'my_super_secret_key_123'
  });
  
  const connection = await prisma.integrationConnection.create({
    data: {
      companyId,
      connectorId: connector.id,
      status: 'CONFIGURED',
      credentials: JSON.parse(credentials)
    }
  });
  
  console.log("Seeded connection:", connection.id);
  console.log("Sleeping for 60 seconds...");
  await new Promise(r => setTimeout(r, 60000));
  
  await prisma.integrationConnection.delete({ where: { id: connection.id } });
  console.log("Cleaned up");
})();
