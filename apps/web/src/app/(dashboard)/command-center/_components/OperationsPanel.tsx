"use client";
import React from 'react';
import { Play, Pause, XCircle, FileText, UserPlus, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OperationsPanelProps {
  selectedTrip: string | null;
}

export const OperationsPanel: React.FC<OperationsPanelProps> = ({ selectedTrip }) => {
  if (!selectedTrip) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm mt-10">
        <Truck className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>Select a trip or alert from the map to view quick actions.</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 border-t border-slate-800">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
        Quick Actions: {selectedTrip}
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-blue-600/20 justify-start">
          <UserPlus className="mr-2 h-4 w-4 text-blue-400" /> Assign Driver
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-emerald-600/20 justify-start">
          <Truck className="mr-2 h-4 w-4 text-emerald-400" /> Assign Vehicle
        </Button>
        
        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-amber-600/20 justify-start">
          <Pause className="mr-2 h-4 w-4 text-amber-400" /> Pause Trip
        </Button>
        <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-rose-600/20 justify-start">
          <XCircle className="mr-2 h-4 w-4 text-rose-400" /> Cancel Trip
        </Button>
        
        <Button variant="outline" size="sm" className="col-span-2 bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 justify-start">
          <FileText className="mr-2 h-4 w-4" /> View Documents
        </Button>
      </div>
    </div>
  );
};
