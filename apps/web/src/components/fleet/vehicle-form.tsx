'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fleetService } from '@/services/fleet';
import { Vehicle } from '@/types/fleet';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Save, X } from 'lucide-react';

const vehicleFormSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  type: z.enum(['TRUCK', 'VAN', 'TRAILER', 'MOTORCYCLE']),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  capacity: z.number().min(0, 'Capacity must be positive'),
  axles: z.number().min(2),
  odometer: z.number().min(0),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  initialData?: Vehicle;
  isEdit?: boolean;
}

export function VehicleForm({ initialData, isEdit }: VehicleFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: initialData ? {
      registrationNumber: initialData.registrationNumber,
      type: initialData.type,
      make: initialData.make,
      model: initialData.model,
      year: initialData.year,
      capacity: initialData.capacity,
      axles: initialData.axles,
      odometer: initialData.odometer,
    } : {
      year: new Date().getFullYear(),
      capacity: 0,
      axles: 2,
      odometer: 0,
      type: 'TRUCK'
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch('type');

  const mutation = useMutation({
    mutationFn: (data: VehicleFormValues) => {
      if (isEdit && initialData) {
        return fleetService.updateVehicle(initialData.id, data);
      }
      return fleetService.createVehicle(data);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Vehicle updated' : 'Vehicle registered successfully');
      queryClient.invalidateQueries({ queryKey: ['fleet'] });
      router.push(`/fleet/${data.id}`);
    },
    onError: (err: any) => {
      console.error('Vehicle creation error:', err?.response?.data || err);
      toast.error(err.normalizedMessage || 'Failed to save vehicle');
    }
  });

  const onSubmit = (data: VehicleFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Identifiers */}
        <div className="space-y-4 md:col-span-2 border-b border-gray-200 dark:border-gray-800 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Registration & Specs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input id="registrationNumber" {...register('registrationNumber')} className="uppercase" />
              {errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Select value={selectedType} onValueChange={(v: any) => setValue('type', v, { shouldDirty: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                  <SelectItem value="VAN">Van</SelectItem>
                  <SelectItem value="TRAILER">Trailer</SelectItem>
                  <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Manufacturing Year</Label>
              <Input type="number" {...register('year', { valueAsNumber: true })} />
              {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
            </div>
          </div>
        </div>

        {/* Make / Model */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Manufacturer</h3>
          <div className="space-y-3">
            <div>
              <Label>Make</Label>
              <Input {...register('make')} placeholder="e.g. Volvo, Freightliner" />
              {errors.make && <p className="text-sm text-red-500">{errors.make.message}</p>}
            </div>
            <div>
              <Label>Model</Label>
              <Input {...register('model')} placeholder="e.g. VNL 860" />
              {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
            </div>
          </div>
        </div>

        {/* Dimensions & Usage */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Capabilities</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Capacity (kg)</Label>
                <Input type="number" {...register('capacity', { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Axles</Label>
                <Input type="number" {...register('axles', { valueAsNumber: true })} />
              </div>
            </div>
            <div>
              <Label>Current Odometer</Label>
              <Input type="number" {...register('odometer', { valueAsNumber: true })} />
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Saving...' : 'Save Vehicle'}
        </Button>
      </div>
    </form>
  );
}
