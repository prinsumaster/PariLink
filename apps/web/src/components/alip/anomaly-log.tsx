'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alipService } from '@/services/alip';
import { ALIPAnomaly } from '@/types/alip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Info, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AnomalyLogProps {
  anomalies: ALIPAnomaly[];
  isLoading?: boolean;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'HIGH': return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case 'MEDIUM': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'LOW': return <Info className="h-5 w-5 text-blue-500" />;
    default: return <Info className="h-5 w-5 text-gray-500" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50';
    case 'HIGH': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900/50';
    case 'MEDIUM': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50';
    case 'LOW': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50';
    default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  }
};

export function AnomalyLog({ anomalies, isLoading }: AnomalyLogProps) {
  const queryClient = useQueryClient();

  const resolveMutation = useMutation({
    mutationFn: (id: string) => alipService.resolveAnomaly(id, 'Resolved via ALIP Dashboard'),
    onSuccess: () => {
      toast.success('Anomaly marked as resolved');
      queryClient.invalidateQueries({ queryKey: ['alip'] });
    },
    onError: () => toast.error('Failed to resolve anomaly')
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader><CardTitle>Real-Time Anomaly Log</CardTitle></CardHeader>
        <CardContent><div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div></CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" /> Real-Time Anomaly Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {anomalies.length === 0 ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
            <p>No active anomalies detected.</p>
            <p className="text-xs mt-1">ALIP neural net monitoring streams...</p>
          </div>
        ) : (
          anomalies.map(anomaly => (
            <div key={anomaly.id} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getSeverityIcon(anomaly.severity)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-sm">{anomaly.category}</span>
                      <Badge variant="outline" className="text-[10px] px-1 py-0">{new Date(anomaly.timestamp).toLocaleTimeString()}</Badge>
                      {anomaly.impactScore > 80 && <Badge variant="destructive" className="text-[10px] px-1 py-0 bg-red-600">HIGH IMPACT</Badge>}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{anomaly.description}</p>
                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded text-xs text-gray-600 dark:text-gray-400 font-medium">
                      <strong className="text-purple-600 dark:text-purple-400">AI Recommendation:</strong> {anomaly.aiRecommendation}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => resolveMutation.mutate(anomaly.id)}
                  disabled={resolveMutation.isPending}
                >
                  Resolve
                </Button>
              </div>
              {anomaly.affectedEntities.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {anomaly.affectedEntities.map((ent, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-mono">{ent.type}: {ent.name}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
