import React from 'react';

export default function InvoicesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts Receivable</h1>
          <p className="text-slate-500 mt-1">Manage customer invoices and credit notes.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
          Generate Invoice
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Outstanding</p>
          <p className="text-4xl font-semibold text-slate-900">₹24,50,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Overdue</p>
          <p className="text-4xl font-semibold text-red-600">₹3,20,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Paid this Month</p>
          <p className="text-4xl font-semibold text-emerald-600">₹18,40,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="py-4 px-6 font-medium">Invoice #</th>
              <th className="py-4 px-6 font-medium">Customer</th>
              <th className="py-4 px-6 font-medium">Date</th>
              <th className="py-4 px-6 font-medium text-right">Amount</th>
              <th className="py-4 px-6 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">INV-2023-{1000 + i}</td>
                <td className="py-4 px-6">Reliance Industries Ltd.</td>
                <td className="py-4 px-6">Oct {i + 10}, 2023</td>
                <td className="py-4 px-6 text-right font-medium">₹{45000 + i * 5000}</td>
                <td className="py-4 px-6 text-center">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">PENDING</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
