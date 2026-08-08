'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Activity, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { toast } from 'sonner';

export default function BillingPortalPage() {
  const [isYearly, setIsYearly] = useState(true);

  const { data: billingInfo, isLoading } = useQuery({
    queryKey: ['billing', 'info'],
    queryFn: () => settingsService.getBillingInfo(),
  });

  const upgradeMutation = useMutation({
    mutationFn: (planId: string) => settingsService.upgradePlan(planId),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => toast.error('Failed to initiate checkout'),
  });

  if (isLoading) {
    return <div className="p-8 animate-pulse">Loading billing info...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Portal</h2>
          <p className="text-muted-foreground mt-1">Manage your PariLink subscription, usage, and invoices.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <CreditCard className="mr-2 h-4 w-4" /> Manage Payment Method
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Active Subscription */}
        <Card className="col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Active Plan
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                Active
              </Badge>
            </CardTitle>
            <CardDescription>You are currently on the {billingInfo?.subscriptionPlan?.name || 'Free'} Tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold tracking-tight">${billingInfo?.subscriptionPlan?.price || 0}</span>
              <span className="text-muted-foreground mb-1">/ {billingInfo?.subscriptionPlan?.interval || 'month'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Billing Cycle</p>
                <p className="text-sm font-semibold">Billed Annually</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Next Invoice</p>
                <p className="text-sm font-semibold">Jan 1, 2027</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => upgradeMutation.mutate('mock_plan_id')}
              disabled={upgradeMutation.isPending}
            >
              {upgradeMutation.isPending ? 'Redirecting...' : 'Upgrade Plan'}
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions / Upgrades */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Add-Ons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-semibold">AI Copilot</p>
                  <p className="text-xs text-muted-foreground">Included</p>
                </div>
              </div>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold">Digital Workers</p>
                  <p className="text-xs text-muted-foreground">+ $99/mo</p>
                </div>
              </div>
              <Button size="sm" variant="secondary">Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Metering (Reads from PlatformMetric) */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Usage Metering</h3>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Trucks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 <span className="text-sm font-normal text-muted-foreground">/ 100</span></div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '42%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">58 trucks remaining on current plan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38 <span className="text-sm font-normal text-muted-foreground">/ 100</span></div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '38%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">62 driver licenses available</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Storage Quota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142,000 <span className="text-sm font-normal text-muted-foreground">/ 500k</span></div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">API Requests this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Invoice History</h3>
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { id: 'INV-2026-004', date: 'Jul 1, 2026', amount: '$2,499.00', status: 'Paid' },
            { id: 'INV-2026-003', date: 'Jun 1, 2026', amount: '$2,499.00', status: 'Paid' },
            { id: 'INV-2026-002', date: 'May 1, 2026', amount: '$2,499.00', status: 'Paid' },
          ].map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">{invoice.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-semibold">{invoice.amount}</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                  {invoice.status}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
