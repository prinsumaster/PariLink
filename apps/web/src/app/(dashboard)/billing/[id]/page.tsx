'use client';
import { money, num, dateIN } from '@/lib/format';

import React from 'react';

import { useInvoice, useApproveInvoice } from '@/hooks';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, FileText, Download, Mail, AlertTriangle, Building, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';


interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = React.use(params);
  const { data: invoice, isLoading, isError } = useInvoice(id);
  const { mutate: approve, isPending: isApproving } = useApproveInvoice();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription>Invoice not found.</AlertDescription>
      </Alert>
    );
  }

  const handleApprove = () => {
    approve(invoice.id, {
      onSuccess: () => toast.success('Invoice approved and sent to customer!'),
      onError: () => toast.error('Failed to approve invoice.'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/billing">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight font-mono text-blue-600 dark:text-blue-400">
                {invoice.invoiceNumber}
              </h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Created {format(new Date(invoice.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {invoice.status === 'DRAFT' && (
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              {isApproving ? 'Approving...' : 'Approve & Send'}
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Document View */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-12 border-b">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Tax Invoice</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">GSTIN: 27AADCB2230M1Z2 | SAC: 9965 (Goods Transport Agency)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">PariLink India Logistics</p>
                  <p className="text-sm text-muted-foreground mt-1">Bandra Kurla Complex<br />Mumbai, Maharashtra 400051</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Billed To</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{invoice.customer?.name || 'Customer'}</p>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                    {invoice.customer?.billingAddress || invoice.customer?.address || 'Mumbai Logistics Hub, Maharashtra'}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-end gap-4">
                    <span className="text-muted-foreground">Invoice Date:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{format(new Date(invoice.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : '—'}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-muted-foreground">Terms:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {invoice.customer?.paymentTerms?.replace('_', ' ') ?? 'NET 30'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="mt-12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-muted-foreground">Description</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">Qty</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">Rate</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">GST</th>
                      <th className="pb-3 font-semibold text-muted-foreground text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-800">
                    {(invoice.lineItems && invoice.lineItems.length > 0 ? invoice.lineItems : [
                      { id: '1', description: 'Primary Freight Haulage (SAC 9965)', quantity: 1, unitPrice: invoice.subtotal || Math.round(invoice.amount / 1.05), amount: invoice.subtotal || Math.round(invoice.amount / 1.05) }
                    ]).map((item: any, idx: number) => (
                      <tr key={item.id || idx}>
                        <td className="py-4">
                          <p className="font-medium text-slate-900 dark:text-white">{item.description}</p>
                          {invoice.loadId && (
                            <p className="text-xs text-muted-foreground mt-0.5 font-mono">Load Ref: {invoice.loadId.slice(0, 8)}</p>
                          )}
                        </td>
                        <td className="py-4 text-right">{item.quantity || 1}</td>
                        <td className="py-4 text-right">{money(item.unitPrice || item.rate || item.amount || 0)}</td>
                        <td className="py-4 text-right">5%</td>
                        <td className="py-4 text-right font-medium text-slate-900 dark:text-white">{money(item.amount || item.total || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-8">
                <div className="w-72 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxable Value (Subtotal)</span>
                    <span className="font-medium text-slate-900 dark:text-white">{money(invoice.subtotal || Math.round(invoice.amount / 1.05))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGST (2.5%)</span>
                    <span className="font-medium text-slate-900 dark:text-white">{money(Math.round((invoice.taxTotal || (invoice.amount - Math.round(invoice.amount / 1.05))) / 2))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SGST (2.5%)</span>
                    <span className="font-medium text-slate-900 dark:text-white">{money((invoice.taxTotal || (invoice.amount - Math.round(invoice.amount / 1.05))) - Math.round((invoice.taxTotal || (invoice.amount - Math.round(invoice.amount / 1.05))) / 2))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-slate-900 dark:text-white">Grand Total</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{money(invoice.grandTotal || invoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-sm text-muted-foreground text-center">
                Please quote Tax Invoice {invoice.invoiceNumber} on all RTGS/NEFT payment remittances.
                <br />Thank you for partnering with PariLink India Logistics.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Payment Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Amount Due</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  {money(invoice.amount)}
                </span>
              </div>
              
              {invoice.status === 'PAID' ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Fully Paid
                </div>
              ) : (
                <Link href="/payments" className="block w-full">
                  <Button className="w-full gap-2">
                    <CreditCard className="h-4 w-4" />
                    Record Payment
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Customer Info</h3>
            {invoice.customer ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                  <Building className="h-4 w-4 text-blue-500" />
                  {invoice.customer.name}
                </div>
                <p className="text-sm text-muted-foreground ml-6">{invoice.customer.email}</p>
                <p className="text-sm text-muted-foreground ml-6">{invoice.customer.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No customer linked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
