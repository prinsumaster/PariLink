'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Milestone, IndianRupee, Route, Search } from 'lucide-react';
import { toast } from 'sonner';

interface TollEstimate {
  originCity: string;
  destinationCity: string;
  fastagCost: number;
  cashCost: number;
  distanceKm: number;
}

async function fetchTollEstimate(
  originCity: string,
  destinationCity: string
): Promise<TollEstimate> {
  const res = await api.get('/routes/toll-estimate', {
    params: { originCity, destinationCity },
  });
  return res.data;
}

export default function RouteTollPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [query, setQuery] = useState<{ origin: string; destination: string } | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['toll-estimate', query?.origin, query?.destination],
    queryFn: () => fetchTollEstimate(query!.origin, query!.destination),
    enabled: !!query,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      toast.error('Enter both origin and destination city');
      return;
    }
    setQuery({ origin: origin.trim(), destination: destination.trim() });
  };

  // Assumption: FASTag integration is NOT live. This UI reads from the static
  // RouteTollRate seed table seeded per tenant. No real NHAI/FASTag API call is made.
  // If a route is not in the seed table, the API returns 404 — shown explicitly below.

  const errorMessage =
    (error as any)?.normalizedMessage ||
    (error as any)?.response?.data?.message ||
    'No toll data found for this route.';

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <PageHeader
        title="Route Toll Estimator"
        description="FASTag toll cost lookup against the seeded rate table. No live NHAI API — routes not in the seed table return an explicit error."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Route className="h-4 w-4 text-primary" />
            Select Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="origin">Origin City</Label>
                <Input
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Delhi"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="destination">Destination City</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Agra"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} id="btn-lookup-toll">
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? 'Looking up...' : 'Look Up Toll Cost'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error — explicit, never silent zero */}
      {isError && query && (
        <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Route data unavailable
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  {errorMessage}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  This route is not in the seeded toll-rate table. It must be added before
                  this lookup will work. Toll cost is <strong>not</strong> defaulted to ₹0.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {data && !isError && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Milestone className="h-4 w-4 text-primary" />
                {data.originCity} → {data.destinationCity}
              </span>
              <Badge variant="outline">{data.distanceKm} km</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div
                id="toll-fastag-cost"
                className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 p-4 text-center"
              >
                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
                  FASTag Cost
                </div>
                <div className="text-3xl font-black text-emerald-700 flex items-center justify-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {data.fastagCost.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-500 mt-1">~5% discount vs cash</div>
              </div>

              <div
                id="toll-cash-cost"
                className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 p-4 text-center"
              >
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Cash Cost
                </div>
                <div className="text-3xl font-black text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1">
                  <IndianRupee className="h-5 w-5" />
                  {data.cashCost.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 mt-1">at toll plazas</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Source: seeded static rate table. FASTag live integration is not yet active.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
