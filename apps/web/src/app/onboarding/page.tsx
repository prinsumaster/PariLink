'use client';

import { TenantOnboardingWizard } from '@/components/settings/tenant-onboarding-wizard';
import { useRouter } from 'next/navigation';
import { Truck } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function OnboardingPage() {
  const router = useRouter();
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleComplete = () => {
    updateUser({ onboardingCompleted: true });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Truck className="w-10 h-10 text-blue-600" />
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          PariLink Enterprise
        </span>
      </div>
      
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8">
          <TenantOnboardingWizard onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
