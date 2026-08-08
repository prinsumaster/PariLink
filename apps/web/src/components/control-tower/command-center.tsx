'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useControlTowerStore } from '../../store/control-tower.store';
import { Search, User, Truck, AlertCircle, FileText, Send } from 'lucide-react';

interface CommandCenterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ open, setOpen }) => {
  const { socket } = useControlTowerStore();
  const [loading, setLoading] = useState(false);

  // Close on escape is handled by CmdK natively, but we ensure state sync
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  const dispatchAction = (action: string) => {
    if (!socket) return;
    setLoading(true);
    socket.emit('dispatch_action', { action, vehicleId: 'GJ01AB1234', timestamp: new Date() }, (response: any) => {
      console.log('Action acknowledged', response);
      setLoading(false);
      setOpen(false);
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden flex flex-col">
        <Command label="Command Menu" className="command-palette" shouldFilter={true}>
          <div className="flex items-center border-b border-slate-700/50 px-3 py-2 bg-slate-800/50">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <Command.Input 
              placeholder="What do you need to do?" 
              className="w-full bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 py-2 text-lg"
              autoFocus
            />
          </div>
          
          <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 mb-1">Dispatch Actions</div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
            <Command.Empty className="p-4 text-center text-slate-500">No results found.</Command.Empty>
            
            <Command.Group>
              <Command.Item onSelect={() => dispatchAction('ASSIGN_VEHICLE')} className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors text-slate-300 hover:bg-slate-800 data-[selected=true]:bg-indigo-500/20 data-[selected=true]:text-indigo-200">
                <Truck className="w-4 h-4 mr-2" /> Assign Vehicle to Trip
              </Command.Item>
              <Command.Item onSelect={() => dispatchAction('ASSIGN_DRIVER')} className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors text-slate-300 hover:bg-slate-800 data-[selected=true]:bg-indigo-500/20 data-[selected=true]:text-indigo-200">
                <User className="w-4 h-4 mr-2" /> Assign Driver
              </Command.Item>
              <Command.Item onSelect={() => dispatchAction('CANCEL_TRIP')} className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors text-red-400 hover:bg-red-500/10 data-[selected=true]:bg-red-500/20 data-[selected=true]:text-red-300">
                <AlertCircle className="w-4 h-4 mr-2" /> Cancel Trip
              </Command.Item>
            </Command.Group>
            
            <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2 mb-1">Operations</div>
            <Command.Group>
              <Command.Item onSelect={() => dispatchAction('GENERATE_INVOICE')} className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors text-slate-300 hover:bg-slate-800 data-[selected=true]:bg-indigo-500/20 data-[selected=true]:text-indigo-200">
                <FileText className="w-4 h-4 mr-2" /> Generate Invoice
              </Command.Item>
              <Command.Item onSelect={() => dispatchAction('SEND_MESSAGE')} className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors text-slate-300 hover:bg-slate-800 data-[selected=true]:bg-indigo-500/20 data-[selected=true]:text-indigo-200">
                <Send className="w-4 h-4 mr-2" /> Message Driver
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
