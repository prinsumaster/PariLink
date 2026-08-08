'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  /** Percentage change (positive = up, negative = down) */
  trend?: number;
  /** Trend label e.g. "vs last month" */
  trendLabel?: string;
  /** Lucide icon */
  icon: LucideIcon;
  /** Icon background color variant */
  colorVariant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'slate';
  /** Optional bottom slot (e.g. sparkline, progress bar) */
  footer?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const COLOR_MAP: Record<NonNullable<StatsCardProps['colorVariant']>, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber:   'bg-amber-50  text-amber-600  dark:bg-amber-500/10  dark:text-amber-400',
  rose:    'bg-rose-50   text-rose-600   dark:bg-rose-500/10   dark:text-rose-400',
  violet:  'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  cyan:    'bg-cyan-50   text-cyan-600   dark:bg-cyan-500/10   dark:text-cyan-400',
  slate:   'bg-slate-100 text-slate-600  dark:bg-slate-800     dark:text-slate-400',
};

/**
 * StatsCard — animated KPI card with trend indicator.
 * Used on dashboard and analytics views.
 */
export function StatsCard({
  title,
  value,
  trend,
  trendLabel,
  icon: Icon,
  colorVariant = 'indigo',
  footer,
  className,
  loading = false,
}: StatsCardProps) {
  if (loading) return <StatsCardSkeleton className={className} />;

  const hasTrend = trend !== undefined;
  const trendPositive = (trend ?? 0) >= 0;
  const TrendIcon = hasTrend
    ? trend === 0 ? Minus : trendPositive ? TrendingUp : TrendingDown
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn(
        'relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5',
        'shadow-sm hover:shadow-md transition-shadow cursor-default group',
        className,
      )}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('rounded-lg p-2.5', COLOR_MAP[colorVariant])}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>

        {hasTrend && TrendIcon && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trendPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
            )}
          >
            <TrendIcon className="h-3 w-3" />
            {Math.abs(trend!).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        <p className="mt-1 text-sm font-medium text-muted-foreground truncate">{title}</p>
        {hasTrend && trendLabel && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">{trendLabel}</p>
        )}
      </div>

      {/* Optional footer slot */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-border">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4', className)}>
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
        <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
      </div>
    </div>
  );
}
