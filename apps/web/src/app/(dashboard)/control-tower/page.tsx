'use client';

import React, { useEffect, useState } from 'react';
import { useControlTowerStore } from '../../../store/control-tower.store';
import { LiveMap } from '../../../components/control-tower/live-map';
import { EventStream } from '../../../components/control-tower/event-stream';
import { ExceptionCenter } from '../../../components/control-tower/exception-center';
import { CommandCenter } from '../../../components/control-tower/command-center';
import { ShieldAlert, Activity, Command } from 'lucide-react';

export default function ControlTowerPage() {
  const { connect, disconnect, isConnected } = useControlTowerStore();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    // In a real app, we fetch the authenticated user's company ID
    const companyId = 'demo-company-id';
    connect(companyId);

    // Setup CMD+K shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      disconnect();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [connect, disconnect]);

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-100 overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
          <h1 className="font-semibold text-lg tracking-tight">Mission Control</h1>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
            {isConnected ? 'WS CONNECTED' : 'WS RECONNECTING...'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCmdOpen(true)}
            className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-700"
          >
            <Command className="w-4 h-4" />
            <span>Command Center</span>
            <kbd className="font-mono text-xs bg-slate-700 px-1.5 py-0.5 rounded ml-2">⌘K</kbd>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-row overflow-hidden">
        
        {/* LEFT: Live Map & Analytics */}
        <div className="w-2/3 h-full relative bg-slate-900 border-r border-slate-800">
          <LiveMap />
          
          {/* Floating Analytics Overlay */}
          <div className="absolute top-4 left-4 z-10 flex space-x-3">
            <div className="glass-panel px-4 py-3 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl bg-slate-950/40">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Fleet</p>
              <p className="text-2xl font-bold font-mono text-white mt-1">4,203</p>
            </div>
            <div className="glass-panel px-4 py-3 rounded-xl border border-red-500/20 shadow-2xl backdrop-blur-xl bg-red-950/20">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wider">Critical Delays</p>
              <p className="text-2xl font-bold font-mono text-red-100 mt-1">12</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Exceptions & Event Stream */}
        <div className="w-1/3 flex flex-col h-full">
          
          {/* Exception Center */}
          <div className="h-2/5 bg-slate-900 border-b border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800/50 flex items-center space-x-2 shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <h2 className="font-semibold text-slate-100">Exception Center</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <ExceptionCenter />
            </div>
          </div>

          {/* Event Stream */}
          <div className="h-3/5 bg-slate-900 flex flex-col">
            <div className="p-4 border-b border-slate-800/50 flex items-center space-x-2 shrink-0">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-slate-100">Live Event Stream</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <EventStream />
            </div>
          </div>
        </div>
      </div>

      <CommandCenter open={cmdOpen} setOpen={setCmdOpen} />
      
      {/* Global styles for this layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
