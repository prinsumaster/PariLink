'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiData {
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  total?: number;
}

interface GlassKpiCardProps {
  title: string;
  data: KpiData | null;
  prefix?: string;
  suffix?: string;
}

export function GlassKpiCard({ title, data, prefix = '', suffix = '' }: GlassKpiCardProps) {
  if (!data) {
    return (
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6 flex flex-col justify-center animate-pulse">
        <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-white/20 rounded w-3/4"></div>
      </div>
    );
  }

  const { value, change, trend, total } = data;
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const isNeutral = trend === 'neutral';

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6 transition-all hover:bg-white/15">
      <h3 className="text-sm font-medium text-white/70 mb-2 uppercase tracking-wider">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">
            {prefix}{value.toLocaleString()}{suffix}
          </span>
          {total && (
            <span className="text-sm text-white/50 ml-2">
              / {total.toLocaleString()}
            </span>
          )}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-emerald-500/20 text-emerald-300'
                : isNegative
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-slate-500/20 text-slate-300'
            }`}
          >
            {isPositive && <TrendingUp className="w-4 h-4 mr-1" />}
            {isNegative && <TrendingDown className="w-4 h-4 mr-1" />}
            {isNeutral && <Minus className="w-4 h-4 mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
}
