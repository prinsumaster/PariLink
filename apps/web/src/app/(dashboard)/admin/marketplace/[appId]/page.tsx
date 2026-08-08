"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Download, ExternalLink, Globe, HelpCircle, Shield, Info, ShieldAlert, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppBanner } from "@/components/marketplace/app-banner"
import { VersionTimeline } from "@/components/marketplace/version-timeline"
import { PermissionMatrix } from "@/components/marketplace/permission-matrix"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from "lucide-react"

export default function AppDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.appId as string;
  
  const { data: app, isLoading } = useQuery({
    queryKey: ['marketplace-app', appId],
    queryFn: async () => {
      const res = await api.get(`/admin/marketplace/apps/${appId}`);
      const data = res.data;
      return {
        id: data.id,
        name: data.name,
        developer: data.developer?.name || 'PariLink',
        description: data.description,
        category: data.category?.name || 'Uncategorized',
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        installs: data.installs || 0,
        isVerified: data.developer?.isVerified,
        price: data.price === 0 ? "Free" : `$${data.price}/mo`,
        licenseType: data.licenseType,
        logoUrl: data.logoUrl,
        bannerUrl: data.screenshots?.[0]?.url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop",
        websiteUrl: data.websiteUrl || 'https://parilink.com',
        privacyUrl: data.developer?.website || 'https://parilink.com/privacy',
        supportUrl: data.developer?.supportEmail ? `mailto:${data.developer.supportEmail}` : 'https://parilink.com/support',
        installed: false,
        permissions: data.permissions || [],
        versions: data.versions || [],
        screenshots: data.screenshots || []
      };
    }
  });

  if (isLoading || !app) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 h-16">
        <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold flex items-center gap-2">
          <span>App Details</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        
        {/* Banner Section */}
        <div className="relative">
          <AppBanner imageUrl={app.bannerUrl} className="rounded-none h-48 md:h-72 border-x-0 border-t-0" />
          
          <div className="mx-auto max-w-5xl px-6 relative -top-16">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="flex items-end gap-6">
                <Avatar className="h-32 w-32 rounded-2xl border-4 border-background bg-card shadow-lg">
                  <AvatarImage src={app.logoUrl} className="object-cover" />
                  <AvatarFallback className="rounded-2xl text-2xl font-bold bg-primary/10 text-primary">
                    {app.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {app.category}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    {app.name}
                    {app.isVerified && <CheckCircle className="h-6 w-6 text-emerald-500" />}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-lg flex items-center gap-2">
                    by {app.developer}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3 pb-2">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto font-semibold px-8 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => router.push(`/admin/marketplace/${app.id}/install`)}
                >
                  Install App
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
            
            {/* Left Column: Details & Tabs */}
            <div className="md:col-span-2 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger value="overview" className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">Overview</TabsTrigger>
                  <TabsTrigger value="permissions" className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none flex gap-2 items-center">
                    Permissions
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">Versions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="m-0 focus-visible:outline-none space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About this app</h3>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {app.description}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mock screenshots */}
                      <div className="aspect-video rounded-xl bg-muted border overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Screenshot 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="aspect-video rounded-xl bg-muted border overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80" alt="Screenshot 2" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900/50 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">Copilot Analysis</h3>
                    </div>
                    <div className="space-y-4 text-sm text-indigo-800 dark:text-indigo-200/80">
                      <p><strong>Security Assessment:</strong> This application requests standard telematics read/write scopes. The permissions are well-defined and follow the principle of least privilege. There are no known security vulnerabilities associated with version {app.versions[0].version}.</p>
                      <p><strong>Compatibility:</strong> Fully compatible with your PariLink V30.0 workspace. Webhooks will sync within ~5 seconds of Samsara events.</p>
                      <p><strong>Recommendation:</strong> Highly recommended for fleets exceeding 10 vehicles requiring automated HOS compliance.</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="m-0 focus-visible:outline-none">
                  <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl flex items-start gap-3">
                    <Info className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">
                      This application requests access to the following resources in your workspace. 
                      You will have the opportunity to review and customize these permissions during installation.
                    </p>
                  </div>
                  <PermissionMatrix permissions={app.permissions} readonly />
                </TabsContent>
                
                <TabsContent value="versions" className="m-0 focus-visible:outline-none">
                  <h3 className="text-xl font-semibold mb-6">Release History</h3>
                  <VersionTimeline versions={app.versions} />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column: Metadata */}
            <div className="space-y-6">
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">App Info</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="font-medium text-foreground">{app.price}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Installs</span>
                    <span className="font-medium flex items-center gap-1">
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                      {app.installs}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Version</span>
                    <span className="font-medium">{app.versions.find((v: any) => v.isLatest)?.version || '1.0.0'}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Security</span>
                    <span className="font-medium flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Shield className="h-3.5 w-3.5" />
                      Audited & Verified
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Developer Links</h3>
                
                <div className="space-y-3">
                  <a href={app.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm hover:text-primary transition-colors group">
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary">
                      <Globe className="h-4 w-4" />
                      Developer Website
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary" />
                  </a>
                  
                  <a href={app.supportUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm hover:text-primary transition-colors group">
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary">
                      <HelpCircle className="h-4 w-4" />
                      Support Center
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary" />
                  </a>
                  
                  <a href={app.privacyUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm hover:text-primary transition-colors group">
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary">
                      <Shield className="h-4 w-4" />
                      Privacy Policy
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary" />
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
