"use client";
import React, { useState, useEffect } from 'react';
import { Search, User, Truck, FileText, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const SearchCommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-slate-700 p-4">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <Input 
            autoFocus
            placeholder="Search across Trips, Vehicles, Drivers, Invoices... (Esc to close)"
            className="flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 text-lg text-white placeholder:text-slate-500 p-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="p-2 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">Quick Actions</h4>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg">
                <span className="flex items-center"><Truck className="h-4 w-4 mr-2 text-blue-400" /> Assign Vehicle to Trip</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg">
                <span className="flex items-center"><User className="h-4 w-4 mr-2 text-emerald-400" /> Create Driver Schedule</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>
          
          {query.length > 2 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">Search Results</h4>
              <div className="space-y-1">
                <button className="w-full flex items-center px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg">
                  <Truck className="h-4 w-4 mr-2 text-slate-400" /> 
                  <span className="font-mono text-xs mr-2 text-blue-400">TRP-992</span>
                  <span>Delhi to Mumbai (In Progress)</span>
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg">
                  <FileText className="h-4 w-4 mr-2 text-slate-400" /> 
                  <span className="font-mono text-xs mr-2 text-emerald-400">INV-812</span>
                  <span>Reliance Industries Ltd - ₹45,000</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
    </div>
  );
};
