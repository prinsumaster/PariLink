import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/services/trips';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Fuel } from 'lucide-react';

export function FuelEntriesPanel({ tripId }: { tripId: string }) {
  const queryClient = useQueryClient();
  const [litres, setLitres] = useState('');
  const [amount, setAmount] = useState('');
  const [pump, setPump] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['trip-fuel', tripId],
    queryFn: () => tripService.getFuel(tripId)
  });

  const addFuelMutation = useMutation({
    mutationFn: (payload: any) => tripService.addFuel(tripId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-fuel', tripId] });
      toast.success('Fuel entry added');
      setLitres('');
      setAmount('');
      setPump('');
      setIsAdding(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to add fuel');
    }
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addFuelMutation.mutate({
      litres: Number(litres),
      amount: Number(amount),
      pump,
      filledAt: new Date().toISOString()
    });
  };

  const getVarianceColor = (pct: number) => {
    if (pct <= 5 && pct >= -5) return 'bg-green-100 text-green-800 border-green-200';
    if (pct > 5 && pct <= 10) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (isLoading) return <div className="animate-pulse">Loading fuel data...</div>;

  const entries = data?.entries || [];
  const totals = data?.totals || { totalLitres: 0, totalAmount: 0, overallVariancePct: null };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Fuel className="h-5 w-5 text-indigo-500" /> Fuel & Diesel
        </CardTitle>
        <Button size="sm" onClick={() => setIsAdding(!isAdding)} variant="outline">
          {isAdding ? 'Cancel' : 'Add Fill'}
        </Button>
      </CardHeader>
      
      <CardContent>
        {isAdding && (
          <form onSubmit={handleAdd} className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-medium text-sm">New Fuel Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Litres Filled</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={litres} 
                  onChange={(e) => setLitres(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Total Amount (₹)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Pump / Location</label>
                <Input 
                  value={pump} 
                  onChange={(e) => setPump(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" disabled={addFuelMutation.isPending} className="w-full md:w-auto">
              Save Entry
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Total Filled</p>
            <p className="text-2xl font-bold mt-1">{totals.totalLitres.toFixed(2)} L</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Total Cost</p>
            <p className="text-2xl font-bold mt-1">₹ {totals.totalAmount.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">Overall Variance</p>
            {totals.overallVariancePct !== null ? (
              <Badge variant="outline" className={`mt-2 text-sm px-2 py-1 ${getVarianceColor(totals.overallVariancePct)}`}>
                {totals.overallVariancePct > 0 ? '+' : ''}{totals.overallVariancePct.toFixed(1)}%
              </Badge>
            ) : (
              <p className="text-lg font-medium mt-1 text-slate-400">—</p>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No fuel entries recorded yet.</div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry: any) => (
              <div key={entry.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div>
                  <p className="font-medium">{entry.pump || 'Unknown Pump'}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(entry.filledAt).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="text-slate-500 text-xs">Actual</p>
                    <p className="font-medium">{entry.litres} L</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs">Expected</p>
                    <p className="font-medium text-slate-600">{entry.expectedLitres?.toFixed(2)} L</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs">Variance</p>
                    {entry.variancePct !== null ? (
                      <Badge variant="outline" className={`mt-1 ${getVarianceColor(entry.variancePct)}`}>
                        {entry.variancePct > 0 ? '+' : ''}{entry.variancePct.toFixed(1)}%
                      </Badge>
                    ) : (
                      <span>—</span>
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
