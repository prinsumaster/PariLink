'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Customer, CustomerFilters } from '@/types/crm';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle2, XCircle, Users, Activity, BarChart3 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomerTableProps {
  customers: Customer[];
  total: number;
  isLoading: boolean;
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
}

const getStatusBadge = (status: Customer['status']) => {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle2 className="mr-1 h-3 w-3" /> Active</Badge>;
    case 'INACTIVE':
      return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" /> Inactive</Badge>;
    case 'LEAD':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Users className="mr-1 h-3 w-3" /> Lead</Badge>;
    case 'CHURNED':
      return <Badge variant="destructive"><Activity className="mr-1 h-3 w-3" /> Churned</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function CustomerTable({ customers, total, isLoading, filters, onFiltersChange }: CustomerTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'companyName',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarFallback className="bg-blue-50 text-blue-700 rounded-md border border-blue-200 font-medium">
                {((row.original as any).name || row.original.companyName || '??').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{(row.original as any).name || row.original.companyName}</div>
              <div className="text-xs text-gray-500">{row.original.type || 'SME'} • {row.original.industry || 'General'}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
      },
      {
        id: 'contact',
        header: 'Primary Contact',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-medium">{(row.original as any).phone || row.original.primaryPhone || 'No Phone'}</div>
            <div className="text-xs text-gray-500">{(row.original as any).email || row.original.primaryEmail || 'No Email'}</div>
          </div>
        ),
      },
      {
        id: 'financials',
        header: 'Financials',
        cell: ({ row }) => {
          const billing = row.original.billing || {};
          const bal = billing.outstandingBalance || 0;
          return (
            <div className="flex flex-col items-start gap-1">
              <Badge variant="outline" className="text-xs font-mono">{billing.paymentTerms || 'NET_30'}</Badge>
              {bal > 0 ? (
                <span className="text-xs font-semibold text-red-600">Arrears: ${bal.toLocaleString()}</span>
              ) : (
                <span className="text-xs text-gray-500">Good Standing</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'metrics',
        header: 'Lifetime Value',
        cell: ({ row }) => (
          <div className="text-sm font-semibold flex items-center gap-1">
            <BarChart3 className="h-4 w-4 text-green-500" />
            ${row.original.metrics?.totalRevenue?.toLocaleString() || '0'}
          </div>
        ),
      }
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / (filters.limit || 20)),
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 whitespace-nowrap font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white/30 dark:bg-slate-900/30">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4 flex gap-3">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                    <div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></div>
                  </td>
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div></td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => router.push(`/customers/${row.original.id}`)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 hover:elevation-1"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm rounded-b-xl">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })} disabled={(filters.page || 1) === 1}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })} disabled={(filters.page || 1) >= table.getPageCount()}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of <span className="font-medium">{total}</span> customers
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button variant="outline" className="rounded-r-none" onClick={() => onFiltersChange({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })} disabled={(filters.page || 1) === 1}>Previous</Button>
              <Button variant="outline" className="rounded-l-none" onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })} disabled={(filters.page || 1) >= table.getPageCount()}>Next</Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
