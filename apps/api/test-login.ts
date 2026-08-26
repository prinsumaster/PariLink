import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@parilink.in' } });
  if (!user) return console.log('User not found');
  const match = await bcrypt.compare('password123', user.password);
  console.log('Password match:', match);
}
run();
