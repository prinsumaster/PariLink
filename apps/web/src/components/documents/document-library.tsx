'use client';

import { useMemo, useState } from 'react';
import { Document, DocumentFilters } from '@/types/documents';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, FileImage, File, Trash2, Download, Eye, Clock, AlertTriangle } from 'lucide-react';

interface DocumentLibraryProps {
  documents: Document[];
  total: number;
  isLoading: boolean;
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
  onViewDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
  if (mimeType.includes('image')) return <FileImage className="h-4 w-4 text-blue-500" />;
  return <File className="h-4 w-4 text-gray-500" />;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DocumentLibrary({ documents, total, isLoading, filters, onFiltersChange, onViewDocument, onDeleteDocument }: DocumentLibraryProps) {
  
  const columns = useMemo<ColumnDef<Document>[]>(
    () => [
      {
        accessorKey: 'filename',
        header: 'File Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewDocument(row.original)}>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
              {getFileIcon(row.original.mimeType)}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {row.original.filename}
              </div>
              <div className="text-xs text-gray-500">{formatBytes(row.original.sizeBytes)} • v{row.original.version}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {row.getValue('category')}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          if (status === 'EXPIRED') return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1"/> Expired</Badge>;
          if (status === 'PENDING_REVIEW') return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1"/> Review</Badge>;
          if (status === 'ARCHIVED') return <Badge variant="outline">Archived</Badge>;
          return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
        },
      },
      {
        id: 'uploaded',
        header: 'Uploaded',
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="text-gray-900 dark:text-white">{new Date(row.original.createdAt).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">by {row.original.uploadedBy}</div>
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => onViewDocument(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-gray-900" onClick={() => window.open(row.original.url, '_blank')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDeleteDocument(row.original.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }
    ],
    [onViewDocument, onDeleteDocument]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: documents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / (filters.limit || 20)),
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left group/table">
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
                  <td className="px-4 py-4 flex gap-3"><div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div><div className="space-y-2"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></div></td>
                  <td className="px-4 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-800 rounded-full w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-1"></div><div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-20"></div></td>
                  <td className="px-4 py-4"></td>
                </tr>
              ))
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No documents found.</p>
                  <p className="text-sm text-gray-400 mt-1">Upload a file or adjust your filters.</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200 hover:elevation-1 group"
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
              Showing <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 20) + (total > 0 ? 1 : 0)}</span> to <span className="font-medium">{Math.min((filters.page || 1) * (filters.limit || 20), total)}</span> of <span className="font-medium">{total}</span> documents
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
