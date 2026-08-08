'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Trip, TripFilters } from '@/types/trips';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TripTableProps {
  trips: Trip[];
  total: number;
  isLoading: boolean;
  filters: TripFilters;
  onFiltersChange: (filters: TripFilters) => void;
}

const getStatusBadge = (status: Trip['status']) => {
  switch (status) {
    case 'IN_TRANSIT':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"><Truck className="mr-1 h-3 w-3" /> In Transit</Badge>;
    case 'DELAYED':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800/50"><AlertTriangle className="mr-1 h-3 w-3" /> Delayed</Badge>;
    case 'COMPLETED':
      return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
    case 'DRAFT':
    case 'PLANNED':
      return <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700"><Clock className="mr-1 h-3 w-3" /> {status.toLowerCase()}</Badge>;
    default:
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">{status}</Badge>;
  }
};

export function TripTable({ trips, total, isLoading, filters, onFiltersChange }: TripTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<Trip>[]>(
    () => [
      {
        accessorKey: 'trackingNumber',
        header: 'Tracking #',
        cell: ({ row }) => (
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {row.getValue('trackingNumber')}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
      },
      {
        id: 'route',
        header: 'Route',
        cell: ({ row }) => (
          <div className="flex flex-col text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="truncate max-w-[150px]" title={row.original.origin.name}>{row.original.origin.name}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-blue-500" />
              <span className="truncate max-w-[150px]" title={row.original.destination.name}>{row.original.destination.name}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'plannedDeparture',
        header: 'Departure',
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">
            {new Date(row.getValue('plannedDeparture')).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'distance',
        header: 'Distance',
        cell: ({ row }) => (
          <span className="text-sm text-gray-500">
            {row.getValue<number>('distance')} mi
          </span>
        ),
      }
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: trips,
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
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                  </td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></td>
                </tr>
              ))
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-medium">No trips found</p>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => router.push(`/trips/${row.original.id}`)}
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
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + 1}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of{' '}
              <span className="font-medium">{total}</span> results
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
