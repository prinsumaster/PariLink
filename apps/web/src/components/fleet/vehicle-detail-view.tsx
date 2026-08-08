'use client';

import { Vehicle } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Activity, Battery, MapPin, Gauge } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';
import { MaintenanceTimeline } from './maintenance-timeline';
import { DocumentManager } from './document-manager';
import { FleetMap } from './fleet-map';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
}

export function VehicleDetailView({ vehicle }: VehicleDetailViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Top Row / Left Column: Vehicle Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-2xl font-bold uppercase">{vehicle.registrationNumber || 'N/A'}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">{vehicle.make} {vehicle.model} • {vehicle.year}</div>
            </div>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS']}>
              <Link href={`/fleet/${vehicle.id}/edit`}>
                <Button variant="outline">Edit Asset</Button>
              </Link>
            </RoleGuard>
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex gap-2">
              <Badge variant={vehicle.status === 'OUT_OF_SERVICE' ? 'destructive' : 'default'} className="text-sm">
                {(vehicle.status || '').replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="text-sm capitalize">
                {(vehicle.type || '').toLowerCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1"><Gauge className="h-4 w-4"/> Odometer</div>
                <div className="text-lg font-semibold">{vehicle.odometer?.toLocaleString() ?? '0'} mi</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1"><Activity className="h-4 w-4"/> Engine Hrs</div>
                <div className="text-lg font-semibold">{vehicle.engineHours?.toLocaleString() ?? '0'}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1"><Battery className="h-4 w-4"/> Fuel/Bat</div>
                <div className="text-lg font-semibold">{vehicle.fuelLevel ?? 0}%</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1"><Truck className="h-4 w-4"/> Capacity</div>
                <div className="text-lg font-semibold">{(vehicle.capacity || 0).toLocaleString()} kg</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Location Map */}
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          {vehicle.location ? (
            <FleetMap vehicles={[vehicle]} isLoading={false} />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500">
              <MapPin className="h-8 w-8 mb-2 text-gray-400" />
              <p>No location data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Status */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Telemetry Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">GPS Signal</span>
              <Badge variant={vehicle.gpsStatus === 'ONLINE' ? 'default' : 'destructive'}>
                {vehicle.gpsStatus}
              </Badge>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">Battery Health</span>
              <Badge variant={vehicle.batteryStatus === 'CRITICAL' ? 'destructive' : vehicle.batteryStatus === 'WARNING' ? 'secondary' : 'outline'}>
                {vehicle.batteryStatus}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Ping</span>
              <span className="text-sm font-medium">
                {vehicle.location?.lastUpdated ? new Date(vehicle.location.lastUpdated).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        <DocumentManager documents={vehicle.documents || []} />
      </div>

      {/* Bottom Row: Maintenance */}
      <div className="lg:col-span-3">
        <MaintenanceTimeline records={vehicle.maintenanceHistory || []} />
      </div>

    </div>
  );
}
