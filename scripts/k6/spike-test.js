import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // extremely fast ramp-up to spike
    { duration: '1m', target: 100 }, // hold the spike
    { duration: '10s', target: 0 }, // rapid scale down
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'], // allow up to 3s latency under extreme spike
    http_req_failed: ['rate<0.05'], // allow up to 5% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default () => {
  const res = http.get(`${BASE_URL}/api/v1/trips`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
};
