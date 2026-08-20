import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
    const conn = await prisma.integrationConnection.findFirst({
        where: { connectorId: 'ENTERPRISE_PAYMENTS' }
    });
    console.log("DB check:", conn);
})();
