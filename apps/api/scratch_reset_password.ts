import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.update({
    where: { email: 'admin@parilink.com' },
    data: { password: hashedPassword }
  });
  console.log('Password reset successfully to password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
