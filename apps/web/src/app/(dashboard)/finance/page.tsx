'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/finance';
import { FinanceFilters as FilterState } from '@/types/finance';
import Link from 'next/link';
import { Plus, Download, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { InvoiceTable } from '@/components/finance/invoice-table';
import { InvoiceFilters } from '@/components/finance/invoice-filters';
import { RoleGuard } from '@/components/auth/role-guard';

export default function FinancePage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => financeService.getInvoices(filters),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="h-8 w-8 text-blue-600" /> Billing & Finance
          </h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Manage accounts receivable, invoices, and payment collections.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE']} fallback={null}>
            <Link href="/finance/new" passHref>
              <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all">
                <Plus className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </Link>
          </RoleGuard>
        </div>
      </div>

      <InvoiceFilters filters={filters} onChange={setFilters} />
      
      <div className="glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300">
        <InvoiceTable 
          invoices={data?.data || []} 
          total={data?.total || 0}
          isLoading={isLoading || isFetching}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </div>
  );
}
