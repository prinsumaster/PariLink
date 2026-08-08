import React from 'react';
import Link from 'next/link';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">PariLink Portal</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/customer/dashboard" className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
          <Link href="/customer/tracking" className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Live Tracking</Link>
          <Link href="/customer/finance" className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Invoices & Payments</Link>
          <Link href="/customer/documents" className="block px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium">Documents</Link>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button className="w-full text-left px-4 py-2 text-red-500 font-medium hover:bg-red-50 rounded-lg transition-colors">Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
