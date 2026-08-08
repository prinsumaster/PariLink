'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCreateDriver } from '@/hooks';
import { z } from 'zod';

const driverSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  licenseNumber: z.string().optional(),
  licenseState: z.string().optional(),
});

export default function NewDriverPage() {
  const router = useRouter();
  const { mutate: createDriver, isPending: saving } = useCreateDriver();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseState: '',
  });

  const handleSave = () => {
    const result = driverSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    const payload = { ...result.data };
    if (payload.email === '') delete payload.email;
    
    createDriver(payload, {
      onSuccess: () => {
        toast.success('Driver added successfully.');
        router.push('/drivers');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Failed to add driver');
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Driver</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Register a driver into the roster</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Driver'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">First Name</label>
              <Input 
                name="firstName"
                placeholder="John" 
                value={formData.firstName}
                onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last Name</label>
              <Input 
                name="lastName"
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                name="phone"
                placeholder="+1 234 567 8900" 
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input 
                name="email"
                type="email"
                placeholder="driver@parilink.com" 
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> License Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">License Number</label>
              <Input 
                name="licenseNumber"
                placeholder="CDL-1234567" 
                value={formData.licenseNumber}
                onChange={(e) => setFormData(p => ({ ...p, licenseNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">State</label>
              <Input 
                name="licenseState"
                placeholder="TX" 
                value={formData.licenseState}
                onChange={(e) => setFormData(p => ({ ...p, licenseState: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
