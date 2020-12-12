/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { sleep } from 'k6';
import { Rate } from 'k6/metrics';

export const options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: [{ threshold: 'p(99)<2000' }], // response time for 99% of requests take under 2000 ms to complete
  },
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:portland': { loadZone: 'amazon:us:portland', percent: 100 },
      },
    },
  },
};

const errorRate = new Rate('error_rate');

export default function () {
  const id = Math.floor(Math.random() * 10000000 + 1);
  const res = http.get(`http://localhost:3001/${id}`);
  errorRate.add(res.error_code);
  // Average time to complete each request: 50 ms
  // Want each VU iteration to take a total of 100 ms so that each VU can run 10 times per second
  // 100 ms * 10 = 1 second
  // So, we have a remainder of 50 ms (100 ms - 50 ms) that we want our VU to sleep for
  sleep(0.05);
}
