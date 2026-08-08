'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function WorkflowHistoryPage() {
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHistory() {
    try {
      // Assuming a generic history endpoint or fetching metrics
      const res = await api.get('/workflow/v2/metrics');
      if (res.data && res.data.recentExecutions) {
        setExecutions(res.data.recentExecutions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'FAILED': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'RUNNING': return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />;
      case 'WAITING_APPROVAL': return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <AlertCircle className="h-5 w-5 text-slate-500" />;
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Execution History" description="Monitor automation workflows" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white dark:bg-slate-950">
          <p className="text-sm text-slate-500">Total Executions</p>
          <p className="text-2xl font-semibold mt-1">{executions.length}</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-950">
          <p className="text-sm text-slate-500">Success Rate</p>
          <p className="text-2xl font-semibold mt-1 text-emerald-600">
            {executions.length ? Math.round((executions.filter(e => e.status === 'COMPLETED').length / executions.length) * 100) : 0}%
          </p>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-950">
          <p className="text-sm text-slate-500">Failed</p>
          <p className="text-2xl font-semibold mt-1 text-red-600">{executions.filter(e => e.status === 'FAILED').length}</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-950">
          <p className="text-sm text-slate-500">Running / Waiting</p>
          <p className="text-2xl font-semibold mt-1 text-indigo-600">{executions.filter(e => ['RUNNING', 'WAITING_APPROVAL'].includes(e.status)).length}</p>
        </Card>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-lg border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Workflow ID</th>
              <th className="px-4 py-3 font-medium">Started</th>
              <th className="px-4 py-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((exec) => (
              <tr key={exec.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <td className="px-4 py-3 flex items-center gap-2">
                  {getStatusIcon(exec.status)}
                  <span className="font-medium">{exec.status}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{exec.workflowId}</td>
                <td className="px-4 py-3 text-slate-500">{format(new Date(exec.startedAt), 'PPpp')}</td>
                <td className="px-4 py-3 text-slate-500">
                  {exec.completedAt ? formatDistanceToNow(new Date(exec.startedAt)) : '-'}
                </td>
              </tr>
            ))}
            {executions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No execution history found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
