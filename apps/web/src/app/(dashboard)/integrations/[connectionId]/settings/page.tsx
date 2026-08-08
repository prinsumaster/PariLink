'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Trash2, PowerOff, ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ConnectionSettingsPage({ params }: { params: { connectionId: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [connection, setConnection] = useState<any>({
    id: params.connectionId,
    provider: 'Loading...',
    status: 'UNKNOWN',
    autoSync: false,
    syncInterval: '60',
  });

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const res = await api.get(`/integrations/${params.connectionId}`);
        if (res.data) setConnection(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchConnection();
  }, [params.connectionId]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.push('/integrations');
    }, 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/integrations">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {connection.provider} Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage synchronization, mappings, and credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-indigo-500" /> Synchronization
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-sm">Automated Sync</h3>
                  <p className="text-xs text-slate-500">Automatically sync records in the background.</p>
                </div>
                {/* Switch component placeholder */}
                <div className="h-6 w-11 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="h-4 w-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-1 block">Sync Interval (Minutes)</label>
                <Input type="number" defaultValue={connection.syncInterval} className="max-w-[200px]" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Connection Health
            </h2>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-emerald-600">Connected & Authenticated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Sync</span>
                <span className="font-semibold">Today, 10:45 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">API Quota</span>
                <span className="font-semibold">45% used (4,500 / 10,000)</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10">
            <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Danger Zone
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Disconnecting will immediately stop all background syncing. Data already synced will not be deleted.
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950">
                <PowerOff className="h-4 w-4 mr-2" /> Disconnect
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 className="h-4 w-4 mr-2" /> Delete Configuration
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link href="/integrations">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white">
          <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
