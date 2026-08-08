'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceKernelStore } from '@/store/workspace-kernel';
import { WorkspaceTabBar } from './workspace-tab-bar';
import { WorkspaceSidebar } from './workspace-sidebar';
import { WorkspaceDock, WorkspaceDockActions } from './workspace-dock';
import { WorkspaceBottomBar } from './workspace-bottom-bar';
import { ComponentRegistry } from './component-registry';
import { WorkspaceOrchestrator } from './workspace-orchestrator';
import { CommandPalette } from '@/components/layout/command-palette';
import { Header } from '@/components/layout/header';
import { GlobalCommandMenu } from '@/components/layout/command-menu';
import { cn } from '@/lib/utils';
import { FileCode } from 'lucide-react';
import { ReactNode } from 'react';

import { useRealtimeEngine } from '@/hooks/use-realtime-engine';

export function WorkspaceShell({ children }: { children: ReactNode }) {
  useRealtimeEngine();
  const { tabs, activeTabId, splitMode, secondaryTabId, sidebarCollapsed } = useWorkspaceKernelStore();

  const activeTab = tabs.find(t => t.id === activeTabId);
  const secondaryTab = tabs.find(t => t.id === secondaryTabId);

  // Determine what to render in the main view.
  // If there are no tabs open, render children (the default Next.js route, e.g. /dashboard)
  // Otherwise, render the active tab from the component registry, preserving others via hidden divs.

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. Left Sidebar */}
      <WorkspaceSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 2. Top Bar (Global Context & Search) */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0 flex items-center justify-between">
          <Header onMenuClick={() => {}} />
        </div>

        {/* 3. Tab Bar */}
        <WorkspaceTabBar />

        {/* 4. Editor Area (Supports Split View) */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative bg-white dark:bg-slate-900">
          
          {tabs.length === 0 ? (
            // No tabs open -> Show Next.js native router children
            <div className="flex-1 w-full h-full overflow-y-auto">
              {children}
            </div>
          ) : (
            <>
              {/* PRIMARY VIEW */}
              <div className={cn(
                "h-full overflow-y-auto relative",
                splitMode === 'horizontal' && "h-1/2 border-b border-slate-200 dark:border-slate-800",
                splitMode === 'vertical' && "w-1/2 border-r border-slate-200 dark:border-slate-800",
                splitMode === 'single' && "flex-1"
              )}>
                {tabs.map((tab) => {
                  const Component = ComponentRegistry[tab.type];
                  const isVisible = tab.id === activeTabId;
                  
                  return (
                    <div 
                      key={`primary-${tab.id}`} 
                      className={cn("absolute inset-0 bg-white dark:bg-slate-900", isVisible ? "block z-10" : "hidden z-0")}
                    >
                      {Component ? <Component /> : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <FileCode className="h-12 w-12 mb-4 opacity-50" />
                          <p>Component Not Found: {tab.type}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SECONDARY VIEW (Split) */}
              {splitMode !== 'single' && (
                <div className={cn(
                  "h-full overflow-y-auto relative bg-slate-50 dark:bg-slate-950",
                  splitMode === 'horizontal' && "h-1/2",
                  splitMode === 'vertical' && "w-1/2",
                )}>
                  {!secondaryTab ? (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                      Select a tab to open in split view
                    </div>
                  ) : (
                    tabs.map((tab) => {
                      const Component = ComponentRegistry[tab.type];
                      const isVisible = tab.id === secondaryTabId;
                      
                      return (
                        <div 
                          key={`secondary-${tab.id}`} 
                          className={cn("absolute inset-0", isVisible ? "block z-10" : "hidden z-0")}
                        >
                          {Component ? <Component /> : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                              <FileCode className="h-12 w-12 mb-4 opacity-50" />
                              <p>Component Not Found: {tab.type}</p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 5. Bottom Bar (Logs/Jobs) */}
        <WorkspaceBottomBar />
      </div>
      {/* 6. Right Dock (AI, Comments, Files) */}
      <WorkspaceDock />
      <WorkspaceDockActions />

      {/* Overlays */}
      <GlobalCommandMenu />
      <CommandPalette />
      <WorkspaceOrchestrator />
    </div>
  );
}
