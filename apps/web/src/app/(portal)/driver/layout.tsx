import React from 'react';
import Link from 'next/link';

export default function DriverPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans sm:flex-row">
      {/* Mobile Header (Hidden on Desktop) */}
      <header className="sm:hidden flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
        <div className="font-bold text-blue-400">PariLink Driver</div>
        <div className="flex items-center gap-2">
          {/* Offline Indicator */}
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-slate-300">Online</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-900 pb-20 sm:pb-0">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-3 z-50">
        <Link href="/driver/workspace" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="text-[10px] font-medium">Trip</span>
        </Link>
        <Link href="/driver/pod" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[10px] font-medium">POD</span>
        </Link>
        <Link href="/driver/expenses" className="flex flex-col items-center gap-1 text-slate-400 hover:text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
          <span className="text-[10px] font-medium">Expense</span>
        </Link>
      </nav>
    </div>
  );
}
