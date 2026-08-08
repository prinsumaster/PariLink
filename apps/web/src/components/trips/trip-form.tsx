'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/services/trips';
import { Trip } from '@/types/trips';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormActions } from '@/components/ui/form-actions';

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const tripFormSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  origin: locationSchema,
  destination: locationSchema,
  plannedDeparture: z.string().min(1, 'Departure time is required'),
  plannedArrival: z.string().min(1, 'Arrival time is required'),
  driverId: z.string().optional(),
  vehicleId: z.string().optional(),
  distance: z.number().min(0),
  estimatedDuration: z.number().min(0),
});

export type TripFormValues = z.infer<typeof tripFormSchema>;

interface TripFormProps {
  initialData?: Trip;
  isEdit?: boolean;
}

export function TripForm({ initialData, isEdit }: TripFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: initialData ? {
      trackingNumber: initialData.trackingNumber,
      origin: initialData.origin,
      destination: initialData.destination,
      plannedDeparture: initialData.plannedDeparture.slice(0, 16),
      plannedArrival: initialData.plannedArrival.slice(0, 16),
      driverId: initialData.driverId || '',
      vehicleId: initialData.vehicleId || '',
      distance: initialData.distance,
      estimatedDuration: initialData.estimatedDuration,
    } : {
      distance: 0,
      estimatedDuration: 0,
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEdit && initialData) {
        return tripService.updateTrip(initialData.id, data);
      }
      return tripService.createTrip({
        ...data,
        origin: { ...data.origin, id: '' },
        destination: { ...data.destination, id: '' }
      } as any);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Trip updated successfully' : 'Trip created successfully');
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      router.push(`/trips/${data.id}`);
    }
  });

  const onSubmit = (data: TripFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input id="trackingNumber" {...register('trackingNumber')} className={errors.trackingNumber ? 'border-red-500' : ''} />
              {errors.trackingNumber && <p className="text-sm text-red-500">{errors.trackingNumber.message}</p>}
            </div>
          </div>
        </div>

        {/* Origin */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Origin</h3>
          <div className="space-y-3">
            <div>
              <Label>Location Name</Label>
              <Input {...register('origin.name')} />
            </div>
            <div>
              <Label>Address</Label>
              <Input {...register('origin.address')} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Latitude</Label>
                <Input type="number" step="any" {...register('origin.lat', { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="any" {...register('origin.lng', { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Destination</h3>
          <div className="space-y-3">
            <div>
              <Label>Location Name</Label>
              <Input {...register('destination.name')} />
            </div>
            <div>
              <Label>Address</Label>
              <Input {...register('destination.address')} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Latitude</Label>
                <Input type="number" step="any" {...register('destination.lat', { valueAsNumber: true })} />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="any" {...register('destination.lng', { valueAsNumber: true })} />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium">Schedule & Logistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Planned Departure</Label>
              <Input type="datetime-local" {...register('plannedDeparture')} />
            </div>
            <div>
              <Label>Planned Arrival</Label>
              <Input type="datetime-local" {...register('plannedArrival')} />
            </div>
            <div>
              <Label>Driver ID</Label>
              <Input {...register('driverId')} placeholder="Optional" />
            </div>
            <div>
              <Label>Vehicle ID</Label>
              <Input {...register('vehicleId')} placeholder="Optional" />
            </div>
            <div>
              <Label>Distance (miles)</Label>
              <Input type="number" {...register('distance', { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Est. Duration (mins)</Label>
              <Input type="number" {...register('estimatedDuration', { valueAsNumber: true })} />
            </div>
          </div>
        </div>
      </div>

      <FormActions 
        onCancel={() => router.back()}
        isSubmitting={mutation.isPending}
        isDirty={isDirty}
        submitLabel={isEdit ? 'Save Changes' : 'Create Trip'}
      />
    </form>
  );
}
