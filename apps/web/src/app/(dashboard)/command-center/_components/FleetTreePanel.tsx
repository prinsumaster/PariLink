'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, Truck, User, Building2, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';

export function FleetTreePanel() {
  const [search, setSearch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'vehicles': true,
    'drivers': true,
    'branches': true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Fetch the fleet tree from our new occ controller
  const { data, isLoading } = useQuery({
    queryKey: ['occ', 'fleet-tree'],
    queryFn: async () => {
      const res = await api.get('/intelligence/occ/fleet-tree');
      return res.data;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
      </div>
    );
  }

  const filterItems = (items: any[], field: string) => {
    if (!search) return items;
    return items.filter(item => (item[field] || '').toLowerCase().includes(search.toLowerCase()));
  };

  const vehicles = filterItems(data?.vehicles || [], 'registrationNumber');
  const drivers = filterItems(data?.drivers || [], 'lastName');
  const branches = filterItems(data?.branches || [], 'name');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fleet..." 
            className="pl-8 h-8 text-xs bg-slate-100 dark:bg-slate-900 border-none" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 text-sm select-none">
        
        {/* Vehicles Node */}
        <div className="mb-1">
          <div 
            onClick={() => toggleNode('vehicles')}
            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer text-slate-700 dark:text-slate-200 font-medium"
          >
            {expandedNodes['vehicles'] ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            <Truck className="h-4 w-4 text-indigo-500" />
            <span>Vehicles ({vehicles.length})</span>
          </div>
          {expandedNodes['vehicles'] && (
            <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5">
              {vehicles.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between px-2 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded cursor-pointer group">
                  <span className="text-slate-600 dark:text-slate-400 text-xs truncate">{v.registrationNumber}</span>
                  <span className={cn("h-1.5 w-1.5 rounded-full", v.status === 'IN_SERVICE' ? "bg-emerald-500" : "bg-rose-500")} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drivers Node */}
        <div className="mb-1">
          <div 
            onClick={() => toggleNode('drivers')}
            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer text-slate-700 dark:text-slate-200 font-medium"
          >
            {expandedNodes['drivers'] ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            <User className="h-4 w-4 text-indigo-500" />
            <span>Drivers ({drivers.length})</span>
          </div>
          {expandedNodes['drivers'] && (
            <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5">
              {drivers.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between px-2 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded cursor-pointer group">
                  <span className="text-slate-600 dark:text-slate-400 text-xs truncate">{d.firstName} {d.lastName}</span>
                  <span className={cn("h-1.5 w-1.5 rounded-full", d.status === 'AVAILABLE' ? "bg-emerald-500" : "bg-amber-500")} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Branches Node */}
        <div className="mb-1">
          <div 
            onClick={() => toggleNode('branches')}
            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer text-slate-700 dark:text-slate-200 font-medium"
          >
            {expandedNodes['branches'] ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            <Building2 className="h-4 w-4 text-indigo-500" />
            <span>Branches ({branches.length})</span>
          </div>
          {expandedNodes['branches'] && (
            <div className="pl-6 pr-2 py-1 flex flex-col gap-0.5">
              {branches.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between px-2 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded cursor-pointer group">
                  <span className="text-slate-600 dark:text-slate-400 text-xs truncate">{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
