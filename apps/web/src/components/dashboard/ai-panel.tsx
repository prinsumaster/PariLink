'use client';

import { AIRecommendation } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ShieldAlert, Zap, Wrench, Package } from 'lucide-react';

interface AIPanelProps {
  recommendations?: AIRecommendation[];
  isLoading: boolean;
}

export function AIPanel({ recommendations, isLoading }: AIPanelProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full md:col-span-1 h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" /> ALIP Insights
          </CardTitle>
          <CardDescription>Autonomous Logistics Intelligence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start space-x-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getIcon = (category: AIRecommendation['category']) => {
    switch (category) {
      case 'DELAY_RISK': return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case 'FUEL_OPTIMIZATION': return <Zap className="h-5 w-5 text-green-500" />;
      case 'MAINTENANCE': return <Wrench className="h-5 w-5 text-red-500" />;
      case 'CAPACITY': return <Package className="h-5 w-5 text-blue-500" />;
      default: return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <Card className="col-span-full md:col-span-1 h-[400px] flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-blue-500" /> ALIP Insights
        </CardTitle>
        <CardDescription>AI-generated operational recommendations</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {(!recommendations || recommendations.length === 0) ? (
          <div className="p-6 text-center text-sm text-gray-500">No active recommendations.</div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recommendations.map((rec) => (
              <li key={rec.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                    {getIcon(rec.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {rec.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {rec.description}
                    </p>
                    {rec.actionUrl && (
                      <Button variant="link" className="px-0 h-auto text-xs mt-2 text-blue-600">
                        Take Action <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
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
