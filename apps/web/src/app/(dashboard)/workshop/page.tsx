'use client';


import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Link from 'next/link';
import { Plus, Wrench, Calendar, Truck } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function WorkshopPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['job-cards'],
    queryFn: async () => {
      const res = await api.get('/workshop/job-cards');
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Workshop & Store</h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-2">Manage job cards, parts, vendors, and tyre logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/workshop/new" className={cn(buttonVariants({ variant: 'default' }), "flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all")}>
            <Plus className="mr-2 h-4 w-4" /> New Job Card
          </Link>
          <Link href="/workshop/tyre-log/new" className={cn(buttonVariants({ variant: 'outline' }), "flex items-center shadow-sm transition-all")}>
            <Plus className="mr-2 h-4 w-4" /> Add Tyre Log
          </Link>
        </div>
      </div>

      <div className="glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Wrench className="w-5 h-5" /> Recent Job Cards</h2>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
            ))}
          </div>
        ) : data?.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-500">No job cards found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {data?.map((jc: any) => (
              <Link href={`/workshop/${jc.id}`} key={jc.id}>
                <Card className="hover:shadow-md transition-all cursor-pointer border-slate-200 dark:border-slate-800">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{jc.issueReported || 'General Service'}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> {jc.vehicleId.slice(0, 8)}...</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(jc.openedAt || jc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <Badge variant={jc.status === 'OPEN' ? 'default' : 'secondary'}>{jc.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
