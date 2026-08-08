'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { usePayments } from '@/hooks';
import { DataTable } from '@/components/data-table/data-table';
import { RecordPaymentDialog } from '@/components/forms/record-payment-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Payment } from '@/types';

const methodLabel: Record<string, string> = {
  CHECK: 'Check', ACH: 'ACH', WIRE: 'Wire Transfer', CREDIT_CARD: 'Credit Card', CASH: 'Cash',
};

const columns: ColumnDef<Payment>[] = [
  { accessorKey: 'id', header: 'Payment ID', cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue<string>('id').slice(0, 8)}…</span> },
  { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">${(row.getValue('amount') as number).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> },
  { accessorKey: 'method', header: 'Method', cell: ({ row }) => methodLabel[row.getValue('method') as string] ?? row.getValue('method') },
  { accessorKey: 'referenceNumber', header: 'Reference', cell: ({ row }) => row.getValue('referenceNumber') || '—' },
  { accessorKey: 'paymentDate', header: 'Payment Date', cell: ({ row }) => format(new Date(row.getValue('paymentDate')), 'MMM d, yyyy') },
  { accessorKey: 'createdAt', header: 'Recorded', cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'MMM d, yyyy') },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-gray-800">
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View Invoice</DropdownMenuItem>
          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function PaymentsPage() {
  const [page] = useState(1);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { data, isLoading } = usePayments({ page, limit: 50 });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">{isLoading ? 'Loading...' : `${((data as any)?.meta?.total ?? (data as any)?.total ?? 0).toLocaleString()} payments recorded`}</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          onClick={() => setPaymentOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <RecordPaymentDialog open={paymentOpen} onOpenChange={setPaymentOpen} />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <DataTable columns={columns} data={data?.data ?? []} />
      )}
    </div>
  );
}
