import { useQuery } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

export function MileageTrendPanel({ vehicleId }: { vehicleId: string }) {
  const { data: trend, isLoading } = useQuery({
    queryKey: ['vehicle-mileage', vehicleId],
    queryFn: () => fleetService.getMileageTrend(vehicleId)
  });

  if (isLoading) return <div className="animate-pulse">Loading mileage trend...</div>;

  if (!trend || trend.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" /> Mileage Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-500 text-sm">No fuel data available to calculate mileage.</div>
        </CardContent>
      </Card>
    );
  }

  const latest = trend[trend.length - 1];
  const isGood = latest.actualKmpl >= latest.expectedKmpl * 0.95;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" /> Mileage Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-6">
          <div>
            <p className="text-sm text-slate-500">Current Mileage (Km/L)</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              {latest.actualKmpl.toFixed(1)}
              {isGood ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
            </p>
          </div>
          <div>
            <Badge variant="outline" className={isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
              Expected: {latest.expectedKmpl.toFixed(1)} Km/L
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Recent Trips</p>
          {trend.slice(-3).reverse().map((t: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium">{new Date(t.date).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500 mt-1">Variance: {t.variancePct > 0 ? '+' : ''}{t.variancePct?.toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{t.actualKmpl.toFixed(1)} <span className="text-xs font-normal text-slate-500">Km/L</span></p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
