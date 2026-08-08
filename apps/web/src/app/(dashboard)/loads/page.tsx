'use client';

import { useState, useMemo } from 'react';
import { useLoads, useDeleteLoad } from '@/hooks/use-loads';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CreateLoadDialog } from '@/components/forms/create-load-dialog';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Package, Search, ArrowRight, Calendar,
  DollarSign, Truck, AlertTriangle, Clock, CheckCircle2,
  ChevronDown, ChevronUp, FileDown, Eye, Trash2, X,
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import Link from 'next/link';
import { api } from '@/services/api';
import type { Load, LoadStatus } from '@/types';
import { toast } from 'sonner';

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<LoadStatus, {
  label: string;
  icon: React.ElementType;
  dotClass: string;
  borderLeft: string;
  badgeClass: string;
  headerClass: string;
  countClass: string;
  urgency: number; // Lower = higher urgency / shows first
}> = {
  PENDING: {
    label: 'Pending',
    icon: Clock,
    dotClass: 'bg-amber-500',
    borderLeft: 'border-l-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    headerClass: 'text-amber-700 dark:text-amber-400',
    countClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    urgency: 1,
  },
  ASSIGNED: {
    label: 'Assigned',
    icon: Truck,
    dotClass: 'bg-blue-500',
    borderLeft: 'border-l-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    headerClass: 'text-blue-700 dark:text-blue-400',
    countClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    urgency: 2,
  },
  IN_TRANSIT: {
    label: 'In Transit',
    icon: ArrowRight,
    dotClass: 'bg-violet-500 animate-pulse',
    borderLeft: 'border-l-violet-500',
    badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    headerClass: 'text-violet-700 dark:text-violet-400',
    countClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
    urgency: 0,
  },
  DELIVERED: {
    label: 'Delivered',
    icon: CheckCircle2,
    dotClass: 'bg-emerald-500',
    borderLeft: 'border-l-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    headerClass: 'text-emerald-700 dark:text-emerald-400',
    countClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    urgency: 4,
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: X,
    dotClass: 'bg-red-400',
    borderLeft: 'border-l-red-300',
    badgeClass: 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 border-red-200 dark:border-red-800',
    headerClass: 'text-red-500 dark:text-red-400',
    countClass: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    urgency: 5,
  },
};

// ─── Load Card ────────────────────────────────────────────────────────────────
function LoadCard({ load, index }: { load: Load; index: number }) {
  const cfg = STATUS_CONFIG[load.status as LoadStatus] ?? STATUS_CONFIG.PENDING;
  const { mutate: deleteLoad } = useDeleteLoad();

  const pickupDate = new Date(load.pickupDate);
  const deliveryDate = new Date(load.deliveryDate);
  const isDeliveryOverdue = isPast(deliveryDate) && load.status !== 'DELIVERED' && load.status !== 'CANCELLED';
  const isPickupToday = isToday(pickupDate) && load.status === 'PENDING';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.18 }}
      className={cn(
        'group relative rounded-xl border border-l-4 bg-card p-4',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        cfg.borderLeft,
        isDeliveryOverdue && 'ring-1 ring-red-300 dark:ring-red-800',
      )}
    >
      {/* Urgent alert */}
      {isDeliveryOverdue && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-2.5 py-1.5 mb-3">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          Delivery overdue — needs attention
        </div>
      )}
      {isPickupToday && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5 mb-3">
          <Clock className="h-3 w-3 shrink-0" />
          Pickup today — ready to assign
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/loads/${load.id}`}
            className="font-mono text-sm font-bold text-foreground hover:text-primary transition-colors"
          >
            {load.referenceNumber}
          </Link>
          <div className="mt-1">
            <StatusBadge status={load.status} />
          </div>
        </div>
        <Link
          href={`/loads/${load.id}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
          title="View details"
        >
          <Eye className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Route */}
      <div className="mt-3 flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-medium text-foreground text-xs">
            {load.originCity}, {load.originState}
          </span>
        </div>
        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span className="font-medium text-foreground text-xs">
            {load.destinationCity}, {load.destinationState}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>Pickup {format(pickupDate, 'MMM d')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <span className={cn(isDeliveryOverdue && 'text-red-500 dark:text-red-400 font-medium')}>
            Del. {format(deliveryDate, 'MMM d')}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
          <DollarSign className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span>${load.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        {load.equipmentType && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Truck className="h-3 w-3 shrink-0" />
            <span className="truncate capitalize">{load.equipmentType.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>

      {/* Customer chip */}
      {load.customer?.name && (
        <div className="mt-2 text-[11px] text-muted-foreground truncate">
          {load.customer.name}
        </div>
      )}

      {/* Hover actions */}
      <div className="mt-3 pt-3 border-t border-border/60 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <Link
          href={`/loads/${load.id}`}
          className="flex-1 h-7 rounded-md border border-border flex items-center justify-center gap-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Eye className="h-3 w-3" />
          View
        </Link>
        <button
          className="h-7 w-7 rounded-md border border-red-200 dark:border-red-800 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Delete load"
          onClick={() => deleteLoad(load.id, {
            onSuccess: () => toast.success('Load deleted'),
            onError: () => toast.error('Failed to delete load'),
          })}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Status Group ─────────────────────────────────────────────────────────────
function LoadGroup({
  status,
  loads,
  defaultExpanded = true,
}: {
  status: LoadStatus;
  loads: Load[];
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  if (loads.length === 0) return null;

  return (
    <section className="space-y-3">
      <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-2 w-full group">
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', cfg.dotClass)} />
        <Icon className={cn('h-4 w-4 shrink-0', cfg.headerClass)} />
        <span className={cn('text-sm font-semibold', cfg.headerClass)}>{cfg.label}</span>
        <span className={cn('ml-1 text-xs font-semibold px-2 py-0.5 rounded-full', cfg.countClass)}>
          {loads.length}
        </span>
        <span className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors">
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {loads.map((l, i) => <LoadCard key={l.id} load={l} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoadsPage() {
  const { data, isLoading, isError } = useLoads({ page: 1, limit: 100 });
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loads = useMemo(() => {
    const all = data?.data ?? [];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (l) =>
        l.referenceNumber?.toLowerCase().includes(q) ||
        l.originCity?.toLowerCase().includes(q) ||
        l.destinationCity?.toLowerCase().includes(q) ||
        l.customer?.name?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const grouped = useMemo(() => {
    const order: LoadStatus[] = ['IN_TRANSIT', 'PENDING', 'ASSIGNED', 'DELIVERED', 'CANCELLED'];
    return order.reduce(
      (acc, s) => ({ ...acc, [s]: loads.filter((l) => l.status === s) }),
      {} as Record<LoadStatus, Load[]>,
    );
  }, [loads]);

  const needsAttentionCount = useMemo(() =>
    loads.filter((l) =>
      l.deliveryDate &&
      isPast(new Date(l.deliveryDate)) &&
      l.status !== 'DELIVERED' &&
      l.status !== 'CANCELLED',
    ).length,
  [loads]);

  const total = (data as any)?.meta?.total ?? (data as any)?.total ?? 0;

  const handleExport = async () => {
    try {
      await api.post('/exports', { entityType: 'Loads' });
      toast.success('Export started — check the Download Center.');
    } catch {
      toast.error('Failed to start export');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 border-b border-border shrink-0">
          <div className="h-7 w-28 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-52 bg-muted rounded mt-2 animate-pulse" />
        </div>
        <div className="flex-1 px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-border bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-5 border-b border-border shrink-0 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Loads</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Package}
            title="Could not load data"
            description="There was a problem fetching your loads. Check your API connection and try again."
            action={{ label: 'Retry', onClick: () => window.location.reload() }}
          />
        </div>
      </div>
    );
  }

  if ((data?.data?.length ?? 0) === 0) {
    return (
      <div className="flex flex-col h-full">
        <CreateLoadDialog open={createOpen} onOpenChange={setCreateOpen} />
        <div className="px-6 py-5 border-b border-border shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Loads</h1>
            <p className="text-sm text-muted-foreground mt-0.5">No loads yet</p>
          </div>
          <Button className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Load
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={Package}
            title="No loads yet"
            description="Create your first load to manage freight, track shipments, and generate invoices."
            action={{ label: 'Create Load', onClick: () => setCreateOpen(true), icon: Plus }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full page-enter">
      <CreateLoadDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* ── Header ────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Loads</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
              <span>{total} total</span>
              {needsAttentionCount > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {needsAttentionCount} overdue
                  </span>
                </>
              )}
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="text-violet-600 dark:text-violet-400 font-medium">
                {grouped.IN_TRANSIT?.length ?? 0} in transit
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
              <FileDown className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              New Load
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by reference, city, customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow',
            )}
          />
        </div>
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-8">
        {/* Active first */}
        <LoadGroup status="IN_TRANSIT" loads={grouped.IN_TRANSIT ?? []} defaultExpanded />
        <LoadGroup status="PENDING" loads={grouped.PENDING ?? []} defaultExpanded />
        <LoadGroup status="ASSIGNED" loads={grouped.ASSIGNED ?? []} defaultExpanded />
        {/* History — collapsed by default */}
        <LoadGroup status="DELIVERED" loads={grouped.DELIVERED ?? []} defaultExpanded={false} />
        <LoadGroup status="CANCELLED" loads={grouped.CANCELLED ?? []} defaultExpanded={false} />

        {search && loads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No loads match "{search}"</p>
            <p className="text-xs text-muted-foreground mt-1">Try a reference number, city, or customer name</p>
          </div>
        )}
      </div>
    </div>
  );
}
