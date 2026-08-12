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
        resolve({ status: res.statusCode, data });
      });
    });
    
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  // Login as Tenant A
  const tenantA = { email: `admin_a_123@example.com`, password: 'password123', companyName: 'TENANT_A' };
  const resA = await request('/auth/register', 'POST', tenantA);
  let token = null;
  if (resA.status === 201) token = JSON.parse(resA.data).access_token;
  else {
      // already exists, login
      const l = await request('/auth/login', 'POST', { email: 'admin_a_123@example.com', password: 'password123' });
      token = JSON.parse(l.data).access_token;
  }

  const testPath = async (path) => {
      const r = await request(path, 'GET', null, token);
      console.log(`${path} -> ${r.status} ${r.data.substring(0, 100)}`);
  };

  await testPath('/vehicles/permits');
  await testPath('/vehicles/maintenance/job-cards');
  await testPath('/vehicles/fuel/cards');
  await testPath('/finance/invoices');
  await testPath('/invoices');
}

run().catch(console.error);
