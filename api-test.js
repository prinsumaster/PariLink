const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const load = await prisma.load.findFirst({ where: { status: 'PENDING' } });
  if (!load) {
    console.log("No pending load found");
    return;
  }
  
  const res = await fetch(`http://localhost:3000/api/v1/loads/${load.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-company-id': load.companyId
    },
    body: JSON.stringify({ status: 'ASSIGNED' })
  });
  
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Updated load status:", data.status);
}

test().catch(console.error).finally(() => prisma.$disconnect());
