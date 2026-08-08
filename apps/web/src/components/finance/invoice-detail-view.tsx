'use client';

import { Invoice } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Calendar, CreditCard, Building2, Banknote, FileText } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';

interface InvoiceDetailViewProps {
  invoice: Invoice;
}

export function InvoiceDetailView({ invoice }: InvoiceDetailViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Top Left: Main Invoice Info & Line Items */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={invoice.status === 'PAID' ? 'default' : invoice.status === 'OVERDUE' ? 'destructive' : 'secondary'} 
                       className={invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : ''}>
                  {invoice.status}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Receipt className="h-6 w-6 text-blue-500" />
                Invoice {invoice.invoiceNumber}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Download PDF
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
                <div className="font-bold text-lg">{invoice.customerName}</div>
                <div className="text-sm text-gray-500">Account ID: {invoice.customerId}</div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar className="h-4 w-4" /> Issued</div>
                  <div className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar className="h-4 w-4 text-red-400" /> Due Date</div>
                  <div className={`font-medium ${invoice.status === 'OVERDUE' ? 'text-red-500' : ''}`}>{new Date(invoice.dueDate).toLocaleDateString()}</div>
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
                      <th className="px-4 py-3 text-right">Tax (%)</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {invoice.lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium">
                          {item.description}
                          {item.orderId && <div className="text-xs text-blue-500 font-normal mt-0.5">Order: {item.orderId}</div>}
                        </td>
                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{item.taxRate}%</td>
                        <td className="px-4 py-3 text-right font-medium">${item.total.toLocaleString()}</td>
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
              <Banknote className="h-5 w-5" /> Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>${invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Tax</span>
              <span>${invoice.taxTotal.toLocaleString()}</span>
            </div>
            {invoice.discountTotal > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600">
                <span>Discount</span>
                <span>-${invoice.discountTotal.toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${invoice.grandTotal.toLocaleString()} {invoice.currency}</span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Amount Paid</span>
                <span>${invoice.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold">
                <span>Balance Due</span>
                <span className={invoice.balanceDue > 0 ? 'text-red-500' : 'text-green-500'}>
                  ${invoice.balanceDue.toLocaleString()}
                </span>
              </div>
            </div>
            
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS']}>
              {invoice.balanceDue > 0 && (
                <Button className="w-full mt-4" variant="default">
                  <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              )}
            </RoleGuard>

          </CardContent>
        </Card>
      </div>

    </div>
  );
}
