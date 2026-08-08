'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Key, Server, Settings2, ShieldCheck, Zap } from 'lucide-react';

export default function EnterpriseDeploymentPage() {
  const [flags, setFlags] = useState({
    aiFeatures: true,
    multiTenant: true,
    betaPlugins: false,
  });

  const toggleFlag = (key: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 space-y-6 p-8 bg-slate-50 dark:bg-slate-900/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Enterprise Deployment</h2>
          <p className="text-muted-foreground mt-1">Configure tenant profiles, environments, and global limits.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-300 dark:border-slate-700">
            Export Config
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
            Deploy Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Environment Profile */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Environment</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Production</div>
            <p className="text-xs text-muted-foreground mt-1">PariLink X8 - Multi-Tenant Cluster</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400">
                Stable Channel
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400">
                v6.2.0
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Global Quotas */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tenant Quotas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Enterprise Tier</div>
            <p className="text-xs text-muted-foreground mt-1">Global overrides applied</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">API Rate Limit:</span>
                <span className="font-medium">10,000 req/min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Storage:</span>
                <span className="font-medium">50,000 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observability */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Observability</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Healthy</div>
            <p className="text-xs text-muted-foreground mt-1">Distributed tracing active</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Avg Latency:</span>
                <span className="font-medium">124ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Error Rate:</span>
                <span className="font-medium text-emerald-600">0.01%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Feature Flags */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="h-5 w-5 text-blue-500" />
              Global Feature Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">AI Copilot Engine</h4>
                <p className="text-sm text-slate-500">Enable universal AI assistance across all tenants.</p>
              </div>
              <Switch checked={flags.aiFeatures} onCheckedChange={() => toggleFlag('aiFeatures')} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Multi-Tenant Isolation</h4>
                <p className="text-sm text-slate-500">Enforce strict logical isolation boundaries.</p>
              </div>
              <Switch checked={flags.multiTenant} onCheckedChange={() => toggleFlag('multiTenant')} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Beta Plugins Runtime</h4>
                <p className="text-sm text-slate-500">Allow installation of experimental industry packs.</p>
              </div>
              <Switch checked={flags.betaPlugins} onCheckedChange={() => toggleFlag('betaPlugins')} />
            </div>
          </CardContent>
        </Card>

        {/* Security & Authentication */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
              Security & Auth Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
                <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">SSO Configuration (OIDC)</h4>
                <p className="text-xs text-slate-500">Currently mapping to Okta / Azure AD</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-md">
                <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Secrets Rotation</h4>
                <p className="text-xs text-slate-500">KMS Integration Active</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
