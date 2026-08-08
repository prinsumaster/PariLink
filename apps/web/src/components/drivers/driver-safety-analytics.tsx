'use client';

import { SafetyAnalytics } from '@/types/drivers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Zap, AlertTriangle, Coffee, Timer, Fuel } from 'lucide-react';

interface DriverSafetyAnalyticsProps {
  analytics?: SafetyAnalytics;
}

export function DriverSafetyAnalytics({ analytics }: DriverSafetyAnalyticsProps) {
  if (!analytics) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" /> Safety & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ShieldAlert className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No safety data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scoreColor = analytics.driverScore >= 80 ? 'text-green-500' : analytics.driverScore >= 60 ? 'text-orange-500' : 'text-red-500';

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" /> Safety & Performance
        </CardTitle>
        <Badge variant={
          analytics.riskRating === 'LOW' ? 'default' : 
          analytics.riskRating === 'MEDIUM' ? 'secondary' : 'destructive'
        }>
          {analytics.riskRating} RISK
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-6 border-b border-gray-100 dark:border-gray-800">
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>
              {analytics.driverScore}
            </div>
            <div className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">Driver Score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Speeding Events</div>
              <div className="text-lg font-semibold">{analytics.speedingEvents}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Harsh Braking</div>
              <div className="text-lg font-semibold">{analytics.harshBraking}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Coffee className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Fatigue Alerts</div>
              <div className="text-lg font-semibold">{analytics.fatigueAlerts}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Timer className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Idle Time</div>
              <div className="text-lg font-semibold">{analytics.idleTimeMinutes}m</div>
            </div>
          </div>
          <div className="col-span-2 flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Fuel className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Fuel Efficiency Score</div>
              <div className="text-lg font-semibold">{analytics.fuelEfficiency}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
