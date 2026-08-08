'use client';

import { Droplets, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function OilManufacturingWidget() {
  return (
    <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 shadow-sm">
      <CardHeader className="pb-3 border-b border-amber-500/10">
        <CardTitle className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          Refinery Status (Plugin)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pipeline Capacity</p>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              84.2% <span className="text-sm font-normal text-emerald-500">Normal</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Active AI Worker</p>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Activity className="h-3 w-3" /> Refinery_AI
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
