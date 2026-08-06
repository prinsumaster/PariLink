async function test() {
  const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  
  console.log("Login status:", loginRes.status);
  const text = await loginRes.text();
  console.log("Login response text:", text.substring(0, 500));
}

test().catch(console.error);
