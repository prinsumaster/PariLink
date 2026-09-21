'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Building2, Package, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSWR from 'swr';
import { api } from '@/services/api';
import Link from 'next/link';

export default function WarehouseMasterPage() {
  const [search, setSearch] = useState('');
  
  // Basic layout for now. Will be populated by backend in future updates.
  const { data, isLoading } = useSWR('/warehouse', (url) => api.get(url).then(r => r.data));

  return (
    <div className="flex flex-col h-full page-enter">
      <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Warehouse Master</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage topology, zones, and bins</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" className="gap-1.5" disabled>
              <Plus className="h-4 w-4" />
              New Warehouse
            </Button>
          </div>
        </div>

        <div className="mt-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search warehouses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow',
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl border border-border bg-card">
            <Building2 className="h-8 w-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-lg">Central Hub</h3>
            <p className="text-sm text-muted-foreground">New York, NY</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 bg-muted rounded text-xs font-medium">3 Zones</span>
              <span className="px-2 py-1 bg-muted rounded text-xs font-medium">120 Bins</span>
            </div>
          </div>
          
          {/* Add empty state if needed */}
        </div>
      </div>
    </div>
  );
}
