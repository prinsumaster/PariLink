'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useParams, useRouter } from 'next/navigation';
import { Wrench, ArrowLeft, Plus, IndianRupee, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';

export default function JobCardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const permissions = (user?.role as any)?.permissions || [];
  
  const hasPerm = (perm: string) => permissions.includes('*') || permissions.includes(perm);
  const isGate = hasPerm('workshop:gate');
  const isMechanic = hasPerm('workshop:mechanic');
  const isSupervisor = hasPerm('workshop:supervisor');
  const isOwner = hasPerm('workshop:owner');

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
      const res = await api.get(`/workshop/job-parts`);
      return res.data.filter((jp: any) => jp.maintenanceJobId === id || jp.jobCardId === id);
    },
  });

  const updateStatusMut = useMutation({
    mutationFn: async ({ action, payload }: { action: string, payload?: any }) => {
      if (action === 'gate-in') return api.post(`/workshop/job-cards/${id}/gate-in`, payload);
      if (action === 'gate-out') return api.post(`/workshop/job-cards/${id}/gate-out`, payload);
      if (action === 'qc-signoff') return api.post(`/workshop/job-cards/${id}/qc-signoff`);
      if (action === 'owner-approve') return api.post(`/workshop/job-cards/${id}/owner-approve`, { approved: true });
      return api.post(`/workshop/job-cards/${id}/status`, { status: action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-cards', id] });
    }
  });

  if (loadingJc || loadingParts) {
    return <div className="p-8">Loading...</div>;
  }

  if (!jobCard) {
    return <div className="p-8">Job Card not found</div>;
  }

  const totalCost = jobParts?.reduce((sum: number, part: any) => sum + (part.amount || 0), 0) || 0;
  
  // High cost condition
  const needsOwnerApproval = (jobCard.totalCost || totalCost) > 50000 && !jobCard.ownerApproved;

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

      <Card>
        <CardHeader><CardTitle>Lifecycle Actions</CardTitle></CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          {jobCard.status === 'OPEN' && isGate && (
            <Button onClick={() => updateStatusMut.mutate({ action: 'gate-in', payload: { odometer: 10000 } })}>Gate In</Button>
          )}
          {['GATE_IN', 'WAITING_PARTS'].includes(jobCard.status) && isMechanic && (
            <Button onClick={() => updateStatusMut.mutate({ action: 'DIAGNOSING' })}>Start Diagnosing</Button>
          )}
          {jobCard.status === 'DIAGNOSING' && isMechanic && (
            <>
              <Button onClick={() => updateStatusMut.mutate({ action: 'WAITING_PARTS' })} variant="secondary">Wait for Parts</Button>
              <Button onClick={() => updateStatusMut.mutate({ action: 'IN_REPAIR' })}>Start Repair</Button>
            </>
          )}
          {jobCard.status === 'IN_REPAIR' && isMechanic && (
            <Button onClick={() => updateStatusMut.mutate({ action: 'QC_PENDING' })}>Finish Repair (QC Pending)</Button>
          )}
          {jobCard.status === 'QC_PENDING' && isSupervisor && (
            <Button onClick={() => updateStatusMut.mutate({ action: 'qc-signoff' })} disabled={needsOwnerApproval} variant="default">
              <CheckCircle className="mr-2 h-4 w-4" /> QC Sign-off
            </Button>
          )}
          {needsOwnerApproval && isOwner && (
            <Button onClick={() => updateStatusMut.mutate({ action: 'owner-approve' })} variant="destructive">
              Owner Approve (Cost &gt; 50k)
            </Button>
          )}
          {jobCard.status === 'QC_PASSED' && isGate && (
            <Button onClick={() => updateStatusMut.mutate({ action: 'gate-out', payload: { odometer: 10050 } })}>Gate Out</Button>
          )}
        </CardContent>
      </Card>

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
