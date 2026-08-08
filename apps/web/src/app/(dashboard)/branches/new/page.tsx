'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const branchService = {
  create: (dto: Record<string, any>) =>
    api.post('/branches', dto).then(r => r.data),
};

export default function NewBranchPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    phone: '',
    email: '',
    status: 'ACTIVE',
  });

  const mutation = useMutation({
    mutationFn: () => branchService.create(Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v !== '')
    )),
    onSuccess: () => {
      toast.success('Branch created successfully');
      qc.invalidateQueries({ queryKey: ['branches'] });
      router.push('/branches');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create branch'),
  });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN']}>
      <div className="flex flex-col h-full page-enter bg-background">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Branch</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Register a new operational location</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={() => mutation.mutate()} disabled={!form.name.trim() || mutation.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {mutation.isPending ? 'Saving...' : 'Save Branch'}
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-8">
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Branch Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-sm font-medium">Branch Name *</label>
                <Input name="name" placeholder="Dallas Terminal" value={form.name} onChange={update('name')} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Branch Code</label>
                <Input name="code" placeholder="DFW-01" value={form.code} onChange={update('code')} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select value={form.status} onValueChange={v => v && setForm(p => ({ ...p, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Phone</label>
                <Input name="phone" placeholder="+1 555 000 0000" value={form.phone} onChange={update('phone')} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="branch@company.com" value={form.email} onChange={update('email')} />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-lg font-semibold">Location</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Street Address</label>
                <Input name="address" placeholder="123 Industrial Blvd" value={form.address} onChange={update('address')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">City</label>
                  <Input name="city" placeholder="Dallas" value={form.city} onChange={update('city')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">State</label>
                  <Input name="state" placeholder="TX" value={form.state} onChange={update('state')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input name="postalCode" placeholder="75001" value={form.postalCode} onChange={update('postalCode')} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Country</label>
                  <Input name="country" placeholder="USA" value={form.country} onChange={update('country')} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
