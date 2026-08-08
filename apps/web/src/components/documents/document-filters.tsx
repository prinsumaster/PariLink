'use client';

import { DocumentFilters as FilterState, DocumentCategory } from '@/types/documents';
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

interface DocumentFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function DocumentFilters({ filters, onChange }: DocumentFiltersProps) {
  
  const handleCategoryChange = (value: string | null) => {
    if (value === 'all' || value === null) {
      const { category, ...rest } = filters;
      onChange({ ...rest, page: 1 });
    } else {
      onChange({ ...filters, category: [value as DocumentCategory], page: 1 });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    onChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = !!filters.category || !!filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 hidden sm:flex">
        <Filter className="h-4 w-4" /> Filters
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search documents by name, tag, or metadata..." 
            className="pl-9"
            value={filters.search || ''}
            onChange={handleSearch}
          />
        </div>

        <Select 
          value={(filters.category && filters.category.length > 0) ? filters.category[0] : 'all'} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="VEHICLE">Vehicle Records</SelectItem>
            <SelectItem value="DRIVER">Driver Profiles</SelectItem>
            <SelectItem value="SHIPMENT">Shipment Manifests</SelectItem>
            <SelectItem value="CUSTOMER">Customer Contracts</SelectItem>
            <SelectItem value="LEGAL">Legal & Compliance</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
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
