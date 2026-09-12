'use client';

import { useQuery } from '@tanstack/react-query';
import { intelligenceService, FuelRootCauseEntry, FuelAnomaly } from '@/services/intelligence';
import { Badge } from '@/components/ui/badge';
import {
  Fuel,
  User,
  Truck,
  Map,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// ── Cause metadata
const CAUSE_META: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode; pillClass: string }
> = {
  DRIVER: {
    label: 'Driver Behaviour',
    color: '#ef4444',
    bg: 'bg-red-50',
    icon: <User className="h-4 w-4" />,
    pillClass: 'bg-red-100 text-red-700 border-red-200',
  },
  MECHANICAL: {
    label: 'Mechanical',
    color: '#f97316',
    bg: 'bg-orange-50',
    icon: <Truck className="h-4 w-4" />,
    pillClass: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  ROUTE: {
    label: 'Route Factor',
    color: '#eab308',
    bg: 'bg-yellow-50',
    icon: <Map className="h-4 w-4" />,
    pillClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  INVESTIGATE: {
    label: 'Investigate',
    color: '#3b82f6',
    bg: 'bg-blue-50',
    icon: <AlertTriangle className="h-4 w-4" />,
    pillClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  INSUFFICIENT_DATA: {
    label: 'Insufficient Data',
    color: '#94a3b8',
    bg: 'bg-slate-50',
    icon: <HelpCircle className="h-4 w-4" />,
    pillClass: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  NORMAL: {
    label: 'Normal',
    color: '#10b981',
    bg: 'bg-emerald-50',
    icon: <CheckCircle2 className="h-4 w-4" />,
    pillClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

function VarianceBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-slate-400">–</span>;
  const abs = Math.abs(pct).toFixed(1);
  if (pct > 5) return (
    <span className="flex items-center gap-1 text-red-600 font-bold text-sm">
      <TrendingUp className="h-3.5 w-3.5" />+{abs}%
    </span>
  );
  if (pct < -5) return (
    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
      <TrendingDown className="h-3.5 w-3.5" />{pct.toFixed(1)}%
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-slate-500 font-bold text-sm">
      <Minus className="h-3.5 w-3.5" />{abs}%
    </span>
  );
}

function RootCauseRow({ entry }: { entry: FuelRootCauseEntry }) {
  const [open, setOpen] = useState(false);
  const meta = CAUSE_META[entry.rootCause] ?? CAUSE_META.INVESTIGATE;

  return (
    <div
      className={`rounded-xl border border-slate-200 ${meta.bg} overflow-hidden transition-all duration-200 hover:shadow-md`}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
        role="button"
        aria-expanded={open}
      >
        {/* Cause badge */}
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${meta.pillClass}`}
        >
          {meta.icon}
          {meta.label}
        </div>

        {/* Driver + Vehicle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-slate-900 truncate">{entry.driverName}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600 text-sm truncate">{entry.licensePlate}</span>
          </div>
          {entry.routeKey && (
            <div className="text-xs text-slate-500 mt-0.5 truncate">
              {entry.routeKey.replace(':', ' → ')}
            </div>
          )}
        </div>

        {/* Litres */}
        <div className="text-right min-w-[80px]">
          <div className="font-bold text-slate-900 text-sm">{entry.litres}L</div>
          <div className="text-xs text-slate-400">filled</div>
        </div>

        {/* Variance */}
        <div className="text-right min-w-[72px]">
          <VarianceBadge pct={entry.variancePct} />
          <div className="text-xs text-slate-400">vs expected</div>
        </div>

        {/* Confidence */}
        <div className="hidden md:block text-right min-w-[56px]">
          <span className={`text-xs font-semibold ${entry.confidence === 'HIGH' ? 'text-emerald-600' : 'text-amber-500'}`}>
            {entry.confidence}
          </span>
          <div className="text-xs text-slate-400">confidence</div>
        </div>

        {/* Expand */}
        <ChevronRight
          className={`h-4 w-4 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-90' : ''}`}
        />
      </div>

      {/* Expanded explanation */}
      {open && (
        <div className="px-4 pb-4 border-t border-slate-200/60">
          <div className="mt-3 flex gap-2 text-sm text-slate-700">
            <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{entry.explanation}</p>
          </div>
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            <span>Comparison group size: <strong className="text-slate-700">{entry.comparisonGroupSize}</strong></span>
            {entry.expectedLitres && (
              <span>Expected: <strong className="text-slate-700">{entry.expectedLitres.toFixed(0)}L</strong></span>
            )}
          </div>
          <Link
            href={`/trips/${entry.tripId}`}
            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 hover:text-blue-700"
            onClick={e => e.stopPropagation()}
          >
            View Trip <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label, count, icon, colorClass,
}: {
  label: string; count: number; icon: React.ReactNode; colorClass: string;
}) {
  return (
    <div className={`rounded-xl border p-4 flex items-center gap-3 ${colorClass}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <div className="text-2xl font-black leading-none">{count}</div>
        <div className="text-xs font-medium text-slate-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

type ActiveFilter = 'ALL' | 'DRIVER' | 'MECHANICAL' | 'ROUTE' | 'INVESTIGATE' | 'INSUFFICIENT_DATA' | 'NORMAL';

export default function FuelIntelligencePage() {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL');

  const { data: rootCause = [], isLoading: loadingRC } = useQuery({
    queryKey: ['fuel-root-cause'],
    queryFn: intelligenceService.getFuelRootCause,
  });

  const { data: anomalies = [], isLoading: loadingAnom } = useQuery({
    queryKey: ['fuel-anomalies'],
    queryFn: intelligenceService.getFuelAnomalies,
  });

  const isLoading = loadingRC || loadingAnom;

  // Guard — Array.isArray before any .filter() or .length
  const safeRootCause: FuelRootCauseEntry[] = Array.isArray(rootCause) ? rootCause : [];
  const safeAnomalies: FuelAnomaly[] = Array.isArray(anomalies) ? anomalies : [];

  const counts = {
    DRIVER: safeRootCause.filter(e => e.rootCause === 'DRIVER').length,
    MECHANICAL: safeRootCause.filter(e => e.rootCause === 'MECHANICAL').length,
    ROUTE: safeRootCause.filter(e => e.rootCause === 'ROUTE').length,
    INVESTIGATE: safeRootCause.filter(e => e.rootCause === 'INVESTIGATE').length,
    INSUFFICIENT_DATA: safeRootCause.filter(e => e.rootCause === 'INSUFFICIENT_DATA').length,
    NORMAL: safeRootCause.filter(e => e.rootCause === 'NORMAL').length,
  };

  const filtered = activeFilter === 'ALL'
    ? safeRootCause
    : safeRootCause.filter(e => e.rootCause === activeFilter);

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl" />)}
        </div>
        {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-slate-200 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Fuel className="h-5 w-5 text-white" />
          </div>
          Fuel Intelligence
        </h1>
        <p className="text-slate-500 mt-2 text-sm max-w-xl">
          Root-cause isolation holds variables constant: same vehicle + route → driver behaviour;
          same driver + route → mechanical; same driver + vehicle → route difficulty.
          Returns <strong>INSUFFICIENT_DATA</strong> when no comparison group exists.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <SummaryCard
          label="Driver Behaviour" count={counts.DRIVER}
          colorClass="bg-red-50 border-red-100 text-red-900"
          icon={<User className="h-5 w-5 text-red-500" />}
        />
        <SummaryCard
          label="Mechanical" count={counts.MECHANICAL}
          colorClass="bg-orange-50 border-orange-100 text-orange-900"
          icon={<Truck className="h-5 w-5 text-orange-500" />}
        />
        <SummaryCard
          label="Route Factor" count={counts.ROUTE}
          colorClass="bg-yellow-50 border-yellow-100 text-yellow-900"
          icon={<Map className="h-5 w-5 text-yellow-500" />}
        />
        <SummaryCard
          label="Investigate" count={counts.INVESTIGATE}
          colorClass="bg-blue-50 border-blue-100 text-blue-900"
          icon={<AlertTriangle className="h-5 w-5 text-blue-500" />}
        />
        <SummaryCard
          label="No Data" count={counts.INSUFFICIENT_DATA}
          colorClass="bg-slate-50 border-slate-200 text-slate-700"
          icon={<Layers className="h-5 w-5 text-slate-400" />}
        />
        <SummaryCard
          label="Normal" count={counts.NORMAL}
          colorClass="bg-emerald-50 border-emerald-100 text-emerald-900"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      {/* Filter tabs */}
      {safeRootCause.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'DRIVER', 'MECHANICAL', 'ROUTE', 'INVESTIGATE', 'INSUFFICIENT_DATA', 'NORMAL'] as ActiveFilter[]).map(f => (
            <button
              key={f}
              id={`filter-${f.toLowerCase()}`}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeFilter === f
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {f === 'ALL' ? `All (${safeRootCause.length})` : `${CAUSE_META[f]?.label ?? f} (${counts[f as keyof typeof counts] ?? 0})`}
            </button>
          ))}
        </div>
      )}

      {/* Root-cause feed */}
      <div className="space-y-3">
        {Array.isArray(filtered) && filtered.map((entry) => (
          <RootCauseRow key={entry.fuelEntryId} entry={entry} />
        ))}
      </div>

      {/* Empty state */}
      {safeRootCause.length === 0 && (
        <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No Fuel Entries Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm">
            Add fuel entries to trips to start seeing root-cause attribution here.
            At least 2 trips sharing a vehicle+route or driver+route are needed to isolate a cause.
          </p>
        </div>
      )}

      {/* Legacy anomalies section */}
      {safeAnomalies.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Legacy Anomaly Feed
            <Badge variant="secondary" className="ml-2 text-xs">{safeAnomalies.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(safeAnomalies) && safeAnomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={anomaly.severity === 'HIGH' ? 'destructive' : 'secondary'}>
                    {anomaly.cause}
                  </Badge>
                  <span className="text-lg font-black text-red-600">+{anomaly.variancePct}%</span>
                </div>
                <p className="font-semibold text-sm text-slate-900 mb-1">{anomaly.entityName}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{anomaly.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
