import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1, // 1 user looping for 1 minute
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default () => {
  const responses = http.batch([
    ['GET', `${BASE_URL}/health/readiness`, null, { tags: { name: 'Readiness' } }],
    ['GET', `${BASE_URL}/health/liveness`, null, { tags: { name: 'Liveness' } }],
  ]);

  check(responses[0], {
    'readiness status is 200': (r) => r.status === 200,
  });

  check(responses[1], {
    'liveness status is 200': (r) => r.status === 200,
  });

  sleep(1);
};
