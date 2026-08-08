import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, RefreshCw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface IntegrationCardProps {
  id: string;
  name: string;
  description: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSync?: string;
  onSync?: () => void;
  logoUrl?: string; // e.g. /logos/salesforce.svg
}

export function IntegrationCard({
  id,
  name,
  description,
  status,
  lastSync,
  onSync,
}: IntegrationCardProps) {
  return (
    <Card className="flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-sm">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-lg font-bold text-slate-400">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
              <p className="text-xs text-slate-500 line-clamp-1">{description}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
        
        {status === 'CONNECTED' && lastSync && (
          <div className="text-xs text-slate-500 mt-4 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
            <RefreshCw className="h-3 w-3" />
            Last synced: {new Date(lastSync).toLocaleString()}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 flex gap-2 justify-end rounded-b-xl">
        {status === 'CONNECTED' ? (
          <>
            <Button variant="outline" size="sm" onClick={onSync} className="text-xs h-8">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Sync Now
            </Button>
            <Link href={`/integrations/${id}/settings`}>
              <Button variant="ghost" size="sm" className="text-xs h-8 w-8 p-0">
                <Settings className="h-4 w-4 text-slate-500" />
              </Button>
            </Link>
          </>
        ) : (
          <Link href={`/integrations/wizard/${id}`}>
            <Button size="sm" className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
              Connect <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'CONNECTED') {
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 gap-1 pl-1.5">
        <CheckCircle2 className="h-3 w-3" /> Connected
      </Badge>
    );
  }
  if (status === 'ERROR') {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 gap-1 pl-1.5">
        <AlertCircle className="h-3 w-3" /> Error
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
      Disconnected
    </Badge>
  );
}
