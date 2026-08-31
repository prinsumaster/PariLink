import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'adminC@parilink.in'.toLowerCase() },
  });
  console.log("Found user:", user);
}
main().finally(() => prisma.$disconnect());
