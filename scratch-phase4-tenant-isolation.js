const http = require('http');

async function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
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
    
    req.on('error', e => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const tenantA = { email: `admin_a_${Date.now()}@example.com`, password: 'password123', companyName: 'TENANT_A' };
  const resA = await request('/auth/register', 'POST', tenantA);
  const tokenA = resA.data.access_token;
  const tenantB = { email: `admin_b_${Date.now()}@example.com`, password: 'password123', companyName: 'TENANT_B' };
  const resB = await request('/auth/register', 'POST', tenantB);
  const tokenB = resB.data.access_token;

  const custB = await request('/customers', 'POST', {
      name: 'Customer B', email: 'custB@b.com', phone: '123', status: 'ACTIVE'
  }, tokenB);
  const custBId = custB.data.id;

  const res = await request(`/customers/${custBId}`, 'GET', null, tokenA);
  console.log(`Access Customer from Tenant A: Status ${res.status}`);
}

run().catch(console.error);
