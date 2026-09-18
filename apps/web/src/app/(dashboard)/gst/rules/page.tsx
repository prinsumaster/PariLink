'use client';

import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Receipt, IndianRupee, AlertCircle } from 'lucide-react';
import { dateIN, money as inr } from '@/lib/format';
import { api } from '@/services/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useAuthStore } from '@/store/auth';

interface GstSummary {
  totalLrs: number;
  totalFreight: number;
  totalGstCollected: number;
  totalBilled: number;
}

interface GstRule {
  id: string;
  hsnSacCode: string;
  description?: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cessRate: number;
  isReverseCharge: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export default function GstReportsPage() {
  const [summary, setSummary] = useState<GstSummary | null>(null);
  const [rules, setRules] = useState<GstRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const load = async () => {
    try {
      setLoading(true);
      const [summaryRes, rulesRes] = await Promise.all([
        api.get('/lorry-receipts/summary/gst'),
        api.get('/gst/rules'),
      ]);
      setSummary(summaryRes.data);
      setRules(rulesRes.data?.data || rulesRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const gstPct = summary && summary.totalBilled > 0
    ? ((summary.totalGstCollected / summary.totalBilled) * 100).toFixed(1)
    : '—';

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Receipt className="h-8 w-8 text-green-600" />
          GST Reports
        </h1>
        <p className="text-muted-foreground text-sm">
          GST summary computed from Lorry Receipt (Bilty) data stored in this system.
          SAC code 9965 (Goods Transport Services) applies at 5% GTA under reverse-charge.
        </p>
      </div>

      {/* Honest disclaimer banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          <strong>Manual data only — not connected to GST Portal / GSTN.</strong>{' '}
          Filing GSTR-1, GSTR-3B, or e-invoicing requires direct portal access. This screen
          shows GST amounts as entered on each Lorry Receipt. Always reconcile against your
          chartered accountant&apos;s records before filing.
        </div>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse h-28" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Total LRs
              </CardDescription>
              <CardTitle className="text-3xl">{summary.totalLrs}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" /> Total Freight
              </CardDescription>
              <CardTitle className="text-2xl">{inr(summary.totalFreight)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1 text-green-700 dark:text-green-400">
                <TrendingUp className="h-4 w-4" /> GST Collected
              </CardDescription>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                {inr(summary.totalGstCollected)}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{gstPct}% of billed amount</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" /> Total Billed
              </CardDescription>
              <CardTitle className="text-2xl">{inr(summary.totalBilled)}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      ) : null}

      {/* GST Tax Rules table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Configured GST Rules</CardTitle>
            <CardDescription>
              HSN/SAC codes and tax rates used to compute GST on freight invoices.
              Manage rules to update rates for new financial years.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-4 text-center">Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HSN / SAC</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">CGST %</TableHead>
                  <TableHead className="text-right">SGST %</TableHead>
                  <TableHead className="text-right">IGST %</TableHead>
                  <TableHead className="text-right">Cess %</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Effective From</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono font-semibold">{r.hsnSacCode}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {r.description || 'Goods Transport Services'}
                    </TableCell>
                    <TableCell className="text-right">{r.cgstRate}%</TableCell>
                    <TableCell className="text-right">{r.sgstRate}%</TableCell>
                    <TableCell className="text-right">{r.igstRate}%</TableCell>
                    <TableCell className="text-right">{r.cessRate}%</TableCell>
                    <TableCell>
                      {r.isReverseCharge ? (
                        <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                          Reverse Charge
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:bg-green-950/30">
                          Forward Charge
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{dateIN(r.effectiveFrom)}</TableCell>
                  </TableRow>
                ))}
                {rules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No GST rules configured yet
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
