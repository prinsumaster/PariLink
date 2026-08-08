"use client";

import React, { useState } from 'react';
import { Truck, Clock, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useTrips } from '@/hooks';
import { useLoads } from '@/hooks/use-loads';

interface KanbanDispatchBoardProps {
  onSelectTrip: (tripId: string) => void;
}

export const KanbanDispatchBoard: React.FC<KanbanDispatchBoardProps> = ({ onSelectTrip }) => {
  const { data: tripsData } = useTrips({ limit: 100 });
  const { data: loadsData } = useLoads({ limit: 100 });

  const trips = tripsData?.data || [];
  const loads = loadsData?.data || [];

  const columns = [
    { 
      id: 'UNPLANNED', 
      title: 'Unplanned Loads', 
      items: loads.filter(l => l.status === 'PENDING').map(l => ({ id: l.id, title: `${l.originCity || 'Unknown'} -> ${l.destinationCity || 'Unknown'}`, type: 'Load', weight: `${l.weight || 0}kg` })) 
    },
    { 
      id: 'AWAITING_VEHICLE', 
      title: 'Awaiting Vehicle', 
      items: trips.filter(t => t.status === 'PLANNED').map(t => ({ id: t.id, title: `Trip ${t.tripNumber || t.id.substring(0, 8)}`, type: 'Trip', driver: t.driverId ? 'Assigned' : 'Unassigned', vehicle: t.vehicleId ? 'Assigned' : 'Unassigned' })) 
    },
    { 
      id: 'IN_TRANSIT', 
      title: 'In Transit', 
      items: trips.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DISPATCHED').map(t => ({ id: t.id, title: `Trip ${t.tripNumber || t.id.substring(0, 8)}`, type: 'Trip', vehicle: t.vehicleId, eta: t.eta ? new Date(t.eta).toLocaleTimeString() : 'Unknown' })) 
    },
    { 
      id: 'DELAYED', 
      title: 'Delayed / Issues', 
      items: trips.filter(t => t.status === 'CANCELLED').map(t => ({ id: t.id, title: `Trip ${t.tripNumber || t.id.substring(0, 8)}`, type: 'Trip', issue: 'Schedule Risk' })) 
    },
  ];

  return (
    <div className="flex h-full w-full overflow-x-auto p-6 gap-6 custom-scrollbar bg-slate-950/80 items-start">
      {columns.map(col => (
        <div key={col.id} className="w-80 shrink-0 flex flex-col max-h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-300 text-sm">{col.title}</h3>
            <Badge variant="secondary" className="bg-slate-800 text-slate-400">{col.items.length}</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-4">
            {col.items.map(item => (
              <Card 
                key={item.id}
                className="bg-slate-900 border-slate-700 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] cursor-grab transition-all p-3"
                onClick={() => onSelectTrip(item.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{item.id}</span>
                  {col.id === 'DELAYED' && <AlertCircle className="h-4 w-4 text-rose-500" />}
                  {col.id === 'IN_TRANSIT' && <Truck className="h-4 w-4 text-emerald-500" />}
                  {col.id === 'UNPLANNED' && <Package className="h-4 w-4 text-slate-500" />}
                </div>
                <h4 className="font-medium text-slate-100 text-sm mb-2">{item.title}</h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  {(item as any).vehicle && <span className="bg-slate-800 px-2 py-1 rounded">V: {(item as any).vehicle}</span>}
                  {(item as any).driver && <span className="bg-slate-800 px-2 py-1 rounded">D: {(item as any).driver}</span>}
                  {(item as any).eta && <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1"><Clock className="h-3 w-3"/> ETA: {(item as any).eta}</span>}
                  {(item as any).issue && <span className="bg-rose-500/10 text-rose-400 px-2 py-1 rounded border border-rose-500/20">{(item as any).issue}</span>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
