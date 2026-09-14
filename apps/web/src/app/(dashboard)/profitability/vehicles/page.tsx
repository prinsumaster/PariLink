'use client';

import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/finance';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function VehicleProfitabilityPage() {
  // @ts-ignore: reserved
  const _router = useRouter();

  const { data: trucks, isLoading } = useQuery({
    queryKey: ['profitability-vehicles'],
    queryFn: () => financeService.listVehiclePnl()
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading P&L...</div>;

  return (
    <RoleGuard allowedRoles={['ORG_ADMIN', 'FINANCE']}>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Per-Truck Profitability</h1>
            <p className="text-sm text-slate-500 mt-1">Total Cost of Ownership (TCO) ranked by Net Profit</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
        </div>

        <div className="grid gap-4">
          {!trucks || trucks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-slate-500">
                No profitability data available. Wait for nightly aggregation or trigger manually.
              </CardContent>
            </Card>
          ) : (
            trucks.map((truck: any, index: number) => {
              const isProfitable = truck.netProfit >= 0;
              return (
                <Card key={truck.vehicle.id} className="overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                  <div className="flex flex-col md:flex-row">
                    
                    {/* Left: Summary */}
                    <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                          <h3 className="text-lg font-bold">{truck.vehicle.licensePlate}</h3>
                          <Badge variant={isProfitable ? 'default' : 'destructive'} className={isProfitable ? 'bg-emerald-500' : ''}>
                            {isProfitable ? 'PROFIT' : 'LOSS'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{truck.vehicle.type}</p>
                      </div>

                      <div className="mt-6">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Net Profit</p>
                        <div className="flex items-end gap-3">
                          <span className={`text-3xl font-bold ${isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            ₹ {Math.abs(truck.netProfit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </span>
                          {isProfitable ? (
                            <TrendingUp className="h-6 w-6 text-emerald-500 mb-1" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-500 mb-1" />
                          )}
                        </div>
                        
                        <div className="flex gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-slate-500">Margin:</span>
                            <span className={`ml-1 font-medium ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
                              {truck.marginPct.toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Yield:</span>
                            <span className="ml-1 font-medium">₹ {truck.profitPerKm.toFixed(2)}/km</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Link href={`/fleet/${truck.vehicle.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Truck Details
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Breakdown */}
                    <div className="p-6 md:w-2/3">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" /> Revenue & Cost Breakdown
                      </h4>

                      <div className="space-y-4">
                        {/* Revenue */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Total Revenue</span>
                            <span className="font-bold text-emerald-600">₹ {truck.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Diesel Cost</p>
                            <p className="font-medium text-sm text-amber-600">₹ {truck.fuelCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{((truck.fuelCost / (truck.revenue || 1)) * 100).toFixed(1)}% of rev</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Workshop / Tyres</p>
                            <p className="font-medium text-sm text-red-500">₹ {truck.maintCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{((truck.maintCost / (truck.revenue || 1)) * 100).toFixed(1)}% of rev</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Tolls & FASTag</p>
                            <p className="font-medium text-sm text-orange-500">₹ {truck.tollCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{((truck.tollCost / (truck.revenue || 1)) * 100).toFixed(1)}% of rev</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Driver & Other</p>
                            <p className="font-medium text-sm text-indigo-500">₹ {(truck.driverCost + truck.otherCost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{(((truck.driverCost + truck.otherCost) / (truck.revenue || 1)) * 100).toFixed(1)}% of rev</p>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
