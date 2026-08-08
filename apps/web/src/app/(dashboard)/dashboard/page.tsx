'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { DashboardFilters as FilterState } from '@/types/dashboard';
import { useWebSocket } from '@/hooks/use-websocket';

import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { KPICards } from '@/components/dashboard/kpi-cards';
import dynamic from 'next/dynamic';
import { Map as MapIcon } from 'lucide-react';

const LiveMap = dynamic(() => import('@/components/dashboard/live-map').then(mod => mod.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full min-h-[400px] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="text-slate-500 dark:text-slate-400 animate-pulse flex items-center gap-3 font-medium">
        <MapIcon className="h-5 w-5 text-blue-500" /> Loading Geographic Engine...
      </div>
    </div>
  )
});
import { AIPanel } from '@/components/dashboard/ai-panel';
import { AlertCenter } from '@/components/dashboard/alert-center';
import { ShipmentPanel } from '@/components/dashboard/shipment-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: new Date().toISOString(), end: new Date().toISOString() }
  });

  const queryClient = useQueryClient();

  // Queries
  const { data: kpis, isLoading: isLoadingKPIs } = useQuery({
    queryKey: ['dashboard-kpis', filters],
    queryFn: () => dashboardService.getKPIs(filters),
  });

  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['dashboard-vehicles', filters],
    queryFn: () => dashboardService.getLiveVehicles(filters),
  });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['dashboard-alerts', filters],
    queryFn: () => dashboardService.getAlerts(filters),
  });

  const { data: aiRecs, isLoading: isLoadingAI } = useQuery({
    queryKey: ['dashboard-ai', filters],
    queryFn: () => dashboardService.getAIRecommendations(filters),
  });

  const { data: shipments, isLoading: isLoadingShipments } = useQuery({
    queryKey: ['dashboard-shipments', filters],
    queryFn: () => dashboardService.getShipments(filters),
  });

  // Real-time WebSocket connection (Disabled for now as backend uses SSE)
  /*
  useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || 'wss://api.parilink.app/ws',
    (msg) => {
      if (msg.type === 'VEHICLE_LOCATION_UPDATE') {
        queryClient.setQueryData(['dashboard-vehicles', filters], (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.map((v: any) => 
            v.id === msg.payload.id ? { ...v, ...msg.payload } : v
          );
        });
      }
      
      if (msg.type === 'NEW_ALERT') {
        queryClient.setQueryData(['dashboard-alerts', filters], (oldData: any) => {
          if (!oldData) return [msg.payload];
          return [msg.payload, ...oldData];
        });
      }
    }
  );
  */

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden bg-background p-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Command Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time enterprise network overview.</p>
        </div>
        <div className="flex items-center space-x-2">
          <DashboardFilters filters={filters} onChange={setFilters} />
          <Button variant="default" size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </div>
      </div>

      {!isLoadingVehicles && vehicles?.length === 0 && !isLoadingShipments && shipments?.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Welcome to PariLink Enterprise"
            description="Your control tower is currently empty. Get started by adding your first vehicle or creating a trip."
            icon={PlusCircle}
            actionLabel="Create Trip"
            actionHref="/trips/new"
          />
        </div>
      )}
      
      <div className="shrink-0">
        <KPICards data={kpis} isLoading={isLoadingKPIs} />
      </div>
      
      <div className="flex-1 grid gap-4 grid-cols-12 min-h-0">
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex-1 rounded-xl overflow-hidden glass elevation-1 border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
            <LiveMap vehicles={vehicles} isLoading={isLoadingVehicles} />
          </div>
          <div className="h-72 rounded-xl glass elevation-1 border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 p-0 flex flex-col">
            <ShipmentPanel shipments={shipments} isLoading={isLoadingShipments} />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
          <AlertCenter alerts={alerts} isLoading={isLoadingAlerts} />
          <AIPanel recommendations={aiRecs} isLoading={isLoadingAI} />
        </div>
      </div>
    </div>
  );
}
