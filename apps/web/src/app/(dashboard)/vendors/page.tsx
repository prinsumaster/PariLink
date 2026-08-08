'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useVendors } from '@/hooks';
import { DataTable } from '@/components/data-table/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Vendor } from '@/types';
import Link from 'next/link';

const columns: ColumnDef<Vendor>[] = [
  { accessorKey: 'name', header: 'Vendor', cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span> },
  { accessorKey: 'type', header: 'Type', cell: ({ row }) => (row.getValue('type') as string).replace(/_/g, ' ') },
  { accessorKey: 'email', header: 'Email', cell: ({ row }) => row.getValue('email') || '—' },
  { accessorKey: 'phone', header: 'Phone', cell: ({ row }) => row.getValue('phone') || '—' },
  { accessorKey: 'paymentTerms', header: 'Terms', cell: ({ row }) => row.getValue('paymentTerms') },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.getValue('status')} /> },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-gray-800">
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View Vendor</DropdownMenuItem>
          <DropdownMenuItem>View Bills</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function VendorsPage() {
  const { data, isLoading } = useVendors({ limit: 50 });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground mt-1">{data ? `${(((data as any).meta?.total) ?? 0).toLocaleString()} vendors` : 'Loading...'}</p>
        </div>
        <Link href="/vendors/new" className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"><Plus className="h-4 w-4" />Add Vendor</Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        <DataTable columns={columns} data={data?.data ?? []} searchKey="name" />
      )}
    </div>
  );
}
