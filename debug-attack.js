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
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); } 
        catch(e) { resolve({ status: res.statusCode, data }); }
      });
    });
    
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  const tA = { email: `attack_a_${Date.now()}@example.com`, password: 'password123', companyName: 'TENANT_A' };
  const tB = { email: `attack_b_${Date.now()}@example.com`, password: 'password123', companyName: 'TENANT_B' };

  const resA = await request('/auth/register', 'POST', tA);
  const tokenA = resA.data.access_token;
  
  const resB = await request('/auth/register', 'POST', tB);
  const tokenB = resB.data.access_token;

  const custB = await request('/customers', 'POST', { name: 'Customer B', email: `custB_${Date.now()}@example.com`, status: 'ACTIVE' }, tokenB);
  const custId = custB.data.id;

  console.log("Customer B Created:", custB.status, custB.data);

  const patchCustA = await request(`/customers/${custId}`, 'PATCH', { name: 'Hacked Customer B' }, tokenA);
  console.log("Patch Customer A:", patchCustA.status, patchCustA.data);
}
run();
