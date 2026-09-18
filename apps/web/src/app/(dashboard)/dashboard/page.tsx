'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { DashboardFilters as FilterState } from '@/types/dashboard';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { TopClients } from '@/components/dashboard/top-clients';
import { RecentBookings } from '@/components/dashboard/recent-bookings';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: new Date().toISOString(), end: new Date().toISOString() }
  });

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-kpis', filters],
    queryFn: () => dashboardService.getKPIs(filters),
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-background p-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time transporter overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <DashboardFilters filters={filters} onChange={setFilters} />
          <Link href="/loads/new" passHref>
            <Button variant="default" size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="shrink-0">
        <KPICards data={metrics} isLoading={isLoading} />
      </div>
      
      <div className="flex-1 grid gap-4 grid-cols-12 min-h-0 pb-4">
        <div className="col-span-12 xl:col-span-8 flex flex-col min-h-0">
          <RecentBookings bookings={metrics?.recentBookings} isLoading={isLoading} />
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col min-h-0">
          <TopClients clients={metrics?.topClients} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
