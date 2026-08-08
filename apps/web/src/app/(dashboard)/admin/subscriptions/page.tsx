'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { RoleGuard } from '@/components/auth/role-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Truck,
  Users,
  MoreVertical,
  Shield,
  Zap,
  Infinity,
  TrendingUp,
  Building2,
  AlertTriangle,
  CheckCircle,
  Crown,
  RefreshCw,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TenantLicense {
  id: string;
  name: string;
  status: string;
  plan: string;
  planCode: string;
  maxVehicles: number;
  vehicleCount: number;
  maxDrivers: number;
  driverCount: number;
  unlimitedMode: boolean;
  boostExpiresAt: string | null;
  createdAt: string;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={cn('p-3 rounded-xl', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

// ─── Usage Bar ───────────────────────────────────────────────────────────────

function UsageBar({ used, limit, unlimited }: { used: number; limit: number; unlimited: boolean }) {
  if (unlimited) {
    return (
      <div className="flex items-center gap-2">
        <Infinity className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{used} / ∞</span>
      </div>
    );
  }
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-600 dark:text-slate-300">{used} / {limit}</span>
        <span className={pct >= 90 ? 'text-red-500' : pct >= 70 ? 'text-amber-500' : 'text-emerald-600'}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Plan Badge ──────────────────────────────────────────────────────────────

function PlanBadge({ planCode }: { planCode: string }) {
  const config: Record<string, { label: string; color: string }> = {
    STARTER:         { label: 'Starter',         color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
    GROWTH:          { label: 'Growth',          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    PROFESSIONAL:    { label: 'Professional',    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
    BUSINESS:        { label: 'Business',        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    ENTERPRISE:      { label: 'Enterprise',      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    ENTERPRISE_PLUS: { label: 'Enterprise Plus', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
    CUSTOM:          { label: 'Custom',          color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    NONE:            { label: 'No Plan',         color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  };
  const c = config[planCode] || config['NONE'];
  return <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', c.color)}>{c.label}</span>;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SubscriptionCenterPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<TenantLicense | null>(null);
  const [modal, setModal] = useState<'truck' | 'boost' | 'unlimited' | null>(null);
  const [truckLimit, setTruckLimit] = useState('');
  const [boostLimit, setBoostLimit] = useState('');
  const [boostExpiry, setBoostExpiry] = useState('');
  const [unlimitedMode, setUnlimitedMode] = useState(false);

  const { data: tenants = [], isLoading, refetch } = useQuery<TenantLicense[]>({
    queryKey: ['admin-tenants-license'],
    queryFn: () => api.get('/admin/licenses/tenants').then(r => r.data),
  });

  const setTruckMutation = useMutation({
    mutationFn: ({ companyId, maxVehicles }: { companyId: string; maxVehicles: number }) =>
      api.put(`/admin/licenses/trucks/limit`, { maxVehicles, reason: 'Admin manual override' }).then(r => r.data),
    onSuccess: () => {
      toast.success('Truck limit updated successfully');
      qc.invalidateQueries({ queryKey: ['admin-tenants-license'] });
      setModal(null);
    },
    onError: () => toast.error('Failed to update truck limit'),
  });

  const setBoostMutation = useMutation({
    mutationFn: ({ boostMaxVehicles, boostExpiresAt }: { boostMaxVehicles: number; boostExpiresAt: string }) =>
      api.put(`/admin/licenses/trucks/boost`, { boostMaxVehicles, boostExpiresAt, reason: 'Admin boost' }).then(r => r.data),
    onSuccess: () => {
      toast.success('Capacity boost activated');
      qc.invalidateQueries({ queryKey: ['admin-tenants-license'] });
      setModal(null);
    },
    onError: () => toast.error('Failed to set boost'),
  });

  const setUnlimitedMutation = useMutation({
    mutationFn: ({ unlimited }: { unlimited: boolean }) =>
      api.put(`/admin/licenses/unlimited`, { unlimited, reason: 'Admin override' }).then(r => r.data),
    onSuccess: (_, vars) => {
      toast.success(`Unlimited mode ${vars.unlimited ? 'enabled' : 'disabled'}`);
      qc.invalidateQueries({ queryKey: ['admin-tenants-license'] });
      setModal(null);
    },
    onError: () => toast.error('Failed to update unlimited mode'),
  });

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.planCode.toLowerCase().includes(search.toLowerCase()),
  );

  const totalVehicles = tenants.reduce((s, t) => s + t.vehicleCount, 0);
  const totalDrivers  = tenants.reduce((s, t) => s + t.driverCount, 0);
  const atCapacity    = tenants.filter(t => !t.unlimitedMode && t.vehicleCount >= t.maxVehicles).length;
  const unlimited     = tenants.filter(t => t.unlimitedMode).length;

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Subscription Center</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 ml-12">
              Manage customer licenses, truck capacities, and subscription plans
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Customers" value={tenants.length} icon={Building2}    color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <StatCard label="Total Vehicles"  value={totalVehicles}  icon={Truck}         color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" />
          <StatCard label="At Capacity"     value={atCapacity}     icon={AlertTriangle} color="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
          <StatCard label="Unlimited Mode"  value={unlimited}      icon={Infinity}      color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers by name or plan..."
            className="pl-10 bg-white dark:bg-slate-900 h-11"
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Plan</TableHead>
                <TableHead className="font-semibold">Trucks</TableHead>
                <TableHead className="font-semibold">Drivers</TableHead>
                <TableHead className="font-semibold">Mode</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(tenant => (
                  <TableRow key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{tenant.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{tenant.id.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={tenant.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : ''}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PlanBadge planCode={tenant.planCode} />
                    </TableCell>
                    <TableCell>
                      <UsageBar used={tenant.vehicleCount} limit={tenant.maxVehicles} unlimited={tenant.unlimitedMode} />
                    </TableCell>
                    <TableCell>
                      <UsageBar used={tenant.driverCount} limit={tenant.maxDrivers} unlimited={tenant.unlimitedMode} />
                    </TableCell>
                    <TableCell>
                      {tenant.unlimitedMode ? (
                        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                          <Infinity className="w-3.5 h-3.5" /> Unlimited
                        </span>
                      ) : tenant.boostExpiresAt ? (
                        <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                          <Zap className="w-3.5 h-3.5" /> Boosted
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 text-xs">
                          <Shield className="w-3.5 h-3.5" /> Standard
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel>License Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedTenant(tenant); setTruckLimit(String(tenant.maxVehicles)); setModal('truck'); }}>
                            <Truck className="w-4 h-4 mr-2" /> Set Truck Limit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedTenant(tenant); setBoostLimit(''); setBoostExpiry(''); setModal('boost'); }}>
                            <Zap className="w-4 h-4 mr-2 text-amber-500" /> Temporary Boost
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => { setSelectedTenant(tenant); setUnlimitedMode(!tenant.unlimitedMode); setModal('unlimited'); }}
                            className={tenant.unlimitedMode ? 'text-red-600' : 'text-purple-600'}>
                            <Infinity className="w-4 h-4 mr-2" />
                            {tenant.unlimitedMode ? 'Disable Unlimited' : 'Enable Unlimited'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Set Truck Limit Dialog */}
        <Dialog open={modal === 'truck'} onOpenChange={(o) => !o && setModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" /> Set Truck Limit
              </DialogTitle>
              <DialogDescription>
                Override the truck/vehicle capacity for <strong>{selectedTenant?.name}</strong>.
                This takes effect immediately without changing their subscription plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Current limit</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTenant?.maxVehicles} trucks</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="truck-limit">New Maximum Trucks</Label>
                <Input
                  id="truck-limit"
                  type="number"
                  min={1}
                  value={truckLimit}
                  onChange={e => setTruckLimit(e.target.value)}
                  placeholder="e.g. 37"
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button
                onClick={() => selectedTenant && setTruckMutation.mutate({ companyId: selectedTenant.id, maxVehicles: parseInt(truckLimit) })}
                disabled={!truckLimit || parseInt(truckLimit) < 1 || setTruckMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {setTruckMutation.isPending ? 'Saving...' : 'Apply Override'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Capacity Boost Dialog */}
        <Dialog open={modal === 'boost'} onOpenChange={(o) => !o && setModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Temporary Capacity Boost
              </DialogTitle>
              <DialogDescription>
                Set a temporary truck capacity for <strong>{selectedTenant?.name}</strong> that automatically expires.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="boost-limit">Boosted Truck Limit</Label>
                <Input id="boost-limit" type="number" min={1} value={boostLimit} onChange={e => setBoostLimit(e.target.value)} placeholder="e.g. 150" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="boost-expiry">Boost Expires On</Label>
                <Input id="boost-expiry" type="datetime-local" value={boostExpiry} onChange={e => setBoostExpiry(e.target.value)} className="h-11" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button
                onClick={() => selectedTenant && setBoostMutation.mutate({ boostMaxVehicles: parseInt(boostLimit), boostExpiresAt: new Date(boostExpiry).toISOString() })}
                disabled={!boostLimit || !boostExpiry || setBoostMutation.isPending}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                {setBoostMutation.isPending ? 'Activating...' : 'Activate Boost'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unlimited Mode Dialog */}
        <Dialog open={modal === 'unlimited'} onOpenChange={(o) => !o && setModal(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Infinity className="w-5 h-5 text-purple-500" />
                {unlimitedMode ? 'Enable' : 'Disable'} Unlimited Mode
              </DialogTitle>
              <DialogDescription>
                {unlimitedMode
                  ? `This will remove all truck/driver capacity checks for ${selectedTenant?.name}. Use for Custom plan customers.`
                  : `This will restore capacity enforcement for ${selectedTenant?.name}.`}
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <div className={cn('rounded-xl p-4 border', unlimitedMode
                ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800')}>
                <p className={cn('text-sm font-medium', unlimitedMode ? 'text-purple-700 dark:text-purple-300' : 'text-red-700 dark:text-red-300')}>
                  {unlimitedMode
                    ? '✓ All capacity limits will be bypassed. Customer can add unlimited trucks and drivers.'
                    : '⚠ Capacity enforcement will be re-enabled. Customer will be subject to their plan limits.'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
              <Button
                onClick={() => setUnlimitedMutation.mutate({ unlimited: unlimitedMode })}
                disabled={setUnlimitedMutation.isPending}
                className={unlimitedMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
              >
                {setUnlimitedMutation.isPending ? 'Applying...' : `Confirm ${unlimitedMode ? 'Enable' : 'Disable'}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </RoleGuard>
  );
}
