import React from 'react';
import Link from 'next/link';

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden sm:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-tight">Financials</h1>
          <p className="text-slate-400 text-sm mt-1">Billing & Accounting</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/finance/invoices" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">Invoices (AR)</Link>
          <Link href="/finance/settlements" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">Settlements (AP)</Link>
          <Link href="/finance/fastag" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">FASTag Tolls</Link>
          <Link href="/finance" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">General Ledger</Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
