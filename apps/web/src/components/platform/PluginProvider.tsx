'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OilManufacturingWidget } from '../../plugins/oil-manufacturing/OilManufacturingWidget';

interface PluginContextState {
  activePlugins: string[];
  isLoading: boolean;
  getWidgetComponent: (widgetName: string) => React.ReactNode | null;
}

const PluginContext = createContext<PluginContextState>({
  activePlugins: [],
  isLoading: true,
  getWidgetComponent: () => null,
});

/**
 * Global provider that mounts at the OS level (layout.tsx)
 * It dynamically discovers what plugins are installed for the active tenant
 * and registers their UI extensions.
 */
export function PluginProvider({ children }: { children: React.ReactNode }) {
  const [activePlugins, setActivePlugins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In reality, this would fetch from GET /api/v1/plugins/active
  useEffect(() => {
    // Simulating loading the Oil Manufacturing Pack
    setTimeout(() => {
      setActivePlugins(['com.parilink.packs.oil-manufacturing']);
      setIsLoading(false);
    }, 500);
  }, []);

  const getWidgetComponent = (widgetName: string) => {
    // Dynamic Component Resolution
    // If the plugin is installed, we return its injected React Component
    if (activePlugins.includes('com.parilink.packs.oil-manufacturing')) {
      if (widgetName === 'OilRefineryStatusWidget') {
        return <OilManufacturingWidget />;
      }
    }
    return null;
  };

  return (
    <PluginContext.Provider value={{ activePlugins, isLoading, getWidgetComponent }}>
      {children}
    </PluginContext.Provider>
  );
}

export const usePlugins = () => useContext(PluginContext);
