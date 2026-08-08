'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin';
import { User, UserRole } from '@/types/admin';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, ShieldAlert } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const userFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS', 'FINANCE', 'SALES', 'DISPATCHER', 'VIEWER', 'DRIVER']),
  department: z.string().optional(),
  branch: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: User;
  isEdit?: boolean;
}

export function UserForm({ initialData, isEdit }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData ? {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      role: initialData.role,
      department: initialData.department || '',
      branch: initialData.branch || '',
    } : {
      role: 'VIEWER',
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const currentRole = watch('role');

  const mutation = useMutation({
    mutationFn: (data: UserFormValues) => {
      if (isEdit && initialData) {
        return adminService.updateUser(initialData.id, data);
      }
      return adminService.createUser(data);
    },
    onSuccess: () => {
      toast.success(isEdit ? 'User profile updated' : 'User invitation sent');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/admin/users');
    },
    onError: (err: any) => {
      toast.error(err.normalizedMessage || 'Failed to save user');
    }
  });

  const onSubmit = (data: UserFormValues) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input {...register('firstName')} />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input {...register('lastName')} />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Email Address</Label>
            <Input type="email" {...register('email')} disabled={isEdit} className={isEdit ? 'bg-gray-50 dark:bg-gray-800' : ''} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            {isEdit && <p className="text-xs text-gray-500 mt-1">Email cannot be changed after invitation.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">Access & RBAC</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">System Role <ShieldAlert className="h-4 w-4 text-blue-500" /></Label>
            <Select value={currentRole} onValueChange={(v) => setValue('role', v as UserRole, { shouldDirty: true })}>
              <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin (Full Access)</SelectItem>
                <SelectItem value="ORG_ADMIN">Organization Admin</SelectItem>
                <SelectItem value="OPERATIONS">Operations Manager</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="SALES">Sales</SelectItem>
                <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                <SelectItem value="VIEWER">Viewer (Read Only)</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Department (Optional)</Label>
            <Input {...register('department')} />
          </div>
          <div className="space-y-2">
            <Label>Branch/Location (Optional)</Label>
            <Input {...register('branch')} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Saving...' : isEdit ? 'Update Profile' : 'Send Invitation'}
        </Button>
      </div>
    </form>
  );
}
