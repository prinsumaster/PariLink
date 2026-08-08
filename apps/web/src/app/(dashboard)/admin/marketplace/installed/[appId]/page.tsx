"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, RefreshCw, AlertCircle, Database, Network, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthBadge } from "@/components/marketplace/health-badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from "lucide-react"

export default function AppConfigurationPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.appId as string;
  const [isSaving, setIsSaving] = React.useState(false);

  const { data: config, isLoading } = useQuery({
    queryKey: ['marketplace-installed-config', appId],
    queryFn: async () => {
      const res = await api.get(`/admin/marketplace/installed/${appId}`);
      return {
        id: res.data.app.id,
        name: res.data.app.name,
        logoUrl: res.data.app.logoUrl,
        health: res.data.healthStatus,
        lastSync: res.data.lastSyncAt ? new Date(res.data.lastSyncAt) : new Date(),
        webhookUrl: res.data.webhooks?.[0]?.url || "",
        apiKey: "********" // API key is hidden by backend
      };
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, send PATCH request to update configurations
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Configuration saved successfully.");
    setIsSaving(false);
  };

  if (isLoading || !config) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 h-16">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold flex items-center gap-2">
            {config.logoUrl && <img src={config.logoUrl} alt={config.name} className="h-6 w-6 rounded-md" />}
            <span>{config.name} Configuration</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <HealthBadge status={config.health} lastSync={config.lastSync} className="hidden sm:flex" />
          <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8 w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="general" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">
                General Settings
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="health" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">
                Health & Logs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6 animate-fade-in m-0">
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage API credentials used by the integration.</p>
                  
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex items-center gap-2">
                        <Input type="password" value={config.apiKey} readOnly className="bg-muted" />
                        <Button variant="outline">Rotate Key</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Feature Flags</h3>
                  <p className="text-sm text-muted-foreground mb-4">Enable or disable specific sync behaviors.</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-lg p-4 bg-background">
                      <div className="flex items-start gap-3">
                        <Network className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <Label className="text-base font-semibold">Auto-Sync Vehicles</Label>
                          <p className="text-sm text-muted-foreground">Automatically create PariLink vehicles when detected in Samsara.</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-lg p-4 bg-background">
                      <div className="flex items-start gap-3">
                        <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <Label className="text-base font-semibold">Keep Location History</Label>
                          <p className="text-sm text-muted-foreground">Store high-frequency GPS breadcrumbs in PariLink database.</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="webhooks" className="space-y-6 animate-fade-in m-0">
              <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Webhook Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-4">Configure the endpoint where Samsara will push real-time events.</p>
                  
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <Label>Endpoint URL</Label>
                      <Input value={config.webhookUrl} readOnly />
                    </div>
                    
                    <div className="pt-4 space-y-4">
                      <h4 className="font-semibold text-sm">Subscribed Events</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Label>GPS Location Updated (Every 5s)</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Label>Dashcam Harsh Braking Detected</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Label>HOS Status Changed</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-6 animate-fade-in m-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1 space-y-6">
                  <div className="rounded-xl border border-amber-200 bg-amber-500/5 p-6 shadow-sm">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                      <AlertCircle className="h-10 w-10 text-amber-500" />
                      <h3 className="text-xl font-bold text-amber-700 dark:text-amber-500">API Rate Limit Warning</h3>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        You have consumed 85% of your Samsara API quota for this hour.
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Diagnostics</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Trigger Manual Sync
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Database className="mr-2 h-4 w-4" />
                        Clear Sync Cache
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 rounded-xl border bg-card p-6 shadow-sm flex flex-col">
                  <h3 className="font-semibold mb-4">Recent Event Logs</h3>
                  <div className="flex-1 bg-muted/30 rounded-lg border font-mono text-xs p-4 overflow-y-auto space-y-2 h-[400px]">
                    <div className="text-muted-foreground">[10:14:02 AM] INFO: Syncing vehicle locations...</div>
                    <div className="text-muted-foreground">[10:14:05 AM] INFO: Successfully mapped 42 vehicles.</div>
                    <div className="text-amber-600 dark:text-amber-400">[10:15:12 AM] WARN: Webhook payload delayed by 1200ms.</div>
                    <div className="text-destructive">[10:20:00 AM] ERROR: Rate limit exceeded on /fleet/vehicles endpoint.</div>
                    <div className="text-muted-foreground">[10:21:00 AM] INFO: Retrying sync operations...</div>
                    <div className="text-muted-foreground">[10:21:05 AM] INFO: Backoff successful.</div>
                  </div>
                </div>
                
              </div>
            </TabsContent>
            
          </Tabs>
        </div>
      </div>
    </div>
  )
}
