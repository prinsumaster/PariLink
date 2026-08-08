'use client';

import { useState } from 'react';
import { Map, LayoutList, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const LoadingFallback = ({ text }: { text: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    <p className="text-sm font-medium">{text}</p>
  </div>
);

const LiveFleetMap = dynamic(() => import('./LiveFleetMap').then(mod => mod.LiveFleetMap), { 
  ssr: false, 
  loading: () => <LoadingFallback text="Initializing Map Engine..." /> 
});
const AnalyticsDashboard = dynamic(() => import('./AnalyticsDashboard').then(mod => mod.AnalyticsDashboard), { 
  ssr: false, 
  loading: () => <LoadingFallback text="Loading Analytics Engine..." /> 
});
import { DispatchBoardV2 } from './DispatchBoardV2';
import { DigitalTwin } from './DigitalTwin';
import { BarChart2 } from 'lucide-react';

type OccView = 'map' | 'board' | 'twin' | 'analytics';

export function OccCenterArea() {
  const [view, setView] = useState<OccView>('map');

  return (
    <div className="flex-1 flex flex-col h-full relative">
      
      {/* View Switcher Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-1">
        <button
          onClick={() => setView('map')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            view === 'map' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Map className="h-3.5 w-3.5" />
          Live Map
        </button>
        <button
          onClick={() => setView('board')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            view === 'board' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <LayoutList className="h-3.5 w-3.5" />
          Dispatch Board
        </button>
        <button
          onClick={() => setView('twin')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            view === 'twin' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Network className="h-3.5 w-3.5" />
          Digital Twin
        </button>
        <button
          onClick={() => setView('analytics')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            view === 'analytics' ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <BarChart2 className="h-3.5 w-3.5" />
          Analytics
        </button>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={cn("absolute inset-0 transition-opacity duration-300", view === 'map' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
          <LiveFleetMap selectedTrip={null} />
        </div>
        
        <div className={cn("absolute inset-0 transition-opacity duration-300", view === 'board' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
          <DispatchBoardV2 />
        </div>

        <div className={cn("absolute inset-0 transition-opacity duration-300", view === 'twin' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
          <DigitalTwin />
        </div>

        <div className={cn("absolute inset-0 transition-opacity duration-300", view === 'analytics' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none")}>
          <AnalyticsDashboard />
        </div>
      </div>

    </div>
  );
}
