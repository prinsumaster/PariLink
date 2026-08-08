'use client';

import { useQuery } from '@tanstack/react-query';
import { alipService } from '@/services/alip';
import { AnomalyLog } from './anomaly-log';
import { PredictiveInsights } from './predictive-insights';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Cpu, Network, ShieldAlert } from 'lucide-react';

export function ALIPDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['alip'],
    queryFn: () => alipService.getDashboard(),
    refetchInterval: 30000, // Poll every 30s for ALIP updates
  });

  return (
    <div className="space-y-6">
      
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={data?.health.status === 'CRITICAL' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Status</p>
              <h3 className={`text-xl font-bold ${data?.health.status === 'OPTIMAL' ? 'text-green-600' : data?.health.status === 'DEGRADED' ? 'text-yellow-600' : 'text-red-600'}`}>
                {isLoading ? '...' : data?.health.status}
              </h3>
            </div>
            <Activity className={`h-8 w-8 ${data?.health.status === 'OPTIMAL' ? 'text-green-500' : 'text-red-500'}`} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Model Latency</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : `${data?.health.modelLatency} ms`}</h3>
            </div>
            <Cpu className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Streams</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : data?.health.activeDataStreams.toLocaleString()}</h3>
            </div>
            <Network className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Anomalies (24h)</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isLoading ? '...' : data?.health.anomaliesDetected24h}</h3>
            </div>
            <ShieldAlert className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AnomalyLog anomalies={data?.activeAnomalies || []} isLoading={isLoading} />
        <PredictiveInsights insights={data?.insights || []} isLoading={isLoading} />
      </div>

    </div>
  );
}
