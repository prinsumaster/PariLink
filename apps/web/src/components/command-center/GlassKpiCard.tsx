"use client";



interface GlassKpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function GlassKpiCard({ title, value, description, trend }: GlassKpiCardProps) {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6 flex flex-col space-y-2">
      <h3 className="text-sm font-medium text-slate-300 tracking-wide uppercase">{title}</h3>
      <div className="flex items-baseline space-x-2">
        <span className="text-4xl font-bold text-white">{value}</span>
        {trend && (
          <span
            className={`text-sm font-semibold ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      {description && <p className="text-sm text-slate-400">{description}</p>}
    </div>
  );
}
