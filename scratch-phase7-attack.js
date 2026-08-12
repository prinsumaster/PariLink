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

  let report = `# PARILINK 2.0 — ADVERSARIAL ISOLATION ATTACK REPORT V2\n\n`;

  // 1. Create records under Tenant B
  const custB = await request('/customers', 'POST', { name: 'Customer B', email: `custB_${Date.now()}@example.com`, status: 'ACTIVE' }, tokenB);
  const vehB = await request('/vehicles', 'POST', { licensePlate: `XYZ-${Date.now()}`, make: 'Volvo', model: 'VNL', status: 'IN_SERVICE' }, tokenB);
  
  if (custB.status !== 201 || vehB.status !== 201) {
      report += `## ERROR: Failed to create target resources for Tenant B.\n`;
      require('fs').writeFileSync('TENANT_ISOLATION_ATTACK_REPORT_V2.md', report);
      return;
  }

  const custId = custB.data.id;
  const vehId = vehB.data.id;

  report += `## Cross-Tenant Read Attacks (GET)\n`;
  const getCustA = await request(`/customers/${custId}`, 'GET', null, tokenA);
  if (getCustA.status === 200) report += `- ❌ GET Customer by UUID: FAIL (Data leaked!)\n`;
  else report += `- ✅ GET Customer by UUID: PASS (Rejected with ${getCustA.status})\n`;

  const getVehA = await request(`/vehicles/${vehId}`, 'GET', null, tokenA);
  if (getVehA.status === 200) report += `- ❌ GET Vehicle by UUID: FAIL (Data leaked!)\n`;
  else report += `- ✅ GET Vehicle by UUID: PASS (Rejected with ${getVehA.status})\n`;

  report += `\n## Cross-Tenant Write Attacks (PATCH)\n`;
  const patchCustA = await request(`/customers/${custId}`, 'PATCH', { name: 'Hacked Customer B' }, tokenA);
  if (patchCustA.status === 200) report += `- ❌ PATCH Customer by UUID: FAIL (Write succeeded!)\n`;
  else report += `- ✅ PATCH Customer by UUID: PASS (Rejected with ${patchCustA.status})\n`;

  const patchVehA = await request(`/vehicles/${vehId}`, 'PATCH', { make: 'Hacked Volvo' }, tokenA);
  if (patchVehA.status === 200) report += `- ❌ PATCH Vehicle by UUID: FAIL (Write succeeded!)\n`;
  else report += `- ✅ PATCH Vehicle by UUID: PASS (Rejected with ${patchVehA.status})\n`;

  report += `\n## Cross-Tenant Delete Attacks (DELETE)\n`;
  const delCustA = await request(`/customers/${custId}`, 'DELETE', null, tokenA);
  if (delCustA.status === 200) report += `- ❌ DELETE Customer by UUID: FAIL (Delete succeeded!)\n`;
  else report += `- ✅ DELETE Customer by UUID: PASS (Rejected with ${delCustA.status})\n`;

  const delVehA = await request(`/vehicles/${vehId}`, 'DELETE', null, tokenA);
  if (delVehA.status === 200) report += `- ❌ DELETE Vehicle by UUID: FAIL (Delete succeeded!)\n`;
  else report += `- ✅ DELETE Vehicle by UUID: PASS (Rejected with ${delVehA.status})\n`;

  report += `\n## Cross-Tenant List Leakage Attacks (GET List)\n`;
  const listCustA = await request('/customers', 'GET', null, tokenA);
  if (listCustA.status === 200 && listCustA.data.data.some(c => c.id === custId)) {
      report += `- ❌ LIST Customers: FAIL (Tenant B data leaked in list!)\n`;
  } else report += `- ✅ LIST Customers: PASS (No leakage)\n`;

  const fs = require('fs');
  fs.writeFileSync('TENANT_ISOLATION_ATTACK_REPORT_V2.md', report);
  console.log("Attack report generated!");
}
run();
