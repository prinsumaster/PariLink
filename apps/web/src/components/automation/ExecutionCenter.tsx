'use client';

import { useState, useEffect } from 'react';
import { Play, CheckCircle2, XCircle, Clock, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRealtimeEngine } from '@/hooks/use-realtime-engine';

interface ExecutionStep {
  id: string;
  nodeId: string;
  owner: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'ROLLBACK';
  retryCount: number;
  timeElapsedMs?: number;
}

export function ExecutionCenter() {
  useRealtimeEngine();
  
  const [activeExecutions, setActiveExecutions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    successRate: 0,
    avgTimeMs: 0,
    activeWorkers: 0
  });

  useEffect(() => {
    // Basic polling or initial fetch until realtime engine is fully connected
    const fetchExecutions = async () => {
      try {
        const res = await fetch('/api/v1/operations/executions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.executions) setActiveExecutions(data.executions);
          if (data.stats) setStats(data.stats);
        }
      } catch (e) {
        console.error('Failed to fetch executions', e);
      }
    };
    fetchExecutions();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-rose-500" />;
      case 'RUNNING': return <Play className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'ROLLBACK': return <RotateCcw className="h-4 w-4 text-amber-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-slate-300" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Execution Center</h1>
          <p className="text-sm text-slate-500">Autonomous Enterprise monitoring and control plane.</p>
        </div>
        
        <div className="flex gap-4">
          <Card className="w-32 bg-emerald-500/10 border-emerald-500/20 shadow-none">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.successRate}%</div>
              <div className="text-xs font-medium text-emerald-600/80 uppercase tracking-wider">AI Success</div>
            </CardContent>
          </Card>
          <Card className="w-32 shadow-none">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">{stats.activeWorkers}</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Workers</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Graphs */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ActivityIcon /> Live Execution Graphs
          </h2>
          
          {activeExecutions.map(exec => (
            <Card key={exec.id} className="overflow-hidden border-blue-500/30 shadow-sm">
              <CardHeader className="bg-blue-500/5 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-base">{exec.title}</CardTitle>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    Executing
                  </span>
                </div>
                <Progress value={exec.progress} className="h-1.5" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {exec.steps.map((step: any, idx: number) => (
                    <div key={step.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="flex-shrink-0">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {idx + 1}. {step.nodeId}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Cpu className="h-3 w-3" /> {step.owner}
                          {step.retryCount > 0 && (
                            <span className="text-amber-500 ml-2">({step.retryCount} retries)</span>
                          )}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-md",
                          step.status === 'SUCCESS' ? "bg-emerald-100 text-emerald-700" :
                          step.status === 'RUNNING' ? "bg-blue-100 text-blue-700" :
                          step.status === 'FAILED' ? "bg-rose-100 text-rose-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {step.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Queues and Errors */}
        <div className="space-y-6">
          <Card className="border-rose-200 dark:border-rose-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Rollback & Compensation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 italic text-center py-6">
                No active rollbacks. System is stable.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Retry Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 italic text-center py-6">
                No tasks awaiting retry.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ActivityIcon() {
  return (
    <div className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
    </div>
  );
}
