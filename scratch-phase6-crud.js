const http = require('http');

async function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
            resolve({ status: res.statusCode, data });
        }
      });
    });
    
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  // Login as Tenant A
  const tenantA = { email: `crud_admin_${Date.now()}@example.com`, password: 'password123', companyName: 'CRUD_TENANT' };
  const resA = await request('/auth/register', 'POST', tenantA);
  const token = resA.data.access_token;
  let markdown = `# PARILINK 2.0 — FULL CRUD VERIFICATION REPORT\n\n`;

  async function testLifecycle(entityName, path, createPayload, updatePayload) {
      markdown += `## Entity: ${entityName}\n`;
      try {
          // 1. CREATE
          const cRes = await request(path, 'POST', createPayload, token);
          if (cRes.status !== 201) {
              markdown += `- ❌ CREATE failed: ${cRes.status} ${JSON.stringify(cRes.data)}\n`;
              return;
          }
          const id = cRes.data.id;
          markdown += `- ✅ CREATE passed (ID: ${id})\n`;

          // 2. GET
          const gRes = await request(`${path}/${id}`, 'GET', null, token);
          if (gRes.status !== 200 || gRes.data.id !== id) {
              markdown += `- ❌ GET failed: ${gRes.status}\n`;
              return;
          }
          markdown += `- ✅ GET passed\n`;

          // 3. LIST
          const lRes = await request(path, 'GET', null, token);
          if (lRes.status !== 200 || !lRes.data.data) {
              markdown += `- ❌ LIST failed: ${lRes.status}\n`;
              return;
          }
          markdown += `- ✅ LIST passed\n`;

          // 4. UPDATE
          const uRes = await request(`${path}/${id}`, 'PATCH', updatePayload, token);
          if (uRes.status !== 200) {
              markdown += `- ❌ UPDATE (PATCH) failed: ${uRes.status} ${JSON.stringify(uRes.data)}\n`;
              return;
          }
          markdown += `- ✅ UPDATE passed\n`;

          // 5. GET AGAIN (Verify change)
          const g2Res = await request(`${path}/${id}`, 'GET', null, token);
          let updatedKeysMatch = true;
          for (const key of Object.keys(updatePayload)) {
             if (g2Res.data[key] !== updatePayload[key]) {
                 updatedKeysMatch = false;
                 markdown += `- ❌ VERIFY UPDATE failed: Field ${key} did not match. Expected ${updatePayload[key]}, got ${g2Res.data[key]}\n`;
             }
          }
          if (updatedKeysMatch) markdown += `- ✅ VERIFY UPDATE passed\n`;

          // 6. DELETE
          const dRes = await request(`${path}/${id}`, 'DELETE', null, token);
          if (dRes.status !== 200) {
              markdown += `- ❌ DELETE failed: ${dRes.status} ${JSON.stringify(dRes.data)}\n`;
              return;
          }
          markdown += `- ✅ DELETE passed\n`;

          // 7. GET AFTER DELETE
          const g3Res = await request(`${path}/${id}`, 'GET', null, token);
          if (g3Res.status !== 404 && g3Res.data.status !== 'INACTIVE' && !g3Res.data.deletedAt) {
               markdown += `- ❌ GET AFTER DELETE failed: Entity is still active or soft-delete flag is missing! Status: ${g3Res.status}\n`;
          } else {
               markdown += `- ✅ GET AFTER DELETE passed (Soft delete verified)\n`;
          }
      } catch (err) {
          markdown += `- 🚨 EXCEPTION: ${err.message}\n`;
      }
      markdown += '\n';
  }

  await testLifecycle('Customer', '/customers', 
    { name: 'CRUD Cust', email: `cust_${Date.now()}@crud.com`, phone: '123', status: 'ACTIVE' },
    { name: 'CRUD Cust Updated' }
  );

  await testLifecycle('Driver', '/drivers', 
    { firstName: 'D', lastName: 'R', email: `driver_${Date.now()}@crud.com`, licenseNumber: `DL_${Date.now()}`, phone: '123', status: 'AVAILABLE' },
    { firstName: 'D_Updated' }
  );

  await testLifecycle('Vehicle', '/vehicles', 
    { licensePlate: `XYZ-${Math.floor(Math.random() * 10000)}`, make: 'Volvo', model: 'VNL', status: 'IN_SERVICE' },
    { make: 'Mack' }
  );

  // Trips require Driver, Vehicle, Customer. 
  // Let's create prerequisites for Trip
  const cust = await request('/customers', 'POST', { name: 'TripCust', email: `tc_${Date.now()}@crud.com`, phone: '123', status: 'ACTIVE' }, token);
  const driver = await request('/drivers', 'POST', { firstName: 'TD', lastName: 'R', email: `td_${Date.now()}@crud.com`, licenseNumber: `DLT_${Date.now()}`, phone: '123', status: 'AVAILABLE' }, token);
  const veh = await request('/vehicles', 'POST', { licensePlate: `XYT-${Math.floor(Math.random() * 10000)}`, make: 'Volvo', model: 'VNL', status: 'IN_SERVICE' }, token);

  if (cust.status === 201 && driver.status === 201 && veh.status === 201) {
      await testLifecycle('Trip', '/trips',
        { customerId: cust.data.id, driverId: driver.data.id, vehicleId: veh.data.id, status: 'PLANNED' },
        { status: 'DISPATCHED' }
      );
  } else {
      markdown += `## Entity: Trip\n- ❌ Prerequisites creation failed\n\n`;
  }

  const fs = require('fs');
  fs.writeFileSync('FULL_CRUD_VERIFICATION.md', markdown);
  console.log('Done!');
}
run();
