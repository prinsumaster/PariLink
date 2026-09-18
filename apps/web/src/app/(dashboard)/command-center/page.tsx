"use client";

import { useEffect, useState } from 'react';
import { GlassKpiCard } from '@/components/command-center/GlassKpiCard';
import { AiDispatchPanel } from '@/components/command-center/AiDispatchPanel';

// Mock KPI data for initial render until socket connects
const initialKpis = [
  { title: "Active Trips", value: 0 },
  { title: "Pending Loads", value: 0 },
  { title: "Available Drivers", value: 0 },
  { title: "Vehicles In Service", value: 0 },
];

export default function CommandCenterPage() {
  const [kpis, setKpis] = useState(initialKpis);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In a real implementation, this would connect to the Command Center WebSocket
    setIsConnected(true);
    setKpis([
      { title: "Active Trips", value: 24 },
      { title: "Pending Loads", value: 12 },
      { title: "Available Drivers", value: 8 },
      { title: "Vehicles In Service", value: 36 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-8 pt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Intelligent Command Center</h1>
            <p className="text-indigo-200 mt-1 flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isConnected ? 'Live Data Stream Active' : 'Connecting...'}</span>
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur border border-white/10 transition-colors text-sm font-medium">
              View Map
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/30 transition-colors text-sm font-medium">
              Generate Report
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => (
            <GlassKpiCard
              key={idx}
              title={kpi.title}
              value={kpi.value}
            />
          ))}
        </div>

        {/* AI Dispatch Section */}
        <AiDispatchPanel />

      </div>
    </div>
  );
}
