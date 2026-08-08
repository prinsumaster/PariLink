'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInvoices, useApproveInvoice } from '@/hooks';
import { DataTable } from '@/components/data-table/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import type { Invoice } from '@/types';

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: 'invoiceNumber', header: 'Invoice #', cell: ({ row }) => <span className="font-mono font-medium text-blue-600 dark:text-blue-400">{row.getValue('invoiceNumber')}</span> },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.getValue('status')} /> },
  { id: 'customer', header: 'Customer', cell: ({ row }) => row.original.customer?.name ?? '—' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => <span className="font-semibold">${(row.getValue('amount') as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>,
  },
  { accessorKey: 'dueDate', header: 'Due Date', cell: ({ row }) => { const v = row.getValue('dueDate') as string; return v ? format(new Date(v), 'MMM d, yyyy') : '—'; } },
  { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'MMM d, yyyy') },
  {
    id: 'actions',
    cell: function ActionsCell({ row }) {
      const invoice = row.original;
       
      const { mutate: approve } = useApproveInvoice();
       
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-gray-800">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/billing/${invoice.id}`)}>
                View Invoice
              </DropdownMenuItem>
              {invoice.status === 'DRAFT' && (
                <DropdownMenuItem
                  onClick={() => approve(invoice.id, {
                    onSuccess: () => toast.success('Invoice approved and sent!'),
                    onError: () => toast.error('Failed to approve invoice'),
                  })}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  Approve & Send
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600">Void Invoice</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function BillingPage() {
  const { data, isLoading } = useInvoices({ limit: 50 });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1">{isLoading ? 'Loading...' : `${((data as any)?.meta?.total ?? (data as any)?.total ?? 0).toLocaleString()} invoices`}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2"><Plus className="h-4 w-4" />Generate Invoice</Button>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <DataTable columns={columns} data={data?.data ?? []} searchKey="invoiceNumber" />
      )}
    </div>
  );
}
