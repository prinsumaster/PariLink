'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { api } from '@/services/api';
import { ShieldAlert, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function AuditLogsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetching the global/tenant audit timeline
      const res = await api.get('/admin/audit/timeline?limit=100');
      setData(res.data?.data || res.data || []);
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">Monitor system activity and compliance events.</p>
        </div>
        <Button onClick={loadData} disabled={loading}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-indigo-500" />
          <CardTitle>Security & Operational Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">Loading audit data...</TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No audit events recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          log.action === 'CREATE' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                          log.action === 'UPDATE' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                          log.action === 'DELETE' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                          'bg-slate-50 text-gray-700 ring-gray-600/20'
                        }`}>
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{log.entityType || log.entity}</span>
                          <span className="text-xs text-muted-foreground font-mono">{log.entityId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.source || 'SYSTEM'}</TableCell>
                      <TableCell className="font-mono text-xs">{log.userId || 'SYSTEM'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
