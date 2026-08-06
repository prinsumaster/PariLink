import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  // Get the pending load 
  const load = await prisma.load.findFirst({ 
    where: { status: 'PENDING' },
    select: { id: true, companyId: true, referenceNumber: true }
  });
  
  if (!load) {
    console.log("No PENDING load found. All loads:");
    const all = await prisma.load.findMany({ select: { id: true, status: true, referenceNumber: true }, take: 5 });
    console.log(JSON.stringify(all, null, 2));
    return;
  }
  
  console.log("Found load:", load);
  
  // Now login and get a token
  const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  
  const loginData = await loginRes.json() as any;
  console.log("Login status:", loginRes.status);
  const token = loginData.accessToken || loginData.token;
  if (!token) {
    console.log("Login response:", JSON.stringify(loginData, null, 2));
    return;
  }
  console.log("Got token:", token.substring(0, 30) + "...");
  
  // Test PATCH with status: ASSIGNED only
  const patchRes = await fetch(`http://localhost:3000/api/v1/loads/${load.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Tenant-ID': load.companyId
    },
    body: JSON.stringify({ status: 'ASSIGNED' })
  });
  
  const patchData = await patchRes.json() as any;
  console.log("PATCH status:", patchRes.status);
  console.log("PATCH response:", JSON.stringify(patchData, null, 2));
}

test().catch(console.error).finally(() => prisma.$disconnect());
