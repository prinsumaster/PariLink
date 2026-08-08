'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/50">
      <FadeIn className="w-full max-w-md">
        <div className="relative flex flex-col items-center p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Subtle destructive background glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-rose-600" />
          <div className="absolute -top-24 opacity-20 dark:opacity-10 pointer-events-none">
            <div className="w-64 h-64 bg-red-500 rounded-full blur-[80px]" />
          </div>

          <StaggerContainer className="relative z-10 flex flex-col items-center w-full">
            <StaggerItem>
              <div className="w-20 h-20 mb-6 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center ring-8 ring-red-50/50 dark:ring-red-500/5 shadow-sm transform -rotate-3 transition-transform hover:rotate-0">
                <ServerCrash className="h-10 w-10 text-red-600 dark:text-red-500" strokeWidth={1.5} />
              </div>
            </StaggerItem>

            <StaggerItem>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                System Exception
              </h2>
            </StaggerItem>

            <StaggerItem>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-[280px]">
                An unexpected error occurred while processing this request. The system has automatically logged this incident for review.
              </p>
            </StaggerItem>

            <StaggerItem className="w-full">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button 
                  onClick={() => reset()} 
                  className="flex-1 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> 
                  Retry Operation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'} 
                  className="flex-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  <Home className="h-4 w-4 mr-2" /> 
                  Dashboard
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </FadeIn>
    </div>
  );
}
