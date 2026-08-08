import React from 'react';

export default function FleetDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Fleet Overview</h1>
        <p className="text-slate-500 mt-1">Monitor asset utilization and vehicle statuses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Assets</p>
          <p className="text-4xl font-semibold text-slate-900">420</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">On Road (In Transit)</p>
          <p className="text-4xl font-semibold text-blue-600">312</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">In Maintenance</p>
          <p className="text-4xl font-semibold text-amber-600">18</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Fleet Utilization</p>
          <p className="text-4xl font-semibold text-emerald-600">74.2%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Asset Activity</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-sm text-slate-500">
              <th className="pb-3">Vehicle ID</th>
              <th className="pb-3">Make / Model</th>
              <th className="pb-3">Driver</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            <tr>
              <td className="py-4 font-medium text-slate-900">MH-12-PQ-8900</td>
              <td className="py-4">Tata Signa 4825.T</td>
              <td className="py-4">Rajesh Kumar</td>
              <td className="py-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Transit</span></td>
            </tr>
            <tr className="border-t border-slate-50">
              <td className="py-4 font-medium text-slate-900">GJ-01-AB-1234</td>
              <td className="py-4">Ashok Leyland 3520</td>
              <td className="py-4">Unassigned</td>
              <td className="py-4"><span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Workshop</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
