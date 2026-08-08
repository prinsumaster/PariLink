'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Users,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Search,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  _count: { users: number };
}

interface PaginatedRoles {
  data: Role[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── All available permissions (grouped) ─────────────────────────────────────
const PERMISSION_GROUPS: Record<string, string[]> = {
  'Core Operations': [
    'loads:create', 'loads:read', 'loads:update', 'loads:delete',
    'trips:create', 'trips:read', 'trips:update', 'trips:delete',
    'dispatch:read', 'dispatch:write', 'dispatch:execute',
  ],
  'Fleet & Drivers': [
    'drivers:create', 'drivers:read', 'drivers:update', 'drivers:delete',
    'vehicles:create', 'vehicles:read', 'vehicles:update', 'vehicles:delete',
    'fleet:read', 'fleet:write',
  ],
  'CRM & Customers': [
    'customers:create', 'customers:read', 'customers:update', 'customers:delete',
    'vendors:create', 'vendors:read', 'vendors:update', 'vendors:delete',
  ],
  'Finance & Billing': [
    'billing:read', 'billing:write',
    'invoices:create', 'invoices:read', 'invoices:update',
    'payments:create', 'payments:read',
    'ledger:read',
  ],
  'Warehouse & Inventory': [
    'warehouse:read', 'warehouse:write',
    'inventory:read', 'inventory:write',
  ],
  'Reports & Analytics': [
    'reports:read', 'analytics:read', 'analytics:write',
    'data:export', 'data:import',
  ],
  'Admin & System': [
    'admin:manage', 'admin:rbac:read', 'admin:rbac:write',
    'admin:audit:read', 'admin:org:read', 'admin:org:write',
    'admin:system:read', 'admin:system:write',
    'roles:create', 'roles:read', 'roles:update', 'roles:delete',
    'users:create', 'users:read', 'users:update', 'users:delete',
  ],
  'AI & Intelligence': [
    'ai:read', 'ai:interact', 'ai:recommend', 'ai:metrics:read',
  ],
  'Documents & Compliance': [
    'documents:create', 'documents:read', 'documents:update', 'documents:delete',
  ],
};

const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat();

// ─── Role Service ─────────────────────────────────────────────────────────────
const rolesService = {
  list: (params?: Record<string, any>) =>
    api.get<PaginatedRoles>('/roles', { params }).then(r => r.data),
  create: (dto: { name: string; description?: string; permissions: string[] }) =>
    api.post<Role>('/roles', dto).then(r => r.data),
  update: (id: string, dto: { name?: string; description?: string; permissions?: string[] }) =>
    api.patch<Role>(`/roles/${id}`, dto).then(r => r.data),
  delete: (id: string) => api.delete(`/roles/${id}`),
};

// ─── Permission Badge ─────────────────────────────────────────────────────────
function PermBadge({ perm }: { perm: string }) {
  const isWildcard = perm === '*';
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border',
      isWildcard
        ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800'
        : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    )}>
      {isWildcard ? <Lock className="h-2.5 w-2.5" /> : null}
      {perm}
    </span>
  );
}

// ─── Create / Edit Role Dialog ────────────────────────────────────────────────
function RoleDialog({
  open,
  role,
  onClose,
}: {
  open: boolean;
  role?: Role | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState(role?.name ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [permissions, setPermissions] = useState<string[]>(role?.permissions ?? []);
  const [searchPerm, setSearchPerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'Core Operations': true });

  const createMutation = useMutation({
    mutationFn: (dto: { name: string; description?: string; permissions: string[] }) =>
      rolesService.create(dto),
    onSuccess: () => {
      toast.success('Role created');
      qc.invalidateQueries({ queryKey: ['roles'] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create role'),
  });

  const updateMutation = useMutation({
    mutationFn: (dto: { name?: string; description?: string; permissions?: string[] }) =>
      rolesService.update(role!.id, dto),
    onSuccess: () => {
      toast.success('Role updated');
      qc.invalidateQueries({ queryKey: ['roles'] });
      onClose();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update role'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const togglePerm = (perm: string) => {
    setPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const toggleWildcard = () => {
    if (permissions.includes('*')) {
      setPermissions([]);
    } else {
      setPermissions(['*']);
    }
  };

  const toggleGroup = (group: string) => {
    const groupPerms = PERMISSION_GROUPS[group];
    const allSelected = groupPerms.every(p => permissions.includes(p) || permissions.includes('*'));
    if (allSelected) {
      setPermissions(prev => prev.filter(p => !groupPerms.includes(p)));
    } else {
      setPermissions(prev => [...new Set([...prev, ...groupPerms])]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Role name is required'); return; }
    if (permissions.length === 0) { toast.error('At least one permission is required'); return; }
    const dto = { name: name.trim(), description: description.trim() || undefined, permissions };
    if (role) {
      updateMutation.mutate(dto);
    } else {
      createMutation.mutate(dto);
    }
  };

  if (!open) return null;

  const filteredGroups = Object.entries(PERMISSION_GROUPS).reduce((acc, [group, perms]) => {
    if (!searchPerm) { acc[group] = perms; return acc; }
    const filtered = perms.filter(p => p.includes(searchPerm.toLowerCase()));
    if (filtered.length) acc[group] = filtered;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{role ? 'Edit Role' : 'Create Role'}</h2>
              <p className="text-xs text-muted-foreground">Define access permissions for this role</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Role Name *</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Senior Dispatcher"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional role description"
                className="h-9"
              />
            </div>
          </div>

          {/* Wildcard toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">Superuser (All Permissions)</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Grants * wildcard — use sparingly</p>
              </div>
            </div>
            <button
              onClick={toggleWildcard}
              className={cn(
                'w-10 h-5 rounded-full transition-colors relative',
                permissions.includes('*') ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'
              )}
            >
              <span className={cn(
                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                permissions.includes('*') ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </button>
          </div>

          {!permissions.includes('*') && (
            <>
              {/* Permission count + search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Filter permissions…"
                    value={searchPerm}
                    onChange={e => setSearchPerm(e.target.value)}
                    className="h-8 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {permissions.length} selected
                </span>
              </div>

              {/* Permission groups */}
              <div className="space-y-2">
                {Object.entries(filteredGroups).map(([group, perms]) => {
                  const allGroupSelected = perms.every(p => permissions.includes(p));
                  const someGroupSelected = perms.some(p => permissions.includes(p));
                  const expanded = expandedGroups[group] ?? false;
                  return (
                    <div key={group} className="rounded-lg border border-border overflow-hidden">
                      <button
                        onClick={() => setExpandedGroups(prev => ({ ...prev, [group]: !expanded }))}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            onClick={e => { e.stopPropagation(); toggleGroup(group); }}
                            className={cn(
                              'h-4 w-4 rounded border-2 flex items-center justify-center transition-colors',
                              allGroupSelected ? 'bg-primary border-primary' : someGroupSelected ? 'bg-primary/30 border-primary/50' : 'border-muted-foreground/40'
                            )}
                          >
                            {allGroupSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                          </div>
                          <span className="text-sm font-semibold text-foreground">{group}</span>
                          <span className="text-xs text-muted-foreground">({perms.filter(p => permissions.includes(p)).length}/{perms.length})</span>
                        </div>
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      {expanded && (
                        <div className="px-4 py-3 grid grid-cols-2 gap-1.5">
                          {perms.map(perm => (
                            <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                              <div
                                onClick={() => togglePerm(perm)}
                                className={cn(
                                  'h-3.5 w-3.5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                                  permissions.includes(perm) ? 'bg-primary border-primary' : 'border-muted-foreground/40 group-hover:border-primary/60'
                                )}
                              >
                                {permissions.includes(perm) && <Check className="h-2 w-2 text-primary-foreground" />}
                              </div>
                              <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors">{perm}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="h-9">Cancel</Button>
          <Button onClick={handleSave} disabled={isPending} className="h-9 gap-2">
            {isPending ? (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            {role ? 'Save Changes' : 'Create Role'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({ role, onEdit, onDelete }: { role: Role; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasWildcard = role.permissions.includes('*');
  const displayPerms = expanded ? role.permissions : role.permissions.slice(0, 6);

  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0',
            hasWildcard ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-primary/10'
          )}>
            {hasWildcard ? (
              <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            ) : (
              <Shield className="h-4 w-4 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{role.name}</h3>
              {hasWildcard && (
                <Badge className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-0">
                  SUPERUSER
                </Badge>
              )}
            </div>
            {role.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {role._count.users} users
              </span>
              <span>{role.permissions.length === 1 && role.permissions[0] === '*' ? 'All permissions' : `${role.permissions.length} permissions`}</span>
              <span>Created {format(new Date(role.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {!hasWildcard && role.permissions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex flex-wrap gap-1.5">
            {displayPerms.map(p => <PermBadge key={p} perm={p} />)}
            {role.permissions.length > 6 && (
              <button
                onClick={() => setExpanded(v => !v)}
                className="text-[10px] font-medium text-primary hover:underline px-2 py-0.5"
              >
                {expanded ? 'Show less' : `+${role.permissions.length - 6} more`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RolesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['roles', search],
    queryFn: () => rolesService.list({ limit: 100, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: rolesService.delete,
    onSuccess: () => { toast.success('Role deleted'); qc.invalidateQueries({ queryKey: ['roles'] }); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to delete role'),
  });

  const openCreate = () => { setEditRole(null); setDialogOpen(true); };
  const openEdit = (role: Role) => { setEditRole(role); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditRole(null); };

  const handleDelete = useCallback((role: Role) => {
    if (role._count.users > 0) {
      toast.error(`Cannot delete "${role.name}" — ${role._count.users} user(s) are assigned to this role`);
      return;
    }
    if (!confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(role.id);
  }, [deleteMutation]);

  const roles = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN']}>
      <RoleDialog open={dialogOpen} role={editRole} onClose={closeDialog} />

      <div className="flex flex-col h-full page-enter">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Roles & Permissions</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {total} roles · Define who can access what in PariLink
              </p>
            </div>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </div>
          {/* Search */}
          <div className="mt-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-xl border border-border bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {search ? `No roles matching "${search}"` : 'No roles yet'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? 'Try a different search term' : 'Create your first role to control user access'}
              </p>
              {!search && (
                <Button onClick={openCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Role
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {roles.map(role => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => openEdit(role)}
                  onDelete={() => handleDelete(role)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
