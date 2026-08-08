"use client"

import * as React from "react"
import { Plus, Terminal, Code2, Rocket, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function DeveloperPortalPage() {
  const router = useRouter();

  return (
    <div className="flex-1 h-full flex flex-col bg-background overflow-hidden">
      <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 h-16">
        <div className="font-semibold flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span>Developer Portal</span>
        </div>
        <Button onClick={() => router.push('/admin/developer/create')} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Plugin
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-6xl space-y-8">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
            <p className="text-muted-foreground">Manage your enterprise plugins, webhook subscriptions, and API keys.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Action card to create a new plugin */}
            <Card className="flex flex-col transition-all hover:shadow-md cursor-pointer border-dashed bg-muted/20" onClick={() => router.push('/admin/developer/create')}>
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Create New Plugin</h3>
                  <p className="text-sm text-muted-foreground mt-1">Start building a new extension using the PariLink SDK</p>
                </div>
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  )
}
