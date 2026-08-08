'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Map as MapIcon, 
  Network, 
  PlayCircle, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  Building2,
  Box
} from 'lucide-react';
import { ContextPanel } from './ContextPanel';

type ViewMode = 'EXECUTIVE' | 'OPERATIONS';

export function ControlTowerCanvas() {
  const [viewMode, setViewMode] = useState<ViewMode>('OPERATIONS');
  const [selectedEntity, setSelectedEntity] = useState<string | null>('WH-A1');
  
  const [metrics, setMetrics] = useState({
    businessHealth: 0,
    predictedSla: 0,
    operationalRisk: 'Low',
    aiConfidence: 'Low (0%)',
    liveTrips: 0,
    delayedAtRisk: 0,
    executionQueue: 0,
    pluginHealth: 'Unknown'
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/v1/operations/dashboard/snapshot', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data) setMetrics(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="flex h-full w-full bg-slate-900 overflow-hidden text-slate-100">
      
      {/* Center Workspace (Mission Control) */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800">
        
        {/* Control Bar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-indigo-400" />
              Autonomous Control Tower
            </h1>
            <div className="h-6 w-px bg-slate-700 mx-2" />
            <div className="flex bg-slate-800 rounded-md p-1">
              <button 
                onClick={() => setViewMode('EXECUTIVE')}
                className={`px-4 py-1 text-sm font-medium rounded ${viewMode === 'EXECUTIVE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Executive
              </button>
              <button 
                onClick={() => setViewMode('OPERATIONS')}
                className={`px-4 py-1 text-sm font-medium rounded ${viewMode === 'OPERATIONS' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Operations
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Activity className="h-3 w-3 mr-1" /> Twin Sync: Live
            </Badge>
          </div>
        </div>

        {/* Dynamic Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* KPI Ribbon */}
          {viewMode === 'EXECUTIVE' ? (
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">Business Health</p>
                  <div className="text-3xl font-bold text-emerald-400">{metrics.businessHealth.toFixed(1)}%</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">Predicted SLA</p>
                  <div className="text-3xl font-bold text-white">{metrics.predictedSla.toFixed(1)}%</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">Operational Risk</p>
                  <div className="text-3xl font-bold text-amber-400">{metrics.operationalRisk}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">AI Confidence</p>
                  <div className="text-3xl font-bold text-indigo-400">{metrics.aiConfidence}</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">Live Trips</p>
                  <div className="text-3xl font-bold text-blue-400">{metrics.liveTrips}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <p className="text-sm text-amber-400 mb-1">Delayed / At Risk</p>
                  <div className="text-3xl font-bold text-amber-500">{metrics.delayedAtRisk}</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">Execution Queue</p>
                  <div className="text-3xl font-bold text-white">{metrics.executionQueue} Pending</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-400 mb-1">Plugin Health</p>
                  <div className="text-3xl font-bold text-emerald-400">{metrics.pluginHealth}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Interactive Digital Twin Map / Graph visualization skeleton */}
          <div className="h-[500px] rounded-lg border border-slate-700 bg-slate-950 flex flex-col">
            <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <MapIcon className="h-4 w-4 mr-2" /> Geographic Map
              </Button>
              <Button variant="ghost" size="sm" className="text-indigo-400 bg-indigo-900/20">
                <Network className="h-4 w-4 mr-2" /> Enterprise Graph
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <PlayCircle className="h-4 w-4 mr-2" /> Live Execution
              </Button>
            </div>
            
            <div className="flex-1 relative flex items-center justify-center overflow-hidden p-8">
              {/* Mocking a graph rendering with absolute positioned elements */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              
              <div className="relative w-full max-w-4xl h-full">
                {/* Node: Warehouse */}
                <button 
                  onClick={() => setSelectedEntity('WH-A1')}
                  className={`absolute top-[20%] left-[10%] p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedEntity === 'WH-A1' ? 'bg-indigo-900/50 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'bg-slate-800 border-slate-600 hover:border-slate-400'}`}
                >
                  <Building2 className="h-8 w-8 text-blue-400 mb-2" />
                  <span className="text-xs font-bold">Dallas Hub</span>
                </button>

                {/* Node: Trip */}
                <button 
                  onClick={() => setSelectedEntity('TRP-992')}
                  className={`absolute top-[40%] left-[45%] p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedEntity === 'TRP-992' ? 'bg-indigo-900/50 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'bg-slate-800 border-amber-500/50 hover:border-amber-400'}`}
                >
                  <AlertTriangle className="h-6 w-6 text-amber-500 mb-2" />
                  <span className="text-xs font-bold text-amber-400">TRP-992 (Delayed)</span>
                </button>

                {/* Node: Vehicle */}
                <button 
                  onClick={() => setSelectedEntity('TRK-01')}
                  className={`absolute top-[70%] left-[80%] p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedEntity === 'TRK-01' ? 'bg-indigo-900/50 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.5)]' : 'bg-slate-800 border-slate-600 hover:border-slate-400'}`}
                >
                  <Truck className="h-8 w-8 text-emerald-400 mb-2" />
                  <span className="text-xs font-bold">TRK-01</span>
                </button>
                
                {/* Mock SVG lines to represent dependencies */}
                <svg className="absolute inset-0 h-full w-full -z-10" style={{ pointerEvents: 'none' }}>
                  <line x1="20%" y1="30%" x2="48%" y2="45%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="55%" y1="52%" x2="82%" y2="73%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Context Panel */}
      <ContextPanel selectedEntityId={selectedEntity} />
    </div>
  );
}
