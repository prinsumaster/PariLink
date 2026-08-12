const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT current_user, session_user, current_database();`;
  const output = JSON.stringify(result, null, 2);
  fs.writeFileSync('/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/rc11-certification-evidence/RC11-P02-database-context.txt', output);
  console.log(output);
}
main().catch(console.error).finally(() => prisma.$disconnect());
