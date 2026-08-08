'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { User, AdminFilters } from '@/types/admin';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, ShieldAlert, Mail, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserTableProps {
  users: User[];
  total: number;
  isLoading: boolean;
  filters: AdminFilters;
  onFiltersChange: (filters: AdminFilters) => void;
  onLockUser: (id: string) => void;
  onResetPassword: (id: string) => void;
}

const getRoleBadge = (role: string) => {
  if (role.includes('ADMIN')) return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">Admin</Badge>;
  if (role === 'OPERATIONS' || role === 'DISPATCHER') return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{role}</Badge>;
  if (role === 'FINANCE' || role === 'SALES') return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">{role}</Badge>;
  return <Badge variant="outline">{role}</Badge>;
};

export function UserTable({ users, total, isLoading, filters, onFiltersChange, onLockUser, onResetPassword }: UserTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {row.original.firstName.charAt(0)}{row.original.lastName.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {row.original.firstName} {row.original.lastName}
              </div>
              <div className="text-xs text-gray-500">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => getRoleBadge(row.getValue('role')),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {row.getValue('department') || <span className="text-gray-400 italic">None</span>}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          if (status === 'LOCKED') return <Badge variant="destructive"><Lock className="h-3 w-3 mr-1"/> Locked</Badge>;
          if (status === 'PENDING_INVITE') return <Badge variant="secondary"><Mail className="h-3 w-3 mr-1"/> Pending</Badge>;
          if (status === 'INACTIVE') return <Badge variant="outline">Inactive</Badge>;
          return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><Unlock className="h-3 w-3 mr-1"/> Active</Badge>;
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 w-8 p-0 items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/admin/users/${row.original.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onResetPassword(row.original.id)}>
                  <ShieldAlert className="mr-2 h-4 w-4" /> Force Password Reset
                </DropdownMenuItem>
                {row.original.status !== 'LOCKED' && (
                  <DropdownMenuItem onClick={() => onLockUser(row.original.id)} className="text-red-600 focus:text-red-600">
                    <Lock className="mr-2 h-4 w-4" /> Lock Account
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }
    ],
    [router, onLockUser, onResetPassword]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / (filters.limit || 20)),
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
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
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div><div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></div></div></td>
                  <td className="px-4 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4"></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No users found matching the criteria.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
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
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, page: Math.max(1, (filters.page || 1) - 1) })} disabled={(filters.page || 1) === 1}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })} disabled={(filters.page || 1) >= table.getPageCount()}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of <span className="font-medium">{total}</span> users
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
