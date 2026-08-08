'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Driver, DriverFilters } from '@/types/drivers';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Truck, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DriverTableProps {
  drivers: Driver[];
  total: number;
  isLoading: boolean;
  filters: DriverFilters;
  onFiltersChange: (filters: DriverFilters) => void;
}

const getStatusBadge = (status: Driver['status']) => {
  switch (status) {
    case 'AVAILABLE':
    case 'ONLINE':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle2 className="mr-1 h-3 w-3" /> {status}</Badge>;
    case 'DRIVING':
    case 'IN_TRIP':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Truck className="mr-1 h-3 w-3" /> {status}</Badge>;
    case 'RESTING':
    case 'ON_LEAVE':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"><Clock className="mr-1 h-3 w-3" /> {status.replace('_', ' ')}</Badge>;
    case 'OFFLINE':
      return <Badge variant="secondary">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getRiskBadge = (rating?: string) => {
  if (!rating) return <span className="text-gray-400">N/A</span>;
  switch (rating) {
    case 'LOW': return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
    case 'MEDIUM': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Med Risk</Badge>;
    case 'HIGH': 
    case 'CRITICAL': return <Badge variant="destructive"><ShieldAlert className="mr-1 h-3 w-3" /> {rating} Risk</Badge>;
    default: return <Badge variant="secondary">{rating}</Badge>;
  }
};

export function DriverTable({ drivers, total, isLoading, filters, onFiltersChange }: DriverTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<Driver>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Driver',
        cell: ({ row }) => {
          const name = row.original.name || `${(row.original as any).firstName || ''} ${(row.original as any).lastName || ''}`.trim() || '??';
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={row.original.photoUrl} alt={name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{name}</div>
                <div className="text-xs text-gray-500">{(row.original as any).employeeCode || ''}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.getValue('status')),
      },
      {
        accessorKey: 'phone',
        header: 'Contact',
        cell: ({ row }) => <span className="text-sm text-gray-600 dark:text-gray-400">{row.getValue('phone')}</span>,
      },
      {
        id: 'safety',
        header: 'Safety Score',
        cell: ({ row }) => {
          const score = row.original.safetyAnalytics?.driverScore;
          return score !== undefined ? (
            <div className="flex items-center gap-2">
              <span className={`font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                {score}/100
              </span>
            </div>
          ) : <span className="text-gray-400">N/A</span>;
        },
      },
      {
        id: 'risk',
        header: 'Risk Profile',
        cell: ({ row }) => getRiskBadge(row.original.safetyAnalytics?.riskRating),
      }
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: drivers,
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
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></div>
                  </td>
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                </tr>
              ))
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No drivers found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => router.push(`/drivers/${row.original.id}`)}
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
      
      <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm rounded-b-xl">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })} disabled={(filters.page || 1) === 1}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })} disabled={(filters.page || 1) >= table.getPageCount()}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of <span className="font-medium">{total}</span> drivers
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
