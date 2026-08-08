"use client"

import * as React from "react"
import { ArrowLeft, Search, Filter, MoreVertical, Settings, Power, PowerOff, RefreshCw, Trash2, LayoutGrid, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { HealthBadge } from "@/components/marketplace/health-badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import Link from "next/link"

export default function InstalledAppsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: installedApps = [], isLoading } = useQuery({
    queryKey: ['marketplace-installed-apps'],
    queryFn: async () => {
      const res = await api.get('/admin/marketplace/installed');
      return res.data.map((installation: any) => ({
        id: installation.app.id,
        appId: installation.app.id,
        name: installation.app.name,
        logoUrl: installation.app.logoUrl,
        version: installation.version,
        status: installation.status,
        health: installation.healthStatus,
        lastSync: installation.lastSyncAt ? new Date(installation.lastSyncAt) : new Date(),
        usage: {
          apiCalls: installation.usageStats?.[0]?.apiCallsCount || 0,
          storage: "N/A"
        },
        hasUpdate: installation.hasUpdate
      }));
    }
  });

  const filteredApps = installedApps.filter((app: any) => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: string, appName: string) => {
    toast.success(`App ${action}`, {
      description: `${appName} has been ${action.toLowerCase()} successfully.`
    });
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 h-16">
        <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2" onClick={() => router.push('/admin/marketplace')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <span>Installed Apps</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
        <div className="mx-auto max-w-6xl space-y-8">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Manage Installations</h1>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-muted-foreground">Monitor health, update settings, and manage billing for your active integrations.</p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search apps..." 
                    className="pl-9 w-full md:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApps.map((app: any) => (
                <div 
                  key={app.id} 
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={app.logoUrl} alt={app.name} className="h-16 w-16 rounded-xl border bg-muted object-cover" />
                      {app.status === 'DISABLED' && (
                        <div className="absolute inset-0 bg-background/50 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                          <PowerOff className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold leading-tight">{app.name}</h3>
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-medium">v{app.version}</Badge>
                        {app.hasUpdate && (
                          <Badge className="px-1.5 py-0 text-[10px] font-medium bg-blue-500 hover:bg-blue-600 text-white border-0">
                            Update Available
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <HealthBadge 
                          status={app.status === 'DISABLED' ? 'OFFLINE' : app.health} 
                          lastSync={app.status === 'ACTIVE' ? app.lastSync : undefined} 
                        />
                      </div>
                    </div>
                  </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  
                  <div className="hidden md:flex flex-col items-end gap-1 px-6 border-r text-sm">
                    <span className="text-muted-foreground">API Usage</span>
                    <span className="font-semibold">{app.usage.apiCalls} calls</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push(`/admin/marketplace/installed/${app.id}`)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {app.hasUpdate && (
                          <DropdownMenuItem className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-900/20" onClick={() => handleAction('Updated', app.name)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update App
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => router.push(`/admin/marketplace/installed/${app.id}`)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Configuration
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {app.status === 'ACTIVE' ? (
                          <DropdownMenuItem onClick={() => handleAction('Disabled', app.name)}>
                            <PowerOff className="mr-2 h-4 w-4" />
                            Disable App
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 dark:focus:bg-emerald-900/20" onClick={() => handleAction('Enabled', app.name)}>
                            <Power className="mr-2 h-4 w-4" />
                            Enable App
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleAction('Uninstalled', app.name)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Uninstall App
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
