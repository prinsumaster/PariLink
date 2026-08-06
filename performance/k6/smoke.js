import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: "5s",
  thresholds: {
    http_req_duration: ['p(99)<500'], // 99% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'], // less than 1% errors
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/v1';
const COMPANY_ID = __ENV.COMPANY_ID || '12345678-1234-1234-1234-123456789012';

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@parilink.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'logged in successfully': (r) => r.status === 201 || r.status === 200,
  });

  const token = loginRes.json('access_token');

  if (token) {
    const params = { headers: { Authorization: `Bearer ${token}` } };
    
    // Check Dashboard
    const dashboardRes = http.get(`${BASE_URL}/loads`, params);
    check(dashboardRes, { 'dashboard loaded': (r) => r.status === 200 });

    // End of smoke test checks
  }

  sleep(1);
}
