'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/drivers';
import { Driver } from '@/types/drivers';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

const driverFormSchema = z.object({
  employeeCode: z.string().min(1, 'Employee Code is required'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  licenseNumber: z.string().min(1, 'License Number is required'),
  licenseCategory: z.string().min(1, 'License Category is required'),
  licenseExpiry: z.string().min(1, 'License Expiry is required'),
  nationalIdMasked: z.string().min(1, 'National ID is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  emergencyContact: z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(10, 'Phone is required'),
    relation: z.string().min(1, 'Relation is required'),
  })
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;

interface DriverFormProps {
  initialData?: Driver;
  isEdit?: boolean;
}

export function DriverForm({ initialData, isEdit }: DriverFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: initialData ? {
      employeeCode: initialData.employeeCode,
      name: initialData.name,
      phone: initialData.phone,
      email: initialData.email,
      licenseNumber: initialData.licenseNumber,
      licenseCategory: initialData.licenseCategory,
      licenseExpiry: initialData.licenseExpiry.slice(0, 10), // yyyy-mm-dd
      nationalIdMasked: initialData.nationalIdMasked,
      bloodGroup: initialData.bloodGroup,
      emergencyContact: initialData.emergencyContact,
    } : {}
  });

  const mutation = useMutation({
    mutationFn: (data: DriverFormValues) => {
      if (isEdit && initialData) {
        return driverService.updateDriver(initialData.id, data);
      }
      return driverService.createDriver(data);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Driver updated' : 'Driver registered successfully');
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      router.push(`/drivers/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.normalizedMessage || 'Failed to save driver');
    }
  });

  const onSubmit = (data: DriverFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="space-y-4 md:col-span-2 border-b border-gray-200 dark:border-gray-800 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Employee Code</Label>
              <Input {...register('employeeCode')} />
              {errors.employeeCode && <p className="text-sm text-red-500">{errors.employeeCode.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Input {...register('bloodGroup')} placeholder="e.g. O+" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input {...register('phone')} type="tel" />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email (Optional)</Label>
              <Input {...register('email')} type="email" />
            </div>
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input {...register('nationalIdMasked')} placeholder="SSN / Aadhaar" />
            </div>
          </div>
        </div>

        {/* License */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Driving License</h3>
          <div className="space-y-3">
            <div>
              <Label>License Number</Label>
              <Input {...register('licenseNumber')} className="uppercase" />
              {errors.licenseNumber && <p className="text-sm text-red-500">{errors.licenseNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category/Class</Label>
                <Input {...register('licenseCategory')} placeholder="e.g. CDL-A" />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input type="date" {...register('licenseExpiry')} />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</h3>
          <div className="space-y-3">
            <div>
              <Label>Contact Name</Label>
              <Input {...register('emergencyContact.name')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input {...register('emergencyContact.phone')} />
              </div>
              <div>
                <Label>Relation</Label>
                <Input {...register('emergencyContact.relation')} />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Saving...' : 'Save Driver'}
        </Button>
      </div>
    </form>
  );
}
