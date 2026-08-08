'use client';

import { useQuery } from '@tanstack/react-query';
import { wmsService } from '@/services/wms';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { WarehouseForm } from '@/components/wms/warehouse-form';
import { RoleGuard } from '@/components/auth/role-guard';

export default function EditWarehousePage() {
  const { id } = useParams();
  
  const { data: warehouse, isLoading, isError } = useQuery({
    queryKey: ['wms', id],
    queryFn: () => wmsService.getWarehouse(id as string),
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

  if (isError || !warehouse) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Facility not found</h3>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        <div>
          <Link href={`/wms/${id}`} className="inline-flex items-center text-base font-medium text-slate-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-gray-300 mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Facility
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Edit {warehouse.code}</h1>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Update capacity, layout zones, and operational status.</p>
        </div>

        <WarehouseForm initialData={warehouse} isEdit={true} />
      </div>
    </RoleGuard>
  );
}
