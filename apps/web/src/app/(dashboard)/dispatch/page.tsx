'use client';

import { useState } from 'react';
import { useLoads, useUpdateLoad } from '@/hooks/use-loads';
import { useDrivers, useVehicles } from '@/hooks';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Truck, User, Package, RefreshCw, Sparkles, Navigation, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Driver, Vehicle, Load } from '@/types';

interface DispatchCardProps {
  load: Load;
  drivers: Driver[];
  vehicles: Vehicle[];
}

function DispatchCard({ load, drivers, vehicles }: DispatchCardProps) {
  const { mutate: updateLoad, isPending } = useUpdateLoad(load.id);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [isAiAssigning, setIsAiAssigning] = useState(false);

  const handleAutoSelect = () => {
    const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE');
    const availableVehicles = vehicles.filter(v => v.status === 'IN_SERVICE');
    
    if (availableDrivers.length > 0) setSelectedDriver(availableDrivers[0].id);
    if (availableVehicles.length > 0) setSelectedVehicle(availableVehicles[0].id);
    
    toast.success('Optimal routing selected');
  };

  const handleDispatch = () => {
    updateLoad({ 
      status: 'ASSIGNED',
      driverId: selectedDriver || undefined,
      vehicleId: selectedVehicle || undefined
    },
      {
        onSuccess: () => toast.success(`Load ${load.referenceNumber} dispatched!`),
        onError: (err: any) => {
          console.error('[Dispatch] Failed to update load status:', err?.normalizedMessage || err?.message || err);
          toast.error('Dispatch failed');
        },
      }
    );
  };

  const statusColor = {
    PENDING: 'border-l-amber-400',
    ASSIGNED: 'border-l-blue-500',
    IN_TRANSIT: 'border-l-violet-500',
    DELIVERED: 'border-l-emerald-500',
    CANCELLED: 'border-l-red-400',
  }[load.status] ?? 'border-l-gray-200';

  return (
    <div className={`rounded-xl border-l-4 border-y border-r ${statusColor} border-y-slate-200/60 border-r-slate-200/60 dark:border-y-slate-800/60 dark:border-r-slate-800/60 glass elevation-1 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-4 hover:elevation-3 hover:-translate-y-1 transition-all duration-300 space-y-3`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{load.referenceNumber}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {load.originCity} → {load.destinationCity}
          </p>
        </div>
        <StatusBadge status={load.status} />
      </div>

      <div className="text-xs flex items-center justify-between">
        <span className="text-muted-foreground">Rate</span>
        <span className="font-semibold">${load.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </div>

      <Separator />

      <div className="space-y-3">
        {load.status === 'PENDING' && (
          <Button
            size="sm"
            variant="secondary"
            className="w-full bg-indigo-50/50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 text-xs h-8 gap-1.5 transition-all hover:scale-[1.02] group border border-indigo-200/50 dark:border-indigo-500/20"
            onClick={handleAutoSelect}
          >
            <Sparkles className="h-3.5 w-3.5 group-hover:text-amber-500 transition-colors" />
            Auto-Select
          </Button>
        )}

        <Select value={selectedDriver} onValueChange={(val) => setSelectedDriver(val ?? '')} disabled={load.status !== 'PENDING' || isAiAssigning}>
          <SelectTrigger className="w-full h-8 text-xs bg-white/50 dark:bg-slate-950/50 focus-ring hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <SelectValue placeholder="Assign Driver…" />
          </SelectTrigger>
          <SelectContent>
            {drivers.filter(d => d.status === 'AVAILABLE').map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.firstName} {d.lastName}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedVehicle} onValueChange={(val) => setSelectedVehicle(val ?? '')} disabled={load.status !== 'PENDING' || isAiAssigning}>
          <SelectTrigger className="w-full h-8 text-xs bg-white/50 dark:bg-slate-950/50 focus-ring hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <SelectValue placeholder="Assign Vehicle…" />
          </SelectTrigger>
          <SelectContent>
            {vehicles.filter(v => v.status === 'IN_SERVICE').map((v) => (
              <SelectItem key={v.id} value={v.id}>{v.licensePlate} — {v.make}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {load.status === 'PENDING' && selectedDriver && selectedVehicle && (
        <div className="pt-2">
          <Button
            size="sm"
            data-testid="dispatch-now-btn"
            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900 h-8 text-xs gap-1.5 shadow-sm transition-all hover:shadow-md"
            onClick={handleDispatch}
            disabled={isPending}
          >
            <Navigation className="h-3.5 w-3.5" />
            {isPending ? 'Dispatching…' : 'Dispatch Now'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function DispatchPage() {
  const { data: loadsData, isLoading: loadsLoading, refetch } = useLoads({ limit: 100 });
  const { data: driversData } = useDrivers({ limit: 100 });
  const { data: vehiclesData } = useVehicles({ limit: 100 });

  const loads = loadsData?.data ?? [];
  const drivers = driversData?.data ?? [];
  const vehicles = vehiclesData?.data ?? [];

  const columns = [
    { status: 'PENDING', label: 'Pending', color: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-800/60 text-amber-700 dark:text-amber-400' },
    { status: 'ASSIGNED', label: 'Assigned', color: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-400' },
    { status: 'IN_TRANSIT', label: 'In Transit', color: 'bg-violet-50/50 dark:bg-violet-900/10 border-violet-200/60 dark:border-violet-800/60 text-violet-700 dark:text-violet-400' },
    { status: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400' },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch Board</h1>
          <p className="text-muted-foreground mt-1">
            {drivers.filter(d => d.status === 'AVAILABLE').length} drivers available •{' '}
            {vehicles.filter(v => v.status === 'IN_SERVICE').length} vehicles in service
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {columns.map((col) => {
          const count = loads.filter(l => l.status === col.status).length;
          return (
            <div key={col.status} className={`rounded-xl border glass elevation-1 p-4 ${col.color} transition-all duration-300 hover:elevation-2`}>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{col.label}</p>
              <p className="text-3xl font-extrabold mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      {loadsLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.status} className="space-y-3">
              <Skeleton className="h-6 w-24" />
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 overflow-auto">
          {columns.map((col) => {
          const colLoads = loadsData?.data?.filter(l => l.status === col.status) || [];
          return (
              <div key={col.status} className="space-y-3">
                <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10 py-2 border-b border-slate-200/60 dark:border-slate-800/60 mb-2">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">{col.label}</h3>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full elevation-1">
                    {colLoads.length}
                  </span>
                </div>
                {colLoads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full mb-3">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">No {col.label.toLowerCase()} loads</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {colLoads.map((load) => (
                      <DispatchCard
                        key={load.id}
                        load={load}
                        drivers={drivers}
                        vehicles={vehicles}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
