'use client';

import { Alert } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, CheckCircle2, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import { dashboardService } from '@/services/dashboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AlertCenterProps {
  alerts?: Alert[];
  isLoading: boolean;
}

export function AlertCenter({ alerts, isLoading }: AlertCenterProps) {
  const queryClient = useQueryClient();
  
  const acknowledgeMutation = useMutation({
    mutationFn: dashboardService.acknowledgeAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-alerts'] });
      toast.success('Alert acknowledged');
    },
    onError: () => {
      toast.error('Failed to acknowledge alert');
    }
  });

  if (isLoading) {
    return (
      <Card className="col-span-full md:col-span-1 h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-gray-500" /> Alert Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-md w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const unacknowledgedAlerts = alerts?.filter(a => !a.isAcknowledged) || [];

  return (
    <Card className="col-span-full md:col-span-1 h-[400px] flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BellRing className="h-5 w-5" /> Active Alerts
          </CardTitle>
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900/30 dark:text-red-400">
            {unacknowledgedAlerts.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {unacknowledgedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
            <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm font-medium">All clear</p>
            <p className="text-xs mt-1">No active operational alerts.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {unacknowledgedAlerts.map((alert) => (
              <li key={alert.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {alert.type === 'CRITICAL' && <AlertOctagon className="h-5 w-5 text-red-500" />}
                    {alert.type === 'WARNING' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                    {alert.type === 'INFO' && <Info className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()} • {alert.source}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => acknowledgeMutation.mutate(alert.id)}
                      disabled={acknowledgeMutation.isPending}
                    >
                      Ack
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
