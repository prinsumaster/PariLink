'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { driverService } from '@/services/drivers';
import { Activity, ShieldCheck, Wrench, Users, Navigation } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export function DriverScorecardPanel({ driverId, overallScore }: { driverId: string, overallScore?: number }) {
  const { data: score, isLoading, isError } = useQuery({
    queryKey: ['drivers', driverId, 'score'],
    queryFn: () => driverService.getDriverScore(driverId),
    enabled: !!driverId,
  });

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Driver Scorecard</CardTitle>
          <CardDescription>Loading metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !score) {
    return (
      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle>Driver Scorecard</CardTitle>
          <CardDescription>No scorecard data available for this driver yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Scores are generated automatically when a driver completes a trip and receives all required reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    { label: 'Dispatch Performance', value: score.dispatchAvg, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: 'Workshop/Maintenance', value: score.workshopAvg, icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-500' },
    { label: 'Gate Security', value: score.securityAvg, icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500' },
    { label: 'Customer Rating', value: score.customerAvg, icon: Users, color: 'text-purple-500', bg: 'bg-purple-500' },
    { label: 'Mileage Efficiency', value: score.mileageAvg, icon: Navigation, color: 'text-green-500', bg: 'bg-green-500' },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Driver Scorecard</CardTitle>
            <CardDescription>Based on most recent trip ({score.tripId})</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {overallScore ? overallScore.toFixed(2) : ((
                (score.dispatchAvg + score.workshopAvg + score.securityAvg + score.customerAvg + score.mileageAvg) / 5
              ).toFixed(2))}
              <span className="text-sm text-slate-500 font-normal ml-1">/ 5.0</span>
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">Overall Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 mt-4">
          {metrics.map((metric, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className="text-sm font-bold">{metric.value.toFixed(1)} / 5.0</span>
              </div>
              <Progress value={(metric.value / 5) * 100} className={`h-2`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
