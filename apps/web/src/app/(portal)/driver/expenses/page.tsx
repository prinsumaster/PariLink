import React from 'react';

export default function DriverExpensesPage() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-white mb-4">Log Expenses</h1>

      <div className="bg-slate-800 rounded-2xl p-5 mb-6 border border-slate-700">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Expense Type</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Fuel / Diesel</option>
              <option>Toll Charges</option>
              <option>Maintenance</option>
              <option>Food & Lodging</option>
              <option>Other / Unloading</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Amount (₹)</label>
            <input type="number" placeholder="Enter amount" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Odometer Reading (Optional)</label>
            <input type="number" placeholder="Km" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="pt-2">
            <button className="w-full border-2 border-dashed border-slate-600 rounded-xl py-4 flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              <span className="text-xs font-medium">Attach Bill Photo</span>
            </button>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors active:scale-95 mt-4">
            Save Expense
          </button>
        </form>
      </div>

      <h2 className="text-lg font-semibold text-white mb-3">Recent Logs</h2>
      <div className="space-y-3">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
            <p className="font-semibold text-white">Diesel Fill</p>
            <p className="text-xs text-slate-400">Today, 10:30 AM</p>
          </div>
          <p className="font-bold text-red-400">-₹ 4,500</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
          <div>
            <p className="font-semibold text-white">Toll Tax (Cash)</p>
            <p className="text-xs text-slate-400">Yesterday, 4:15 PM</p>
          </div>
          <p className="font-bold text-red-400">-₹ 350</p>
        </div>
      </div>
    </div>
  );
}
