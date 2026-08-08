'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCreateVendor } from '@/hooks';
import { z } from 'zod';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  code: z.string().optional(),
  type: z.enum(['CARRIER', 'MAINTENANCE', 'FUEL', 'INSURANCE', 'OTHER']).default('CARRIER'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  billingAddress: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.enum(['NET_15', 'NET_30', 'NET_60', 'PREPAID', 'COD']).default('NET_30'),
});

export default function NewVendorPage() {
  const router = useRouter();
  const { mutate: createVendor, isPending: saving } = useCreateVendor();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'CARRIER',
    email: '',
    phone: '',
    billingAddress: '',
    taxId: '',
    paymentTerms: 'NET_30',
  });

  const handleSave = () => {
    const result = vendorSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    const payload = { ...result.data };
    if (payload.email === '') delete payload.email;
    
    createVendor(payload as any, {
      onSuccess: () => {
        toast.success('Vendor added successfully.');
        router.push('/vendors');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Failed to add vendor');
      }
    });
  };

  return (
    <div className="flex flex-col h-full page-enter bg-background">
      <div className="px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Vendor</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Register a new vendor or carrier</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Vendor'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Company Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Vendor Name *</label>
              <Input 
                name="name"
                placeholder="Acme Freight" 
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Vendor Code</label>
              <Input 
                name="code"
                placeholder="V-001" 
                value={formData.code}
                onChange={(e) => setFormData(p => ({ ...p, code: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Vendor Type</label>
              <Select value={formData.type} onValueChange={(v) => v && setFormData(p => ({ ...p, type: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARRIER">Carrier / Partner</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="FUEL">Fuel Provider</SelectItem>
                  <SelectItem value="INSURANCE">Insurance</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Contact & Billing
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input 
                name="email"
                type="email"
                placeholder="billing@acmefreight.com" 
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                name="phone"
                placeholder="+1 555 123 4567" 
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-sm font-medium">Billing Address</label>
              <Input 
                name="billingAddress"
                placeholder="123 Industrial Way, Suite B" 
                value={formData.billingAddress}
                onChange={(e) => setFormData(p => ({ ...p, billingAddress: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tax ID / EIN</label>
              <Input 
                name="taxId"
                placeholder="XX-XXXXXXX" 
                value={formData.taxId}
                onChange={(e) => setFormData(p => ({ ...p, taxId: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Payment Terms</label>
              <Select value={formData.paymentTerms} onValueChange={(v) => v && setFormData(p => ({ ...p, paymentTerms: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NET_15">Net 15</SelectItem>
                  <SelectItem value="NET_30">Net 30</SelectItem>
                  <SelectItem value="NET_60">Net 60</SelectItem>
                  <SelectItem value="PREPAID">Prepaid</SelectItem>
                  <SelectItem value="COD">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
