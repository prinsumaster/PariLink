'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/search-input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, SlidersHorizontal, Download, X, Trash2, FileSpreadsheet, FileText } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Called when export CSV button is clicked */
  onExportCSV?: () => void;
  /** Called when export Excel button is clicked */
  onExportExcel?: () => void;
  /** Custom filter elements (rendered after search) */
  filters?: React.ReactNode;
  /** Whether bulk delete is enabled when rows are selected */
  onBulkDelete?: (ids: string[]) => void;
  /** Field to get ID from for bulk operations */
  getRowId?: (row: TData) => string;
}

/**
 * DataTableToolbar — enterprise toolbar for all data tables.
 * Provides: global search, column visibility, export, and bulk actions.
 */
export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Search...',
  onExportCSV,
  onExportExcel,
  filters,
  onBulkDelete,
  getRowId,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState('');
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const handleSearch = useCallback(
    (val: string) => {
      setSearchValue(val);
      table.setGlobalFilter(val);
    },
    [table]
  );

  const handleBulkDelete = () => {
    if (!onBulkDelete || !getRowId) return;
    const ids = table
      .getFilteredSelectedRowModel()
      .rows.map((r) => getRowId(r.original));
    onBulkDelete(ids);
    table.resetRowSelection();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Bulk action bar — slides in when rows selected */}
      {selectedCount > 0 && (
        <div className={cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-lg',
          'bg-primary/5 border border-primary/20 text-sm',
          'animate-fade-in',
        )}>
          <span className="font-medium text-primary">
            {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div className="flex-1" />
          {onBulkDelete && getRowId && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 h-7"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={() => table.resetRowSelection()}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Main toolbar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearch}
          wrapperClassName="max-w-xs"
        />

        {/* Custom filters */}
        {filters}

        <div className="flex-1" />

        {/* View Options (Column Visibility) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-medium whitespace-nowrap transition-all shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 ml-auto h-8 lg:flex hidden">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Exports */}
        {(onExportCSV || onExportExcel) && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-medium whitespace-nowrap transition-all shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 h-8 hidden lg:flex">
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {onExportCSV && (
                <DropdownMenuCheckboxItem onSelect={onExportCSV}>
                  <FileText className="mr-2 h-4 w-4 text-slate-500" />
                  Export CSV
                </DropdownMenuCheckboxItem>
              )}
              {onExportExcel && (
                <DropdownMenuCheckboxItem onSelect={onExportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" />
                  Export Excel
                </DropdownMenuCheckboxItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
