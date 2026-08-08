'use client';

import { useState } from 'react';
import { NotificationFilters as FilterState } from '@/types/notifications';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { RoleGuard } from '@/components/auth/role-guard';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Link from 'next/link';

export default function NotificationsPage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 50,
  });

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE', 'OPERATIONS', 'SALES', 'DISPATCHER', 'VIEWER']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-8 w-8 text-indigo-600" /> Notifications
            </h1>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Activity feed, alerts, and system announcements.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select 
              value={filters.isRead === undefined ? 'ALL' : filters.isRead ? 'READ' : 'UNREAD'}
              onValueChange={(val) => {
                if (val === 'ALL') setFilters({ ...filters, isRead: undefined, page: 1 });
                if (val === 'UNREAD') setFilters({ ...filters, isRead: false, page: 1 });
                if (val === 'READ') setFilters({ ...filters, isRead: true, page: 1 });
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Notifications</SelectItem>
                <SelectItem value="UNREAD">Unread Only</SelectItem>
                <SelectItem value="READ">Read Only</SelectItem>
              </SelectContent>
            </Select>

            <Link href="/notifications/preferences" passHref>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Center List */}
        <NotificationCenter filters={filters} />
        
      </div>
    </RoleGuard>
  );
}
