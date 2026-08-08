'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { settingsService } from '@/services/settings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ChevronRight, Settings, Globe, Briefcase, Building } from 'lucide-react';

export function TenantOnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    fiscalYearStartMonth: 1,
    logoUrl: '',
  });

  const onboardingMutation = useMutation({
    mutationFn: () => settingsService.completeOnboarding(formData),
    onSuccess: async () => {
      await settingsService.provisionDefaults();
      toast.success('Organization setup complete!');
      onComplete();
    },
    onError: () => toast.error('Failed to complete onboarding'),
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Card className="w-full max-w-2xl mx-auto elevation-3 glass border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-hidden animate-fade-in-up">
      <div className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Setup Organization</h3>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className={step >= 1 ? 'text-blue-600 dark:text-blue-400' : ''}>1</span>
          <div className="w-4 h-[2px] bg-slate-200 dark:bg-slate-700" />
          <span className={step >= 2 ? 'text-blue-600 dark:text-blue-400' : ''}>2</span>
          <div className="w-4 h-[2px] bg-slate-200 dark:bg-slate-700" />
          <span className={step >= 3 ? 'text-blue-600 dark:text-blue-400' : ''}>3</span>
        </div>
      </div>
      <CardHeader className="px-8 pt-8">
        <CardTitle className="text-2xl font-bold">Welcome to PariLink Enterprise</CardTitle>
        <CardDescription className="text-base mt-1">Let's set up your organization defaults to get started.</CardDescription>
      </CardHeader>
      
      <CardContent className="px-8 min-h-[220px]">
        {step === 1 && (
          <div className="space-y-5 animate-slide-in-right">
            <div className="flex items-center gap-2 pb-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Regional Settings</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600 dark:text-slate-400">Timezone</Label>
                <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" value={formData.timezone} onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} placeholder="e.g. UTC, America/New_York" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 dark:text-slate-400">Currency</Label>
                <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} placeholder="e.g. USD, EUR, INR" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-slide-in-right">
            <div className="flex items-center gap-2 pb-2">
              <Settings className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Business Rules</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600 dark:text-slate-400">System Language</Label>
                <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} placeholder="e.g. en, es, fr" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 dark:text-slate-400">Fiscal Year Start Month (1-12)</Label>
                <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" type="number" min="1" max="12" value={formData.fiscalYearStartMonth} onChange={(e) => setFormData({ ...formData, fiscalYearStartMonth: parseInt(e.target.value) })} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-slide-in-right">
            <div className="flex items-center gap-2 pb-2">
              <Briefcase className="h-4 w-4 text-violet-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Branding</h4>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-400">Logo URL</Label>
              <Input className="focus-ring transition-all hover:border-slate-300 dark:hover:border-slate-700" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" />
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">Provide a URL for your company logo. You can also upload this later in settings.</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-8 pb-8 flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={step === 1} className="transition-all hover:bg-slate-100 dark:hover:bg-slate-800">Back</Button>
        {step < 3 ? (
          <Button onClick={nextStep} className="gap-1 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900">
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => onboardingMutation.mutate()} disabled={onboardingMutation.isPending} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            {onboardingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {onboardingMutation.isPending ? 'Provisioning...' : 'Complete Setup'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
