"use client";

import React, { useState, useEffect } from 'react';
import { Search, User, Truck, FileText, ChevronRight, Package, Link } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { api } from '@/services/api';

interface UniversalSearchProps {
  onSelectTrip: (tripId: string) => void;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({ onSelectTrip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string, id: string, title: string, subtitle: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        // Expected format from globalSearch depends on API, mapping safely
        const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
        setResults(data);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[10vh]">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center border-b border-slate-700 p-4 bg-slate-950">
          <Search className="h-5 w-5 text-indigo-400 mr-3 shrink-0" />
          <Input 
            autoFocus
            placeholder="Search PariLink (Trips, Loads, Vehicles, Invoices)..."
            className="flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 text-xl text-white placeholder:text-slate-600 p-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="p-3 overflow-y-auto max-h-[60vh] custom-scrollbar flex gap-4">
          <div className="flex-1">
             <h4 className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">Quick Actions</h4>
             <div className="space-y-0.5">
                <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg focus:outline-none focus:bg-slate-800">
                  <span className="flex items-center"><Truck className="h-4 w-4 mr-3 text-blue-400" /> Create New Trip</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">T</span>
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg focus:outline-none focus:bg-slate-800">
                  <span className="flex items-center"><User className="h-4 w-4 mr-3 text-emerald-400" /> Assign Driver</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">D</span>
                </button>
             </div>
          </div>

          <div className="w-[1px] bg-slate-800" />

          <div className="flex-1">
             {query.length > 0 ? (
               <>
                 <h4 className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">
                   {isLoading ? 'Searching...' : 'Results'}
                 </h4>
                 <div className="space-y-0.5">
                   {results.map((r, i) => (
                     <button 
                       key={i}
                       onClick={() => { 
                         if (r.type === 'TRIP') onSelectTrip(r.id); 
                         setIsOpen(false); 
                       }}
                       className="w-full flex items-center px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg group"
                     >
                       {r.type === 'TRIP' ? <Truck className="h-4 w-4 mr-3 text-indigo-400" /> : 
                        r.type === 'LOAD' ? <Package className="h-4 w-4 mr-3 text-emerald-400" /> : 
                        <Search className="h-4 w-4 mr-3 text-slate-500 group-hover:text-white" />}
                       <div className="flex flex-col items-start">
                         <span className="font-semibold text-white">{r.title || r.id}</span>
                         <span className="text-xs text-slate-500">{r.subtitle || r.type}</span>
                       </div>
                     </button>
                   ))}
                   {results.length === 0 && !isLoading && (
                     <div className="px-3 py-2 text-sm text-slate-500">No results found for "{query}"</div>
                   )}
                 </div>
               </>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-8">
                  <Search className="h-8 w-8 opacity-20" />
                  <span className="text-sm">Type to search the entire OS</span>
                </div>
             )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
    </div>
  );
};
