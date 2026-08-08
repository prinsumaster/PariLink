'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Truck,
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Weight,
  Calendar,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Trailer {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  capacityWeight?: number;
  capacityVolume?: number;
  status: string;
}

const trailerService = {
  list: (params?: Record<string, any>) =>
    api.get<{ data: Trailer[]; meta: { total: number } }>('/trailers', { params }).then(r => r.data),
  delete: (id: string) => api.delete(`/trailers/${id}`),
};

export default function TrailersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['trailers', search],
    queryFn: () => trailerService.list({ limit: 100, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: trailerService.delete,
    onSuccess: () => { toast.success('Trailer removed'); qc.invalidateQueries({ queryKey: ['trailers'] }); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to remove trailer'),
  });

  const trailers = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div className="flex flex-col h-full page-enter">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Trailers</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {total} trailers · Manage your trailer fleet assets
            </p>
          </div>
          <Link href="/trailers/new" className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Trailer
          </Link>
        </div>

        <div className="mt-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search trailers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-border bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : trailers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No trailers registered</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first trailer to start tracking fleet assets
            </p>
            <Link href="/trailers/new" className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Trailer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trailers.map(trailer => (
              <div
                key={trailer.id}
                className="group rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {[trailer.make, trailer.model].filter(Boolean).join(' ') || 'Unknown Trailer'}
                      </h3>
                      {trailer.licensePlate && (
                        <span className="text-xs font-mono text-muted-foreground">{trailer.licensePlate}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={trailer.status ?? 'AVAILABLE'} />
                    <DropdownMenu>
                    <DropdownMenuTrigger className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => window.location.href = `/trailers/${trailer.id}`}>
                          <Edit2 className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => {
                            if (!confirm('Remove this trailer?')) return;
                            deleteMutation.mutate(trailer.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  {trailer.year && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>Year: {trailer.year}</span>
                    </div>
                  )}
                  {trailer.capacityWeight && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Weight className="h-3 w-3 flex-shrink-0" />
                      <span>Capacity: {trailer.capacityWeight.toLocaleString()} kg</span>
                    </div>
                  )}
                  {trailer.vin && (
                    <div className="text-xs font-mono text-muted-foreground truncate">
                      VIN: {trailer.vin}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
