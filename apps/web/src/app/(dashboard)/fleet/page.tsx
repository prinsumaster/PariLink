'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { FleetFilters as FilterState } from '@/types/fleet';
import Link from 'next/link';
import { Plus, Download, Map as MapIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { VehicleTable } from '@/components/fleet/vehicle-table';
import { VehicleFilters } from '@/components/fleet/vehicle-filters';
import { RoleGuard } from '@/components/auth/role-guard';
import dynamic from 'next/dynamic';

const FleetMap = dynamic(() => import('@/components/fleet/fleet-map').then(mod => mod.FleetMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="text-slate-500 dark:text-slate-400 animate-pulse flex items-center gap-3 font-medium">
        <MapIcon className="h-5 w-5 text-blue-500" /> Loading Geographic Engine...
      </div>
    </div>
  )
});

export default function FleetPage() {
  const [filters, setFilters] = useState<FilterState>({
    page: 1,
    limit: 20,
  });
  const [view, setView] = useState<'table' | 'map'>('table');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['fleet', filters],
    queryFn: () => fleetService.getVehicles(filters),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Fleet Management</h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">Manage vehicles, maintenance, and compliance documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => setView(view === 'table' ? 'map' : 'table')}
            className="flex items-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MapIcon className="mr-2 h-4 w-4" /> {view === 'table' ? 'View Map' : 'View Table'}
          </Button>
          <Button variant="outline" className="flex items-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FLEET_MANAGER']} fallback={null}>
            <Link href="/fleet/new" className={cn(buttonVariants({ variant: 'default' }), "flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all")}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Link>
          </RoleGuard>
        </div>
      </div>

      {view === 'table' ? (
        <>
          <VehicleFilters filters={filters} onChange={setFilters} />
          <div className="glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300">
            <VehicleTable 
              vehicles={data?.data || []} 
              total={data?.total || 0}
              isLoading={isLoading || isFetching}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        </>
      ) : (
        <div className="h-[600px] w-full glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300">
          <FleetMap vehicles={data?.data || []} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
