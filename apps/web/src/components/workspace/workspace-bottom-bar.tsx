'use client';

import { useWorkspaceKernelStore } from '@/store/workspace-kernel';
import { Terminal, Download, Activity, Bell, X, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function WorkspaceBottomBar() {
  const { isBottomBarOpen, activeBottomTab, toggleBottomBar } = useWorkspaceKernelStore();

  return (
    <div className="flex flex-col border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
      
      {/* Bottom Panel Content (When Open) */}
      {isBottomBarOpen && (
        <div className="h-64 border-b border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between px-4 h-9 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex gap-4 h-full">
              <button 
                onClick={() => toggleBottomBar('logs')}
                className={cn("text-xs font-medium uppercase tracking-wider h-full px-1 border-b-2 transition-colors", activeBottomTab === 'logs' ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300")}
              >
                Output Logs
              </button>
              <button 
                onClick={() => toggleBottomBar('jobs')}
                className={cn("text-xs font-medium uppercase tracking-wider h-full px-1 border-b-2 transition-colors", activeBottomTab === 'jobs' ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300")}
              >
                Background Jobs
              </button>
              <button 
                onClick={() => toggleBottomBar('downloads')}
                className={cn("text-xs font-medium uppercase tracking-wider h-full px-1 border-b-2 transition-colors", activeBottomTab === 'downloads' ? "border-indigo-500 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300")}
              >
                Downloads
              </button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400" onClick={() => {}}>
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100" onClick={() => toggleBottomBar()}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
            {activeBottomTab === 'logs' && (
              <div className="text-slate-600 dark:text-slate-400">
                <div>[System] Workspace initialized successfully.</div>
                <div>[EventBus] Connected to internal events.</div>
                <div className="text-emerald-500">[Sync] Data synchronization complete.</div>
              </div>
            )}
            {activeBottomTab === 'jobs' && (
              <div className="text-slate-500 italic">No active background jobs.</div>
            )}
            {activeBottomTab === 'downloads' && (
              <div className="text-slate-500 italic">No recent downloads.</div>
            )}
          </div>
        </div>
      )}

      {/* Status Bar (Always visible) */}
      <div className="h-7 flex items-center justify-between px-3 text-[11px] font-medium text-slate-500 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            <span>PariLink Sync: Online</span>
          </div>
          
          <button 
            onClick={() => toggleBottomBar('jobs')}
            className={cn("flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-300 transition-colors", activeBottomTab === 'jobs' && isBottomBarOpen && "text-indigo-600 dark:text-indigo-400")}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>0 Jobs</span>
          </button>
          
          <button 
            onClick={() => toggleBottomBar('downloads')}
            className={cn("flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-300 transition-colors", activeBottomTab === 'downloads' && isBottomBarOpen && "text-indigo-600 dark:text-indigo-400")}
          >
            <Download className="h-3.5 w-3.5" />
            <span>0 Ready</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => toggleBottomBar('notifications')}
            className={cn("flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-300 transition-colors", activeBottomTab === 'notifications' && isBottomBarOpen && "text-indigo-600 dark:text-indigo-400")}
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
          <span>v27.1.0</span>
        </div>
      </div>

    </div>
  );
}
