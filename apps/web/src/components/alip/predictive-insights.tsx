'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alipService } from '@/services/alip';
import { PredictiveInsight } from '@/types/alip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface PredictiveInsightsProps {
  insights: PredictiveInsight[];
  isLoading?: boolean;
}

export function PredictiveInsights({ insights, isLoading }: PredictiveInsightsProps) {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: (id: string) => alipService.applyRecommendation(id),
    onSuccess: () => {
      toast.success('AI recommendation applied successfully');
      queryClient.invalidateQueries({ queryKey: ['alip'] });
    },
    onError: () => toast.error('Failed to apply recommendation')
  });

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader><CardTitle>Predictive Insights</CardTitle></CardHeader>
        <CardContent><div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div></CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 border-purple-100 dark:border-purple-900/50 shadow-sm">
      <CardHeader className="bg-purple-50/50 dark:bg-purple-900/10 border-b border-purple-50 dark:border-purple-900/30">
        <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
          <Lightbulb className="h-5 w-5 text-yellow-500" /> Predictive Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
        {insights.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No new insights available.</div>
        ) : (
          insights.map(insight => (
            <div key={insight.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{insight.title}</h4>
                <Badge variant={insight.confidenceScore > 85 ? 'default' : 'secondary'} className="text-[10px] px-1 py-0">
                  {insight.confidenceScore}% Conf
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">Est. Impact</span>
                  <span className="text-xs font-bold text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +${insight.potentialCostImpact.toLocaleString()}
                  </span>
                </div>
                
                {insight.actionRequired ? (
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white h-7 text-xs px-2"
                    onClick={() => applyMutation.mutate(insight.id)}
                    disabled={applyMutation.isPending}
                  >
                    Auto-Resolve
                  </Button>
                ) : (
                  <div className="flex items-center text-xs text-green-600 font-medium">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Passive
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
