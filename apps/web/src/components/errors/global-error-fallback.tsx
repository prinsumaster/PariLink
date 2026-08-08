'use client';

import { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    // Transmit crash telemetry to observability backend
    if (process.env.NODE_ENV === 'production') {
      try {
        const err = error as any;
        const payload = JSON.stringify({
          message: err.message || String(error),
          stack: err.stack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        });
        
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/v1/telemetry/errors', payload);
        } else {
          fetch('/api/v1/telemetry/errors', { method: 'POST', body: payload, keepalive: true }).catch(() => {});
        }
      } catch (e) {
        // Silently fail if telemetry fails
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertOctagon className="h-8 w-8 text-red-600 dark:text-red-500" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h2>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs text-left max-w-full overflow-auto">
            {((error as any).message) || 'Unknown error occurred'}
          </pre>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            A critical error occurred in the application shell. Our team has been notified.
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-48 text-xs font-mono text-gray-800 dark:text-gray-200">
            {(error as any).message}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={resetErrorBoundary} className="flex items-center">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
