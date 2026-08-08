'use client';

import { OrderFilters as FilterState, OrderStatus, PaymentStatus } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface OrderFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function OrderFilters({ filters, onChange }: OrderFiltersProps) {
  const handleStatusChange = (value: string | null) => {
    if (value === 'all' || value === null) {
      const { status, ...rest } = filters;
      onChange({ ...rest, page: 1 });
    } else {
      onChange({ ...filters, status: [value as OrderStatus], page: 1 });
    }
  };

  const handlePaymentChange = (value: string | null) => {
    if (value === 'all' || value === null) {
      const { paymentStatus, ...rest } = filters;
      onChange({ ...rest, page: 1 });
    } else {
      onChange({ ...filters, paymentStatus: [value as PaymentStatus], page: 1 });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    onChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = !!filters.status || !!filters.paymentStatus || !!filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center p-4 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm glass elevation-1 transition-all duration-300">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hidden sm:flex">
        <Filter className="h-4 w-4 text-blue-500" /> Filters
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search order # or customer..." 
            className="pl-9 bg-white/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 focus-visible:ring-blue-500 transition-all duration-200"
            value={filters.search || ''}
            onChange={handleSearch}
          />
        </div>

        <Select 
          value={(filters.status && filters.status.length > 0) ? filters.status[0] : 'all'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="bg-white/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 focus:ring-blue-500 transition-all duration-200">
            <SelectValue placeholder="Shipment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="READY_FOR_PICKUP">Ready for Pickup</SelectItem>
            <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={(filters.paymentStatus && filters.paymentStatus.length > 0) ? filters.paymentStatus[0] : 'all'} 
          onValueChange={handlePaymentChange}
        >
          <SelectTrigger className="bg-white/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/60 focus:ring-blue-500 transition-all duration-200">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
