'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notifications';
import { NotificationPreferences as Prefs } from '@/types/notifications';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Loader2, Mail, Smartphone, MessageSquare, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationPreferences() {
  const queryClient = useQueryClient();

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: () => notificationService.getPreferences(),
  });

  const { control, handleSubmit, formState: { isDirty } } = useForm<Prefs>({
    values: initialData || {
      emailEnabled: true,
      smsEnabled: false,
      whatsappEnabled: false,
      pushEnabled: true,
      notifyOnOrderUpdate: true,
      notifyOnShipmentDelay: true,
      notifyOnBilling: true,
      notifyOnSystemAlerts: true,
    }
  });

  const mutation = useMutation({
    mutationFn: (data: Prefs) => notificationService.updatePreferences(data),
    onSuccess: () => {
      toast.success('Notification preferences updated');
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
    onError: () => toast.error('Failed to update preferences'),
  });

  const onSubmit = (data: Prefs) => mutation.mutate(data);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-3xl">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      
      {/* Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Channels</CardTitle>
          <CardDescription>Select how you want to receive notifications from PariLink.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md"><Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
              <div>
                <Label className="text-base font-semibold">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive alerts via your registered email address.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="emailEnabled"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md"><Bell className="h-5 w-5 text-green-600 dark:text-green-400" /></div>
              <div>
                <Label className="text-base font-semibold">Push Notifications</Label>
                <p className="text-sm text-gray-500">In-browser and mobile push alerts.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="pushEnabled"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md"><Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" /></div>
              <div>
                <Label className="text-base font-semibold">SMS Alerts</Label>
                <p className="text-sm text-gray-500">Standard text messages for critical updates.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="smsEnabled"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md"><MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /></div>
              <div>
                <Label className="text-base font-semibold">WhatsApp Integration</Label>
                <p className="text-sm text-gray-500">Receive rich notifications directly to WhatsApp.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="whatsappEnabled"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Triggers */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Events</CardTitle>
          <CardDescription>Configure which system events trigger a notification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Order & Shipment Updates</Label>
              <p className="text-sm text-gray-500">When an order is created, assigned, or completed.</p>
            </div>
            <Controller
              control={control}
              name="notifyOnOrderUpdate"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>
          
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div>
              <Label className="text-base font-semibold">Shipment Delays & Anomalies</Label>
              <p className="text-sm text-gray-500">ALIP alerts, weather delays, and route deviations.</p>
            </div>
            <Controller
              control={control}
              name="notifyOnShipmentDelay"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div>
              <Label className="text-base font-semibold">Billing & Finance</Label>
              <p className="text-sm text-gray-500">New invoices, payment confirmations, and overdue notices.</p>
            </div>
            <Controller
              control={control}
              name="notifyOnBilling"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
            <div>
              <Label className="text-base font-semibold">System Alerts</Label>
              <p className="text-sm text-gray-500">Security warnings, maintenance windows, and system health.</p>
            </div>
            <Controller
              control={control}
              name="notifyOnSystemAlerts"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {mutation.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>

    </form>
  );
}
