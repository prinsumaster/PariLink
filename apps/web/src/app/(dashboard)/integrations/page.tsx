'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { IntegrationCard } from '@/components/integrations/integration-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Webhook, Link2, Activity, Box } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsHomePage() {
  const [connections, setConnections] = useState<any[]>([]);
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [connRes, catRes] = await Promise.all([
          api.get('/integrations'),
          api.get('/admin/marketplace/apps')
        ]);
        setConnections(connRes.data);
        setCatalogue(Array.isArray(catRes.data?.data) ? catRes.data.data : (Array.isArray(catRes.data) ? catRes.data : []));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatus = (providerId: string) => {
    const conn = connections.find(c => c.connector?.provider === providerId);
    if (!conn) return 'DISCONNECTED';
    if (conn.status === 'FAILED') return 'ERROR';
    return 'CONNECTED';
  };

  const getLastSync = (providerId: string) => {
    const conn = connections.find(c => c.connector?.provider === providerId);
    return conn?.lastSync;
  };

  const getConnectionId = (providerId: string) => {
    const conn = connections.find(c => c.connector?.provider === providerId);
    return conn?.id || providerId;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Link2 className="h-6 w-6 text-indigo-600" /> Enterprise Integrations
          </h1>
          <p className="text-sm text-slate-500 mt-1">Connect your ERP, CRM, and accounting systems to automate operations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Webhook className="h-4 w-4" /> Webhook Center
          </Button>
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" /> API Gateway
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Connections', value: connections.filter(c => c.status === 'CONFIGURED').length, color: 'text-indigo-600' },
          { label: 'Total Syncs (24h)', value: '1,245', color: 'text-emerald-600' },
          { label: 'Failed Syncs', value: connections.filter(c => c.status === 'FAILED').length, color: 'text-red-600' },
          { label: 'API Requests', value: '45.2k', color: 'text-violet-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search integrations..." className="pl-9 bg-white dark:bg-slate-950" />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-10">
          <Filter className="h-4 w-4" /> Filter by Category
        </Button>
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 ml-auto">
          <button className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-md shadow-sm">All</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Connected</button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {catalogue.map(item => (
          <IntegrationCard
            key={item.id}
            id={getConnectionId(item.id)}
            name={item.name}
            description={item.description}
            status={getStatus(item.id)}
            lastSync={getLastSync(item.id)}
            onSync={() => {
              api.post('/integrations/sync', { connectionId: getConnectionId(item.id), entityType: 'ALL' });
              // Simple optimistic toast could go here
            }}
          />
        ))}
        
        {/* Empty state generic REST/Webhook card */}
        <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer">
          <Box className="h-8 w-8 mb-3 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom Integration</h3>
          <p className="text-xs mt-1 max-w-[200px]">Build your own connection using Generic REST APIs or Webhooks</p>
          <Button variant="outline" size="sm" className="mt-4 text-xs">Build Custom</Button>
        </div>
      </div>
    </div>
  );
}
