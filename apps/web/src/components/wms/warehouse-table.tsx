'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Warehouse, WMSFilters } from '@/types/wms';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, CheckCircle2, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  total: number;
  isLoading: boolean;
  filters: WMSFilters;
  onFiltersChange: (filters: WMSFilters) => void;
}

const getStatusBadge = (status: Warehouse['status']) => {
  switch (status) {
    case 'OPERATIONAL':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle2 className="mr-1 h-3 w-3" /> Operational</Badge>;
    case 'AT_CAPACITY':
      return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> At Capacity</Badge>;
    case 'MAINTENANCE':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"><AlertCircle className="mr-1 h-3 w-3" /> Maintenance</Badge>;
    case 'CLOSED':
      return <Badge variant="secondary"><XCircle className="mr-1 h-3 w-3" /> Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function WarehouseTable({ warehouses, total, isLoading, filters, onFiltersChange }: WarehouseTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<Warehouse>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
          <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
            {row.getValue('code')}
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Facility',
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{row.original.name}</div>
            <div className="text-xs text-gray-500">{row.original.type.replace(/_/g, ' ')}</div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
      },
      {
        id: 'location',
        header: 'Location',
        cell: ({ row }) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.address.city}, {row.original.address.state}</span>,
      },
      {
        id: 'utilization',
        header: 'Capacity (Pallets)',
        cell: ({ row }) => {
          const util = row.original.capacity.utilizationPercentage;
          const color = util > 90 ? 'bg-red-500' : util > 75 ? 'bg-orange-500' : 'bg-green-500';
          return (
            <div className="flex flex-col gap-1 w-32">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-700 dark:text-gray-300">{row.original.capacity.availablePallets.toLocaleString()} free</span>
                <span className="text-gray-500">{util}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${util}%` }}></div>
              </div>
            </div>
          );
        },
      }
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: warehouses,
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
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></td>
                  <td className="px-4 py-4 space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4 space-y-1"><div className="flex justify-between w-32"><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-8"></div></div><div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded w-32"></div></td>
                </tr>
              ))
            ) : warehouses.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No facilities found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => router.push(`/wms/${row.original.id}`)}
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
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of <span className="font-medium">{total}</span> facilities
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
