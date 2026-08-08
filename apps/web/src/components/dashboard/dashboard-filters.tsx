'use client';

import { DashboardFilters as FilterState } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface DashboardFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  const handleRegionChange = (value: string | null) => {
    onChange({ ...filters, regionId: value === 'all' || value === null ? undefined : value });
  };

  const handleFleetChange = (value: string | null) => {
    onChange({ ...filters, fleetId: value === 'all' || value === null ? undefined : value });
  };

  const hasActiveFilters = !!filters.regionId || !!filters.fleetId;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <Filter className="h-4 w-4" /> Filters
      </div>
      
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <Select value={filters.regionId || 'all'} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="na">North America</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="apac">APAC</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.fleetId || 'all'} onValueChange={handleFleetChange}>
          <SelectTrigger>
            <SelectValue placeholder="Fleet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fleets</SelectItem>
            <SelectItem value="heavy">Heavy Duty</SelectItem>
            <SelectItem value="last-mile">Last Mile</SelectItem>
            <SelectItem value="contractor">Contractors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onChange({ dateRange: filters.dateRange })}
          className="text-gray-500"
        >
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
