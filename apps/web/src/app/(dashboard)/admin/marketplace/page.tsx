"use client"

import * as React from "react"
import { Search, Filter, Compass, Download, Settings, ChevronRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MarketplaceCard, AppData } from "@/components/marketplace/marketplace-card"
import { AppBanner } from "@/components/marketplace/app-banner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: apps = [], isLoading: loading } = useQuery<AppData[]>({
    queryKey: ['marketplace-catalog'],
    queryFn: async () => {
      const res = await api.get('/admin/marketplace/apps');
      // Map API data to component props format
      return res.data.map((app: any) => ({
        id: app.id,
        name: app.name,
        developer: app.developer?.name || 'PariLink',
        description: app.description,
        category: app.category?.name || 'Uncategorized',
        rating: app.rating || 0,
        reviews: app.reviews || 0,
        installs: app.installs || 0,
        isVerified: app.developer?.isVerified,
        price: app.price === 0 ? "Free" : `$${app.price}/mo`,
        licenseType: app.licenseType,
        logoUrl: app.logoUrl,
        installed: false, // Update with real status from /installed later
      }));
    }
  });

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 flex shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 h-16">
        <div className="flex items-center gap-2 font-semibold">
          <Compass className="h-5 w-5 text-primary" />
          <span>App Marketplace</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/admin/marketplace/installed">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Installed Apps
            </Button>
          </Link>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
        <div className="mx-auto max-w-6xl space-y-10">
          
          {/* Featured Banner */}
          {!searchQuery && (
            <AppBanner imageUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=400&fit=crop" className="from-indigo-500/20 to-purple-500/5">
              <div className="max-w-xl">
                <Badge className="bg-primary text-primary-foreground mb-3">Featured Partner</Badge>
                <h1 className="text-3xl font-bold text-white drop-shadow-md">Samsara Fleet Integration</h1>
                <p className="mt-2 text-white/90 drop-shadow-sm line-clamp-2">
                  Connect your PariLink workspace directly to Samsara ELDs to sync HOS, real-time GPS tracking, and dashcam events instantly.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Button onClick={() => router.push('/admin/marketplace/samsara-fleet')}>View Details</Button>
                  <Button variant="outline" className="bg-background/20 text-white hover:bg-background/40 hover:text-white border-white/20">Learn More</Button>
                </div>
              </div>
            </AppBanner>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search apps by name, category, or developer... (Press ⌘K to open global palette)" 
                className="pl-9 h-11 rounded-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-11 rounded-full px-4 gap-2 border-dashed">
                <Filter className="h-4 w-4" />
                Categories
              </Button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 h-10 w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger value="all" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">All Apps</TabsTrigger>
                <TabsTrigger value="telematics" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">Telematics</TabsTrigger>
                <TabsTrigger value="finance" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">Finance & ERP</TabsTrigger>
                <TabsTrigger value="ai" className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none">AI & Automation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0 focus-visible:outline-none">
                {searchQuery && (
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">Search Results</h3>
                    <span className="text-sm text-muted-foreground">{filteredApps.length} found</span>
                  </div>
                )}
                
                {!searchQuery && (
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight">Recommended for you</h3>
                    <Button variant="link" className="text-primary h-auto p-0 gap-1">
                      View all <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredApps.map(app => (
                    <MarketplaceCard 
                      key={app.id} 
                      app={app} 
                      onInstall={() => router.push(`/admin/marketplace/${app.id}/install`)}
                      onConfigure={() => router.push(`/admin/marketplace/installed/${app.id}`)}
                    />
                  ))}
                </div>
                
                {filteredApps.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl border-dashed">
                    <Search className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold">No apps found</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">We couldn't find any applications matching your search criteria. Try using different keywords.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="telematics" className="m-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredApps.filter(a => a.category.toLowerCase() === 'telematics').map(app => (
                    <MarketplaceCard 
                      key={app.id} 
                      app={app} 
                      onInstall={() => router.push(`/admin/marketplace/${app.id}/install`)}
                      onConfigure={() => router.push(`/admin/marketplace/installed/${app.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="finance" className="m-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredApps.filter(a => a.category.toLowerCase().includes('finance')).map(app => (
                    <MarketplaceCard 
                      key={app.id} 
                      app={app} 
                      onInstall={() => router.push(`/admin/marketplace/${app.id}/install`)}
                      onConfigure={() => router.push(`/admin/marketplace/installed/${app.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="ai" className="m-0 focus-visible:outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredApps.filter(a => a.category.toLowerCase() === 'ai').map(app => (
                    <MarketplaceCard 
                      key={app.id} 
                      app={app} 
                      onInstall={() => router.push(`/admin/marketplace/${app.id}/install`)}
                      onConfigure={() => router.push(`/admin/marketplace/installed/${app.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

        </div>
      </div>
    </div>
  )
}
