const { PrismaClient } = require('@prisma/client');
const { IntegrationAuthService } = require('./dist/integration/auth/auth.service.js');
const prisma = new PrismaClient();
const authService = new IntegrationAuthService();

(async () => {
  const companyId = '9e0a8d0e-6353-4ff5-955b-30da74cfbba6';
  const provider = 'ENTERPRISE_PAYMENTS';
  
  // Encrypt the credentials
  const credentials = authService.encryptCredentials({
    webhookSecret: 'my_super_secret_key_123'
  });
  
  const connection = await prisma.integrationConnection.create({
    data: {
      companyId,
      connectorId: provider,
      status: 'CONFIGURED',
      credentials: credentials
    }
  });
  console.log("Seeded connection:", connection.id);
  await prisma.$disconnect();
})();
