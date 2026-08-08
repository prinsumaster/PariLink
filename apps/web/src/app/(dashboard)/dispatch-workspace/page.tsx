"use client";

import React, { useState } from 'react';
import { KanbanDispatchBoard } from './_components/KanbanDispatchBoard';
import { UniversalSearch } from './_components/UniversalSearch';
import { TripWorkspacePanel } from './_components/TripWorkspacePanel';
import { AiAssistantPanel } from './_components/AiAssistantPanel';
import { Map, ListTodo, Activity, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DispatchWorkspacePage() {
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'MAP' | 'TIMELINE'>('KANBAN');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <UniversalSearch onSelectTrip={setSelectedTrip} />
      
      {/* LEFT NAVIGATION / VIEWS */}
      <div className="w-16 flex flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur items-center py-4 gap-4">
        <Button 
          variant={activeTab === 'KANBAN' ? 'secondary' : 'ghost'} 
          size="icon" 
          onClick={() => setActiveTab('KANBAN')}
          className={activeTab === 'KANBAN' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'text-slate-400'}
        >
          <ListTodo className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'MAP' ? 'secondary' : 'ghost'} 
          size="icon" 
          onClick={() => setActiveTab('MAP')}
          className={activeTab === 'MAP' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'text-slate-400'}
        >
          <Map className="h-5 w-5" />
        </Button>
        <Button 
          variant={activeTab === 'TIMELINE' ? 'secondary' : 'ghost'} 
          size="icon" 
          onClick={() => setActiveTab('TIMELINE')}
          className={activeTab === 'TIMELINE' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'text-slate-400'}
        >
          <Activity className="h-5 w-5" />
        </Button>
      </div>

      {/* MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur shrink-0 justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg text-slate-100 tracking-tight">Dispatch Operations</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 uppercase tracking-wider border border-indigo-500/20">
              Live
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
              <span className="text-slate-400">Cmd+K</span>
              <span className="text-slate-300 font-medium">Search anything</span>
            </div>
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950/80">
          {activeTab === 'KANBAN' && <KanbanDispatchBoard onSelectTrip={setSelectedTrip} />}
          {activeTab === 'MAP' && (
             <div className="h-full w-full flex items-center justify-center text-slate-500">
               Live Fleet Map View (Shared with Command Center)
             </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - AI & Notifications */}
      <div className={`w-[400px] flex flex-col border-l border-slate-800 bg-slate-900/50 backdrop-blur transition-all duration-300 ${selectedTrip ? 'translate-x-0' : ''}`}>
        {selectedTrip ? (
          <TripWorkspacePanel tripId={selectedTrip} onClose={() => setSelectedTrip(null)} />
        ) : (
          <AiAssistantPanel />
        )}
      </div>
    </div>
  );
}
