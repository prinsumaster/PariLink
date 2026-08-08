'use client';

import { BrainCircuit } from 'lucide-react';
import { ALIPDashboard } from '@/components/alip/alip-dashboard';
import { RoleGuard } from '@/components/auth/role-guard';

export default function ALIPPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS', 'DISPATCHER']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-900 dark:bg-black p-6 rounded-lg shadow-sm border border-gray-800 text-white relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-purple-400" /> ALIP
              <span className="text-xl font-light text-slate-400">Operations Center</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Advanced Logistics Intelligence Protocol. Real-time neural net monitoring and predictive routing.</p>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
            <span className="text-xs font-medium uppercase tracking-wider text-green-400">Neural Link Active</span>
          </div>
        </div>

        <ALIPDashboard />
        
      </div>
    </RoleGuard>
  );
}
