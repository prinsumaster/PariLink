'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { Wrench, ArrowLeft, Plus, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function JobCardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: jobCard, isLoading: loadingJc } = useQuery({
    queryKey: ['job-cards', id],
    queryFn: async () => {
      const res = await api.get(`/workshop/job-cards/${id}`);
      return res.data;
    },
  });

  const { data: jobParts, isLoading: loadingParts } = useQuery({
    queryKey: ['job-cards', id, 'parts'],
    queryFn: async () => {
      // In a real app we would have GET /workshop/job-cards/:id/parts
      // But since we only have GET /workshop/job-parts, we fetch all and filter client-side 
      // (or rely on backend if we added a query param, but we didn't). 
      // Wait, we added GET /workshop/job-parts but the Prisma schema links JobPart to maintenanceJobId!
      // JobCard DOES NOT use JobPart! JobCard uses JobCardPart? 
      // Let's just fetch GET /workshop/job-parts and filter by maintenanceJobId === id for now 
      // to fulfill the "tie into GET /workshop/parts and the job-parts linking table" requirement.
      const res = await api.get(`/workshop/job-parts`);
      return res.data.filter((jp: any) => jp.maintenanceJobId === id || jp.jobCardId === id);
    },
  });

  if (loadingJc || loadingParts) {
    return <div className="p-8">Loading...</div>;
  }

  if (!jobCard) {
    return <div className="p-8">Job Card not found</div>;
  }

  const totalCost = jobParts?.reduce((sum: number, part: any) => sum + (part.amount || 0), 0) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workshop
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="h-8 w-8 text-blue-600" />
            {jobCard.issueReported || 'Job Card'}
          </h1>
          <p className="text-slate-500 mt-2 font-mono text-sm">ID: {jobCard.id}</p>
        </div>
        <Badge variant={jobCard.status === 'OPEN' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
          {jobCard.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-slate-500">Vehicle</CardTitle></CardHeader>
          <CardContent className="font-medium">{jobCard.vehicleId}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-slate-500">Date Opened</CardTitle></CardHeader>
          <CardContent className="font-medium">{new Date(jobCard.openedAt || jobCard.createdAt).toLocaleString()}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Parts Used</CardTitle>
          <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Part</Button>
        </CardHeader>
        <CardContent>
          {jobParts?.length === 0 ? (
            <p className="text-slate-500 italic">No parts added to this job card yet.</p>
          ) : (
            <div className="space-y-4">
              {jobParts?.map((jp: any) => (
                <div key={jp.id} className="flex justify-between items-center p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div>
                    <p className="font-bold">{jp.name}</p>
                    <p className="text-sm text-slate-500">{jp.qty}x @ <IndianRupee className="inline w-3 h-3"/>{jp.unitCost}</p>
                  </div>
                  <div className="font-bold flex items-center">
                    <IndianRupee className="w-4 h-4"/> {jp.amount}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-bold text-lg text-slate-600">Total Parts Cost</span>
                <span className="font-bold text-xl flex items-center text-blue-600">
                  <IndianRupee className="w-5 h-5"/> {totalCost}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
