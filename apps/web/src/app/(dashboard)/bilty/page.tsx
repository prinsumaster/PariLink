'use client';

import { useState } from 'react';
import { useLorryReceipts } from '@/hooks/use-lorry-receipts';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText, Printer, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BiltyPage() {
  const { data, isLoading } = useLorryReceipts({ limit: 100 });
  const receipts = data?.data || [];

  const handlePrint = (id: string) => {
    // Open print view in new tab
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/lorry-receipts/${id}/print`, '_blank');
  };

  if (isLoading) {
    return <div className="p-8">Loading Bilty Records...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lorry Receipts (Bilty)</h2>
      </div>

      {receipts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Lorry Receipts Found"
          description="Lorry receipts will appear here when they are generated from bookings."
        />
      ) : (
        <div className="border rounded-md bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-medium">
              <tr>
                <th className="px-4 py-3">LR Number</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Consignor</th>
                <th className="px-4 py-3">Consignee</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {receipts.map((lr: any) => (
                <tr key={lr.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-blue-600">{lr.lrNumber}</td>
                  <td className="px-4 py-3 text-gray-500">{format(new Date(lr.createdAt), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3">{lr.consignorName}</td>
                  <td className="px-4 py-3">{lr.consigneeName}</td>
                  <td className="px-4 py-3">{lr.fromStation} &rarr; {lr.toStation}</td>
                  <td className="px-4 py-3">{lr.vehicleNumber || 'Unassigned'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {lr.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handlePrint(lr.id)}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
