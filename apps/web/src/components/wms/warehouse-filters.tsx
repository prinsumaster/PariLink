'use client';

import { WMSFilters as FilterState, WarehouseStatus, WarehouseType } from '@/types/wms';
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

interface WarehouseFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function WarehouseFilters({ filters, onChange }: WarehouseFiltersProps) {
  const handleStatusChange = (value: string | null) => {
    if (value === 'all' || value === null) {
      const { status, ...rest } = filters;
      onChange({ ...rest, page: 1 });
    } else {
      onChange({ ...filters, status: [value as WarehouseStatus], page: 1 });
    }
  };

  const handleTypeChange = (value: string | null) => {
    if (value === 'all' || value === null) {
      const { type, ...rest } = filters;
      onChange({ ...rest, page: 1 });
    } else {
      onChange({ ...filters, type: [value as WarehouseType], page: 1 });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    onChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = !!filters.status || !!filters.type || !!filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hidden sm:flex">
        <Filter className="h-4 w-4" /> Filters
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search code, name, or city..." 
            className="pl-9"
            value={filters.search || ''}
            onChange={handleSearch}
          />
        </div>

        <Select 
          value={(filters.status && filters.status.length > 0) ? filters.status[0] : 'all'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Facility Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="OPERATIONAL">Operational</SelectItem>
            <SelectItem value="AT_CAPACITY">At Capacity</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={(filters.type && filters.type.length > 0) ? filters.type[0] : 'all'} 
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Facility Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="DISTRIBUTION_CENTER">Dist. Center</SelectItem>
            <SelectItem value="FULFILLMENT_CENTER">Fulfillment</SelectItem>
            <SelectItem value="CROSS_DOCK">Cross Dock</SelectItem>
            <SelectItem value="COLD_STORAGE">Cold Storage</SelectItem>
            <SelectItem value="BONDED">Bonded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-gray-500"
        >
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
