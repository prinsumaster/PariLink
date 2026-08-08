import React from 'react';

export default function VendorBillsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settlements</h1>
          <p className="text-slate-500 mt-1">Track payments and upload vendor bills.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
          Submit New Bill
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="py-4 px-6 font-medium">Bill Number</th>
              <th className="py-4 px-6 font-medium">Date Submitted</th>
              <th className="py-4 px-6 font-medium">Amount</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { id: 'VB-9021', date: 'Oct 23, 2026', amt: '₹ 45,000', status: 'PAID', due: 'Nov 01, 2026' },
              { id: 'VB-9024', date: 'Oct 24, 2026', amt: '₹ 38,000', status: 'PENDING', due: 'Nov 05, 2026' },
            ].map(bill => (
              <tr key={bill.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900">{bill.id}</td>
                <td className="py-4 px-6 text-slate-600">{bill.date}</td>
                <td className="py-4 px-6 font-medium text-slate-900">{bill.amt}</td>
                <td className="py-4 px-6">
                  {bill.status === 'PAID' ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Paid</span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending Approval</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right text-slate-600">{bill.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
