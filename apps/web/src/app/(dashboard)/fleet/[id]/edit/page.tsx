'use client';

import { useQuery } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { VehicleForm } from '@/components/fleet/vehicle-form';
import { RoleGuard } from '@/components/auth/role-guard';

export default function EditVehiclePage() {
  const { id } = useParams();
  
  const { data: vehicle, isLoading, isError } = useQuery({
    queryKey: ['fleet', id],
    queryFn: () => fleetService.getVehicle(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-[600px] bg-gray-200 dark:bg-slate-800 rounded"></div>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Vehicle not found</h3>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FLEET_MANAGER']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <div>
          <Link href={`/fleet/${id}`} className="inline-flex items-center text-base font-medium text-slate-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-300 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Vehicle
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit {vehicle.registrationNumber}</h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Update asset capabilities and registry details.</p>
        </div>

        <VehicleForm initialData={vehicle} isEdit={true} />
      </div>
    </RoleGuard>
  );
}
