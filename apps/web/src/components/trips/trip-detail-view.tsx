'use client';

import { Trip } from '@/types/trips';
import dynamic from 'next/dynamic';
import { MapPin as MapPinIcon } from 'lucide-react';

const TripMap = dynamic(() => import('./trip-map').then(mod => mod.TripMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
      <div className="text-slate-500 animate-pulse flex items-center gap-2">
        <MapPinIcon className="h-5 w-5" /> Loading Route Map...
      </div>
    </div>
  )
});
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, CheckCircle, Truck, FileText, Activity } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';

interface TripDetailViewProps {
  trip: Trip;
}

export function TripDetailView({ trip }: TripDetailViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Trip Information</CardTitle>
              <div className="text-sm text-gray-500 mt-1">ID: {trip.id}</div>
            </div>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'DISPATCHER']}>
              <Link href={`/trips/${trip.id}/edit`}>
                <Button variant="outline">Edit Trip</Button>
              </Link>
            </RoleGuard>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Origin</div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">{trip.origin.name}</div>
                    <div className="text-sm text-gray-500">{trip.origin.address}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Destination</div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">{trip.destination.name}</div>
                    <div className="text-sm text-gray-500">{trip.destination.address}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Planned Schedule</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Dep: {new Date(trip.plannedDeparture).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Arr: {new Date(trip.plannedArrival).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Assignments</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Driver: {trip.driverId || 'Unassigned'}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Vehicle: {trip.vehicleId || 'Unassigned'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="h-[400px]">
          <TripMap trip={trip} />
        </div>
      </div>

      {/* Right Column: Status & Timeline */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">Current Status</span>
              <Badge className="text-sm">{trip.status.replace('_', ' ')}</Badge>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">SLA</span>
              <Badge variant={trip.slaStatus === 'MET' ? 'default' : 'destructive'} className="text-sm">
                {trip.slaStatus.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Est. Distance</span>
              <span className="text-sm font-medium">{trip.distance} miles</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 space-y-6">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Trip Created</p>
                <p className="text-xs text-gray-500">{new Date(trip.createdAt).toLocaleString()}</p>
              </div>
              {trip.status !== 'DRAFT' && trip.status !== 'PLANNED' && (
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dispatched</p>
                  <p className="text-xs text-gray-500">{trip.actualDeparture ? new Date(trip.actualDeparture).toLocaleString() : 'Pending'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
