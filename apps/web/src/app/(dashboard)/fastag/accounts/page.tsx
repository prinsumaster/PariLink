'use client';

import { api } from '@/services/api';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAuthStore } from '@/store/auth';

export default function fastagPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/fastag/accounts');
      setData(res.data?.data || res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">FASTag Accounts</h1>
        <Button onClick={loadData}>Refresh</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage FASTag Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>provider</TableHead>
                  <TableHead>accountNumber</TableHead>
                  <TableHead>walletBalance</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id?.substring(0,8)}</TableCell>
                    <TableCell>{String(item.provider || '-')}</TableCell>
                    <TableCell>{String(item.accountNumber || '-')}</TableCell>
                    <TableCell>{String(item.walletBalance || '-')}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
