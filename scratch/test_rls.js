const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

async function run() {
  console.log('--- Seeding RLS Test Data ---');
  // Hash password
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const runId = Date.now();
  // 1. Create Company A and User A
  const companyA = await prisma.company.create({
    data: {
      name: 'Test Company A',
      users: {
        create: {
          email: `usera-${runId}@example.com`,
          password: passwordHash,
          firstName: 'User',
          lastName: 'A',
          status: 'ACTIVE'
        }
      }
    },
    include: { users: true }
  });
  
  const roleA = await prisma.role.create({
    data: {
      name: `Test Role A ${runId}`,
      companyId: companyA.id,
      permissions: ['users:read']
    }
  });
  
  await prisma.user.update({
    where: { id: companyA.users[0].id },
    data: { roleId: roleA.id }
  });

  // 2. Create Company B and User B
  const companyB = await prisma.company.create({
    data: {
      name: 'Test Company B',
      users: {
        create: {
          email: `userb-${runId}@example.com`,
          password: passwordHash,
          firstName: 'User',
          lastName: 'B',
          status: 'ACTIVE'
        }
      }
    },
    include: { users: true }
  });

  const roleB = await prisma.role.create({
    data: {
      name: `Test Role B ${runId}`,
      companyId: companyB.id,
      permissions: ['users:read']
    }
  });

  await prisma.user.update({
    where: { id: companyB.users[0].id },
    data: { roleId: roleB.id }
  });
  
  // 3. Create Audit Logs
  const logA = await prisma.auditLog.create({
    data: {
      companyId: companyA.id,
      userId: companyA.users[0].id,
      entity: 'User',
      entityId: companyA.users[0].id,
      action: 'LOGIN',
      details: { test: 'logA' }
    }
  });
  
  const logB = await prisma.auditLog.create({
    data: {
      companyId: companyB.id,
      userId: companyB.users[0].id,
      entity: 'User',
      entityId: companyB.users[0].id,
      action: 'LOGIN',
      details: { test: 'logB' }
    }
  });
  
  // Generate random IDs for the script to use later
  console.log(`Created Company A: ${companyA.id}, Log A: ${logA.id}`);
  console.log(`Created Company B: ${companyB.id}, Log B: ${logB.id}`);

  // Test the API as User A
  console.log('\n--- Logging in as User A ---');
  const loginRes = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `usera-${runId}@example.com`, password: 'password123' })
  });
  
  const cookies = loginRes.headers.get('set-cookie');
  if (!cookies) {
    console.error('Failed to get cookies:', await loginRes.text());
    process.exit(1);
  }
  
  // Parse access_token
  const accessMatch = cookies.match(/access_token=([^;]+)/);
  const accessToken = accessMatch ? accessMatch[1] : null;
  
  console.log('\n--- Fetching Users as User A ---');
  const listRes = await fetch('http://localhost:8080/api/v1/admin/users', {
    headers: { 'Cookie': `access_token=${accessToken}` }
  });
  const listData = await listRes.json();
  if (listData.items || Array.isArray(listData)) {
    const items = listData.items || listData;
    console.log(`List Endpoint Result (Should only see A):`, JSON.stringify(items.map(l => l.email)));
  } else {
    console.log(`List Endpoint Result:`, listData);
  }
  
  console.log('\n--- Fetching User B Directly as User A ---');
  const getRes = await fetch(`http://localhost:8080/api/v1/admin/users/${companyB.users[0].id}`, {
    headers: { 'Cookie': `access_token=${accessToken}` }
  });
  console.log(`GET /admin/users/<User B ID> status: ${getRes.status}`);
  
  // Clean up
  console.log('\n--- Cleaning Up ---');
  await prisma.auditLog.deleteMany({ where: { id: { in: [logA.id, logB.id] } } });
  await prisma.user.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
  await prisma.company.deleteMany({ where: { id: { in: [companyA.id, companyB.id] } } });
  console.log('Cleanup complete.');
  
}

run().catch(console.error).finally(() => prisma.$disconnect());
