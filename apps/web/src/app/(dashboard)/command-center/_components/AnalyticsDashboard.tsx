'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Truck, Users, Activity, Fuel, Clock, Star, AlertTriangle, CheckCircle as CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 4500 },
  { name: 'Fri', revenue: 6000 },
  { name: 'Sat', revenue: 5500 },
  { name: 'Sun', revenue: 7000 },
];

const DELAY_DATA = [
  { cause: 'Traffic', count: 45 },
  { cause: 'Weather', count: 20 },
  { cause: 'Breakdown', count: 12 },
  { cause: 'Warehouse', count: 35 },
  { cause: 'Driver', count: 8 },
];

export function AnalyticsDashboard() {
  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-950 overflow-y-auto p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Operational Analytics</h2>
          <p className="text-slate-500 mt-1">Live metrics across all fleet and logistics operations.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="On-Time Delivery" value="94.2%" trend="+2.1%" icon={<Clock className="h-5 w-5 text-emerald-500" />} />
          <KpiCard title="Vehicle Utilization" value="89.5%" trend="+5.4%" icon={<Truck className="h-5 w-5 text-indigo-500" />} />
          <KpiCard title="Driver Productivity" value="92%" trend="-1.2%" trendNegative icon={<Users className="h-5 w-5 text-blue-500" />} />
          <KpiCard title="Today's Revenue" value="$142.5K" trend="+12.5%" icon={<TrendingUp className="h-5 w-5 text-purple-500" />} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Revenue Trend (7 Days)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Delay Causes</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DELAY_DATA} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis dataKey="cause" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#334155', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Trip Completion Rate" value="98.1%" icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />} />
          <KpiCard title="Avg Fuel Efficiency" value="6.8 MPG" icon={<Fuel className="h-5 w-5 text-slate-500" />} />
          <KpiCard title="Customer Satisfaction" value="4.8/5.0" icon={<Star className="h-5 w-5 text-amber-500" />} />
          <KpiCard title="Active Anomalies" value="12" icon={<AlertTriangle className="h-5 w-5 text-rose-500" />} />
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, trendNegative, icon }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">{icon}</div>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trendNegative ? "text-rose-600 bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400" : "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400")}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</h4>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
}

