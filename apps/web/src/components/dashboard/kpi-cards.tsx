'use client';

import { KPIData } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus, TrendingUp, Truck, AlertTriangle, Clock, DollarSign, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  data?: KPIData;
  isLoading: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="animate-pulse glass border-slate-200/60 dark:border-slate-800/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Fleet Health',
      value: `${data.fleetUtilization.value}%`,
      change: `${data.fleetUtilization.change}%`,
      trend: data.fleetUtilization.trend,
      icon: TrendingUp,
    },
    {
      title: 'Daily Revenue',
      value: `$${(data.revenue.value / 1000).toFixed(1)}k`,
      change: `${data.revenue.change}%`,
      trend: data.revenue.trend,
      icon: DollarSign,
    },
    {
      title: 'Profit Margin',
      value: `${data.profitMargin.value}%`,
      change: `${data.profitMargin.change}%`,
      trend: data.profitMargin.trend,
      icon: TrendingUp,
    },
    {
      title: 'Fuel Efficiency',
      value: `${data.fuelEfficiency.value} MPG`,
      change: `${data.fuelEfficiency.change}%`,
      trend: data.fuelEfficiency.trend,
      icon: Minus,
    },
    {
      title: 'Active Shipments',
      value: data.activeShipments.value.toLocaleString(),
      change: `${data.activeShipments.change}%`,
      trend: data.activeShipments.trend,
      icon: Truck,
    },
    {
      title: 'Delayed Shipments',
      value: data.delayedShipments.value.toLocaleString(),
      change: `${data.delayedShipments.change}%`,
      trend: data.delayedShipments.trend, // If up, bad.
      icon: AlertTriangle,
    },
    {
      title: 'Average ETA',
      value: `${data.averageEtaMinutes.value}m`,
      change: `${data.averageEtaMinutes.change}m`,
      trend: data.averageEtaMinutes.trend,
      icon: Clock,
    },
    {
      title: 'Revenue Today',
      value: `$${data.revenueToday.value.toLocaleString()}`,
      change: `${data.revenueToday.change}%`,
      trend: data.revenueToday.trend,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 hover:elevation-3 hover:-translate-y-0.5 group">
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
            <p className="text-xs flex items-center mt-1">
              {kpi.trend === 'up' && <ArrowUp className="h-3 w-3 mr-1 text-green-500" />}
              {kpi.trend === 'down' && <ArrowDown className="h-3 w-3 mr-1 text-red-500" />}
              {kpi.trend === 'neutral' && <Minus className="h-3 w-3 mr-1 text-gray-500" />}
              <span className={cn(
                kpi.trend === 'up' ? 'text-green-600 dark:text-green-500 font-medium' : 
                kpi.trend === 'down' ? 'text-red-600 dark:text-red-500 font-medium' : 'text-slate-500 font-medium'
              )}>
                {kpi.change}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-1 text-xs">from last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
