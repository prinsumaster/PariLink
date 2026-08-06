import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Setup the testing options
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up to 20 users over 30s
    { duration: '1m', target: 20 },   // Stay at 20 users for 1m
    { duration: '30s', target: 0 },   // Ramp-down to 0 users over 30s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],                 // Failures must be < 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8080/api/v1';
const TOKEN = __ENV.JWT_TOKEN || 'placeholder-token';

// 2. Setup (runs once before load test)
export function setup() {
  // E.g., authenticate and return a token if not provided
  return { token: TOKEN };
}

// 3. The actual test scenario
export default function (data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // Test 1: Fetch user profile
  const profileRes = http.get(`${BASE_URL}/users/me`, { headers });
  check(profileRes, {
    'profile status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);

  // Test 2: Fetch Active Loads (Driver Dashboard)
  const loadsRes = http.get(`${BASE_URL}/loads?status=ACTIVE`, { headers });
  check(loadsRes, {
    'loads status is 200 or 401': (r) => r.status === 200 || r.status === 401,
  });

  sleep(2);
}
