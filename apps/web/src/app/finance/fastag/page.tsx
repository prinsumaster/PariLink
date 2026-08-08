import React from 'react';

export default function FastagPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">FASTag Tolls</h1>
          <p className="text-slate-500 mt-1">Live automated toll transaction sync and GPS reconciliation.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Syncing Live
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="py-4 px-6 font-medium">Vehicle</th>
              <th className="py-4 px-6 font-medium">Toll Plaza</th>
              <th className="py-4 px-6 font-medium">Timestamp</th>
              <th className="py-4 px-6 font-medium text-right">Deduction</th>
              <th className="py-4 px-6 font-medium text-center">GPS Match</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">MH-12-PQ-890{i}</td>
                <td className="py-4 px-6">Khalapur Toll Plaza (Mumbai-Pune)</td>
                <td className="py-4 px-6">{i * 15} mins ago</td>
                <td className="py-4 px-6 text-right font-medium text-red-600">-₹320.00</td>
                <td className="py-4 px-6 text-center">
                  {i === 3 ? (
                    <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium">MISMATCH</span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">VERIFIED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
