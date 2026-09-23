'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function NewJobCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    workshopId: '',
    issueReported: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.workshopId || !formData.issueReported) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/workshop/job-cards', formData);
      toast.success('Job Card created successfully');
      router.push(`/workshop/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create job card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 animate-in fade-in">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workshop
      </Button>

      <h1 className="text-3xl font-bold">New Job Card</h1>

      <Card>
        <CardHeader>
          <CardTitle>Job Card Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle ID (UUID) <span className="text-red-500">*</span></Label>
              <Input 
                id="vehicleId" 
                value={formData.vehicleId}
                onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                placeholder="e.g. 4ecd29b4-555d-40f7-8354-dca33b593173"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workshopId">Workshop ID (UUID) <span className="text-red-500">*</span></Label>
              <Input 
                id="workshopId" 
                value={formData.workshopId}
                onChange={e => setFormData({ ...formData, workshopId: e.target.value })}
                placeholder="e.g. 3804A3BA-93C0-4255-B538-9211BF74A4A9"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issueReported">Issue Reported <span className="text-red-500">*</span></Label>
              <Input 
                id="issueReported" 
                value={formData.issueReported}
                onChange={e => setFormData({ ...formData, issueReported: e.target.value })}
                placeholder="e.g. Brake pads worn out"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Create Job Card'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
