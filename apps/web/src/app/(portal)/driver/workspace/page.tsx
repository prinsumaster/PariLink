import React from 'react';

export default function DriverWorkspacePage() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Active Trip</h1>
          <p className="text-slate-400 text-sm">TRP-4091</p>
        </div>
        <button className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs font-bold border border-red-500/30">
          SOS
        </button>
      </div>

      {/* Status Card */}
      <div className="bg-slate-800 rounded-2xl p-5 mb-4 border border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider">IN TRANSIT</span>
          <span className="text-slate-400 text-sm font-medium">ETA: 4 hrs</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-1">Mumbai to Pune (Auto Parts)</h2>
        <p className="text-slate-400 text-sm">Customer: Tata Motors Ltd</p>
      </div>

      {/* Swipe to Actions */}
      <div className="space-y-3 mb-6">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors active:scale-95 flex justify-center items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Mark Arrived at Destination
        </button>
        <button className="w-full bg-slate-800 text-white font-semibold py-4 rounded-xl border border-slate-700 flex justify-center items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          Open Navigation
        </button>
      </div>

      {/* Sync Status Engine Visual */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Sync Engine</p>
            <p className="text-xs text-slate-400">All data synced to cloud</p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">SYNCED</span>
      </div>
    </div>
  );
}
