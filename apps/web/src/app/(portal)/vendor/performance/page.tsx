import React from 'react';

export default function VendorPerformancePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Performance SLA</h1>
        <p className="text-slate-500 mt-1">Monitor your service level agreement metrics and ratings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-emerald-600">98%</span>
          </div>
          <p className="font-semibold text-slate-800">On-Time Pickup</p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-emerald-600">96%</span>
          </div>
          <p className="font-semibold text-slate-800">On-Time Delivery</p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-blue-600">100%</span>
          </div>
          <p className="font-semibold text-slate-800">POD Compliance</p>
          <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-amber-600">4.8</span>
          </div>
          <p className="font-semibold text-slate-800">Overall Rating</p>
          <p className="text-xs text-slate-500 mt-1">All Time</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">SLA Breach Alerts</h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-800">You are in excellent standing.</p>
            <p className="text-sm text-slate-600 mt-1">No SLA breaches recorded in the last 90 days. Keep up the good work to qualify for Premium Tenders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
