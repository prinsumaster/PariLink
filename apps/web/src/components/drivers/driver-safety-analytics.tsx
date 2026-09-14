'use client';

import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/drivers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, Coffee, Timer, Fuel, CheckCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { dateIN } from '@/lib/format';

interface DriverSafetyAnalyticsProps {
  driverId: string;
}

export function DriverSafetyAnalytics({ driverId }: DriverSafetyAnalyticsProps) {
  const { data: scoreData, isLoading } = useQuery({
    queryKey: ['driver-score', driverId],
    queryFn: () => driverService.getDriverScore(driverId),
    enabled: !!driverId,
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scoreData || scoreData.totalScore === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No scorecard data available yet.</p>
            <p className="text-xs mt-1">Complete a trip to generate a score.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = scoreData.totalScore >= 80 ? 'text-green-500' : scoreData.totalScore >= 60 ? 'text-orange-500' : 'text-red-500';
  const TrendIcon = scoreData.trend === 'up' ? TrendingUp : scoreData.trend === 'down' ? TrendingDown : ArrowRight;
  const trendColor = scoreData.trend === 'up' ? 'text-green-500' : scoreData.trend === 'down' ? 'text-red-500' : 'text-slate-500';

  return (
    <Card className="h-full border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="h-5 w-5 text-blue-500" /> Running Scorecard
        </CardTitle>
        <Badge variant={
          scoreData.totalScore >= 80 ? 'default' : 
          scoreData.totalScore >= 60 ? 'secondary' : 'destructive'
        } className="capitalize">
          {scoreData.totalScore >= 80 ? 'Good' : scoreData.totalScore >= 60 ? 'Average' : 'Poor'} Standing
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-6xl font-extrabold ${scoreColor}`}>
                {Math.round(scoreData.totalScore)}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Overall Score</div>
            </div>
            <div className={`flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 ${trendColor}`}>
              <TrendIcon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium uppercase">{scoreData.trend}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 mb-1">Based on last {scoreData.recentTrips?.length || 0} trips</div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold">{Math.round(scoreData.onTimeAvg)}%</span>
            </div>
            <div className="text-xs font-medium text-slate-500 uppercase mt-1">On Time</div>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs font-bold">{Math.round(scoreData.podAvg)}%</span>
            </div>
            <div className="text-xs font-medium text-slate-500 uppercase mt-1">POD Upload</div>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Fuel className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-bold">{Math.round(scoreData.fuelAvg)}/100</span>
            </div>
            <div className="text-xs font-medium text-slate-500 uppercase mt-1">Fuel Eff.</div>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs font-bold">{Math.round(scoreData.damageAvg)}/100</span>
            </div>
            <div className="text-xs font-medium text-slate-500 uppercase mt-1">Damage Free</div>
          </div>
          <div className="flex flex-col gap-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Coffee className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-bold">{Math.round(scoreData.behaviourAvg)}/100</span>
            </div>
            <div className="text-xs font-medium text-slate-500 uppercase mt-1">Behaviour</div>
          </div>
        </div>

        {scoreData.recentTrips && scoreData.recentTrips.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Recent Rated Trips</h4>
            <div className="space-y-3">
              {scoreData.recentTrips.map((trip: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <div className="font-medium text-sm">Trip {trip.tripNumber}</div>
                    <div className="text-xs text-slate-500">{dateIN(trip.date)}</div>
                  </div>
                  <div className={`font-bold ${trip.score >= 80 ? 'text-green-600' : trip.score >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                    {Math.round(trip.score)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
