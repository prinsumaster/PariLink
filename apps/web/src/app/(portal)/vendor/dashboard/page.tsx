import React from 'react';

export default function VendorDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your active loads and pending settlements.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Active Loads (Accepted)</p>
          <p className="text-4xl font-semibold text-blue-600">4</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Pending Settlements</p>
          <p className="text-4xl font-semibold text-amber-600">₹ 1,25,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Current SLA Rating</p>
          <p className="text-4xl font-semibold text-emerald-600">4.8 <span className="text-lg text-slate-400 font-normal">/ 5.0</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Recent Assigned Loads</h2>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 font-medium">Tender ID</th>
                <th className="pb-3 font-medium">Origin</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Rate</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 last:border-0">
                <td className="py-4 font-medium text-slate-900">TND-2023-889</td>
                <td className="py-4 text-slate-600">Mumbai, MH</td>
                <td className="py-4 text-slate-600">Delhi, DL</td>
                <td className="py-4 font-medium text-slate-900">₹ 45,000</td>
                <td className="py-4">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">In Transit</span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-blue-600 font-medium hover:underline">Upload POD</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
