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
  stages: [
    { duration: '1m', target: 100 }, // Ramp-up auf 100 Nutzer
    { duration: '3m', target: 100 }, // Haltephase
    { duration: '1m', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% unter 500ms
  },
};

export default function () {
  const res = http.get('https://myhealth-app-test.netlify.app');
  check(res, { 'Status ist 200': (r) => r.status === 200 });
  sleep(1);
}
