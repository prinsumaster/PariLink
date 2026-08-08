'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api, API_URL } from '@/services/api';
import { 
  TrendingUp, TrendingDown, DollarSign, Truck, Users, Activity, Download, BrainCircuit, RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';

export default function CommandCenterPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveStream, setLiveStream] = useState<any>(null);

  // Phase 8: Role-based filtering simulation
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') || 'CEO' : 'CEO';

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/analytics/metrics/command-center');
      setMetrics(res.data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const setupSSE = () => {
    // Basic SSE setup for Phase 5
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${API_URL}/analytics/metrics/live?token=${token}`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLiveStream(data.payload);
      } catch (e) {}
    };
    return eventSource;
  };

  useEffect(() => {
    fetchMetrics();
    const es = setupSSE();
    return () => {
      es.close();
    };
  }, []);

  const generateReport = async (format: 'PDF' | 'EXCEL' | 'CSV') => {
    try {
      const res = await api.post('/analytics/reports/export', { reportType: 'EXECUTIVE_SUMMARY', format });
      toast.success(`${format} Report Generated! Download starting...`);
      // Simulating download logic
      window.open(res.data.downloadUrl, '_blank');
    } catch (e) {
      toast.error('Failed to generate report');
    }
  };



  if (loading) return <div className="p-10 flex justify-center"><RefreshCcw className="animate-spin text-indigo-500 h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Executive Command Center" description={`Real-time Business Intelligence for ${userRole}`}>
        <div className="flex gap-2">

          <Button variant="outline" onClick={() => generateReport('PDF')}>
            <Download className="h-4 w-4 mr-2" /> PDF Report
          </Button>
          <Button variant="outline" onClick={() => generateReport('EXCEL')}>
            <Download className="h-4 w-4 mr-2" /> Excel Report
          </Button>
        </div>
      </PageHeader>

      {/* Live Indicator */}
      {liveStream && (
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-3 rounded-lg flex items-center text-sm">
          <span className="relative flex h-3 w-3 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Live Stream Active: {liveStream.liveActiveTrips} Trips Currently In-Transit across network
        </div>
      )}

      {/* Core KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <Card className="p-5 bg-white dark:bg-slate-950">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
              <TrendingUp className="h-3 w-3 mr-1" /> +14.2%
            </Badge>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">30-Day Revenue</p>
          <h3 className="text-2xl font-bold">${metrics?.revenue?.value?.toLocaleString() || '0'}</h3>
        </Card>

        {/* Fleet Utilization */}
        <Card className="p-5 bg-white dark:bg-slate-950">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
              <TrendingUp className="h-3 w-3 mr-1" /> +5.1%
            </Badge>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Fleet Utilization</p>
          <h3 className="text-2xl font-bold">{metrics?.fleetUtilization?.percentage?.toFixed(1) || '0'}%</h3>
        </Card>

        {/* Trips */}
        <Card className="p-5 bg-white dark:bg-slate-950">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Trips Completed (30d)</p>
          <h3 className="text-2xl font-bold">{metrics?.tripsCompleted30d || '0'}</h3>
        </Card>

        {/* Customers */}
        <Card className="p-5 bg-white dark:bg-slate-950">
          <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
          <h3 className="text-2xl font-bold">{metrics?.totalCustomers || '0'}</h3>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-6 bg-white dark:bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
           <p className="text-slate-500 mb-2">Revenue Forecast Chart (Integration ready)</p>
           {/* Chart.js or Recharts will mount here */}
        </Card>
        <Card className="p-6 bg-white dark:bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
           <p className="text-slate-500 mb-2">Fleet Performance Heatmap (Integration ready)</p>
        </Card>
      </div>

    </div>
  );
}
