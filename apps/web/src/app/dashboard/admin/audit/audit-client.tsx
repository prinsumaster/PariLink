'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ShieldCheck, ShieldAlert, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function AuditClient() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/admin/audit/timeline', {
        params: {
          action: actionFilter !== 'ALL' ? actionFilter : undefined,
          limit: 50,
        },
      });
      setLogs(response.data.items || response.data || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.entityId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex gap-4 items-center w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search entity ID or action..."
              className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={actionFilter} onValueChange={(val) => setActionFilter(val || '')}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="LOGIN_SUCCESS">Login Success</SelectItem>
              <SelectItem value="LOGIN_FAILED">Login Failed</SelectItem>
              <SelectItem value="TRIP_CREATED">Trip Created</SelectItem>
              <SelectItem value="ROLE_CHANGED">Role Changed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="py-12 text-center text-red-500 bg-red-950/20 rounded-md border border-red-900/50">
            <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-red-500/70" />
            <p className="text-lg font-medium">Failed to load audit logs</p>
            <p className="text-sm text-red-400/70 mt-1">Check your connection or permissions and try again.</p>
            <Button onClick={fetchLogs} variant="outline" className="mt-4 border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300">
              Retry
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-zinc-800">
            <table className="w-full text-sm text-left text-zinc-300">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Target ID</th>
                  <th className="px-4 py-3">Source IP</th>
                  <th className="px-4 py-3">Integrity</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-500" />
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                      No audit logs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={log.action.includes('FAILED') || log.action.includes('DELETED') ? 'destructive' : 'secondary'}
                               className={log.action.includes('FAILED') ? 'bg-red-900/50 text-red-200 border-red-900' : 'bg-emerald-900/50 text-emerald-200 border-emerald-900'}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{log.entity}</td>
                      <td className="px-4 py-3 font-mono text-xs">{log.entityId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{log.ipAddress || 'Internal'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {log.integrityValid !== false ? (
                            <>
                              <ShieldCheck className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-emerald-500/70 font-mono" title={log._integrity?.hmac}>Verified</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="h-4 w-4 text-red-500" />
                              <span className="text-xs text-red-500/70 font-mono" title="HMAC Signature mismatch">Tampered</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
