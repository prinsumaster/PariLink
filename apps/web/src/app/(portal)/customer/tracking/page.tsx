import React from 'react';

export default function CustomerTrackingPage() {
  return (
    <div className="flex flex-col h-full bg-slate-100">
      <header className="p-6 bg-white border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Live Tracking</h1>
        <p className="text-slate-500">Track all your active shipments in real-time.</p>
      </header>
      
      <div className="flex-1 p-6 flex gap-6">
        {/* Map Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-700">Map Loading...</p>
            <p className="text-sm text-slate-500">Initializing Deck.GL overlay</p>
          </div>
        </div>

        {/* Sidebar List */}
        <div className="w-96 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Active Trucks (8)</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-blue-600">LOD-982{i}</span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">On Time</span>
                </div>
                <p className="text-sm text-slate-600 mb-1">Mumbai → Delhi</p>
                <p className="text-xs text-slate-500">Last updated: 2 mins ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
