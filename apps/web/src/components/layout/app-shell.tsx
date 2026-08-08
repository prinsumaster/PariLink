'use client';

import { ReactNode, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { CommandPalette } from './command-palette';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalErrorFallback } from '../errors/global-error-fallback';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:dark:bg-slate-900 focus:text-indigo-600 focus:top-0 focus:left-0 focus:font-bold focus:shadow-md"
      >
        Skip to main content
      </a>
      
      <CommandPalette />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 w-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main id="main-content" tabIndex={-1} className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
