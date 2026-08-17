const { compA, compB, usersA } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.ADMIN.email, password: 'password123' })
  });
  const data = await tokenReq.json();
  const token = data.access_token;

  // Attack 1: Attempt to list drivers from Company B
  const listReq = await fetch(`http://localhost:8080/api/v1/drivers?companyId=${compB}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("LIST DRIVERS WITH COMPANY B:", await listReq.status, await listReq.text());

  // Attack 2: Attempt to PATCH my own company record to migrate it to Company B's ID (which would break isolation if it succeeds)
  const patchReq = await fetch(`http://localhost:8080/api/v1/companies/${compA}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ id: compB })
  });
  console.log("PATCH COMPANY ID:", await patchReq.status, await patchReq.text());
}
attack();
