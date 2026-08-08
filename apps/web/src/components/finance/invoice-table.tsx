'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Invoice, FinanceFilters } from '@/types/finance';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, AlertTriangle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  total: number;
  isLoading: boolean;
  filters: FinanceFilters;
  onFiltersChange: (filters: FinanceFilters) => void;
}

const getStatusBadge = (status: Invoice['status']) => {
  switch (status) {
    case 'PAID':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle2 className="mr-1 h-3 w-3" /> Paid</Badge>;
    case 'PARTIAL':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Clock className="mr-1 h-3 w-3" /> Partial</Badge>;
    case 'OVERDUE':
      return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Overdue</Badge>;
    case 'ISSUED':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"><FileText className="mr-1 h-3 w-3" /> Issued</Badge>;
    case 'CANCELLED':
    case 'REFUNDED':
      return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" /> {status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function InvoiceTable({ invoices, total, isLoading, filters, onFiltersChange }: InvoiceTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: 'invoiceNumber',
        header: 'Invoice #',
        cell: ({ row }) => (
          <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
            {row.getValue('invoiceNumber')}
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="font-medium text-gray-900 dark:text-white">
            {row.getValue('customerName')}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
      },
      {
        id: 'dates',
        header: 'Timeline',
        cell: ({ row }) => (
          <div className="text-xs space-y-1">
            <div className="text-gray-500">Issued: {new Date(row.original.issueDate).toLocaleDateString()}</div>
            <div className={`font-medium ${row.original.status === 'OVERDUE' ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
              Due: {new Date(row.original.dueDate).toLocaleDateString()}
            </div>
          </div>
        ),
      },
      {
        id: 'financials',
        header: 'Amount',
        cell: ({ row }) => {
          const inv = row.original;
          return (
            <div className="flex flex-col items-end gap-1">
              <span className="font-semibold text-gray-900 dark:text-white">
                ${inv.grandTotal.toLocaleString()} <span className="text-xs font-normal text-gray-500">{inv.currency}</span>
              </span>
              {inv.balanceDue > 0 && inv.status !== 'DRAFT' && (
                <span className="text-xs font-medium text-red-500">Balance: ${inv.balanceDue.toLocaleString()}</span>
              )}
            </div>
          );
        },
      }
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: invoices,
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
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4 flex flex-col items-end space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></td>
                </tr>
              ))
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No invoices found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => router.push(`/finance/${row.original.id}`)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 hover:elevation-1"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={`px-4 py-3 ${cell.column.id === 'financials' ? 'text-right' : ''}`}>
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
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of <span className="font-medium">{total}</span> invoices
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
