'use client';
import { money, num } from '@/lib/format';

import { TransporterMetrics } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, FileSpreadsheet, IndianRupee } from 'lucide-react';


interface KPICardsProps {
  data?: TransporterMetrics;
  isLoading: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse glass border-slate-200/60 dark:border-slate-800/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Bookings',
      value: num(data.totalBookings),
      icon: Package,
    },
    {
      title: "Today's Billing",
      value: money(data.revenueToday),
      icon: IndianRupee,
    },
    {
      title: 'Outstanding',
      value: money(data.outstanding),
      icon: FileSpreadsheet,
    },
    {
      title: 'Active Vehicles',
      value: num(data.activeVehicles),
      icon: Truck,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index} data-testid={`kpi-${kpi.title.toLowerCase().replace(/ /g, '-')}`} className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 hover:elevation-3 hover:-translate-y-0.5 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {kpi.title}
            </CardTitle>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-md group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <kpi.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
