'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { RoleGuard } from '@/components/auth/role-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Activity, Truck, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export default function ProfitabilityPage() {
  const [page, _setPage] = useState(1);
  const limit = 20;

  const { data: summary, isError: isSummaryError, isLoading: isLoadingSummary } = useQuery<any>({
    queryKey: ['profitability-summary'],
    queryFn: async () => {
      const res = await api.get('/profitability/summary');
      return res.data;
    },
  });

  const { data: tripsData, isError: isTripsError, isLoading: isLoadingTrips } = useQuery<any>({
    queryKey: ['profitability-trips', page],
    queryFn: async () => {
      const res = await api.get(`/profitability/trips?page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (isSummaryError) toast.error('Failed to load profitability summary');
  }, [isSummaryError]);

  useEffect(() => {
    if (isTripsError) toast.error('Failed to load trips profitability');
  }, [isTripsError]);

  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedTripId(expandedTripId === id ? null : id);
  };

  return (
    <RoleGuard requiredPermissions={['finance:read']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profitability</h1>
          <p className="text-muted-foreground">
            Analyze trip-level profitability and fleet financial performance.
          </p>
        </div>

        {/* Summary Strip */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-tabular-nums">
                {isLoadingSummary ? '...' : formatCurrency(summary?.totalRevenue || 0, 'INR')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-tabular-nums text-red-500">
                {isLoadingSummary ? '...' : formatCurrency(summary?.totalCost || 0, 'INR')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold font-tabular-nums ${(summary?.totalProfit ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {isLoadingSummary ? '...' : formatCurrency(summary?.totalProfit || 0, 'INR')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-tabular-nums">
                {isLoadingSummary ? '...' : `${summary?.avgMarginPct || 0}%`}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best / Worst Lane</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {isLoadingSummary ? '...' : (
                  <>
                    <div className="text-green-500">{summary?.bestLane?.lane || 'N/A'}</div>
                    <div className="text-red-500 mt-1">{summary?.worstLane?.lane || 'N/A'}</div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Profitability</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip No</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTrips ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading trips...</TableCell>
                  </TableRow>
                ) : Array.isArray(tripsData?.data) && tripsData.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No trips found.</TableCell>
                  </TableRow>
                ) : (
                  Array.isArray(tripsData?.data) && tripsData.data.map((row: any) => (
                    <React.Fragment key={row.trip.id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleRow(row.trip.id)}
                      >
                        <TableCell className="font-medium">{row.trip.number}</TableCell>
                        <TableCell>{row.from && row.to ? `${row.from} → ${row.to}` : 'N/A'}</TableCell>
                        <TableCell>{row.trip.status}</TableCell>
                        <TableCell className="text-right font-tabular-nums">{formatCurrency(row.revenue, 'INR')}</TableCell>
                        <TableCell className="text-right font-tabular-nums text-red-500">{formatCurrency(row.totalCost, 'INR')}</TableCell>
                        <TableCell className={`text-right font-tabular-nums font-bold ${row.profitable ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(row.profit, 'INR')}
                        </TableCell>
                        <TableCell className="text-right font-tabular-nums">{row.marginPct}%</TableCell>
                      </TableRow>
                      {expandedTripId === row.trip.id && (
                        <TableRow className="bg-muted/20">
                          <TableCell colSpan={7}>
                            <div className="p-4 grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground mb-1">Fuel Costs</p>
                                <p className="font-medium font-tabular-nums">{formatCurrency(row.fuel, 'INR')}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Toll Costs</p>
                                <p className="font-medium font-tabular-nums">{formatCurrency(row.toll, 'INR')}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Other/Bhatta</p>
                                <p className="font-medium font-tabular-nums">{formatCurrency(row.bhattaOther, 'INR')}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Total Cost</p>
                                <p className="font-medium font-tabular-nums text-red-500">{formatCurrency(row.totalCost, 'INR')}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
