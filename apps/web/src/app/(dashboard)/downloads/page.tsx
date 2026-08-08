'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, RefreshCw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { format } from 'date-fns';

interface ExportJob {
  id: string;
  type: string;
  entityType: string;
  status: string;
  fileName: string | null;
  fileUrl: string | null;
  sizeBytes: number | null;
  createdAt: string;
  completedAt: string | null;
  error: string | null;
}

export default function DownloadCenterPage() {
  const [exports, setExports] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchExports = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);
    
    try {
      const response = await api.get('/exports');
      setExports(response.data);
    } catch (error) {
      console.error('Failed to load exports:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExports();
    
    // Auto-refresh every 10 seconds if there are pending exports
    const interval = setInterval(() => {
      setExports(prev => {
        const hasPending = prev.some(e => e.status === 'PENDING' || e.status === 'PROCESSING');
        if (hasPending) {
          fetchExports(true);
        }
        return prev;
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number = 0, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'FAILED': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PROCESSING': return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />;
      default: return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Download Center" 
        description="View and download your generated reports and data exports."
      >
        <Button variant="outline" onClick={() => fetchExports(false)} disabled={loading || refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
          Refresh List
        </Button>
      </PageHeader>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : exports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full mb-4">
              <FileDown className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No exports found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              You haven't requested any data exports yet. You can export data from any data table using the Export action.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {exports.map((job) => (
              <div key={job.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {job.entityType} Export
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {job.status === 'COMPLETED' ? (
                        <>Generated on {format(new Date(job.completedAt!), 'PPp')} • {formatBytes(job.sizeBytes || 0)}</>
                      ) : job.status === 'FAILED' ? (
                        <span className="text-red-500">Failed: {job.error}</span>
                      ) : (
                        <>Requested on {format(new Date(job.createdAt), 'PPp')}</>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center sm:ml-auto pl-9 sm:pl-0">
                  {job.status === 'COMPLETED' && (
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto"
                      onClick={() => window.open(job.fileUrl || '', '_blank')}
                    >
                      <FileDown className="mr-2 h-4 w-4" /> Download CSV
                    </Button>
                  )}
                  {job.status === 'PROCESSING' && (
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 w-full sm:w-auto text-center py-2 px-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
