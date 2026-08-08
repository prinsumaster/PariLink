'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Save, Truck } from 'lucide-react';

const trailerService = {
  create: (dto: Record<string, any>) => api.post('/trailers', dto).then(r => r.data),
};

export default function NewTrailerPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    licensePlate: '',
    vin: '',
    capacityWeight: '',
    capacityVolume: '',
  });

  const mutation = useMutation({
    mutationFn: () => {
      const payload: Record<string, any> = {};
      if (form.make) payload.make = form.make;
      if (form.model) payload.model = form.model;
      if (form.year) payload.year = parseInt(form.year);
      if (form.licensePlate) payload.licensePlate = form.licensePlate;
      if (form.vin) payload.vin = form.vin;
      if (form.capacityWeight) payload.capacityWeight = parseFloat(form.capacityWeight);
      if (form.capacityVolume) payload.capacityVolume = parseFloat(form.capacityVolume);
      return trailerService.create(payload);
    },
    onSuccess: () => {
      toast.success('Trailer registered successfully');
      qc.invalidateQueries({ queryKey: ['trailers'] });
      router.push('/trailers');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create trailer'),
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="flex flex-col h-full page-enter bg-background">
      <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Register Trailer</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Add a trailer to your fleet</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {mutation.isPending ? 'Saving...' : 'Save Trailer'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Trailer Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Make</label>
              <Input name="make" placeholder="Utility, Wabash, Great Dane…" value={form.make} onChange={update('make')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Model</label>
              <Input name="model" placeholder="4000D-X, DuraPlate…" value={form.model} onChange={update('model')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Year</label>
              <Input name="year" type="number" placeholder="2024" value={form.year} onChange={update('year')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">License Plate</label>
              <Input name="licensePlate" placeholder="TR-90088" value={form.licensePlate} onChange={update('licensePlate')} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">VIN</label>
              <Input name="vin" placeholder="17-character VIN" value={form.vin} onChange={update('vin')} className="font-mono" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Capacity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Weight Capacity (kg)</label>
              <Input name="capacityWeight" type="number" placeholder="45000" value={form.capacityWeight} onChange={update('capacityWeight')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Volume Capacity (ft³)</label>
              <Input name="capacityVolume" type="number" placeholder="4000" value={form.capacityVolume} onChange={update('capacityVolume')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
