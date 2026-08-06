import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: "5s", target: 20 }, // Ramp up to 200 users
    { duration: "5s", target: 20 }, // Stay at 200 users for 10m
    { duration: "5s", target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Allow higher latency under stress
    http_req_failed: ['rate<0.05'], // Accept up to 5% failure under extreme stress
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/v1';
const COMPANY_ID = __ENV.COMPANY_ID || '12345678-1234-1234-1234-123456789012';

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@parilink.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('access_token');

  if (token) {
    const params = { headers: { Authorization: `Bearer ${token}` } };
    
    // Simulate heavy queries (Factoring Dashboard, Reports)
    http.get(`${BASE_URL}/factoring/dashboard`, params);
    http.get(`${BASE_URL}/ledger/trial-balance`, params);
  }

  sleep(1);
}
