'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { OrganizationSettings as OrgSettings } from '@/types/settings';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function OrganizationSettingsForm() {
  const queryClient = useQueryClient();

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['settings', 'organization'],
    queryFn: () => settingsService.getOrganizationSettings(),
  });

  const { register, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<OrgSettings>({
    values: initialData || {
      name: '',
      taxId: '',
      supportEmail: '',
      supportPhone: '',
      address: { street: '', city: '', state: '', country: '', postalCode: '' },
      localization: { timezone: 'UTC', currency: 'USD', dateFormat: 'MM/DD/YYYY', weightUnit: 'kg', distanceUnit: 'km' }
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const currentCurrency = watch('localization.currency');

  const mutation = useMutation({
    mutationFn: (data: OrgSettings) => settingsService.updateOrganizationSettings(data),
    onSuccess: () => {
      toast.success('Organization settings updated');
      queryClient.invalidateQueries({ queryKey: ['settings', 'organization'] });
    },
    onError: () => toast.error('Failed to update settings'),
  });

  const onSubmit = (data: OrgSettings) => mutation.mutate(data);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <Card className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>Legal entity details and support contact information.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Organization Name</Label>
            <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" {...register('name')} />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Tax ID / VAT</Label>
            <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" {...register('taxId')} />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Support Email</Label>
            <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" type="email" {...register('supportEmail')} />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Support Phone</Label>
            <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" {...register('supportPhone')} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60">
        <CardHeader>
          <CardTitle>Localization & Units</CardTitle>
          <CardDescription>System-wide defaults for formatting.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Currency</Label>
            <Select value={currentCurrency} onValueChange={(v) => setValue('localization.currency', (v as string), { shouldDirty: true })}>
              <SelectTrigger className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Timezone</Label>
            // eslint-disable-next-line react-hooks/incompatible-library
            <Select value={watch('localization.timezone')} onValueChange={(v) => setValue('localization.timezone', (v as string), { shouldDirty: true })}>
              <SelectTrigger className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Weight Unit</Label>
            // eslint-disable-next-line react-hooks/incompatible-library
            <Select value={watch('localization.weightUnit')} onValueChange={(v) => setValue('localization.weightUnit', (v as 'kg'|'lbs'), { shouldDirty: true })}>
              <SelectTrigger className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 dark:text-slate-400">Distance Unit</Label>
            // eslint-disable-next-line react-hooks/incompatible-library
            <Select value={watch('localization.distanceUnit')} onValueChange={(v) => setValue('localization.distanceUnit', (v as 'km'|'mi'), { shouldDirty: true })}>
              <SelectTrigger className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilometers (km)</SelectItem>
                <SelectItem value="mi">Miles (mi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || mutation.isPending} className="shadow-sm transition-all hover:shadow-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900">
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

    </form>
  );
}
