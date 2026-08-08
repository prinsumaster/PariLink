import React from 'react';
import Link from 'next/link';

export default function VendorPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white tracking-tight">Vendor Portal</h1>
          <p className="text-slate-400 text-sm mt-1">PariLink Network</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/vendor/dashboard" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">Dashboard</Link>
          <Link href="/vendor/bids" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">Load Board & Bids</Link>
          <Link href="/vendor/bills" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">Settlements</Link>
          <Link href="/vendor/performance" className="block px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors font-medium">Performance SLA</Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full text-left px-4 py-2 text-red-400 font-medium hover:bg-slate-800 rounded-lg transition-colors">Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
