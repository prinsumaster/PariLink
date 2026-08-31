'use client';
import { money, num, dateIN } from '@/lib/format';

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
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, CheckCircle, Truck, FileText, Activity, Send } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';
import { StatusFlip } from '@/components/motion';
import { tripService } from '@/services/trips';
import { toast } from 'sonner';
import { TripDesksPanel } from './trip-desks-panel';
import { LoadingEventsPanel } from './loading-events-panel';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';


interface TripDetailViewProps {
  trip: Trip;
}

export function TripDetailView({ trip }: TripDetailViewProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [scoreData, setScoreData] = useState({
    onTime: true,
    podUploaded: true,
    fuelScore: 80,
    damageScore: 100,
    behaviourScore: 90
  });

  const handleDispatch = async () => {
    setIsPending(true);
    setOptimisticStatus('IN_TRANSIT');
    try {
      await tripService.updateTrip(trip.id, { status: 'IN_TRANSIT' });
      toast.success('Trip dispatched successfully');
    } catch (err) {
      setOptimisticStatus(null);
      toast.error('Failed to dispatch trip');
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = async () => {
    setIsPending(true);
    try {
      // 1. Submit driver score
      await tripService.submitDriverScore(trip.id, {
        onTime: scoreData.onTime,
        podUploaded: scoreData.podUploaded,
        fuelScore: scoreData.fuelScore,
        damageScore: scoreData.damageScore,
        behaviourScore: scoreData.behaviourScore
      });
      // 2. Close trip
      await tripService.closeTrip(trip.id);
      setOptimisticStatus('COMPLETED');
      setIsRatingModalOpen(false);
      toast.success('Trip closed and driver rated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to close trip');
    } finally {
      setIsPending(false);
    }
  };

  const currentStatus = optimisticStatus || trip.status;

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
                    <div className="text-base text-gray-900 dark:text-white font-medium">{trip.origin?.name || trip.loads?.[0]?.originCity || 'Unknown Origin'}</div>
                    <div className="text-sm text-gray-500">{trip.origin?.address || '—'}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Destination</div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">{trip.destination?.name || trip.loads?.[0]?.destinationCity || 'Unknown Destination'}</div>
                    <div className="text-sm text-gray-500">{trip.destination?.address || '—'}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Planned Schedule</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Dep: {trip.startDate ? dateIN(trip.startDate) : 'Not Set'}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      Arr: {trip.endDate ? dateIN(trip.endDate) : 'Not Set'}
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
              <StatusFlip statusKey={currentStatus}>
                <Badge className="text-sm">{currentStatus.replace('_', ' ')}</Badge>
              </StatusFlip>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">SLA</span>
              <Badge variant={trip.slaStatus === 'MET' ? 'default' : 'destructive'} className="text-sm">
                {(trip.slaStatus || 'UNKNOWN').replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Est. Distance</span>
              <span className="text-sm font-medium">{trip.estimatedDistance || 0} km</span>
            </div>
            {(currentStatus === 'PLANNED' || currentStatus === 'DRAFT') && (
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleDispatch} disabled={isPending}>
                <Send className="mr-2 h-4 w-4" /> Dispatch Trip
              </Button>
            )}
            {currentStatus === 'IN_TRANSIT' && (
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => setIsRatingModalOpen(true)}
                disabled={isPending}
                title="All desks must be DONE to close the trip"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Close Trip
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Rating Modal */}
        <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Driver & Close Trip</DialogTitle>
              <DialogDescription>
                Provide a quick rating for the driver to build their scorecard before closing the trip.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <Label className="flex flex-col">
                  <span>On-time Delivery</span>
                  <span className="font-normal text-xs text-slate-500">Delivered within SLA window</span>
                </Label>
                <Switch 
                  checked={scoreData.onTime} 
                  onCheckedChange={(c) => setScoreData(prev => ({...prev, onTime: c}))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="flex flex-col">
                  <span>POD Uploaded</span>
                  <span className="font-normal text-xs text-slate-500">Clean POD uploaded promptly</span>
                </Label>
                <Switch 
                  checked={scoreData.podUploaded} 
                  onCheckedChange={(c) => setScoreData(prev => ({...prev, podUploaded: c}))} 
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Fuel Efficiency</Label>
                  <span className="text-sm font-medium">{scoreData.fuelScore}/100</span>
                </div>
                <input 
                  type="range"
                  value={scoreData.fuelScore}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData(prev => ({...prev, fuelScore: Number(e.target.value)}))} 
                  min={0} max={100} step={5}
                  className="w-full accent-blue-600"
                />
                <p className="text-xs text-slate-500">Based on expected vs actual consumption.</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Cargo Safety / No Damage</Label>
                  <span className="text-sm font-medium">{scoreData.damageScore}/100</span>
                </div>
                <input 
                  type="range"
                  value={scoreData.damageScore}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData(prev => ({...prev, damageScore: Number(e.target.value)}))} 
                  min={0} max={100} step={5} 
                  className="w-full accent-blue-600"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Driver Behaviour</Label>
                  <span className="text-sm font-medium">{scoreData.behaviourScore}/100</span>
                </div>
                <input 
                  type="range"
                  value={scoreData.behaviourScore}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScoreData(prev => ({...prev, behaviourScore: Number(e.target.value)}))} 
                  min={0} max={100} step={5} 
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRatingModalOpen(false)}>Cancel</Button>
              <Button onClick={handleClose} disabled={isPending}>
                Submit & Close Trip
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TripDesksPanel tripId={trip.id} />
        <LoadingEventsPanel tripId={trip.id} />

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
                <p className="text-xs text-gray-500">{dateIN(trip.createdAt)}</p>
              </div>
              {currentStatus !== 'DRAFT' && currentStatus !== 'PLANNED' && (
                <div className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Dispatched</p>
                  <p className="text-xs text-gray-500">{trip.startDate ? dateIN(trip.startDate) : 'Just now'}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
