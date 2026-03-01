import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
   ext: {  
    loadimpact: {  
      distribution: {  
        'amazon:ie:dublin': { loadZone: 'amazon:ie:dublin', percent: 100 },  
      },  
    },  
  },  
   scenarios: {
    limited_with_stages: {
      executor: 'ramping-arrival-rate',
      startRate: 2,         // 120 RPM
      timeUnit: '1s',
      stages: [
        { target: 8, duration: '1m' },  // 480 RPM
        { target: 8, duration: '3m' },  // halten
        { target: 0, duration: '1m' },  // runterfahren
      ],
      preAllocatedVUs: 5,
      maxVUs: 10,           // begrenzt Parallelität
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% unter 500ms
     http_req_failed: ['rate<0.01'], // max 1% Fehler
  },
};

export default function () {
  const res = http.get('https://myhealth-app-test.netlify.app');
  check(res, { 'Status ist 200': (r) => r.status === 200 });
  sleep(3);
}
