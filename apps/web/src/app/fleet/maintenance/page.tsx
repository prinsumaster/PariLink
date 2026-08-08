import React from 'react';

export default function FleetMaintenancePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance & Repair</h1>
          <p className="text-slate-500 mt-1">Track work orders and predictive breakdowns.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
          Create Work Order
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h2 className="font-semibold text-red-900">AI Predictive Alerts</h2>
          </div>
          <p className="text-sm text-red-700 mb-4">The ML Risk Engine has flagged 2 vehicles for potential engine failure based on thermal variance.</p>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg border border-red-200 text-sm flex justify-between items-center">
              <span className="font-medium text-slate-900">MH-04-FD-2234</span>
              <span className="text-red-600 font-medium">89% Breakdown Probability</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Upcoming Scheduled Service</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">DL-1C-AA-0988</p>
                <p className="text-xs text-slate-500">PM Service (Oil Change, Brakes)</p>
              </div>
              <p className="text-sm font-medium text-slate-600">Tomorrow</p>
            </div>
            <div className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">RJ-14-GH-1122</p>
                <p className="text-xs text-slate-500">Tire Replacement (Axle 2)</p>
              </div>
              <p className="text-sm font-medium text-slate-600">Oct 14</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
