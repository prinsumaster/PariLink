'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Truck, Infinity, Zap, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LicenseUsage {
  capacity: {
    vehicles: {
      used: number;
      limit: number;
      effectiveLimit: number;
      utilizationPct: number;
      unlimitedMode: boolean;
      boost: { boostMaxVehicles: number; boostExpiresAt: string } | null;
    };
    drivers: {
      used: number;
      limit: number;
      utilizationPct: number;
    };
  };
  subscriptionPlan: {
    name: string;
    planCode: string;
  };
}

/**
 * LicenseUsageBanner
 *
 * Shows real-time fleet capacity usage in the dashboard sidebar/header.
 * Displays: Trucks Used / Limit, warn when ≥70%, critical when ≥90%.
 * Boost and Unlimited mode states are indicated visually.
 */
export function LicenseUsageBanner() {
  const { data, isLoading } = useQuery<LicenseUsage>({
    queryKey: ['license-usage'],
    queryFn: () => api.get('/admin/licenses/usage').then(r => r.data),
    refetchInterval: 60_000, // refresh every minute
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 animate-pulse">
        <div className="h-3 rounded bg-slate-100 dark:bg-slate-800 w-2/3" />
        <div className="h-2 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (!data) return null;

  const v = data.capacity.vehicles;
  const pct = v.utilizationPct;
  const isWarning  = !v.unlimitedMode && pct >= 70 && pct < 90;
  const isCritical = !v.unlimitedMode && pct >= 90;

  const barColor = isCritical
    ? 'bg-red-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-indigo-500';

  return (
    <div
      className={cn(
        'rounded-xl border p-3 space-y-2.5 transition-colors',
        isCritical
          ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
          : isWarning
          ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isCritical ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          ) : v.unlimitedMode ? (
            <Infinity className="w-3.5 h-3.5 text-purple-500" />
          ) : v.boost ? (
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Truck className="w-3.5 h-3.5 text-indigo-500" />
          )}
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Fleet Capacity
          </span>
        </div>
        <span
          className={cn(
            'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
            data.subscriptionPlan.planCode === 'CUSTOM' || v.unlimitedMode
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
          )}
        >
          {data.subscriptionPlan.name}
        </span>
      </div>

      {/* Metric row */}
      {v.unlimitedMode ? (
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{v.used}</span>
          <span className="text-sm text-slate-400">/ ∞ trucks</span>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-1">
              <span
                className={cn(
                  'text-lg font-bold',
                  isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-900 dark:text-white',
                )}
              >
                {v.used}
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500 mb-0.5">
                / {v.effectiveLimit} trucks
              </span>
            </div>
            <span
              className={cn(
                'text-xs font-semibold',
                isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-500',
              )}
            >
              {pct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-500', barColor)}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>

          {/* Boost badge */}
          {v.boost && (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              <Zap className="w-3 h-3" />
              Boost active until {new Date(v.boost.boostExpiresAt).toLocaleDateString()}
            </div>
          )}

          {/* Capacity limit warning */}
          {isCritical && (
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                License limit reached
              </p>
              <Link
                href="/admin/subscriptions"
                className="flex items-center gap-0.5 text-[10px] text-red-600 hover:underline font-medium"
              >
                Upgrade <ArrowUpRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
