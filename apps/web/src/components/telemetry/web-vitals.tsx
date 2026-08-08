'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // In production, send to observability backend (e.g., Datadog, Sentry, or custom endpoint)
    // We use a beacon to avoid blocking the main thread during page unload
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify(metric);
      const url = '/api/v1/telemetry/vitals';
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        fetch(url, { body, method: 'POST', keepalive: true }).catch(() => {});
      }
    } else {
      // In development, you can log it to the console if needed
      // console.log(metric);
    }
  });

  return null;
}
