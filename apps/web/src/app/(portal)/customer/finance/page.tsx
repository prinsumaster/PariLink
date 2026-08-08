import React from 'react';

export default function CustomerFinancePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Invoices & Payments</h1>
        <p className="text-slate-500 mt-1">Manage your billing, view invoices, and make payments.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Outstanding Balance</p>
            <p className="text-3xl font-bold text-slate-900">₹ 4,50,000</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
            Pay Now
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Download Statement</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 font-medium">Invoice #</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100 last:border-0">
                <td className="py-4 font-medium text-slate-900">INV-2023-089</td>
                <td className="py-4 text-slate-600">Oct 15, 2026</td>
                <td className="py-4 font-medium text-slate-900">₹ 1,50,000</td>
                <td className="py-4">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Unpaid</span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-blue-600 font-medium hover:underline">Download PDF</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
