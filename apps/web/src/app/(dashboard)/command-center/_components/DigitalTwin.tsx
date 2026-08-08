'use client';
import React from 'react';
import { Package, Truck, Home, Database, AlertCircle, Zap } from 'lucide-react';

export function DigitalTwin() {
  return (
    <div className="relative h-full w-full bg-slate-950 overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Overlay Metrics */}
      <div className="absolute top-6 left-6 z-10 flex gap-4">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg p-4 w-48 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Global Revenue</div>
          <div className="text-2xl font-bold text-white">$142,500</div>
          <div className="text-emerald-400 text-xs mt-1">+12.5% today</div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg p-4 w-48 shadow-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Active Trips</div>
          <div className="text-2xl font-bold text-indigo-400">842</div>
          <div className="text-slate-500 text-xs mt-1">92% On-Time</div>
        </div>
      </div>

      {/* SVG Canvas for Edges */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Static connection lines */}
        <path d="M 250,400 Q 400,300 600,400" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 600,400 Q 800,500 950,400" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 600,400 Q 600,200 600,150" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 600,400 Q 800,250 950,200" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 250,400 Q 400,550 500,700" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />

        {/* Animated Flow 1 */}
        <path d="M 250,400 Q 400,300 600,400" fill="none" stroke="url(#flowGrad)" strokeWidth="3" filter="url(#glow)">
          <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="4s" repeatCount="indefinite" />
        </path>
        
        {/* Animated Flow 2 */}
        <path d="M 600,400 Q 800,500 950,400" fill="none" stroke="#10b981" strokeOpacity="0.8" strokeWidth="3" filter="url(#glow)">
          <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="3.5s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Nodes */}
      
      {/* Node: West Coast Hub */}
      <div className="absolute top-[350px] left-[150px] transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/40 transition-all"></div>
          <div className="relative h-20 w-20 bg-slate-900 border-2 border-indigo-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10">
            <Database className="h-6 w-6 text-indigo-400 mb-1" />
            <span className="text-[10px] font-bold text-white">US-WEST</span>
          </div>
          <div className="absolute top-full mt-2 w-32 left-1/2 -translate-x-1/2 text-center">
            <div className="text-xs font-semibold text-slate-300">Port of LA Hub</div>
            <div className="text-[10px] text-slate-500">82% Capacity</div>
          </div>
        </div>
      </div>

      {/* Node: Central HQ */}
      <div className="absolute top-[350px] left-[550px] transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-6 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative h-24 w-24 bg-slate-900 border-2 border-purple-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)] z-10">
            <Home className="h-8 w-8 text-purple-400 mb-1" />
            <span className="text-[11px] font-bold text-white">CENTRAL</span>
          </div>
          <div className="absolute top-full mt-3 w-40 left-1/2 -translate-x-1/2 text-center bg-slate-900/90 border border-slate-700 p-2 rounded-md shadow-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-xs font-semibold text-white">Chicago Superhub</div>
            <div className="text-[10px] text-slate-400 mt-1 flex justify-between"><span>Throughput:</span> <span className="text-emerald-400">High</span></div>
            <div className="text-[10px] text-slate-400 flex justify-between"><span>Active Jobs:</span> <span className="text-indigo-400">142</span></div>
          </div>
        </div>
      </div>

      {/* Node: East Coast Hub */}
      <div className="absolute top-[350px] left-[900px] transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/40 transition-all"></div>
          <div className="relative h-20 w-20 bg-slate-900 border-2 border-emerald-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10">
            <Database className="h-6 w-6 text-emerald-400 mb-1" />
            <span className="text-[10px] font-bold text-white">US-EAST</span>
          </div>
          <div className="absolute top-full mt-2 w-32 left-1/2 -translate-x-1/2 text-center">
            <div className="text-xs font-semibold text-slate-300">NY/NJ Terminal</div>
            <div className="text-[10px] text-slate-500">95% Capacity</div>
          </div>
          {/* Alert Badge */}
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-slate-900 z-20">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      {/* Node: Northern Warehouse */}
      <div className="absolute top-[100px] left-[550px] transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative group cursor-pointer">
          <div className="relative h-16 w-16 bg-slate-900 border border-slate-600 rounded-full flex flex-col items-center justify-center z-10">
            <Package className="h-5 w-5 text-slate-400 mb-1" />
            <span className="text-[9px] font-bold text-slate-300">WH-N</span>
          </div>
        </div>
      </div>

      {/* Moving Entity: Truck 1 */}
      <div className="absolute top-[280px] left-[320px] transform -translate-x-1/2 -translate-y-1/2 z-20 group">
        <div className="h-8 w-8 bg-slate-800 border-2 border-indigo-400 rounded-full flex items-center justify-center shadow-lg">
          <Truck className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="absolute bottom-full mb-2 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          V-1042 · In Transit
        </div>
      </div>

      {/* Moving Entity: Truck 2 (Delayed) */}
      <div className="absolute top-[415px] left-[700px] transform -translate-x-1/2 -translate-y-1/2 z-20 group">
        <div className="h-8 w-8 bg-slate-800 border-2 border-rose-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <Truck className="h-4 w-4 text-rose-500" />
        </div>
        <div className="absolute bottom-full mb-2 bg-rose-950 border border-rose-500 px-2 py-1 rounded text-[10px] text-rose-200 whitespace-nowrap opacity-100">
          V-8821 · Break Down
        </div>
      </div>

    </div>
  );
}
