'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Edit2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Branch {
  id: string;
  name: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  status: string;
  createdAt: string;
}

const branchService = {
  list: (params?: Record<string, any>) =>
    api.get<{ data: Branch[]; meta: { total: number } }>('/branches', { params }).then(r => r.data),
  delete: (id: string) => api.delete(`/branches/${id}`),
};

export default function BranchesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['branches', search],
    queryFn: () => branchService.list({ limit: 100, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: branchService.delete,
    onSuccess: () => { toast.success('Branch deleted'); qc.invalidateQueries({ queryKey: ['branches'] }); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete branch'),
  });

  const branches = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN']}>
      <div className="flex flex-col h-full page-enter">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Branches</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {total} branch locations · Manage your company's operational sites
              </p>
            </div>
            <Link href="/branches/new" className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shrink-0">
              <Plus className="h-4 w-4" />
              Add Branch
            </Link>
          </div>

          {/* Search */}
          <div className="mt-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search branches…"
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
                <div key={i} className="h-40 rounded-xl border border-border bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No branches yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first branch location to manage operations across sites
              </p>
              <Link href="/branches/new" className="inline-flex items-center gap-2 h-8 px-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Branch
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map(branch => (
                <div
                  key={branch.id}
                  className="group rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{branch.name}</h3>
                        {branch.code && (
                          <span className="text-xs font-mono text-muted-foreground">{branch.code}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={branch.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => window.location.href = `/branches/${branch.id}`}>
                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                            Edit Branch
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400 focus:text-red-600"
                            onClick={() => {
                              if (!confirm(`Delete branch "${branch.name}"?`)) return;
                              deleteMutation.mutate(branch.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Branch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {(branch.city || branch.state) && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>{[branch.address, branch.city, branch.state, branch.country].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                    {branch.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{branch.phone}</span>
                      </div>
                    )}
                    {branch.email && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span>{branch.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
