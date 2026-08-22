'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error Boundary caught:', error);
    console.error('[BOUNDARY]', error.message);
  }, [error]);

  return (
    <div data-error-boundary="true" className="flex h-full w-full flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center max-w-md text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Dashboard View Error
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          A component in this view encountered an unexpected error.
        </p>
        <Button onClick={() => reset()} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload View
        </Button>
      </div>
    </div>
  );
}
