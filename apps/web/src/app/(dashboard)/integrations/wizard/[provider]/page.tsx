'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, ChevronRight, Lock, KeyRound, Globe, ArrowRight, Loader2 } from 'lucide-react';

export default function ConnectionWizardPage({ params }: { params: { provider: string } }) {
  const router = useRouter();
  const provider = params.provider.toUpperCase();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Authentication', icon: Lock },
    { id: 2, title: 'Permissions', icon: KeyRound },
    { id: 3, title: 'Field Mapping', icon: Globe },
    { id: 4, title: 'Validation', icon: CheckCircle2 },
  ];

  const handleConnect = async () => {
    setLoading(true);
    try {
      // In a real OAuth flow, this would redirect to the provider's Auth URL.
      // For MVP, we simulate the backend configuration API call directly.
      const res = await api.post('/integrations/configure', {
        providerId: provider,
        credentials: { authToken: 'dev_token_123' },
        settings: { autoSync: true }
      });
      setConnectionId(res.data.id);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const finishSetup = () => {
    router.push('/integrations');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          Connect {provider}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Follow the wizard to securely connect your {provider} account to PariLink.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between relative mb-12">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>
        {steps.map(s => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isPast = step > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center bg-white dark:bg-slate-950 px-2">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' :
                isPast ? 'border-emerald-500 bg-emerald-500 text-white' :
                'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400'
              }`}>
                {isPast ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={`text-xs font-medium mt-2 ${isActive || isPast ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="flex-1 flex flex-col bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 p-8 shadow-sm rounded-xl">
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
              <Lock className="h-8 w-8 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Secure Authentication</h2>
            <p className="text-sm text-slate-500 max-w-sm mb-8">
              PariLink uses secure OAuth2 to connect to {provider}. You will be redirected to their login page. We never see your password.
            </p>
            <Button onClick={handleConnect} disabled={loading} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px]">
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <KeyRound className="h-4 w-4 mr-2" />}
              Authenticate with {provider}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-bold mb-4">Required Permissions</h2>
            <div className="space-y-3 mb-8">
              {['Read CRM Accounts', 'Read & Write Invoices', 'Access Sync Logs'].map(p => (
                <div key={p} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex justify-end">
              <Button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col text-center justify-center items-center">
             <Globe className="h-12 w-12 text-slate-300 mb-4" />
             <h2 className="text-lg font-bold mb-2">Default Field Mapping</h2>
             <p className="text-sm text-slate-500 max-w-sm mb-8">Standard objects are mapped automatically. You can customize them later in Settings.</p>
             <div className="mt-auto w-full flex justify-end">
              <Button onClick={() => setStep(4)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Validate Connection <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Connection Successful!</h2>
            <p className="text-sm text-slate-500 mb-8">
              Your {provider} integration is active and ready to sync.
            </p>
            <Button onClick={finishSetup} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[200px]">
              Go to Integrations Hub
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
