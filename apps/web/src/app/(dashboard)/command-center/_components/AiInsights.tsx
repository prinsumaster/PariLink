'use client';
import React from 'react';
import { ShieldAlert, AlertTriangle, Route, TrendingUp, Truck, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

type Anomaly = {
  id: string;
  type: 'risk' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  entity: string;
};

const FAKE_INSIGHTS: Anomaly[] = [
  { id: '1', type: 'risk', title: 'High Risk of Delay', description: 'Traffic congestion on I-40 East adds 45m to ETA.', severity: 'high', entity: 'Trip T-481' },
  { id: '2', type: 'anomaly', title: 'Idle Vehicle Detected', description: 'V-102 has been idle with engine on for 1.5 hours.', severity: 'medium', entity: 'Vehicle V-102' },
  { id: '3', type: 'anomaly', title: 'Fuel Efficiency Drop', description: 'Fuel consumption increased by 15% over last 200 miles.', severity: 'medium', entity: 'Vehicle V-220' },
  { id: '4', type: 'recommendation', title: 'Load Rebalancing', description: 'Driver D-40 is near max HOS. Assign Load L-99 to D-88 instead.', severity: 'low', entity: 'Driver D-40' },
  { id: '5', type: 'risk', title: 'Late Shipment Prediction', description: '80% probability L-102 will miss delivery window.', severity: 'high', entity: 'Load L-102' },
];

export const AiInsights: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900 p-3 space-y-4">
      {/* Global Risk Score */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fleet Risk Score</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">12</span>
            <span className="text-sm text-slate-500">/ 100</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Normal Operations</p>
        </div>
        <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
          <Activity className="h-5 w-5 text-emerald-400" />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Utilization</span>
          </div>
          <span className="text-lg font-semibold text-slate-200">89%</span>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">On-Time</span>
          </div>
          <span className="text-lg font-semibold text-emerald-400">94.2%</span>
        </div>
      </div>

      {/* Live Insights Feed */}
      <div>
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 px-1">Continuous Analysis</h3>
        <div className="space-y-2">
          {FAKE_INSIGHTS.map((insight) => (
            <div key={insight.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-indigo-500/50 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-1.5 rounded-md mt-0.5",
                  insight.severity === 'high' ? "bg-rose-500/10 text-rose-400" :
                  insight.severity === 'medium' ? "bg-amber-500/10 text-amber-400" :
                  "bg-indigo-500/10 text-indigo-400"
                )}>
                  {insight.type === 'risk' && <ShieldAlert className="h-4 w-4" />}
                  {insight.type === 'anomaly' && <AlertTriangle className="h-4 w-4" />}
                  {insight.type === 'recommendation' && <Zap className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200 truncate">{insight.title}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {insight.entity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
