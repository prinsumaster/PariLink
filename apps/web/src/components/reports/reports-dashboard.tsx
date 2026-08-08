'use client';

import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports';
import { ReportFilters } from '@/types/reports';
import { KPICards } from './kpi-cards';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ChartFallback = () => (
  <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
    <div className="text-gray-500 animate-pulse flex items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" /> Loading Chart Engine...
    </div>
  </div>
);

const RevenueChart = dynamic(() => import('./revenue-chart').then(mod => mod.RevenueChart), {
  ssr: false,
  loading: ChartFallback
});

const FleetUtilizationChart = dynamic(() => import('./fleet-utilization-chart').then(mod => mod.FleetUtilizationChart), {
  ssr: false,
  loading: ChartFallback
});
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface ReportsDashboardProps {
  filters: ReportFilters;
}

export function ReportsDashboard({ filters }: ReportsDashboardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardMetrics', filters],
    queryFn: () => reportsService.getDashboardMetrics(filters),
  });

  return (
    <div className="space-y-6">
      <KPICards kpis={data?.kpis || []} isLoading={isLoading} />
      
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <RevenueChart data={data?.revenueData || []} isLoading={isLoading} />
        <FleetUtilizationChart data={data?.fleetData || []} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional SLA Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="px-4 py-3">Region</th>
                    <th className="px-4 py-3 text-right">Deliveries</th>
                    <th className="px-4 py-3 text-right">On-Time %</th>
                    <th className="px-4 py-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 ml-auto"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-12 ml-auto"></div></td>
                        <td className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : (
                    data?.regionalData.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.region}</td>
                        <td className="px-4 py-3 text-right">{row.deliveries.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <Badge variant={row.onTimePercentage > 95 ? 'outline' : 'destructive'}
                                 className={row.onTimePercentage > 95 ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                            {row.onTimePercentage}%
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">${row.revenue.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for Alerts / System Health that often pairs with BI dashboards */}
        <Card>
          <CardHeader>
            <CardTitle>System Health & Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-200">High Idle Time Detected</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Northeast Fleet Region showing 15% above average idle time over the last 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-200">WMS Sync Successful</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">All facility inventory levels synced with ERP backend at 14:00 UTC.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-200">Upcoming Scheduled Maintenance</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">12 vehicles scheduled for preventative maintenance this weekend.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
