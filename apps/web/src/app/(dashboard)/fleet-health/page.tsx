import React from 'react';
import { Activity, Wrench, ShieldAlert } from 'lucide-react';

export default function FleetHealthPage() {
  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          Fleet Health & Maintenance
        </h1>
        <p className="text-slate-400 mt-2">Predictive analytics for remaining useful life and breakdowns.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-orange-500/20 bg-orange-950/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-orange-400 mb-4">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-lg font-semibold text-slate-200">Critical Breakdown Risks</h2>
          </div>
          <div className="space-y-4">
            {/* Mock Data Row */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Truck MH-04-AB-1234</p>
                <p className="text-xs text-slate-400">Tyre Failure Probability: 89%</p>
              </div>
              <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-md text-sm font-medium hover:bg-orange-500/30 transition-colors">
                Schedule Repair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
