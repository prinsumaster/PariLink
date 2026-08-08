'use client';

import { useQuery } from '@tanstack/react-query';
import { crmService } from '@/services/crm';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { CustomerDetailView } from '@/components/crm/customer-detail-view';
import { RoleGuard } from '@/components/auth/role-guard';

export default function CustomerDetailPage() {
  const { id } = useParams();
  
  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['customers', id],
    queryFn: () => crmService.getCustomer(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-[600px] bg-gray-200 dark:bg-slate-800 rounded"></div>
          <div className="h-[400px] bg-gray-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Account not found</h3>
        <p className="mt-1 text-base font-medium text-slate-500">The customer profile you are looking for does not exist or you don't have access.</p>
        <div className="mt-6">
          <Link href="/customers" className="text-blue-600 hover:text-blue-500">
            &larr; Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'SALES', 'FINANCE', 'DISPATCHER', 'OPERATIONS', 'VIEWER']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
        <div>
          <Link href="/customers" className="inline-flex items-center text-base font-medium text-slate-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-300 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Directory
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Account Profile
            </h1>
          </div>
        </div>

        <CustomerDetailView customer={customer} />
      </div>
    </RoleGuard>
  );
}
