'use client';

import { useWorkspaceStore } from '@/store/workspace';
import { Button } from '@/components/ui/button';
import { PanelRightClose, Clock, Star, ClipboardList, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function WorkspaceContextBar() {
  const { isContextBarOpen, setContextBarOpen } = useWorkspaceStore();

  if (!isContextBarOpen) return null;

  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-screen flex flex-col shadow-xl absolute right-0 top-0 z-40 transition-transform">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Workspace</h2>
        <Button variant="ghost" size="icon" onClick={() => setContextBarOpen(false)}>
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Pinned / Favorites */}
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100 gap-2">
              <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
              Pinned
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-center border border-slate-100 dark:border-slate-800/50 border-dashed">
              <p className="text-xs text-slate-500">No pinned records.</p>
              <p className="text-[10px] text-slate-400 mt-1">Right-click any record to pin it here for quick access.</p>
            </div>
          </div>

          {/* Recent */}
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100 gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Recently Viewed
            </div>
            <div className="space-y-1">
              {/* Dummy data for now */}
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Load #1042</span>
                  <span className="text-[10px] text-slate-500">Dallas, TX → Austin, TX</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Acme Corp</span>
                  <span className="text-[10px] text-slate-500">Customer</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Clipboard */}
          <div className="space-y-3">
            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-slate-100 gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-500" />
              Clipboard
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800/50 line-clamp-3">
              Items copied via the command palette will appear here.
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
