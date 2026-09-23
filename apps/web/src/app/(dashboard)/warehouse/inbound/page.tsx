'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Search, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InboundReceiptsPage() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="flex flex-col h-full page-enter">
      <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Inbound Receipts</h1>
            <p className="text-sm text-muted-foreground mt-1">Receive stock and manage ASNs</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" className="gap-1.5" disabled>
              <Plus className="h-4 w-4" />
              New ASN
            </Button>
          </div>
        </div>

        <div className="mt-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search ASN or load ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow',
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-4">
        
        {/* Mock Data Item */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-500/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Download className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">ASN-1234</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 tracking-wider">
                  EXPECTED
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> Today, 2:00 PM</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>100 Items</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" disabled>
            Receive Goods
          </Button>
        </div>

        {/* Received Mock Data Item */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card opacity-75">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">ASN-0998</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 tracking-wider">
                  RECEIVED
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>Received to: RCV-01</span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" disabled>
            View
          </Button>
        </div>

      </div>
    </div>
  );
}
