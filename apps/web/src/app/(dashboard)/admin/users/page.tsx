'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin';
import { AdminFilters as FilterState } from '@/types/admin';
import Link from 'next/link';
import { Plus, Users, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { UserTable } from '@/components/admin/user-table';
import { UserFilters } from '@/components/admin/user-filters';
import { RoleGuard } from '@/components/auth/role-guard';
import { toast } from 'sonner';

export default function UsersAdminPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => adminService.getUsers(filters),
  });

  const lockMutation = useMutation({
    mutationFn: (id: string) => adminService.lockUserAccount(id),
    onSuccess: () => {
      toast.success('User account locked successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to lock account')
  });

  const resetMutation = useMutation({
    mutationFn: (id: string) => adminService.resetUserPassword(id),
    onSuccess: () => {
      toast.success('Password reset email dispatched');
    },
    onError: () => toast.error('Failed to dispatch password reset')
  });

  const handleLockUser = (id: string) => {
    if (confirm('Are you sure you want to lock this user account? They will be immediately signed out and unable to log in.')) {
      lockMutation.mutate(id);
    }
  };

  const handleResetPassword = (id: string) => {
    if (confirm('Are you sure you want to force a password reset for this user?')) {
      resetMutation.mutate(id);
    }
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN']}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-indigo-600" /> Identity & Access Management
            </h1>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Manage users, roles, invitations, and active sessions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/users/new" passHref>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Invite User
              </Button>
            </Link>
          </div>
        </div>

        <UserFilters filters={filters} onChange={setFilters} />
        
        <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <UserTable 
            users={data?.data || []} 
            total={data?.total || 0}
            isLoading={isLoading || isFetching}
            filters={filters}
            onFiltersChange={setFilters}
            onLockUser={handleLockUser}
            onResetPassword={handleResetPassword}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
