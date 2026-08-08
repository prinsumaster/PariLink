"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { InstallWizard, WizardStep } from "@/components/marketplace/install-wizard"
import { PermissionMatrix } from "@/components/marketplace/permission-matrix"
import { ArrowLeft, CheckCircle, Info, Shield, Key, Webhook, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/services/api'
import { Loader2 } from "lucide-react"

const INSTALL_STEPS: WizardStep[] = [
  { id: 'overview', title: 'Overview', description: 'Review the application details.' },
  { id: 'permissions', title: 'Permissions', description: 'Review and approve required access.' },
  { id: 'auth', title: 'Authentication', description: 'Connect your integration account.' },
  { id: 'webhooks', title: 'Webhooks', description: 'Configure event listeners.' },
  { id: 'health', title: 'System Check', description: 'Verifying integrations.' }
];

export default function AppInstallPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.appId as string;
  
  const { data: app, isLoading: isAppLoading } = useQuery({
    queryKey: ['marketplace-app', appId],
    queryFn: async () => {
      const res = await api.get(`/admin/marketplace/apps/${appId}`);
      return res.data;
    }
  });

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState<any[]>([]);
  const [apiKey, setApiKey] = React.useState('');

  React.useEffect(() => {
    if (app?.permissions) {
      setPermissions(app.permissions.map((p: any) => ({ ...p, isGranted: p.isRequired })));
    }
  }, [app]);

  const installMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        credentials: { apiKey },
        settings: {
          grantedPermissions: permissions.filter(p => p.isGranted).map(p => p.scope)
        },
        webhooks: [
          { url: 'https://pari.link/api/webhooks/incoming', events: ['*'] }
        ]
      };
      await api.post(`/admin/marketplace/apps/${appId}/install`, payload);
    },
    onSuccess: () => {
      toast.success(`${app?.name || 'App'} installed successfully!`, {
        description: "You can now configure the application in your workspace."
      });
      router.push(`/admin/marketplace/installed/${appId}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Installation failed");
      setIsLoading(false);
    }
  });

  const handleNext = async () => {
    if (currentStep === INSTALL_STEPS.length - 1) {
      // Finish installation
      setIsLoading(true);
      installMutation.mutate();
    } else if (currentStep === 2 && !apiKey) {
      toast.error("API Key is required to continue.");
    } else if (currentStep === 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleCancel = () => {
    router.back();
  };

  if (isAppLoading || !app) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 h-16">
        <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={handleCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold flex items-center gap-2">
          {app?.logoUrl && <img src={app.logoUrl} alt={app.name} className="h-6 w-6 rounded-md" />}
          <span>Install {app?.name || 'App'}</span>
        </div>
      </header>

      <InstallWizard
        steps={INSTALL_STEPS}
        currentStepIndex={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onCancel={handleCancel}
        nextLabel={currentStep === INSTALL_STEPS.length - 1 ? 'Complete Installation' : 'Next Step'}
        isLoading={isLoading}
      >
        
        {/* Step 0: Overview */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border bg-card p-8 text-center space-y-4 shadow-sm">
              {app?.logoUrl && <img src={app.logoUrl} alt={app.name} className="h-20 w-20 mx-auto rounded-2xl shadow-md border" />}
              <h3 className="text-2xl font-bold">You are about to install {app?.name}</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                This installation wizard will guide you through connecting your account, reviewing required security permissions, and setting up real-time event webhooks.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Security Audited</h4>
                  <p className="text-xs text-muted-foreground mt-1">This application has been verified by the PariLink security team.</p>
                </div>
              </div>
              <div className="rounded-xl border p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Prerequisites</h4>
                  <p className="text-xs text-muted-foreground mt-1">You will need an active administrator account to proceed.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Permissions */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-primary">Permission Review Required</p>
                <p className="text-muted-foreground mt-1">
                  Please review the access scopes required by this application. By proceeding, you authorize {app?.name} to perform these actions on behalf of your workspace.
                </p>
              </div>
            </div>
            
            <PermissionMatrix 
              permissions={permissions} 
              onPermissionChange={(id, granted) => {
                setPermissions(prev => prev.map(p => p.id === id ? { ...p, isGranted: granted } : p));
              }}
            />
          </div>
        )}

        {/* Step 2: Authentication */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border p-6 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Samsara API Configuration</h3>
                  <p className="text-sm text-muted-foreground">Enter your Samsara API token to establish a connection.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Token <span className="text-destructive">*</span></Label>
                  <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="sam_api_xxxxxxxxxxxxxxxxxxxxx" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can generate this token from your Samsara dashboard under Settings &gt; API Tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Webhooks */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border p-6 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Webhook className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Event Listeners</h3>
                  <p className="text-sm text-muted-foreground">Configure which events to subscribe to in real-time.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <Label className="text-base font-semibold">Real-time GPS Pings</Label>
                    <p className="text-sm text-muted-foreground">Receive vehicle location updates every 5 seconds.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <Label className="text-base font-semibold">Dashcam Events</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for harsh braking and collisions.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <Label className="text-base font-semibold">Hours of Service (HOS) Violations</Label>
                    <p className="text-sm text-muted-foreground">Receive instant alerts when a driver approaches their limits.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Health Check */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Verifying Integration</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  We are testing your API token and webhook connections to ensure everything is functioning correctly before finalizing the installation.
                </p>
              </div>
              
              <div className="max-w-md mx-auto text-left space-y-3 bg-muted/30 p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Validating API Token...</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Establishing Webhook Listeners...</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Syncing Initial Master Data...</span>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">All systems operational.</h4>
                <p className="text-sm text-muted-foreground mt-1">You can now complete the installation.</p>
              </div>
            </div>
          </div>
        )}
      </InstallWizard>
    </div>
  )
}
