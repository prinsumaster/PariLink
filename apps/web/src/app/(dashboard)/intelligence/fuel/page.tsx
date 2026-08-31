'use client';

import { useQuery } from '@tanstack/react-query';
import { intelligenceService } from '@/services/intelligence';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Truck, User, Map, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function FuelIntelligencePage() {
  const { data: anomalies, isLoading } = useQuery({
    queryKey: ['fuel-anomalies'],
    queryFn: intelligenceService.getFuelAnomalies,
  });

  if (isLoading) {
    return <div className="p-8 animate-pulse space-y-4">
      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
      <div className="h-32 bg-slate-200 rounded w-full"></div>
    </div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-blue-600" />
          Fuel Intelligence
        </h1>
        <p className="text-slate-500 mt-2">AI-driven anomaly detection for fuel theft and mechanical issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {anomalies?.map((anomaly, idx) => (
          <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-50">
              <div className="flex justify-between items-start">
                <Badge variant={anomaly.severity === 'HIGH' ? 'destructive' : 'secondary'} className="mb-2">
                  {anomaly.cause}
                </Badge>
                <div className="text-right">
                  <div className="text-2xl font-black text-red-600">+{anomaly.variancePct}%</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Variance</div>
                </div>
              </div>
              <CardTitle className="text-lg flex items-center gap-2">
                {anomaly.entityType === 'TRUCK' && <Truck className="h-5 w-5 text-slate-400" />}
                {anomaly.entityType === 'DRIVER' && <User className="h-5 w-5 text-slate-400" />}
                {anomaly.entityType === 'TRIP' && <Map className="h-5 w-5 text-slate-400" />}
                {anomaly.entityName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {anomaly.description}
              </p>
              
              <Link href={
                anomaly.entityType === 'TRUCK' ? `/vehicles/${anomaly.entityId}` :
                anomaly.entityType === 'DRIVER' ? `/drivers/${anomaly.entityId}` :
                `/trips/${anomaly.entityId}`
              } className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mt-4 group">
                Investigate <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ))}

        {anomalies?.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <AlertTriangle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No Anomalies Detected</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">Fuel consumption looks normal across the fleet for recent trips.</p>
          </div>
        )}
      </div>
    </div>
  );
}
