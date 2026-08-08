import React from 'react';
import { WorkflowBuilder } from './workflow-builder';
import { Button } from '@/components/ui/button';
import { Plus, Play, History, Download, Settings2 } from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function WorkflowsPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS', 'FINANCE']}>
      <div className="flex flex-col h-full w-full bg-slate-50/50 dark:bg-slate-900/20">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-indigo-500" />
              Workflow Automation Engine
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Visually design condition-based triggers and actions to automate your logistics network.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" className="hidden sm:flex transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
              <History className="mr-2 h-4 w-4" /> Execution Logs
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" /> Export Config
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block mx-1" />
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all">
              <Play className="mr-2 h-4 w-4" /> Deploy Active
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all">
              <Plus className="mr-2 h-4 w-4" /> New Flow
            </Button>
          </div>
        </div>

        {/* Builder Canvas Area */}
        <div className="flex-1 w-full p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 dark:opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, slate-400 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          
          <div className="h-full w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden flex flex-col relative z-0">
            <WorkflowBuilder />
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
