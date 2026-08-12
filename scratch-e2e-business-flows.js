const http = require('http');

const API_URL = 'http://localhost:8080/api/v1';

async function request(path, method = 'GET', body = null, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
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
    
    req.on('error', e => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- E2E BUSINESS FLOW TESTS ---');
  
  // 1. Get a token via login
  const loginRes = await request('/auth/login', 'POST', {
    email: 'admin@parilink.com',
    password: 'password123'
  });
  
  if (loginRes.status !== 200 || !loginRes.data.access_token) {
    console.error('Failed to login:', loginRes.data);
    process.exit(1);
  }
  const token = loginRes.data.access_token;
  console.log('✅ Login successful');

  const flows = [];
  
  try {
      // CUSTOMER FLOW
      console.log('Running Customer Flow...');
      const custRes = await request('/customers', 'POST', {
          name: 'E2E Test Customer',
          email: 'e2e@test.com',
          phone: '+1234567890',
          status: 'ACTIVE'
      }, token);
      
      if (custRes.status === 201) {
          const custId = custRes.data.id;
          const getRes = await request(`/customers/${custId}`, 'GET', null, token);
          if (getRes.status === 200) {
              const updRes = await request(`/customers/${custId}`, 'PATCH', { name: 'E2E Updated' }, token);
              if (updRes.status === 200) {
                  flows.push({ flow: 'CUSTOMER', status: 'PASS' });
                  console.log('✅ Customer Flow PASSED');
              } else flows.push({ flow: 'CUSTOMER', status: `FAIL - UPDATE ${updRes.status}` });
          } else flows.push({ flow: 'CUSTOMER', status: `FAIL - GET ${getRes.status}` });
      } else flows.push({ flow: 'CUSTOMER', status: `FAIL - CREATE ${custRes.status}` });
      
      // DRIVER FLOW
      console.log('Running Driver Flow...');
      const driverRes = await request('/drivers', 'POST', {
          firstName: 'John',
          lastName: 'Doe',
          email: 'driver@e2e.com',
          phone: '+1987654321',
          licenseNumber: 'DL123456',
          status: 'AVAILABLE'
      }, token);
      if (driverRes.status === 201) {
          const driverId = driverRes.data.id;
          const updDriver = await request(`/drivers/${driverId}`, 'PATCH', { firstName: 'Johnny' }, token);
          if (updDriver.status === 200) {
              flows.push({ flow: 'DRIVER', status: 'PASS' });
              console.log('✅ Driver Flow PASSED');
          } else {
              flows.push({ flow: 'DRIVER', status: `FAIL - UPDATE ${updDriver.status} ${JSON.stringify(updDriver.data)}` });
          }
      } else {
          flows.push({ flow: 'DRIVER', status: `FAIL - CREATE ${driverRes.status} ${JSON.stringify(driverRes.data)}` });
      }

      // VEHICLE FLOW
      console.log('Running Vehicle Flow...');
      const vehRes = await request('/vehicles', 'POST', {
          licensePlate: `XYZ-${Math.floor(Math.random() * 10000)}`,
          make: 'Volvo',
          model: 'VNL',
          status: 'IN_SERVICE'
      }, token);
      if (vehRes.status === 201) {
          const vehId = vehRes.data.id;
          const updVeh = await request(`/vehicles/${vehId}`, 'PATCH', { make: 'Volvo 2' }, token);
          if (updVeh.status === 200) {
              flows.push({ flow: 'VEHICLE', status: 'PASS' });
              console.log('✅ Vehicle Flow PASSED');
          } else {
              flows.push({ flow: 'VEHICLE', status: `FAIL - UPDATE ${updVeh.status} ${JSON.stringify(updVeh.data)}` });
          }
      } else {
          flows.push({ flow: 'VEHICLE', status: `FAIL - CREATE ${vehRes.status} ${JSON.stringify(vehRes.data)}` });
      }

  } catch(err) {
      console.error('Fatal error during flows:', err);
  }

  console.log('\n--- FLOW RESULTS ---');
  console.table(flows);
}

run();
