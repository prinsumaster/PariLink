"use client"

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UIExtension } from '@parilink/plugin-sdk';

interface PluginSlotProps {
  slotId: string;
  context?: Record<string, any>;
}

export function PluginSlot({ slotId, context = {} }: PluginSlotProps) {
  const [extensions, setExtensions] = useState<UIExtension[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  useEffect(() => {
    async function fetchExtensions() {
      try {
        setLoading(true);
        // This endpoint will return UI extensions mapped to this specific slot
        // that belong to active installed apps for the current company
        const res = await api.get(`/admin/marketplace/extensions/${slotId}`);
        setExtensions(res.data);
      } catch (err: any) {
        console.error('Failed to load plugin extensions', err);
        setError('Failed to load extensions');
      } finally {
        setLoading(false);
      }
    }
    
    fetchExtensions();
  }, [slotId]);

  // Handle postMessage communication from plugin IFrames
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin here in production
      if (event.data?.type === 'PARILINK_SDK_INIT') {
        const sourceFrame = Object.values(iframeRefs.current).find(
          frame => frame?.contentWindow === event.source
        );
        if (sourceFrame) {
          sourceFrame.contentWindow?.postMessage({
            type: 'PARILINK_CONTEXT',
            payload: context
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [context]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 min-h-[100px] border border-dashed rounded-lg">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Extension Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (extensions.length === 0) {
    return null; // Don't render anything if no plugins hook into this slot
  }

  return (
    <div className="space-y-4 plugin-slot w-full">
      {extensions.map((ext) => (
        <div key={ext.id} className="relative w-full border rounded-lg bg-card overflow-hidden min-h-[200px]">
          <iframe
            ref={el => { iframeRefs.current[ext.id] = el; }}
            src={ext.url}
            className="w-full h-full min-h-[200px] border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title={ext.label}
          />
        </div>
      ))}
    </div>
  );
}
