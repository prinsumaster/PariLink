'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Shield, Settings, ToggleLeft, ToggleRight, 
  ClipboardList, Activity, Loader2, Building2, 
  Key, Bell, Palette, ChevronRight, Search,
  CheckCircle2, XCircle, User, ArrowUpRight,
  Server, Database, Cpu, HardDrive, DollarSign, Target, TrendingUp, Truck
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/auth';

type Tab = 'overview' | 'users' | 'customers' | 'success' | 'roles' | 'feature-flags' | 'audit-logs' | 'marketplace' | 'observability';

interface UserRecord { id: string; firstName: string; lastName: string; email: string; status: string; createdAt: string; role?: { name: string }; }
interface RoleRecord { id: string; name: string; description: string; permissions: string[]; _count: { users: number }; }
interface FeatureFlag { id: string; key: string; description?: string; enabled: boolean; }
interface AuditRecord { id: string; entity: string; entityId: string; action: string; createdAt: string; user?: { firstName: string; lastName: string; email: string }; details?: any; }
interface HealthData { status: string; uptime: number; database: { status: string; latencyMs: number }; memory: { heapUsedMb: number; heapTotalMb: number }; }

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'customers', label: 'Customers', icon: Building2 },
  { id: 'success', label: 'Customer Success', icon: TrendingUp },
  { id: 'users', label: 'Internal Users', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'feature-flags', label: 'Feature Flags', icon: ToggleLeft },
  { id: 'audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { id: 'marketplace', label: 'App Marketplace', icon: Settings },
  { id: 'observability', label: 'Production Health', icon: Server },
];

export default function AdminCenterPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const currentUser = useAuthStore(s => s.user);

  const fetchUsers = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/users'); setUsers(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/roles'); setRoles(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchFlags = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/feature-flags'); setFlags(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try { const r = await api.get('/admin/audit-logs'); setAuditLogs(r.data.data || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/health');
      setHealth(r.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    switch (tab) {
      case 'users': fetchUsers(); break;
      case 'roles': fetchRoles(); break;
      case 'feature-flags': fetchFlags(); break;
      case 'audit-logs': fetchAuditLogs(); break;
      case 'observability': fetchHealth(); break;
    }
  }, [tab]);

  const toggleFlag = async (flag: FeatureFlag) => {
    setActionLoading(flag.id);
    try {
      await api.put(`/admin/feature-flags/${flag.key}`, { enabled: !flag.enabled });
      setFlags(prev => prev.map(f => f.id === flag.id ? { ...f, enabled: !f.enabled } : f));
    } catch (e) { console.error(e); } finally { setActionLoading(null); }
  };

  const filteredUsers = users.filter(u =>
    !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 min-h-[calc(100vh-5rem)]">
      {/* Sidebar Nav */}
      <div className="w-56 flex-shrink-0">
        <div className="sticky top-0 space-y-1">
          <div className="px-3 py-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white dark:text-slate-900" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Admin Console</p>
                <p className="text-[10px] text-slate-400">LogOS v27.0</p>
              </div>
            </div>
          </div>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                tab === id
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Admin Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: users.length || '—', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
                { label: 'Active Fleets', value: '42', icon: Truck, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                { label: 'MRR', value: '₹12.4M', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { label: 'ARR Run Rate', value: '₹148.8M', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label} className="p-5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                  <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{label}</div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TABS.slice(1).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <Icon className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customers & Provisioning */}
        {tab === 'customers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Customer Directory</h2>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white"><Building2 className="mr-2 h-4 w-4" /> Provision New Company</Button>
            </div>
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>{['Company', 'License Tier', 'Health Score', 'Usage', 'Action'].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">ABC Logistics</td>
                    <td className="px-4 py-3"><Badge>STARTER</Badge></td>
                    <td className="px-4 py-3"><Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Healthy (95/100)</Badge></td>
                    <td className="px-4 py-3 text-slate-500">20 Trucks / 400 Trips</td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm">Manage</Button></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">XYZ Freight</td>
                    <td className="px-4 py-3"><Badge variant="outline">GROWTH</Badge></td>
                    <td className="px-4 py-3"><Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Warning (60/100)</Badge></td>
                    <td className="px-4 py-3 text-slate-500">50 Trucks / 100 Trips</td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm">Manage</Button></td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* Customer Success */}
        {tab === 'success' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Customer Success & Revenue</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 border-emerald-200 bg-emerald-50"><div className="text-sm text-emerald-700 mb-1">MRR</div><div className="text-2xl font-bold text-emerald-900">₹12.4M</div></Card>
              <Card className="p-5 border-emerald-200 bg-emerald-50"><div className="text-sm text-emerald-700 mb-1">ARR Run Rate</div><div className="text-2xl font-bold text-emerald-900">₹148.8M</div></Card>
              <Card className="p-5"><div className="text-sm text-slate-500 mb-1">Active Trials</div><div className="text-2xl font-bold">14</div></Card>
              <Card className="p-5 border-amber-200 bg-amber-50"><div className="text-sm text-amber-700 mb-1">Churn Risk</div><div className="text-2xl font-bold text-amber-900">2 Accounts</div></Card>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">User Management</h2>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"><User className="h-3.5 w-3.5 mr-1.5" />Invite User</Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full max-w-sm pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div> : (
              <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>{['Name', 'Email', 'Role', 'Status', 'Joined', ''].map(h => <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                                {user.firstName[0]}{user.lastName[0]}
                              </div>
                              <span className="font-medium text-slate-900 dark:text-slate-100">{user.firstName} {user.lastName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{user.email}</td>
                          <td className="px-4 py-3">
                            <Badge className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-0">{user.role?.name || 'No Role'}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {user.status === 'ACTIVE' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                              <span className={user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}>{user.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Roles */}
        {tab === 'roles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Roles & Permissions</h2>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"><Shield className="h-3.5 w-3.5 mr-1.5" />Create Role</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div> : (
              <div className="grid gap-4">
                {roles.map(role => (
                  <Card key={role.id} className="p-5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{role.name}</h3>
                          <Badge className="text-[10px] border-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{role._count.users} users</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">{role.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(role.permissions || []).slice(0, 8).map(p => (
                            <code key={p} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded px-1.5 py-0.5 font-mono">{p}</code>
                          ))}
                          {role.permissions?.length > 8 && <span className="text-[10px] text-slate-400">+{role.permissions.length - 8} more</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 flex-shrink-0"><Settings className="h-3 w-3" />Edit</Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feature Flags */}
        {tab === 'feature-flags' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Feature Flags</h2>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"><Key className="h-3.5 w-3.5 mr-1.5" />Add Flag</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div> : (
              flags.length === 0 ? (
                <div className="text-center py-16">
                  <ToggleLeft className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">No feature flags configured</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {flags.map(flag => (
                    <Card key={flag.id} className="p-4 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <code className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">{flag.key}</code>
                        {flag.description && <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>}
                      </div>
                      <button
                        onClick={() => toggleFlag(flag)}
                        disabled={actionLoading === flag.id}
                        className="flex-shrink-0"
                      >
                        {actionLoading === flag.id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        ) : flag.enabled ? (
                          <ToggleRight className="h-8 w-8 text-emerald-500 hover:text-emerald-600 transition-colors" />
                        ) : (
                          <ToggleLeft className="h-8 w-8 text-slate-400 hover:text-slate-600 transition-colors" />
                        )}
                      </button>
                    </Card>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* Audit Logs */}
        {tab === 'audit-logs' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Audit Log</h2>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div> : (
              <Card className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                      <tr>{['User', 'Action', 'Entity', 'Time', ''].map(h => <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</td>
                          <td className="px-4 py-3">
                            <Badge className={`text-[10px] border-0 ${log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' : log.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{log.action}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-500">{log.entity}</span>
                            <code className="text-[10px] text-slate-400 ml-2 font-mono">{log.entityId.slice(0, 8)}…</code>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">{format(new Date(log.createdAt), 'MMM d, h:mm a')}</td>
                          <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">Details <ArrowUpRight className="h-2.5 w-2.5" /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {auditLogs.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No audit events found</p>}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* System Health */}
        {tab === 'observability' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">System Health</h2>
              <Button variant="outline" size="sm" onClick={fetchHealth} className="h-8 text-xs gap-1.5"><Activity className="h-3.5 w-3.5" />Refresh</Button>
            </div>
            {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div> : !health ? (
              <div className="text-center py-12">
                <Server className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Health data unavailable</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'API Status', value: health.status || 'OK', icon: Server, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  { label: 'DB Latency', value: `${health.database?.latencyMs || 0}ms`, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Heap Memory', value: `${Math.round(health.memory?.heapUsedMb || 0)} MB`, icon: HardDrive, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                  { label: 'Uptime', value: `${Math.round((health.uptime || 0) / 3600)}h`, icon: Cpu, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                  <Card key={label} className="p-5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{label}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Marketplace shortcut */}
        {tab === 'marketplace' && (
          <div className="text-center py-16">
            <Settings className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">App Marketplace</h3>
            <p className="text-slate-500 mb-6">Manage integrations and installed apps</p>
            <Button onClick={() => window.location.href = '/admin/marketplace'} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Open Marketplace <ArrowUpRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
