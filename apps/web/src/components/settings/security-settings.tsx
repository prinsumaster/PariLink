'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { SecuritySettings as SecSettings } from '@/types/settings';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Save, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySettingsForm() {
  const queryClient = useQueryClient();

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['settings', 'security'],
    queryFn: () => settingsService.getSecuritySettings(),
  });

  const { register, control, handleSubmit, setValue, watch, formState: { isDirty } } = useForm<SecSettings>({
    values: initialData || {
      passwordPolicy: { minLength: 12, requireUppercase: true, requireNumbers: true, requireSymbols: true, expiryDays: 90 },
      mfa: { required: false, allowedMethods: ['APP'] },
      sso: { enabled: false, provider: 'NONE', domainRestrictions: [] },
      sessionTimeoutMinutes: 30
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const isSsoEnabled = watch('sso.enabled');

  const mutation = useMutation({
    mutationFn: (data: SecSettings) => settingsService.updateSecuritySettings(data),
    onSuccess: () => {
      toast.success('Security settings updated');
      queryClient.invalidateQueries({ queryKey: ['settings', 'security'] });
    },
    onError: () => toast.error('Failed to update security settings'),
  });

  const onSubmit = (data: SecSettings) => mutation.mutate(data);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Multi-factor and Single Sign-On configurations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md"><Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>
              <div>
                <Label className="text-base font-semibold">Require MFA</Label>
                <p className="text-sm text-gray-500">Enforce Multi-Factor Authentication for all users.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="mfa.required"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-md"><ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div>
              <div>
                <Label className="text-base font-semibold">Enable SSO</Label>
                <p className="text-sm text-gray-500">Allow login via SAML or OIDC providers.</p>
              </div>
            </div>
            <Controller
              control={control}
              name="sso.enabled"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
          </div>

          {isSsoEnabled && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4">
              <div className="space-y-2">
                <Label>SSO Provider</Label>
                // eslint-disable-next-line react-hooks/incompatible-library
                <Select value={watch('sso.provider')} onValueChange={(v) => setValue('sso.provider', (v as 'SAML'|'OIDC'), { shouldDirty: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAML">SAML 2.0 (Okta, Entra ID)</SelectItem>
                    <SelectItem value="OIDC">OpenID Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Policy</CardTitle>
          <CardDescription>Complexity requirements for local accounts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Minimum Length</Label>
              <Input type="number" {...register('passwordPolicy.minLength', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Expiry Days (0 for never)</Label>
              <Input type="number" {...register('passwordPolicy.expiryDays', { valueAsNumber: true })} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Controller control={control} name="passwordPolicy.requireUppercase" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
              <Label>Require Uppercase</Label>
            </div>
            <div className="flex items-center gap-2">
              <Controller control={control} name="passwordPolicy.requireNumbers" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
              <Label>Require Numbers</Label>
            </div>
            <div className="flex items-center gap-2">
              <Controller control={control} name="passwordPolicy.requireSymbols" render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />} />
              <Label>Require Symbols</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {mutation.isPending ? 'Saving...' : 'Save Security Settings'}
        </Button>
      </div>

    </form>
  );
}
