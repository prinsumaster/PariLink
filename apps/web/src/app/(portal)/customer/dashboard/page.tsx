import React from 'react';

export default function CustomerDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="text-slate-500 mt-1">Here is a summary of your active shipments and account balance.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Active Shipments</p>
          <p className="text-4xl font-semibold text-slate-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">In Transit</p>
          <p className="text-4xl font-semibold text-blue-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Outstanding Balance</p>
          <p className="text-4xl font-semibold text-slate-900">₹ 4,50,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Shipments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 font-medium">Load ID</th>
                <th className="pb-3 font-medium">Origin</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 last:border-0">
                <td className="py-4 font-medium text-blue-600">LOD-9823</td>
                <td className="py-4 text-slate-700">Mumbai, MH</td>
                <td className="py-4 text-slate-700">Delhi, DL</td>
                <td className="py-4"><span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Transit</span></td>
                <td className="py-4 text-slate-700">Oct 24, 14:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
