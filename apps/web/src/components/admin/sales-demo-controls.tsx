'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Share2, Trash2, Database, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/services/api';

export function SalesDemoControls() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSize, setActiveSize] = useState<'STARTER' | 'ENTERPRISE'>('ENTERPRISE');
  const [activeDemoTenant, setActiveDemoTenant] = useState<string | null>(null);

  const handleStartDemo = async () => {
    setIsGenerating(true);
    toast.loading('Provisioning PariLink Demo Logistics Pvt Ltd...', { id: 'demo-toast' });
    
    try {
      const response = await api.post('/saas/demo/seed', { size: activeSize });
      if (response.data.success) {
        setActiveDemoTenant(response.data.companyId);
        toast.success(`Demo environment provisioned successfully! Tenant ID: ${response.data.companyId}`, { id: 'demo-toast' });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to provision demo environment.', { id: 'demo-toast' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    toast.success('Demo environment reset to initial state.');
  };

  const handleShare = () => {
    navigator.clipboard.writeText('https://app.parilink.com/demo/pari-logistics-1234');
    toast.success('Demo sharing link copied to clipboard.');
  };

  const handleDelete = async () => {
    if (!activeDemoTenant) {
      toast.error('No active demo tenant to destroy.');
      return;
    }
    toast.loading('Destroying demo environment...', { id: 'demo-destroy' });
    try {
      await api.delete(`/saas/demo/${activeDemoTenant}`);
      setActiveDemoTenant(null);
      toast.success('Demo environment destroyed.', { id: 'demo-destroy' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to destroy demo environment.', { id: 'demo-destroy' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sales Demo Environment</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Provision and manage temporary demo tenants for prospect demonstrations. 
          Environments are automatically destroyed after 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Provision New Tenant
            </CardTitle>
            <CardDescription>
              Creates "PariLink Demo Logistics Pvt Ltd" with historical trips, vehicles, and live telemetry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant={activeSize === 'STARTER' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveSize('STARTER')}
                className="w-full"
              >
                Starter (20 Trucks)
              </Button>
              <Button 
                variant={activeSize === 'ENTERPRISE' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveSize('ENTERPRISE')}
                className="w-full"
              >
                Enterprise (250 Trucks)
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartDemo} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="mr-2 h-4 w-4" />
              {isGenerating ? 'Provisioning...' : 'Start Demo'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Active Demo Management
            </CardTitle>
            <CardDescription>
              Control the currently active demo tenant session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Demo
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Data
              </Button>
            </div>
            <Button variant="destructive" onClick={handleDelete} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Destroy Demo Tenant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
