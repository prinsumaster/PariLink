"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, ServerCrash } from 'lucide-react';

// global-error must include html and body tags
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('PariLink Global Error Boundary Caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950">
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="relative flex flex-col items-center p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Subtle destructive background glow */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 to-rose-700" />
              
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-20 h-20 mb-6 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center ring-8 ring-red-50/50 dark:ring-red-500/5 shadow-sm transform -rotate-3">
                  <ServerCrash className="h-10 w-10 text-red-600 dark:text-red-500" strokeWidth={1.5} />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                  Critical System Error
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-[280px]">
                  A critical error occurred that prevented the application from rendering. The session cannot recover automatically.
                </p>

                <div className="w-full">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full rounded-xl shadow-sm transition-all active:scale-[0.98]"
                    size="lg"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" /> 
                    Reload Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
