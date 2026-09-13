'use client';

import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Wrench,
  Truck,
  CircleDot,
  Search,
  AlertTriangle,
  Calendar,
  IndianRupee,
} from 'lucide-react';

interface KundaliEntry {
  type: 'JOB_CARD' | 'MAINTENANCE_JOB' | 'TYRE_LOG';
  id: string;
  date: string; // ISO string
  status: string;
  title: string;
  cost: number | null;
  details: Record<string, any>;
}

const TYPE_META: Record<
  KundaliEntry['type'],
  { label: string; icon: React.ReactNode; colorClass: string; pillClass: string }
> = {
  JOB_CARD: {
    label: 'Job Card',
    icon: <Wrench className="h-4 w-4" />,
    colorClass: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20',
    pillClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  MAINTENANCE_JOB: {
    label: 'Maintenance',
    icon: <Truck className="h-4 w-4" />,
    colorClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20',
    pillClass: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  TYRE_LOG: {
    label: 'Tyre Action',
    icon: <CircleDot className="h-4 w-4" />,
    colorClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20',
    pillClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

function KundaliCard({ entry }: { entry: KundaliEntry }) {
  const meta = TYPE_META[entry.type];
  const date = new Date(entry.date);
  const dateStr = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Guard: only show details that have values
  const detailEntries = Object.entries(entry.details || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== ''
  );

  return (
    <div
      className={`rounded-xl border p-4 ${meta.colorClass} transition-all hover:shadow-md`}
      id={`kundali-entry-${entry.id.slice(0, 8)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.pillClass}`}
          >
            {meta.icon}
            {meta.label}
          </span>
          <Badge variant="outline" className="text-xs font-normal">
            {entry.status}
          </Badge>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            {dateStr}
          </div>
          {entry.cost !== null && entry.cost !== undefined && (
            <div className="flex items-center justify-end gap-0.5 font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              <IndianRupee className="h-3.5 w-3.5" />
              {Number(entry.cost).toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </div>

      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-2 text-sm">
        {entry.title}
      </p>

      {detailEntries.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {detailEntries.map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                {k.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {Array.isArray(v) ? (Array.isArray(v) && v.join(', ')) || '—' : String(v)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function fetchKundali(vehicleId: string): Promise<KundaliEntry[]> {
  const res = await api.get(`/maintenance/kundali/${vehicleId}`);
  return res.data;
}

function VehicleKundaliContent() {
  const searchParams = useSearchParams();
  const defaultId = searchParams.get('vehicleId') || '';
  const [vehicleIdInput, setVehicleIdInput] = useState(defaultId);
  const [vehicleId, setVehicleId] = useState<string | null>(defaultId || null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['kundali', vehicleId],
    queryFn: () => fetchKundali(vehicleId!),
    enabled: !!vehicleId,
    retry: false,
  });

  // Guard: Array.isArray before any .map()
  const timeline: KundaliEntry[] = Array.isArray(data) ? data : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = vehicleIdInput.trim();
    if (!id) return;
    setVehicleId(id);
  };

  const errorMessage =
    (error as any)?.normalizedMessage ||
    (error as any)?.response?.data?.message ||
    'Failed to load service history.';

  const typeCounts = {
    JOB_CARD: timeline.filter((e) => e.type === 'JOB_CARD').length,
    MAINTENANCE_JOB: timeline.filter((e) => e.type === 'MAINTENANCE_JOB').length,
    TYRE_LOG: timeline.filter((e) => e.type === 'TYRE_LOG').length,
  };

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <PageHeader
        title="Vehicle Service Kundali"
        description="Complete chronological service history — job cards, maintenance jobs, and tyre actions aggregated from all maintenance tables."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Look Up Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor="vehicle-id">Vehicle ID (UUID)</Label>
              <Input
                id="vehicle-id"
                value={vehicleIdInput}
                onChange={(e) => setVehicleIdInput(e.target.value)}
                placeholder="Paste vehicle UUID..."
                className="font-mono text-sm"
              />
            </div>
            <Button
              type="submit"
              className="self-end"
              disabled={isLoading}
              id="btn-load-kundali"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Load Kundali'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isError && vehicleId && (
        <Card className="border-red-300 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">
                  Could not load kundali
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{errorMessage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && vehicleId && timeline.length === 0 && (
        <div className="py-16 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700">No service records found</h3>
          <p className="text-slate-500 text-sm mt-1">
            This vehicle has no job cards, maintenance jobs, or tyre logs yet.
          </p>
        </div>
      )}

      {timeline.length > 0 && (
        <>
          {/* Summary chips */}
          <div className="flex flex-wrap gap-2" id="kundali-summary">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Wrench className="h-3 w-3 mr-1" />
              {typeCounts.JOB_CARD} Job Cards
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Truck className="h-3 w-3 mr-1" />
              {typeCounts.MAINTENANCE_JOB} Maintenance Jobs
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CircleDot className="h-3 w-3 mr-1" />
              {typeCounts.TYRE_LOG} Tyre Actions
            </Badge>
            <Badge variant="secondary" className="ml-auto">
              {timeline.length} total · chronological ↓ newest first
            </Badge>
          </div>

          {/* Timeline — sorted server-side (desc date), rendered as-is */}
          <div className="space-y-3" id="kundali-timeline">
            {Array.isArray(timeline) &&
              timeline.map((entry) => (
                <KundaliCard key={entry.id} entry={entry} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function VehicleKundaliPage() {
  return (
    <Suspense fallback={<div>Loading Kundali...</div>}>
      <VehicleKundaliContent />
    </Suspense>
  );
}
