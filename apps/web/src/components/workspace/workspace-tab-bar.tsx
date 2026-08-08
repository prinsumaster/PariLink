'use client';

import { useWorkspaceKernelStore, WorkspaceTab } from '@/store/workspace-kernel';
import { X, Plus, GripVertical, FileCode, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function WorkspaceTabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, closeAllTabs, closeOtherTabs, setSplitMode, splitMode } = useWorkspaceKernelStore();
  const router = useRouter();

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto select-none no-scrollbar h-10 shrink-0">
      <div className="flex-1 flex items-center min-w-max h-full">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const Icon = tab.icon || FileCode;
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                // Also update URL to keep Next.js routing in sync if possible, or just push State
                window.history.pushState(null, '', tab.url);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                // Simple context menu logic could go here
              }}
              className={cn(
                "group flex items-center h-full px-3 gap-2 border-r border-slate-200 dark:border-slate-800 max-w-[200px] cursor-pointer transition-colors relative",
                isActive 
                  ? "bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400" 
                  : "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-500" />
              )}
              <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", isActive ? "text-indigo-600 dark:text-indigo-500" : "text-slate-400")} />
              <span className="text-[11px] font-medium truncate">{tab.title}</span>
              {tab.isDirty && (
                <div className="h-2 w-2 rounded-full bg-amber-500 ml-1 flex-shrink-0" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={cn(
                  "p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 ml-auto flex-shrink-0",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center px-2 border-l border-slate-200 dark:border-slate-800 h-full bg-slate-50 dark:bg-slate-900">
        <button 
          onClick={() => setSplitMode(splitMode === 'single' ? 'vertical' : 'single')}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
          title="Split Editor Right"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
