'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { wmsService } from '@/services/wms';
import { Warehouse } from '@/types/wms';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
  country: z.string().min(1, 'Country is required'),
});

const warehouseFormSchema = z.object({
  code: z.string().min(3, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['DISTRIBUTION_CENTER', 'FULFILLMENT_CENTER', 'CROSS_DOCK', 'COLD_STORAGE', 'BONDED']),
  managerName: z.string().min(1, 'Manager Name required'),
  managerPhone: z.string().min(10, 'Valid phone required'),
  managerEmail: z.string().email('Invalid email'),
  operatingHours: z.string().min(1, 'Operating hours required'),
  address: addressSchema,
  capacity: z.object({
    totalPallets: z.number().min(0),
    totalSquareFeet: z.number().min(0)
  }),
  zones: z.array(z.object({
    name: z.string().min(1, 'Zone name required'),
    type: z.enum(['RACK', 'FLOOR', 'COLD', 'HAZMAT']),
    capacity: z.number().min(0)
  })).min(1, 'At least one zone is required')
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

interface WarehouseFormProps {
  initialData?: Warehouse;
  isEdit?: boolean;
}

export function WarehouseForm({ initialData, isEdit }: WarehouseFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: initialData ? {
      code: initialData.code,
      name: initialData.name,
      type: initialData.type,
      managerName: initialData.managerName,
      managerPhone: initialData.managerPhone,
      managerEmail: initialData.managerEmail,
      operatingHours: initialData.operatingHours,
      address: initialData.address,
      capacity: {
        totalPallets: initialData.capacity.totalPallets,
        totalSquareFeet: initialData.capacity.totalSquareFeet,
      },
      zones: initialData.zones,
    } : {
      type: 'DISTRIBUTION_CENTER',
      capacity: { totalPallets: 1000, totalSquareFeet: 50000 },
      zones: [{ name: 'Zone A', type: 'RACK', capacity: 1000 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "zones"
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // Auto-calculate available capacity (assuming 0 load for new)
      const payload = {
        ...data,
        capacity: {
          ...data.capacity,
          availablePallets: initialData ? initialData.capacity.availablePallets : data.capacity.totalPallets,
          utilizationPercentage: initialData ? initialData.capacity.utilizationPercentage : 0
        },
        zones: data.zones.map((z: any, i: number) => ({
          ...z,
          currentLoad: initialData && initialData.zones[i] ? initialData.zones[i].currentLoad : 0
        }))
      };

      if (isEdit && initialData) {
        return wmsService.updateWarehouse(initialData.id, payload);
      }
      const submissionData = {
        ...data,
        zones: data.zones.map((z: any) => ({ ...z, id: '' }))
      };
      return wmsService.createWarehouse(submissionData as any);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Facility updated' : 'Facility created successfully');
      queryClient.invalidateQueries({ queryKey: ['wms'] });
      router.push(`/wms/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.normalizedMessage || 'Failed to save facility');
    }
  });

  const onSubmit = (data: WarehouseFormValues) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Facility Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Facility Code</Label>
            <Input {...register('code')} className="font-mono uppercase" placeholder="WH-XYZ-01" />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Facility Name</Label>
            <Input {...register('name')} />
          </div>
          <div className="space-y-2">
            <Label>Facility Type</Label>
            // eslint-disable-next-line react-hooks/incompatible-library
            <Select value={watch('type')} onValueChange={(v: any) => setValue('type', v, { shouldDirty: true })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DISTRIBUTION_CENTER">Distribution Center</SelectItem>
                <SelectItem value="FULFILLMENT_CENTER">Fulfillment Center</SelectItem>
                <SelectItem value="CROSS_DOCK">Cross Dock</SelectItem>
                <SelectItem value="COLD_STORAGE">Cold Storage</SelectItem>
                <SelectItem value="BONDED">Bonded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Operating Hours</Label>
            <Input {...register('operatingHours')} placeholder="e.g. 24/7 or 08:00 - 18:00" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Location Address</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input {...register('address.street')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input {...register('address.city')} /></div>
              <div className="space-y-2"><Label>State</Label><Input {...register('address.state')} /></div>
              <div className="space-y-2"><Label>ZIP Code</Label><Input {...register('address.postalCode')} /></div>
              <div className="space-y-2"><Label>Country</Label><Input {...register('address.country')} defaultValue="USA" /></div>
            </div>
          </div>
        </div>

        {/* Management & Capacity */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Manager</h3>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input {...register('managerName')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone</Label><Input type="tel" {...register('managerPhone')} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" {...register('managerEmail')} /></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Base Capacity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Sq Ft</Label>
                <Input type="number" {...register('capacity.totalSquareFeet', { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Total Pallet Positions</Label>
                <Input type="number" {...register('capacity.totalPallets', { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zones Array */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Warehouse Zones</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', type: 'RACK', capacity: 100 })}>
            <Plus className="mr-2 h-4 w-4" /> Add Zone
          </Button>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-red-500" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-8">
                <div className="space-y-2"><Label>Zone Name / ID</Label><Input {...register(`zones.${index}.name` as const)} placeholder="e.g. Aisle 1" /></div>
                <div className="space-y-2">
                  <Label>Zone Type</Label>
                  {/* eslint-disable-next-line react-hooks/incompatible-library */}
                  <Select value={watch(`zones.${index}.type` as const)} onValueChange={(v: any) => setValue(`zones.${index}.type` as const, v, { shouldDirty: true })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RACK">Standard Racking</SelectItem>
                      <SelectItem value="FLOOR">Floor Storage</SelectItem>
                      <SelectItem value="COLD">Cold Storage</SelectItem>
                      <SelectItem value="HAZMAT">HAZMAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Capacity (Pallets)</Label><Input type="number" {...register(`zones.${index}.capacity` as const, { valueAsNumber: true })} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Saving...' : 'Save Facility'}
        </Button>
      </div>
    </form>
  );
}
