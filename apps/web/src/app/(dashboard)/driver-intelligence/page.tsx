import React from 'react';
import { UserCircle, Shield, Target } from 'lucide-react';

export default function DriverIntelligencePage() {
  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
          Driver Intelligence
        </h1>
        <p className="text-slate-400 mt-2">Driver scoring, fatigue risk, and safety leaderboards.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-emerald-400 mb-4">
            <Shield className="w-6 h-6" />
            <h2 className="text-lg font-semibold text-slate-200">Top Safety Performer</h2>
          </div>
          <p className="text-2xl font-bold text-white mb-1">Ramesh Kumar</p>
          <p className="text-3xl font-mono text-emerald-400 mb-2">99.8/100</p>
          <p className="text-sm text-slate-500">0 harsh brakes this month</p>
        </div>
      </div>
    </div>
  );
}
