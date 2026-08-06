const login = await fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
});
const loginData = await login.json();
if (!loginData.access_token) {
  console.log("Login failed: ", JSON.stringify(loginData, null, 2));
  process.exit(1);
}
const res = await fetch('http://localhost:8080/api/v1/loads', {
  headers: { Authorization: `Bearer ${loginData.access_token}` }
});
console.log(JSON.stringify(await res.json(), null, 2));
