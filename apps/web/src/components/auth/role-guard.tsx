'use client';

import { useAuthStore } from '@/store/auth';
import { Role, Permission } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: Role[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, requiredPermissions, fallback }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated || !user) {
    return null; // Handled by middleware mostly, but just in case for CSR
  }

  const hasRole = allowedRoles ? allowedRoles.includes(user.role) : true;
  
  const hasPermission = requiredPermissions 
    ? requiredPermissions.every(p => user.permissions.some(up => up.action === p))
    : true;

  if (hasRole && hasPermission) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 rounded-xl border border-gray-200 dark:border-gray-800 m-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
          <ShieldAlert className="h-8 w-8 text-orange-600 dark:text-orange-500" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">403 Forbidden</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have the required permissions or role to view this page. Contact your administrator if you believe this is an error.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/dashboard" passHref>
            <Button>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
