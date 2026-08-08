"use client";

import React, { useState } from 'react';
import { X, Truck, User, MapPin, CheckCircle2, Clock, AlertTriangle, MessageSquare, DollarSign, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useTrip } from '@/hooks';

interface TripWorkspacePanelProps {
  tripId: string;
  onClose: () => void;
}

export const TripWorkspacePanel: React.FC<TripWorkspacePanelProps> = ({ tripId, onClose }) => {
  const { data: trip, isLoading } = useTrip(tripId);

  if (isLoading || !trip) return <div className="p-8 text-slate-400">Loading trip details...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden shadow-2xl relative">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded text-sm font-bold">{trip.id}</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
            <span className={`h-1.5 w-1.5 rounded-full ${trip.status === 'IN_PROGRESS' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} /> {trip.status}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Quick Context Header */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Trip #{trip.tripNumber || trip.id.substring(0, 8)}</h2>
            <Button variant="secondary" size="sm" className="bg-slate-800 text-slate-200 hover:bg-slate-700 h-7 text-xs">
              <PenSquare className="h-3 w-3 mr-2" /> Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
             <div className="flex items-center gap-2 text-slate-300">
               <Truck className="h-4 w-4 text-slate-500" />
               <span className="font-mono">{trip.vehicleId || 'Unassigned'}</span>
             </div>
             <div className="flex items-center gap-2 text-slate-300">
               <User className="h-4 w-4 text-slate-500" />
               <span>{trip.driverId || 'Unassigned'}</span>
             </div>
             <div className="flex items-center gap-2 text-slate-300">
               <MapPin className="h-4 w-4 text-slate-500" />
               <span>ETA: {trip.eta ? new Date(trip.eta).toLocaleTimeString() : 'Not Set'}</span>
             </div>
             <div className="flex items-center gap-2 text-slate-300">
               <DollarSign className="h-4 w-4 text-slate-500" />
               <span className="text-emerald-400">₹{trip.fuelExpenses || 0}</span>
             </div>
          </div>
        </div>

        {/* Tabbed Workspace */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="w-full justify-start bg-slate-900 border-b border-slate-800 p-0 h-12 rounded-none px-4">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none h-full data-[state=active]:shadow-none text-slate-400 data-[state=active]:text-indigo-400 font-medium">Timeline</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none h-full data-[state=active]:shadow-none text-slate-400 data-[state=active]:text-indigo-400 font-medium">Internal Notes</TabsTrigger>
            <TabsTrigger value="docs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none h-full data-[state=active]:shadow-none text-slate-400 data-[state=active]:text-indigo-400 font-medium">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="p-4 m-0 space-y-4">
             {/* Timeline Node 1 */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center z-10 shrink-0">
                   <Clock className="h-3 w-3 text-indigo-400" />
                 </div>
                 <div className="w-[1px] h-full bg-slate-700 my-1" />
               </div>
               <div className="pb-4">
                 <p className="text-sm font-semibold text-slate-200">Trip Scheduled</p>
                 <p className="text-xs text-slate-400">By System Automation</p>
                 <span className="text-[10px] text-slate-500 font-mono">Today, 08:00 AM</span>
               </div>
             </div>

             {/* Timeline Node 2 */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center z-10 shrink-0">
                   <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                 </div>
                 <div className="w-[1px] h-full bg-slate-700 my-1" />
               </div>
               <div className="pb-4">
                 <p className="text-sm font-semibold text-emerald-400">Loading Completed</p>
                 <p className="text-xs text-slate-400">WH-Alpha Dock 4</p>
                 <span className="text-[10px] text-slate-500 font-mono">Today, 10:15 AM</span>
               </div>
             </div>

             {/* Timeline Node 3 (Active) */}
             <div className="flex gap-4">
               <div className="flex flex-col items-center">
                 <div className="h-6 w-6 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center z-10 shrink-0 animate-pulse">
                   <Truck className="h-3 w-3 text-white" />
                 </div>
                 <div className="w-[1px] h-full bg-transparent my-1" />
               </div>
               <div>
                 <p className="text-sm font-semibold text-blue-400">In Transit</p>
                 <p className="text-xs text-slate-400">Current Location: Vapi Highway</p>
                 <span className="text-[10px] text-slate-500 font-mono">Live</span>
               </div>
             </div>
          </TabsContent>
          
          <TabsContent value="chat" className="p-4 m-0 h-full flex flex-col">
             <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mb-3">
               <p className="text-xs text-indigo-400 font-bold mb-1">Copilot <span className="text-slate-500 font-normal">10:30 AM</span></p>
               <p className="text-sm text-slate-300">Driver is approaching HOS limits. Recommended swap at Surat Checkpoint.</p>
             </div>
             <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
               <p className="text-xs text-emerald-400 font-bold mb-1">You <span className="text-slate-500 font-normal">Just now</span></p>
               <p className="text-sm text-slate-300">Approved. Dispatching backup driver.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
