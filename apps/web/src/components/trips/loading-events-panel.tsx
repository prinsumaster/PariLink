'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/services/trips';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, PackageOpen, Truck, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { RoleGuard } from '@/components/auth/role-guard';
import { dateIN } from '@/lib/format';

interface LoadingEventsPanelProps {
  tripId: string;
}

export function LoadingEventsPanel({ tripId }: LoadingEventsPanelProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    type: 'LOAD',
    point: '',
    timeIn: '',
    timeOut: '',
    weightIn: '',
    weightOut: '',
    hamaliCost: ''
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['trips', tripId, 'loading'],
    queryFn: () => tripService.getLoadingEvents(tripId),
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => tripService.addLoadingEvent(tripId, data),
    onSuccess: () => {
      toast.success('Loading event added successfully');
      setIsAdding(false);
      setFormData({ type: 'LOAD', point: '', timeIn: '', timeOut: '', weightIn: '', weightOut: '', hamaliCost: '' });
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'loading'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add event');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.point) return toast.error('Point/Location is required');
    
    addMutation.mutate({
      type: formData.type,
      point: formData.point,
      timeIn: formData.timeIn ? new Date(formData.timeIn).toISOString() : undefined,
      timeOut: formData.timeOut ? new Date(formData.timeOut).toISOString() : undefined,
      weightIn: formData.weightIn ? parseFloat(formData.weightIn) : undefined,
      weightOut: formData.weightOut ? parseFloat(formData.weightOut) : undefined,
      hamaliCost: formData.hamaliCost ? parseFloat(formData.hamaliCost) : undefined,
    });
  };

  const checkShortage = (events: any[]) => {
    const loads = events.filter(e => e.type === 'LOAD');
    const unloads = events.filter(e => e.type === 'UNLOAD');
    
    let totalLoadNet = 0;
    loads.forEach(l => {
      const wIn = l.weightIn || 0;
      const wOut = l.weightOut || 0;
      totalLoadNet += Math.abs(wOut - wIn);
    });

    let totalUnloadNet = 0;
    unloads.forEach(u => {
      const wIn = u.weightIn || 0;
      const wOut = u.weightOut || 0;
      totalUnloadNet += Math.abs(wIn - wOut);
    });

    if (totalLoadNet > 0 && totalUnloadNet > 0) {
      const shortage = totalLoadNet - totalUnloadNet;
      if (shortage > (totalLoadNet * 0.005)) { // 0.5% tolerance
        return shortage;
      }
    }
    return null;
  };

  const shortageValue = checkShortage(events);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Truck className="h-5 w-5" /> Loading & Unloading Events
        </CardTitle>
        <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'DISPATCHER', 'OPERATIONS']}>
          <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? 'outline' : 'default'} size="sm">
            {isAdding ? 'Cancel' : 'Add Event'}
          </Button>
        </RoleGuard>
      </CardHeader>
      
      <CardContent>
        {shortageValue !== null && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-400">Weight Shortage Detected</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                A shortage of <span className="font-bold">{shortageValue.toFixed(2)} tons</span> was detected beyond the 0.5% tolerance threshold between loading and unloading points.
              </p>
            </div>
          </div>
        )}

        {isAdding && (
          <div className="mb-6 p-4 border border-slate-200 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-900/50">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="LOAD">LOAD</option>
                    <option value="UNLOAD">UNLOAD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Point / Location</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950" 
                    placeholder="e.g. Factory A"
                    value={formData.point}
                    onChange={(e) => setFormData({...formData, point: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time In</label>
                  <input 
                    type="datetime-local" 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950"
                    value={formData.timeIn}
                    onChange={(e) => setFormData({...formData, timeIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time Out</label>
                  <input 
                    type="datetime-local" 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950"
                    value={formData.timeOut}
                    onChange={(e) => setFormData({...formData, timeOut: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight In (tons)</label>
                  <input 
                    type="number" step="0.01" 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950"
                    value={formData.weightIn}
                    onChange={(e) => setFormData({...formData, weightIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight Out (tons)</label>
                  <input 
                    type="number" step="0.01" 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950"
                    value={formData.weightOut}
                    onChange={(e) => setFormData({...formData, weightOut: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hamali Cost (₹)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded bg-white dark:bg-slate-950"
                    value={formData.hamaliCost}
                    onChange={(e) => setFormData({...formData, hamaliCost: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={addMutation.isPending}>
                  {addMutation.isPending ? 'Saving...' : 'Save Event'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No loading/unloading events recorded.</div>
        ) : (
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {events?.map((event: any, _i: number) => (
              <div key={event.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {event.type === 'LOAD' ? <PackageOpen className="h-4 w-4 text-blue-500" /> : <PackageOpen className="h-4 w-4 text-green-500" />}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant="outline" className={event.type === 'LOAD' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-green-600 border-green-200 bg-green-50'}>
                        {event.type}
                      </Badge>
                      <h4 className="font-semibold mt-1 text-slate-900 dark:text-white">{event.point}</h4>
                    </div>
                    {event.timeOut && <span className="text-xs text-slate-400">{dateIN(event.timeOut)}</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-slate-600 dark:text-slate-400">
                    {event.weightIn > 0 && <div><span className="text-slate-400">Wt In:</span> {event.weightIn}t</div>}
                    {event.weightOut > 0 && <div><span className="text-slate-400">Wt Out:</span> {event.weightOut}t</div>}
                    
                    {event.hamaliCost > 0 && (
                      <div className="col-span-2 flex items-center gap-1 text-amber-600 dark:text-amber-500 mt-1">
                        <IndianRupee className="h-3 w-3" /> Hamali: {event.hamaliCost}
                      </div>
                    )}
                    
                    {event.detentionHrs > 0 && (
                      <div className="col-span-2 flex items-center gap-1 text-red-500 mt-1">
                        <Clock className="h-3 w-3" /> Detention: {event.detentionHrs} hrs (₹{event.detentionCharge})
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
