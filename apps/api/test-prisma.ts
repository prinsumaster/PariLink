import { PrismaService } from './src/prisma/prisma.service';

async function main() {
  const prisma = new PrismaService();
  await prisma.onModuleInit();
  
  try {
    const user = await prisma.runAsSystem('Testing finding unique user', async (tx) => {
      return tx.user.findUnique({
        where: { email: 'admin@parilink.com' },
        select: {
          id: true,
          email: true,
          company: {
            select: {
              tenantConfiguration: {
                select: { onboardingCompleted: true }
              }
            }
          }
        }
      });
    });
    console.log('Success:', user);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.onModuleDestroy();
  }
}

main();
