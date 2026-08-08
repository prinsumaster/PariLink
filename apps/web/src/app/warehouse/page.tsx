'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanBarcode, Package, ArrowDownToLine, ArrowUpFromLine, ListChecks } from 'lucide-react';
import Link from 'next/link';

export default function WarehouseDashboard() {
  const tasks = [
    { id: 1, title: 'Inbound Receiving', count: 12, icon: ArrowDownToLine, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 2, title: 'Outbound Loading', count: 5, icon: ArrowUpFromLine, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 3, title: 'Pick & Pack', count: 28, icon: Package, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 4, title: 'Cycle Counts', count: 3, icon: ListChecks, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Warehouse</h1>
          <p className="text-slate-500 text-sm">Main Distribution Center</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform cursor-pointer bg-white dark:bg-slate-950 hover:shadow-md">
            <div className={`p-3 rounded-full ${task.bg} dark:bg-opacity-20`}>
              <task.icon className={`h-6 w-6 ${task.color}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</p>
              <p className="text-xs text-slate-500">{task.count} Pending</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4">
        <Link href="/warehouse/scan">
          <Button className="w-full h-16 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg flex items-center justify-center gap-2">
            <ScanBarcode className="h-6 w-6" />
            Scan Barcode / QR
          </Button>
        </Link>
      </div>
    </div>
  );
}
