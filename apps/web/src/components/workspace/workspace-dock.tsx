'use client';

import { useWorkspaceKernelStore } from '@/store/workspace-kernel';
import { cn } from '@/lib/utils';
import { Bot, MessageSquare, FolderTree, History, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkspaceDock() {
  const { panels, togglePanel, setPanelWidth, closeAllPanels } = useWorkspaceKernelStore();
  const openPanel = panels.find(p => p.isOpen);

  if (!openPanel) return null;

  return (
    <div 
      className="flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0 relative"
      style={{ width: openPanel.width }}
    >
      {/* Resizer Handle */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-1 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-500 z-10"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const startWidth = openPanel.width;
          
          const onMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = startWidth - (moveEvent.clientX - startX);
            if (newWidth >= 200 && newWidth <= 600) {
              setPanelWidth(openPanel.id, newWidth);
            }
          };
          
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };
          
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        }}
      />

      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 shrink-0 h-10">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {openPanel.title}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
            <Settings2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100" onClick={closeAllPanels}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {openPanel.id === 'ai' && (
          <div className="p-4 text-center text-sm text-slate-500">AI Copilot Panel (To be integrated)</div>
        )}
        {openPanel.id === 'comments' && (
          <div className="p-4 text-center text-sm text-slate-500">Comments Panel</div>
        )}
        {openPanel.id === 'files' && (
          <div className="p-4 text-center text-sm text-slate-500">Files Explorer</div>
        )}
        {openPanel.id === 'history' && (
          <div className="p-4 text-center text-sm text-slate-500">Audit & History Panel</div>
        )}
      </div>
    </div>
  );
}

export function WorkspaceDockActions() {
  const { panels, togglePanel } = useWorkspaceKernelStore();

  return (
    <div className="w-12 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-4 gap-4 flex-shrink-0 shrink-0">
      <button 
        onClick={() => togglePanel('ai')} 
        className={cn("p-2 rounded-xl transition-colors relative group", panels.find(p => p.id === 'ai')?.isOpen ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300")}
        title="AI Copilot"
      >
        <Bot className="h-5 w-5" />
      </button>
      <button 
        onClick={() => togglePanel('comments')} 
        className={cn("p-2 rounded-xl transition-colors relative group", panels.find(p => p.id === 'comments')?.isOpen ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300")}
        title="Comments"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
      <button 
        onClick={() => togglePanel('files')} 
        className={cn("p-2 rounded-xl transition-colors relative group", panels.find(p => p.id === 'files')?.isOpen ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300")}
        title="Files"
      >
        <FolderTree className="h-5 w-5" />
      </button>
      <button 
        onClick={() => togglePanel('history')} 
        className={cn("p-2 rounded-xl transition-colors relative group", panels.find(p => p.id === 'history')?.isOpen ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300")}
        title="History"
      >
        <History className="h-5 w-5" />
      </button>
    </div>
  );
}
