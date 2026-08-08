import React from 'react';

export default function SettlementsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts Payable</h1>
          <p className="text-slate-500 mt-1">Vendor settlements, driver advances, and payments.</p>
        </div>
        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
          Record Payment
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Pending Vendor Bills</h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-slate-900">Shreeji Transports</p>
                  <p className="text-xs text-slate-500">Trip TRP-88{i}9 • Lorry Hire</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">₹{12000 + i * 2500}</p>
                  <p className="text-xs text-amber-600 font-medium">Due in {i * 2} days</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Driver Advances</h2>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-slate-900">Rajesh Kumar</p>
                  <p className="text-xs text-slate-500">Trip TRP-99{i}0 • Fuel Advance</p>
                </div>
                <div className="flex gap-4 items-center text-right">
                  <p className="text-sm font-semibold text-slate-900">₹5,000</p>
                  <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
