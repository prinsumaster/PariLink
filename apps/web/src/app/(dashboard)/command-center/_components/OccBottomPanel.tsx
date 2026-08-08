'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Activity, Download, Terminal, Clock, X } from 'lucide-react';
import { EventTimeline } from './EventTimeline';

type BottomTab = 'jobs' | 'downloads' | 'logs' | 'timeline' | null;

export function OccBottomPanel() {
  const [activeTab, setActiveTab] = useState<BottomTab>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTab = (tab: BottomTab) => {
    if (activeTab === tab) {
      setIsExpanded(!isExpanded);
    } else {
      setActiveTab(tab);
      setIsExpanded(true);
    }
  };

  const closePanel = () => {
    setIsExpanded(false);
    setTimeout(() => setActiveTab(null), 300); // Wait for transition
  };

  return (
    <div className={cn(
      "w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out",
      isExpanded ? "h-64" : "h-10"
    )}>
      {/* Header / Tabs */}
      <div className="flex items-center px-4 h-10 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex gap-1 flex-1">
          <TabButton 
            active={activeTab === 'timeline' && isExpanded} 
            onClick={() => toggleTab('timeline')}
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Event Timeline"
          />
          <TabButton 
            active={activeTab === 'jobs' && isExpanded} 
            onClick={() => toggleTab('jobs')}
            icon={<Activity className="h-3.5 w-3.5" />}
            label="Background Jobs"
          />
          <TabButton 
            active={activeTab === 'downloads' && isExpanded} 
            onClick={() => toggleTab('downloads')}
            icon={<Download className="h-3.5 w-3.5" />}
            label="Downloads"
          />
          <TabButton 
            active={activeTab === 'logs' && isExpanded} 
            onClick={() => toggleTab('logs')}
            icon={<Terminal className="h-3.5 w-3.5" />}
            label="Logs"
          />
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {isExpanded && (
            <button 
              onClick={closePanel}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-slate-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-slate-500"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={cn(
        "flex-1 overflow-hidden",
        !isExpanded && "hidden"
      )}>
        {activeTab === 'timeline' && <EventTimeline />}
        {activeTab === 'jobs' && <PlaceholderContent title="Background Jobs" />}
        {activeTab === 'downloads' && <PlaceholderContent title="Downloads" />}
        {activeTab === 'logs' && <PlaceholderContent title="System Logs" />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-t-md border-b-2 transition-colors",
        active 
          ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-950" 
          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
      <div className="flex flex-col items-center gap-2">
        <Activity className="h-6 w-6 opacity-50" />
        <span className="text-sm font-medium">{title} content will appear here</span>
      </div>
    </div>
  );
}
