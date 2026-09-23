'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function NewTyreLogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tyreId: '',
    vehicleId: '',
    action: 'INSPECTION',
    treadDepthMm: '',
    cost: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tyreId || !formData.vehicleId) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        treadDepthMm: formData.treadDepthMm ? Number(formData.treadDepthMm) : undefined,
        cost: formData.cost ? Number(formData.cost) : undefined,
      };
      await api.post('/workshop/tyre-logs', payload);
      toast.success('Tyre Log created successfully');
      router.push('/workshop');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create tyre log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6 animate-in fade-in">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workshop
      </Button>

      <h1 className="text-3xl font-bold">Add Tyre Log</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tyre Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tyreId">Tyre ID (UUID) <span className="text-red-500">*</span></Label>
              <Input 
                id="tyreId" 
                value={formData.tyreId}
                onChange={e => setFormData({ ...formData, tyreId: e.target.value })}
                placeholder="e.g. 58387ba9-e9e2-4cbe-8dad-17ed42bd6cd0"
                required
              />
            </div>

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
              <Label htmlFor="action">Action</Label>
              <Select value={formData.action} onValueChange={(v) => setFormData({ ...formData, action: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSPECTION">Inspection</SelectItem>
                  <SelectItem value="ROTATION">Rotation</SelectItem>
                  <SelectItem value="REPLACEMENT">Replacement</SelectItem>
                  <SelectItem value="REPAIR">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="treadDepthMm">Tread Depth (mm)</Label>
                <Input 
                  id="treadDepthMm" 
                  type="number"
                  step="0.1"
                  value={formData.treadDepthMm}
                  onChange={e => setFormData({ ...formData, treadDepthMm: e.target.value })}
                  placeholder="e.g. 6.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (₹)</Label>
                <Input 
                  id="cost" 
                  type="number"
                  value={formData.cost}
                  onChange={e => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="e.g. 1500"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
              <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Add Tyre Log'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
