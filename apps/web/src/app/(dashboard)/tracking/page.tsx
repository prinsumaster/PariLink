'use client';

import { useLoads } from '@/hooks/use-loads';
import { StatusBadge } from '@/components/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Activity, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TrackingPage() {
  const { data: loadsData, isLoading } = useLoads({ status: 'IN_TRANSIT', limit: 50 });

  const activeLoads = loadsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Tracking</h1>
          <p className="text-muted-foreground mt-1">
            {activeLoads.length} loads currently in transit
          </p>
        </div>
        <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Map Placeholder — can wire MapLibre/Leaflet here */}
      <div className="rounded-xl border bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
        <div className="h-[420px] bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex flex-col items-center justify-center gap-4">
          <MapPin className="h-12 w-12 text-blue-300 dark:text-blue-700" />
          <div className="text-center">
            <p className="font-semibold text-gray-700 dark:text-gray-200">Live Map View</p>
            <p className="text-sm text-muted-foreground mt-1">
              Integrate MapLibre GL or Leaflet to render real GPS markers from{' '}
              <code className="text-xs bg-gray-200 dark:bg-slate-800 px-1 py-0.5 rounded">
                /api/v1/tracking/location
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Active Loads panel */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Active Loads</h2>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : activeLoads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl">
            <Activity className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-muted-foreground">No loads currently in transit</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeLoads.map((load) => (
              <Link key={load.id} href={`/loads/${load.id}`}>
                <div className="rounded-xl border bg-white dark:bg-gray-950 p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {load.referenceNumber}
                    </span>
                    <StatusBadge status={load.status} />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {load.originCity} → {load.destinationCity}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
