'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import { Order } from '@/types/orders';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal Code is required'),
  country: z.string().min(1, 'Country is required'),
});

const orderFormSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone is required'),
    companyName: z.string().optional(),
  }),
  origin: addressSchema,
  destination: addressSchema,
  items: z.array(z.object({
    description: z.string().min(1, 'Description required'),
    quantity: z.number().min(1),
    weight: z.number().min(0),
    value: z.number().min(0),
    isHazardous: z.boolean(),
    temperatureControlled: z.boolean(),
  })).min(1, 'At least one item is required'),
  estimatedPickupDate: z.string().min(1, 'Pickup date required'),
  estimatedDeliveryDate: z.string().min(1, 'Delivery date required'),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  initialData?: Order;
  isEdit?: boolean;
}

export function OrderForm({ initialData, isEdit }: OrderFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, formState: { errors, isDirty } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: initialData ? {
      customer: initialData.customer,
      origin: initialData.origin,
      destination: initialData.destination,
      items: initialData.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        weight: item.weight,
        value: item.value,
        isHazardous: item.isHazardous,
        temperatureControlled: item.temperatureControlled,
      })),
      estimatedPickupDate: initialData.estimatedPickupDate.slice(0, 16),
      estimatedDeliveryDate: initialData.estimatedDeliveryDate.slice(0, 16),
    } : {
      items: [{ description: '', quantity: 1, weight: 0, value: 0, isHazardous: false, temperatureControlled: false }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // Auto-calculate totals for the payload
      const totalWeight = data.items.reduce((sum: number, item: any) => sum + item.weight, 0);
      const totalValue = data.items.reduce((sum: number, item: any) => sum + item.value, 0);
      const payload = { ...data, totalWeight, totalValue };

      if (isEdit && initialData) {
        return orderService.updateOrder(initialData.id, payload);
      }
      return orderService.createOrder({
        ...data,
        customer: { id: '', ...data.customer },
        origin: { ...data.origin, id: '' },
        destination: { ...data.destination, id: '' },
      } as any);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Order updated' : 'Order created successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.push(`/orders/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.normalizedMessage || 'Failed to save order');
    }
  });

  const onSubmit = (data: OrderFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Customer Info */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contact Name</Label>
            <Input {...register('customer.name')} />
          </div>
          <div className="space-y-2">
            <Label>Company (Optional)</Label>
            <Input {...register('customer.companyName')} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register('customer.email')} />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input type="tel" {...register('customer.phone')} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Origin */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pickup Origin</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input {...register('origin.street')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input {...register('origin.city')} /></div>
              <div className="space-y-2"><Label>State</Label><Input {...register('origin.state')} /></div>
              <div className="space-y-2"><Label>ZIP Code</Label><Input {...register('origin.postalCode')} /></div>
              <div className="space-y-2"><Label>Country</Label><Input {...register('origin.country')} defaultValue="USA" /></div>
            </div>
            <div className="space-y-2 pt-2">
              <Label>Estimated Pickup Time</Label>
              <Input type="datetime-local" {...register('estimatedPickupDate')} />
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delivery Destination</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input {...register('destination.street')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input {...register('destination.city')} /></div>
              <div className="space-y-2"><Label>State</Label><Input {...register('destination.state')} /></div>
              <div className="space-y-2"><Label>ZIP Code</Label><Input {...register('destination.postalCode')} /></div>
              <div className="space-y-2"><Label>Country</Label><Input {...register('destination.country')} defaultValue="USA" /></div>
            </div>
            <div className="space-y-2 pt-2">
              <Label>Estimated Delivery Time</Label>
              <Input type="datetime-local" {...register('estimatedDeliveryDate')} />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Freight Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, weight: 0, value: 0, isHazardous: false, temperatureControlled: false })}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-8">
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Input {...register(`items.${index}.description` as const)} placeholder="Commodity description" />
                </div>
                <div className="space-y-2">
                  <Label>Qty</Label>
                  <Input type="number" {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" {...register(`items.${index}.weight` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Declared Value ($)</Label>
                  <Input type="number" {...register(`items.${index}.value` as const, { valueAsNumber: true })} />
                </div>
                <div className="space-y-2 md:col-span-2 flex flex-col justify-end gap-2 pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register(`items.${index}.isHazardous` as const)} className="rounded border-gray-300" /> Hazardous Material (HAZMAT)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...register(`items.${index}.temperatureControlled` as const)} className="rounded border-gray-300" /> Temperature Controlled (Reefer)
                  </label>
                </div>
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
          <Save className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Saving...' : 'Save Order'}
        </Button>
      </div>
    </form>
  );
}
