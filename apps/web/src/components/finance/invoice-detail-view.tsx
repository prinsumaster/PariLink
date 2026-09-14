'use client';
import { money, dateIN } from '@/lib/format';

import { useState } from 'react';
import { Invoice } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Calendar, CreditCard, Building2, Banknote, FileText } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';
import { CountUp, StatusFlip } from '@/components/motion';
import { financeService } from '@/services/finance';
import { toast } from 'sonner';


interface InvoiceDetailViewProps {
  invoice: Invoice;
}

export function InvoiceDetailView({ invoice }: InvoiceDetailViewProps) {
  const [optimisticPaid, setOptimisticPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const subtotal = invoice.subtotal || Math.round((invoice.grandTotal ?? invoice.amount) / 1.05);
  const taxTotal = invoice.taxTotal || ((invoice.grandTotal ?? invoice.amount) - subtotal);
  const grandTotal = invoice.grandTotal ?? invoice.amount;

  const handleRecordPayment = async () => {
    setIsPending(true);
    try {
      await financeService.recordPayment(invoice.id, currentBalanceDue || grandTotal, 'RTGS');
      setOptimisticPaid(true);
      toast.success('Payment recorded successfully. Ledger updated.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to record payment');
    } finally {
      setIsPending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStatus = optimisticPaid ? 'PAID' : invoice.status;
  const currentAmountPaid = optimisticPaid ? grandTotal : (invoice.amountPaid ?? (invoice.status === 'PAID' ? grandTotal : 0));
  const currentBalanceDue = optimisticPaid ? 0 : Math.max(0, grandTotal - currentAmountPaid);

  const lineItemsList = invoice.lineItems && invoice.lineItems.length > 0 ? invoice.lineItems : [
    { id: '1', description: 'Primary Freight Haulage (SAC 9965)', quantity: 1, unitPrice: subtotal, taxRate: 5, total: subtotal }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:block">
      
      {/* Top Left: Main Invoice Info & Line Items */}
      <div className="xl:col-span-2 space-y-6">
        <Card className="print:border-none print:shadow-none">
          <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1 print:hidden">
                <StatusFlip statusKey={currentStatus}>
                  <Badge variant={currentStatus === 'PAID' ? 'default' : currentStatus === 'OVERDUE' ? 'destructive' : 'secondary'} 
                         className={currentStatus === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : ''}>
                    {currentStatus}
                  </Badge>
                </StatusFlip>
              </div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Receipt className="h-6 w-6 text-blue-500" />
                Tax Invoice {invoice.invoiceNumber}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">GST Identification Number: 27AADCB2230M1Z2 | SAC: 9965</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" onClick={handlePrint}>
                <FileText className="mr-2 h-4 w-4" /> Download / Print PDF
              </Button>
              <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS']}>
                <Link href={`/finance/${invoice.id}/edit`}>
                  <Button variant="outline">Edit Invoice</Button>
                </Link>
              </RoleGuard>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            
            {/* Header Meta */}
            <div className="flex flex-wrap justify-between gap-6 mb-8">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Building2 className="h-4 w-4" /> Bill To</div>
                <div className="font-bold text-lg">{invoice.customerName || 'Reliance Retail Ltd'}</div>
                <div className="text-sm text-gray-500">Customer ID: {invoice.customerId || 'CUST-IND-1001'}</div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar className="h-4 w-4" /> Issued Date</div>
                  <div className="font-medium">{dateIN(invoice.issueDate || invoice.createdAt)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar className="h-4 w-4 text-red-400" /> Due Date</div>
                  <div className={`font-medium ${currentStatus === 'OVERDUE' ? 'text-red-500 font-semibold' : ''}`}>{dateIN(invoice.dueDate)}</div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mt-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Tax (GST)</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {lineItemsList.map((item: any, idx: number) => (
                      <tr key={item.id || idx}>
                        <td className="px-4 py-3 font-medium">
                          {item.description}
                          {item.orderId && <div className="text-xs text-blue-500 font-normal mt-0.5">Order: {item.orderId}</div>}
                        </td>
                        <td className="px-4 py-3 text-right">{item.quantity || 1}</td>
                        <td className="px-4 py-3 text-right">{money(item.unitPrice || item.rate || item.amount || 0)}</td>
                        <td className="px-4 py-3 text-right">{item.type === 'TAX' ? '5%' : `${item.taxRate ?? 5}%`}</td>
                        <td className="px-4 py-3 text-right font-medium">{money(item.total || item.amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Notes:</strong> {invoice.notes}
              </div>
            )}
            
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Financial Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5" /> Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Taxable Value (Subtotal)</span>
              <span className="font-medium">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>CGST (2.5%)</span>
              <span className="font-medium">{money(Math.round(taxTotal / 2))}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>SGST (2.5%)</span>
              <span className="font-medium">{money(taxTotal - Math.round(taxTotal / 2))}</span>
            </div>
            {(invoice.discountTotal ?? 0) > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600">
                <span>Discount</span>
                <span>-{money(invoice.discountTotal)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Grand Total</span>
                <span className="text-blue-600 dark:text-blue-400">{money(grandTotal)}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Amount Paid</span>
                <span className="flex font-semibold text-emerald-600 dark:text-emerald-400">
                  ₹<CountUp value={currentAmountPaid} formatFn={(v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-bold">
                <span>Balance Due</span>
                <span className={currentBalanceDue > 0 ? 'text-red-500 flex' : 'text-green-500 flex'}>
                  ₹<CountUp value={currentBalanceDue} formatFn={(v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
                </span>
              </div>
            </div>
            
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS', 'FINANCE']}>
              {currentBalanceDue > 0 && (
                <Button 
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white" 
                  variant="default"
                  onClick={handleRecordPayment}
                  disabled={isPending}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> {isPending ? 'Processing Payment...' : 'Record Payment (RTGS / NEFT)'}
                </Button>
              )}
            </RoleGuard>

          </CardContent>
        </Card>
      </div>

    </div>
  );
}
