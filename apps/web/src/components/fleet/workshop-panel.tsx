'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Wrench, Plus, CheckCircle } from 'lucide-react';

export function WorkshopPanel({ vehicleId }: { vehicleId: string }) {
  const queryClient = useQueryClient();
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobType, setNewJobType] = useState('PREVENTIVE');
  const [newJobLabour, setNewJobLabour] = useState('');
  
  const [activeJobForPart, setActiveJobForPart] = useState<string | null>(null);
  const [partName, setPartName] = useState('');
  const [partQty, setPartQty] = useState('1');
  const [partCost, setPartCost] = useState('');

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['vehicle-jobs', vehicleId],
    queryFn: () => fleetService.getJobs(vehicleId)
  });

  const createJobMutation = useMutation({
    mutationFn: (payload: any) => fleetService.createJob(vehicleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-jobs', vehicleId] });
      toast.success('Job created');
      setIsAddingJob(false);
      setNewJobLabour('');
    }
  });

  const addPartMutation = useMutation({
    mutationFn: ({ jobId, payload }: { jobId: string, payload: any }) => fleetService.addJobPart(jobId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-jobs', vehicleId] });
      toast.success('Part added');
      setActiveJobForPart(null);
      setPartName('');
      setPartCost('');
      setPartQty('1');
    }
  });

  const closeJobMutation = useMutation({
    mutationFn: (jobId: string) => fleetService.closeJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-jobs', vehicleId] });
      toast.success('Job closed and costs rolled up');
    }
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJobMutation.mutate({
      type: newJobType,
      labourCost: Number(newJobLabour)
    });
  };

  const handleAddPart = (e: React.FormEvent, jobId: string) => {
    e.preventDefault();
    addPartMutation.mutate({
      jobId,
      payload: {
        name: partName,
        qty: Number(partQty),
        unitCost: Number(partCost)
      }
    });
  };

  if (isLoading) return <div className="animate-pulse">Loading workshop data...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wrench className="h-5 w-5 text-indigo-500" /> Workshop & Job Cards
        </CardTitle>
        <Button size="sm" onClick={() => setIsAddingJob(!isAddingJob)} variant="outline">
          {isAddingJob ? 'Cancel' : 'Open New Job'}
        </Button>
      </CardHeader>
      
      <CardContent>
        {isAddingJob && (
          <form onSubmit={handleCreateJob} className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-medium text-sm">New Job Card</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Job Type</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:focus-visible:ring-slate-300"
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value)}
                >
                  <option value="PREVENTIVE">Preventive Maintenance</option>
                  <option value="BREAKDOWN">Breakdown Repair</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Labour Cost (₹)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={newJobLabour} 
                  onChange={(e) => setNewJobLabour(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" disabled={createJobMutation.isPending}>
              Open Job
            </Button>
          </form>
        )}

        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No jobs recorded for this vehicle.</div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job: any) => (
              <div key={job.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-0 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Job Card #{job.id.substring(0,8).toUpperCase()}</h4>
                      <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'}>{job.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {job.type} | Opened: {new Date(job.openedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total Cost</p>
                    <p className="text-xl font-bold">₹ {job.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-slate-500">Labour Cost:</span>
                    <span className="font-medium">₹ {job.labourCost.toFixed(2)}</span>
                  </div>

                  {job.parts && job.parts.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase mb-2">Parts Used</p>
                      <ul className="space-y-2">
                        {job.parts.map((part: any) => (
                          <li key={part.id} className="text-sm flex justify-between">
                            <span>{part.name} (x{part.qty})</span>
                            <span className="font-medium">₹ {part.amount.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.status === 'OPEN' && (
                    <div className="pt-4 flex items-center justify-between">
                      {activeJobForPart === job.id ? (
                        <form onSubmit={(e) => handleAddPart(e, job.id)} className="flex items-end gap-2 w-full">
                          <div className="flex-1">
                            <Input placeholder="Part name" value={partName} onChange={(e) => setPartName(e.target.value)} required />
                          </div>
                          <div className="w-20">
                            <Input type="number" placeholder="Qty" value={partQty} onChange={(e) => setPartQty(e.target.value)} required />
                          </div>
                          <div className="w-28">
                            <Input type="number" placeholder="Unit ₹" value={partCost} onChange={(e) => setPartCost(e.target.value)} required />
                          </div>
                          <Button type="submit" size="sm">Add</Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setActiveJobForPart(null)}>Cancel</Button>
                        </form>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setActiveJobForPart(job.id)}>
                            <Plus className="h-4 w-4 mr-1" /> Add Part
                          </Button>
                          <Button size="sm" onClick={() => closeJobMutation.mutate(job.id)} disabled={closeJobMutation.isPending}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Close Job
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
