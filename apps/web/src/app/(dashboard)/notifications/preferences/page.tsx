'use client';

import { NotificationPreferences } from '@/components/notifications/notification-preferences';
import { RoleGuard } from '@/components/auth/role-guard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NotificationPreferencesPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE', 'OPERATIONS', 'SALES', 'DISPATCHER', 'VIEWER']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <div>
          <Link href="/notifications" className="inline-flex items-center text-base font-medium text-slate-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-300 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Inbox
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Notification Preferences</h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Control how and when PariLink alerts you to system events.</p>
        </div>

        <NotificationPreferences />
      </div>
    </RoleGuard>
  );
}
