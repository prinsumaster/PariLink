'use client';

import { useQuery } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { VehicleDetailView } from '@/components/fleet/vehicle-detail-view';
import { MileageTrendPanel } from '@/components/fleet/mileage-trend-panel';
import { WorkshopPanel } from '@/components/fleet/workshop-panel';
import { TyresPanel } from '@/components/fleet/tyres-panel';
import { RoleGuard } from '@/components/auth/role-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function VehicleDetailPage() {
  const { id } = useParams();
  
  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['fleet', id],
    queryFn: () => fleetService.getVehicle(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[600px] bg-gray-200 dark:bg-slate-800 rounded"></div>
          <div className="h-[400px] bg-gray-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Vehicle not found</h3>
        <p className="mt-1 text-base font-medium text-slate-500">The asset you are looking for does not exist or you don't have access.</p>
        <div className="mt-6">
          <Link href="/fleet" className="text-blue-600 hover:text-blue-500">
            &larr; Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FLEET_MANAGER', 'DISPATCHER', 'OPERATIONS', 'VIEWER']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
        <div>
          <Link href="/fleet" className="inline-flex items-center text-base font-medium text-slate-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-300 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Fleet
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Vehicle Overview
            </h1>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workshop">Workshop & Jobs</TabsTrigger>
            <TabsTrigger value="tyres">Tyres</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-0">
            <VehicleDetailView vehicle={vehicle} />
            <MileageTrendPanel vehicleId={id as string} />
          </TabsContent>

          <TabsContent value="workshop" className="mt-0">
            <WorkshopPanel vehicleId={id as string} />
          </TabsContent>

          <TabsContent value="tyres" className="mt-0">
            <TyresPanel vehicleId={id as string} />
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}
