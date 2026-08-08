'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Vehicle, FleetFilters } from '@/types/fleet';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, AlertTriangle, Wrench, CheckCircle2 } from 'lucide-react';

interface VehicleTableProps {
  vehicles: Vehicle[];
  total: number;
  isLoading: boolean;
  filters: FleetFilters;
  onFiltersChange: (filters: FleetFilters) => void;
}

const getStatusBadge = (status: Vehicle['status']) => {
  switch (status) {
    case 'AVAILABLE':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"><CheckCircle2 className="mr-1 h-3 w-3" /> Available</Badge>;
    case 'IN_USE':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"><Truck className="mr-1 h-3 w-3" /> In Use</Badge>;
    case 'MAINTENANCE':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"><Wrench className="mr-1 h-3 w-3" /> Maintenance</Badge>;
    case 'OUT_OF_SERVICE':
      return <Badge variant="destructive" className="bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50"><AlertTriangle className="mr-1 h-3 w-3" /> Out of Service</Badge>;
    default:
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">{status}</Badge>;
  }
};

export function VehicleTable({ vehicles, total, isLoading, filters, onFiltersChange }: VehicleTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        id: 'registrationNumber',
        header: 'Registration #',
        cell: ({ row }) => {
          const reg = row.original.registrationNumber || (row.original as any).licensePlate || 'N/A';
          return (
            <div className="font-medium text-blue-600 dark:text-blue-400">
              {reg}
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <span className="capitalize">{row.getValue<string>('type').toLowerCase()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
      },
      {
        accessorKey: 'odometer',
        header: 'Odometer (mi)',
        cell: ({ row }) => <span className="text-sm text-gray-500">{row.getValue<number>('odometer')?.toLocaleString() ?? '0'}</span>,
      },
      {
        accessorKey: 'fuelLevel',
        header: 'Fuel / Battery',
        cell: ({ row }) => {
          const fuel = row.getValue<number>('fuelLevel');
          const color = fuel < 20 ? 'bg-red-500' : fuel < 50 ? 'bg-orange-500' : 'bg-green-500';
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${fuel}%` }}></div>
              </div>
              <span className="text-xs text-gray-500">{fuel}%</span>
            </div>
          );
        },
      }
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: vehicles,
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
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></td>
                </tr>
              ))
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-medium">No vehicles found</p>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => router.push(`/fleet/${row.original.id}`)}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })}
            disabled={(filters.page || 1) === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })}
            disabled={(filters.page || 1) >= table.getPageCount()}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of{' '}
              <span className="font-medium">{total}</span> vehicles
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                variant="outline"
                className="rounded-r-none"
                onClick={() => onFiltersChange({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })}
                disabled={(filters.page || 1) === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="rounded-l-none"
                onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })}
                disabled={(filters.page || 1) >= table.getPageCount()}
              >
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
