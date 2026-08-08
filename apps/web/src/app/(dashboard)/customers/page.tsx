'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { crmService } from '@/services/crm';
import { CustomerFilters as FilterState } from '@/types/crm';
import Link from 'next/link';
import { Plus, Download } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { CustomerTable } from '@/components/crm/customer-table';
import { CustomerFilters } from '@/components/crm/customer-filters';
import { RoleGuard } from '@/components/auth/role-guard';

export default function CustomersPage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => crmService.getCustomers(filters),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Customer Directory</h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Manage B2B accounts, billing terms, and contacts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'SALES', 'FINANCE']} fallback={null}>
            <Link href="/customers/new" className={cn(buttonVariants({ variant: 'default' }), "flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all")}>
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Link>
          </RoleGuard>
        </div>
      </div>

      <CustomerFilters filters={filters} onChange={setFilters} />
      
      <div className="glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300">
        <CustomerTable 
          customers={data?.data || []} 
          total={data?.total || 0}
          isLoading={isLoading || isFetching}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </div>
  );
}
