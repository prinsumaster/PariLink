import http from 'k6/http';
export default function () {
  const loginRes = http.post('http://localhost:3000/api/v1/auth/login', JSON.stringify({ email: 'admin@parilink.com', password: 'password123' }), { headers: { 'Content-Type': 'application/json' } });
  if (loginRes.status !== 200 && loginRes.status !== 201) {
    console.log("LOGIN FAILED:", loginRes.status, loginRes.body);
  }
}
