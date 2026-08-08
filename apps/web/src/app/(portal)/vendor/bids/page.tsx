import React from 'react';

export default function VendorBidsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Load Board & Bids</h1>
        <p className="text-slate-500 mt-1">Browse open tenders, submit bids, and win loads.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-medium text-slate-800">Open Tenders</h2>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white">
              <option>All Routes</option>
              <option>Mumbai → Delhi</option>
            </select>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="py-4 px-6 font-medium">Tender ID</th>
              <th className="py-4 px-6 font-medium">Route</th>
              <th className="py-4 px-6 font-medium">Expected Volume</th>
              <th className="py-4 px-6 font-medium">Deadline</th>
              <th className="py-4 px-6 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[1, 2, 3].map(i => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-blue-600 cursor-pointer">TND-900{i}</td>
                <td className="py-4 px-6 text-slate-800">Pune, MH → Bangalore, KA</td>
                <td className="py-4 px-6 text-slate-600">12 Tons (Dry Van)</td>
                <td className="py-4 px-6 text-slate-600">Tomorrow, 14:00</td>
                <td className="py-4 px-6 text-right">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors text-xs">
                    Submit Bid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
