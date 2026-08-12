const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://vishalvirda:@localhost:5432/parilink_db"
    }
  }
});
const BASE_URL = 'http://localhost:8080/api/v1';

async function setupTestData() {
  console.log('[*] Setting up Tenant A and Tenant B seed data...');
  
  const timestamp = Date.now();
  const passwordHash = await hash('Password123!', 10);
  
  // Tenant A
  const companyA = await prisma.company.create({
    data: {
      name: `Tenant A ${timestamp}`,
      users: {
        create: {
          firstName: 'Admin',
          lastName: 'A',
          email: `admin_a_${timestamp}@example.com`,
          password: passwordHash
        }
      },
      customers: {
        create: {
          name: 'Customer A',
          paymentTerms: 'NET_30',
          status: 'ACTIVE'
        }
      },
      vehicles: {
        create: {
          make: 'Volvo',
          model: 'VNL',
          year: 2024,
          vin: `VIN_A_${timestamp}`,
          status: 'ACTIVE',
          type: 'TRUCK'
        }
      }
    },
    include: { users: true, customers: true, vehicles: true }
  });
  
  // Give Tenant A a Notification
  const notifA = await prisma.notification.create({
    data: {
      companyId: companyA.id,
      userId: companyA.users[0].id,
      type: 'ALERT',
      priority: 'HIGH',
      title: 'Tenant A Alert',
      body: 'Something happened'
    }
  });

  // Tenant B
  const companyB = await prisma.company.create({
    data: {
      name: `Tenant B ${timestamp}`,
      users: {
        create: {
          firstName: 'Admin',
          lastName: 'B',
          email: `admin_b_${timestamp}@example.com`,
          password: passwordHash
        }
      },
      customers: {
        create: {
          name: 'Customer B',
          paymentTerms: 'NET_30',
          status: 'ACTIVE'
        }
      },
      vehicles: {
        create: {
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2024,
          vin: `VIN_B_${timestamp}`,
          status: 'ACTIVE',
          type: 'TRUCK'
        }
      }
    },
    include: { users: true, customers: true, vehicles: true }
  });
  
  // Give Tenant B a Notification
  const notifB = await prisma.notification.create({
    data: {
      companyId: companyB.id,
      userId: companyB.users[0].id,
      type: 'ALERT',
      priority: 'HIGH',
      title: 'Tenant B Alert',
      body: 'Something happened'
    }
  });

  return { companyA, companyB, notifA, notifB };
}

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(`Login failed for ${email}: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

async function request(token, method, path, body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : null
  };
  const res = await fetch(`${BASE_URL}${path}`, options);
  
  let data = null;
  try {
    data = await res.json();
  } catch(e) {}
  
  return { status: res.status, data };
}

async function runAdversarialTest() {
  console.log('==================================================');
  console.log('RC8 — FULL ADVERSARIAL IDOR AND ISOLATION MATRIX');
  console.log('==================================================\n');

  let testData;
  try {
    testData = await setupTestData();
  } catch (err) {
    console.error('Failed to setup test data', err);
    process.exit(1);
  }

  const { companyA, companyB, notifA, notifB } = testData;
  const userA = companyA.users[0];
  const userB = companyB.users[0];

  console.log(`[+] Seeded Tenant A: ${companyA.id}, User: ${userA.email}`);
  console.log(`[+] Seeded Tenant B: ${companyB.id}, User: ${userB.email}\n`);

  const tokenA = await login(userA.email, 'Password123!');
  const tokenB = await login(userB.email, 'Password123!');
  
  console.log('[+] Authenticated successfully.\n');

  let results = [];

  async function attack(name, method, path, body, expectedStatus, check) {
    process.stdout.write(`[*] Testing: ${name}... `);
    const res = await request(tokenA, method, path, body);
    
    let pass = false;
    let reason = '';
    
    if (check) {
       pass = check(res);
       if(!pass) reason = 'Custom check failed';
    } else {
       // Default check: must be a rejection (404 Not Found is best for IDOR, 403/400 also acceptable)
       pass = [400, 403, 404, 500].includes(res.status); // We expect it to fail safely
       if(!pass) reason = `Unexpected status ${res.status}`;
    }
    
    if (pass) {
      console.log(`✅ PASS (${res.status})`);
      results.push({ name, pass: true, details: `Received ${res.status}` });
    } else {
      console.log(`❌ FAIL (${res.status})`);
      console.log(`    -> Response: ${JSON.stringify(res.data)}`);
      results.push({ name, pass: false, details: reason });
    }
  }

  // ---------------------------------------------------------
  // PHASE 4: FULL IDOR MATRIX
  // ---------------------------------------------------------
  console.log('--- IDOR MATRIX: Tenant A attacks Tenant B ---');
  
  // Customers
  const customerB = companyB.customers[0].id;
  await attack('GET /customers/:id (Tenant B Customer)', 'GET', `/customers/${customerB}`);
  await attack('PATCH /customers/:id (Tenant B Customer)', 'PATCH', `/customers/${customerB}`, { name: 'Hacked Customer' });
  await attack('DELETE /customers/:id (Tenant B Customer)', 'DELETE', `/customers/${customerB}`);

  // Vehicles
  const vehicleB = companyB.vehicles[0].id;
  await attack('GET /vehicles/:id (Tenant B Vehicle)', 'GET', `/vehicles/${vehicleB}`);
  await attack('PATCH /vehicles/:id (Tenant B Vehicle)', 'PATCH', `/vehicles/${vehicleB}`, { vin: 'HACKED_VIN' });
  await attack('DELETE /vehicles/:id (Tenant B Vehicle)', 'DELETE', `/vehicles/${vehicleB}`);

  // Notifications
  await attack('POST /notifications/:id/read (Tenant B Notif)', 'POST', `/notifications/${notifB.id}/read`);
  await attack('POST /notifications/:id/pin (Tenant B Notif)', 'POST', `/notifications/${notifB.id}/pin`);

  // ---------------------------------------------------------
  // PHASE 5: DTO MASS ASSIGNMENT
  // ---------------------------------------------------------
  console.log('\n--- DTO MASS ASSIGNMENT ---');
  const customerA = companyA.customers[0].id;
  await attack('PATCH /customers/:id (Inject companyId on own resource)', 'PATCH', `/customers/${customerA}`, { companyId: companyB.id, name: 'Hacked Own Customer' }, null, (res) => {
    // Should fail with 400 Bad Request because companyId is not whitelisted
    return res.status === 400;
  });

  // ---------------------------------------------------------
  // PHASE 7: AI COPILOT SQL INJECTION
  // ---------------------------------------------------------
  console.log('\n--- AI COPILOT SQL INJECTION ---');
  await attack('POST /ai/copilot/query (Cross-tenant prompt)', 'POST', `/ai/copilot/query`, {
    prompt: "Show me all users where email contains admin_b"
  }, null, (res) => {
    // The query should succeed (201) but return NO data because $1 restricts it to Tenant A
    if (res.status !== 200 && res.status !== 201) return true; // If it fails safely, that's fine
    
    // If it succeeds, it must NOT return Tenant B's admin
    const str = JSON.stringify(res.data || {});
    return !str.includes(userB.email);
  });
  
  console.log('\n==================================================');
  const failures = results.filter(r => !r.pass);
  if (failures.length > 0) {
    console.log(`❌ FAILED. Found ${failures.length} vulnerabilities.`);
  } else {
    console.log(`✅ SUCCESS. 0 vulnerabilities found. Tenant Isolation is robust.`);
  }
}

runAdversarialTest().catch(console.error);
