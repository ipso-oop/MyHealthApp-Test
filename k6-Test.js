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
  limited: {
      executor: 'constant-arrival-rate',
      rate: 8,            // 480 RPM
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 5,
      maxVUs: 10,         // <- weniger gleichzeitige Verbindungen
    },
  stages: [
    { duration: '1m', target: 10 }, // Ramp-up auf 10 Nutzer
    { duration: '3m', target: 10 }, // Haltephase
    { duration: '1m', target: 0 },   // Ramp-down
  ],
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
