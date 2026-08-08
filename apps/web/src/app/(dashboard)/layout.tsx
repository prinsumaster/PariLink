'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkspaceShell } from '@/components/workspace/workspace-shell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router, pathname]);

  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    if (mounted && isAuthenticated && user && user.onboardingCompleted === false && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [mounted, isAuthenticated, user, router, pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Skeleton className="h-[200px] w-[400px] rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (user && user.onboardingCompleted === false && pathname !== '/onboarding') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Skeleton className="h-[200px] w-[400px] rounded-xl" />
      </div>
    );
  }

  // The WorkspaceShell now handles the Sidebar, TopBar, Tabs, Dock, and BottomBar
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
