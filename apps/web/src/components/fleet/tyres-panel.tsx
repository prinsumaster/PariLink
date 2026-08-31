import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Circle, Plus, Trash2 } from 'lucide-react';

export function TyresPanel({ vehicleId }: { vehicleId: string }) {
  const queryClient = useQueryClient();
  const [isFitting, setIsFitting] = useState(false);
  const [position, setPosition] = useState('Front-Left');
  const [serialNo, setSerialNo] = useState('');
  const [brand, setBrand] = useState('');
  const [fittedAtKm, setFittedAtKm] = useState('');
  const [cost, setCost] = useState('');

  // Mocking currentKm for demonstration as requested
  const [currentKmInput, setCurrentKmInput] = useState('');
  const [appliedCurrentKm, setAppliedCurrentKm] = useState<number | undefined>(undefined);

  const { data: tyres, isLoading } = useQuery({
    queryKey: ['vehicle-tyres', vehicleId, appliedCurrentKm],
    queryFn: () => fleetService.getTyres(vehicleId, appliedCurrentKm)
  });

  const fitTyreMutation = useMutation({
    mutationFn: (payload: any) => fleetService.fitTyre(vehicleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-tyres', vehicleId] });
      toast.success('Tyre fitted');
      setIsFitting(false);
      setSerialNo('');
      setBrand('');
      setCost('');
      setFittedAtKm('');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to fit tyre');
    }
  });

  const removeTyreMutation = useMutation({
    mutationFn: (tyreId: string) => fleetService.removeTyre(tyreId, { removedAtKm: appliedCurrentKm || Number(fittedAtKm) + 5000 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-tyres', vehicleId] });
      toast.success('Tyre removed');
    }
  });

  const handleFit = (e: React.FormEvent) => {
    e.preventDefault();
    fitTyreMutation.mutate({
      position,
      serialNo,
      brand,
      fittedAtKm: Number(fittedAtKm),
      cost: Number(cost),
      expectedLifeKm: 100000
    });
  };

  const applyKm = () => {
    setAppliedCurrentKm(Number(currentKmInput));
  };

  if (isLoading) return <div className="animate-pulse">Loading tyres...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Circle className="h-5 w-5 text-indigo-500" /> Tyre Management
        </CardTitle>
        <Button size="sm" onClick={() => setIsFitting(!isFitting)} variant="outline">
          {isFitting ? 'Cancel' : 'Fit Tyre'}
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6 flex items-end gap-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex-1 max-w-xs">
            <label className="text-xs text-slate-500 mb-1 block">Simulate Current Odometer (Km)</label>
            <Input 
              type="number" 
              placeholder="e.g. 150000" 
              value={currentKmInput} 
              onChange={(e) => setCurrentKmInput(e.target.value)} 
            />
          </div>
          <Button onClick={applyKm} size="sm" variant="secondary">Apply to calculate Cost/Km</Button>
        </div>

        {isFitting && (
          <form onSubmit={handleFit} className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-medium text-sm">Fit New Tyre</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Position</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:focus-visible:ring-slate-300"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                >
                  <option>Front-Left</option>
                  <option>Front-Right</option>
                  <option>Rear-Left-Outer</option>
                  <option>Rear-Left-Inner</option>
                  <option>Rear-Right-Outer</option>
                  <option>Rear-Right-Inner</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Serial No</label>
                <Input value={serialNo} onChange={(e) => setSerialNo(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Brand</label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Fitted At Odometer (Km)</label>
                <Input type="number" value={fittedAtKm} onChange={(e) => setFittedAtKm(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Tyre Cost (₹)</label>
                <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" disabled={fitTyreMutation.isPending}>
              Save Fitment
            </Button>
          </form>
        )}

        {!tyres || tyres.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No active tyres.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tyres.map((tyre: any) => (
              <div key={tyre.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 relative hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 h-8 w-8"
                  onClick={() => removeTyreMutation.mutate(tyre.id)}
                  title="Remove Tyre"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    <Circle className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{tyre.position}</h4>
                    <p className="text-xs text-slate-500">{tyre.brand} | SN: {tyre.serialNo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <p className="text-slate-500 text-xs">Life Used</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${tyre.lifeUsedPct > 80 ? 'bg-red-500' : tyre.lifeUsedPct > 50 ? 'bg-amber-500' : 'bg-green-500'}`} 
                          style={{ width: `${Math.min(100, Math.max(0, tyre.lifeUsedPct))}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{tyre.lifeUsedPct}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Current Cost / Km</p>
                    <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mt-0.5">
                      ₹ {tyre.costPerKm.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Fitted At</p>
                    <p className="font-medium mt-0.5">{tyre.fittedAtKm} Km</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Purchase Cost</p>
                    <p className="font-medium mt-0.5">₹ {tyre.cost}</p>
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
