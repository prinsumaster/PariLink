'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrialBalanceLine {
  accountId: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

interface PnLData {
  revenue: number;
  expenses: number;
  netIncome: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────
const ledgerService = {
  getTrialBalance: () =>
    api.get<TrialBalanceLine[]>('/ledger/trial-balance').then(r => r.data),
  getPnL: (startDate?: string, endDate?: string) =>
    api.get<PnLData>('/ledger/profit-and-loss', { params: { startDate, endDate } }).then(r => r.data),
  getChartOfAccounts: () =>
    api.get<any[]>('/ledger/chart-of-accounts').then(r => r.data),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

const TYPE_COLOR: Record<string, string> = {
  ASSET: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  LIABILITY: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  EQUITY: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
  INCOME: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  EXPENSE: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
};

function SummaryCard({ label, value, icon: Icon, trend }: { label: string; value: number; icon: React.ElementType; trend?: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        {trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
      </div>
      <div className="text-2xl font-bold text-foreground">{fmtCurrency(value)}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LedgerPage() {
  const [activeTab, setActiveTab] = useState<'trial-balance' | 'pnl' | 'chart'>('trial-balance');
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    ASSET: true, LIABILITY: true, INCOME: true, EXPENSE: true, EQUITY: false,
  });

  const { data: trialBalance, isLoading: tbLoading, refetch: refetchTB } = useQuery({
    queryKey: ['ledger', 'trial-balance'],
    queryFn: ledgerService.getTrialBalance,
  });

  const { data: pnl, isLoading: pnlLoading } = useQuery({
    queryKey: ['ledger', 'pnl'],
    queryFn: () => ledgerService.getPnL(),
  });

  const { data: accounts, isLoading: chartLoading } = useQuery({
    queryKey: ['ledger', 'chart'],
    queryFn: ledgerService.getChartOfAccounts,
    enabled: activeTab === 'chart',
  });

  // Group trial balance by type
  const groupedTB = (trialBalance ?? []).reduce((acc, line) => {
    if (!acc[line.type]) acc[line.type] = [];
    acc[line.type].push(line);
    return acc;
  }, {} as Record<string, TrialBalanceLine[]>);

  const totalDebits = (trialBalance ?? []).reduce((s, l) => s + l.totalDebit, 0);
  const totalCredits = (trialBalance ?? []).reduce((s, l) => s + l.totalCredit, 0);

  const tabs = [
    { id: 'trial-balance' as const, label: 'Trial Balance' },
    { id: 'pnl' as const, label: 'Profit & Loss' },
    { id: 'chart' as const, label: 'Chart of Accounts' },
  ];

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE']}>
      <div className="flex flex-col h-full page-enter">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">General Ledger</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Trial balance, profit & loss, and chart of accounts
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchTB()} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <SummaryCard
              label="Total Revenue"
              value={pnl?.revenue ?? 0}
              icon={TrendingUp}
              trend="up"
            />
            <SummaryCard
              label="Total Expenses"
              value={pnl?.expenses ?? 0}
              icon={TrendingDown}
              trend="down"
            />
            <SummaryCard
              label="Net Income"
              value={pnl?.netIncome ?? 0}
              icon={DollarSign}
              trend={(pnl?.netIncome ?? 0) >= 0 ? 'up' : 'down'}
            />
            <SummaryCard
              label="Total Debit/Credit"
              value={totalDebits}
              icon={FileSpreadsheet}
            />
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Trial Balance */}
          {activeTab === 'trial-balance' && (
            <div className="space-y-4">
              {tbLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl border border-border bg-muted/40 animate-pulse" />
                ))
              ) : (trialBalance ?? []).length === 0 ? (
                <div className="text-center py-16">
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No journal entries found</p>
                </div>
              ) : (
                <>
                  {['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'].map(type => {
                    const lines = groupedTB[type] ?? [];
                    if (lines.length === 0) return null;
                    const expanded = expandedTypes[type] ?? true;
                    const typeTotal = lines.reduce((s, l) => s + l.balance, 0);
                    return (
                      <div key={type} className="rounded-xl border border-border overflow-hidden">
                        <button
                          onClick={() => setExpandedTypes(prev => ({ ...prev, [type]: !expanded }))}
                          className="w-full flex items-center justify-between px-5 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                              TYPE_COLOR[type]
                            )}>
                              {type}
                            </span>
                            <span className="text-sm font-semibold text-foreground">{lines.length} accounts</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              'text-sm font-bold',
                              typeTotal >= 0 ? 'text-emerald-600' : 'text-red-500'
                            )}>
                              {fmtCurrency(typeTotal)}
                            </span>
                            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </button>
                        {expanded && (
                          <table className="w-full text-sm">
                            <thead className="bg-muted/20">
                              <tr>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-2">Code</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-2">Account</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-2">Debit</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-2">Credit</th>
                                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-2">Balance</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                              {lines.map(line => (
                                <tr key={line.accountId} className="hover:bg-muted/20 transition-colors">
                                  <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{line.code}</td>
                                  <td className="px-5 py-2.5 font-medium text-foreground">{line.name}</td>
                                  <td className="px-5 py-2.5 text-right text-muted-foreground">{fmtCurrency(line.totalDebit)}</td>
                                  <td className="px-5 py-2.5 text-right text-muted-foreground">{fmtCurrency(line.totalCredit)}</td>
                                  <td className={cn(
                                    'px-5 py-2.5 text-right font-semibold',
                                    line.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                                  )}>
                                    {fmtCurrency(line.balance)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    );
                  })}

                  {/* Totals row */}
                  <div className="rounded-xl border-2 border-border bg-muted/30 px-5 py-3 flex items-center justify-between">
                    <span className="font-bold text-foreground">Totals</span>
                    <div className="flex gap-8 text-sm font-semibold">
                      <span className="text-blue-600 dark:text-blue-400">DR {fmtCurrency(totalDebits)}</span>
                      <span className="text-purple-600 dark:text-purple-400">CR {fmtCurrency(totalCredits)}</span>
                      <span className={cn(
                        'font-bold',
                        Math.abs(totalDebits - totalCredits) < 0.01 ? 'text-emerald-600' : 'text-red-500'
                      )}>
                        {Math.abs(totalDebits - totalCredits) < 0.01 ? '✓ Balanced' : `DIFF: ${fmtCurrency(totalDebits - totalCredits)}`}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* P&L */}
          {activeTab === 'pnl' && (
            <div className="max-w-2xl space-y-4">
              {pnlLoading ? (
                <div className="h-64 rounded-xl border border-border bg-muted/40 animate-pulse" />
              ) : (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="px-5 py-4 bg-muted/30 border-b border-border">
                    <h2 className="font-bold text-foreground">Profit & Loss Statement</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">All time — based on posted journal entries</p>
                  </div>
                  <div className="divide-y divide-border/40">
                    <div className="px-5 py-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Total Revenue</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmtCurrency(pnl?.revenue ?? 0)}</span>
                    </div>
                    <div className="px-5 py-3 flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Total Expenses</span>
                      <span className="font-bold text-red-500">{fmtCurrency(pnl?.expenses ?? 0)}</span>
                    </div>
                    <div className={cn(
                      'px-5 py-4 flex justify-between items-center',
                      (pnl?.netIncome ?? 0) >= 0 ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'bg-red-50/50 dark:bg-red-950/20'
                    )}>
                      <span className="text-sm font-bold text-foreground">Net Income</span>
                      <span className={cn(
                        'text-xl font-bold',
                        (pnl?.netIncome ?? 0) >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'
                      )}>
                        {fmtCurrency(pnl?.netIncome ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chart of Accounts */}
          {activeTab === 'chart' && (
            <div className="rounded-xl border border-border overflow-hidden">
              {chartLoading ? (
                <div className="h-48 bg-muted/40 animate-pulse" />
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      {['Code', 'Account Name', 'Type', 'Normal Balance'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {(accounts ?? []).map((acct: any) => (
                      <tr key={acct.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-2.5 font-mono text-xs text-muted-foreground">{acct.code}</td>
                        <td className="px-5 py-2.5 font-medium text-foreground">{acct.name}</td>
                        <td className="px-5 py-2.5">
                          <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border', TYPE_COLOR[acct.type] || 'bg-muted text-muted-foreground border-border')}>
                            {acct.type}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 text-xs text-muted-foreground">
                          {['ASSET', 'EXPENSE'].includes(acct.type) ? 'Debit' : 'Credit'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
