import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

(async () => {
  await prisma.onModuleInit();
  const companyId = '9e0a8d0e-6353-4ff5-955b-30da74cfbba6';
  const provider = 'ENTERPRISE_PAYMENTS';
  
  const conn = await prisma.runAsSystem('Webhook bypass debug', async (tx) => {
    return tx.integrationConnection.findFirst({
      where: { companyId, connector: { provider: provider } },
      include: { connector: true }
    });
  });
  
  console.log("Result:", conn);
})();
