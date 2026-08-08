'use client';

import { Card, CardContent } from '@/components/ui/card';
import { KPI } from '@/types/reports';
import { TrendingUp, TrendingDown, Minus, DollarSign, Package, Truck, Clock } from 'lucide-react';

interface KPICardsProps {
  kpis: KPI[];
  isLoading?: boolean;
}

const getIconForTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('revenue') || t.includes('profit')) return <DollarSign className="h-5 w-5 text-gray-400" />;
  if (t.includes('order') || t.includes('shipment')) return <Package className="h-5 w-5 text-gray-400" />;
  if (t.includes('fleet') || t.includes('vehicle')) return <Truck className="h-5 w-5 text-gray-400" />;
  if (t.includes('time') || t.includes('delay')) return <Clock className="h-5 w-5 text-gray-400" />;
  return <TrendingUp className="h-5 w-5 text-gray-400" />;
};

export function KPICards({ kpis, isLoading }: KPICardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-32 bg-gray-50 dark:bg-gray-800/50"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const isPositive = kpi.change > 0;
        const isNeutral = kpi.change === 0;
        
        let formattedValue = kpi.value.toString();
        if (kpi.format === 'currency') formattedValue = `$${Number(kpi.value).toLocaleString()}`;
        if (kpi.format === 'percentage') formattedValue = `${kpi.value}%`;

        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
                {getIconForTitle(kpi.title)}
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formattedValue}</h3>
                <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : isNeutral ? <Minus className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
