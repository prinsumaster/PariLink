"use client";
import React from 'react';
import { AlertCircle, Wrench, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AlertCenterProps {
  onSelectTrip: (tripId: string) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ onSelectTrip }) => {
  return (
    <div className="p-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between items-center">
        Real-Time Alerts <Badge variant="destructive" className="bg-rose-500 text-[10px]">3 New</Badge>
      </h3>
      
      <div className="space-y-3">
        {/* High Alert */}
        <div 
          onClick={() => onSelectTrip('T-102')}
          className="bg-slate-900 border border-rose-900/50 p-3 rounded-lg cursor-pointer hover:bg-slate-800 hover:border-rose-700 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-rose-500/20 p-1">
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">Driver SOS Triggered</p>
              <p className="text-xs text-slate-400 mt-1">Trip T-102 (Jane Smith) reported an emergency on Route 66.</p>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">2 mins ago</p>
            </div>
          </div>
        </div>

        {/* Medium Alert */}
        <div 
          onClick={() => onSelectTrip('T-884')}
          className="bg-slate-900 border border-amber-900/50 p-3 rounded-lg cursor-pointer hover:bg-slate-800 hover:border-amber-700 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-500/20 p-1">
              <Wrench className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">Breakdown Reported</p>
              <p className="text-xs text-slate-400 mt-1">Truck MH04XY9999 engine temperature critical.</p>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">14 mins ago</p>
            </div>
          </div>
        </div>

        {/* Low Alert */}
        <div 
          onClick={() => onSelectTrip('WH-Alpha')}
          className="bg-slate-900 border border-blue-900/50 p-3 rounded-lg cursor-pointer hover:bg-slate-800 hover:border-blue-700 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-500/20 p-1">
              <ShieldAlert className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">Warehouse Congestion</p>
              <p className="text-xs text-slate-400 mt-1">WH-Alpha inbound docks at 94% utilization.</p>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">1 hr ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
