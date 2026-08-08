'use client';

import { ShipmentSummary } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Clock, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShipmentPanelProps {
  shipments?: ShipmentSummary[];
  isLoading: boolean;
}

export function ShipmentPanel({ shipments, isLoading }: ShipmentPanelProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full md:col-span-2 h-[400px]">
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Live trips in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-800 rounded-md w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: ShipmentSummary['status']) => {
    switch (status) {
      case 'IN_TRANSIT': return <TruckIcon className="text-blue-500" />;
      case 'DELIVERED': return <CheckCircle2 className="text-green-500" />;
      case 'DELAYED': return <AlertTriangle className="text-orange-500" />;
      case 'EXCEPTION': return <AlertOctagon className="text-red-500" />;
      default: return <Clock className="text-gray-500" />;
    }
  };

  const getSlaBadge = (status: ShipmentSummary['slaStatus']) => {
    switch (status) {
      case 'MET': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">On Time</span>;
      case 'AT_RISK': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">At Risk</span>;
      case 'BREACHED': return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Breached</span>;
    }
  };

  return (
    <Card className="col-span-full md:col-span-2 h-[400px] flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Active Shipments</CardTitle>
            <CardDescription>Live trips in progress across the network</CardDescription>
          </div>
          <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            {shipments?.length || 0} Total
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {(!shipments || shipments.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
            <Package className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium">No active shipments</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 dark:text-gray-400 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3">Tracking / Status</th>
                  <th scope="col" className="px-4 py-3">Route</th>
                  <th scope="col" className="px-4 py-3">ETA</th>
                  <th scope="col" className="px-4 py-3">SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(shipment.status)}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{shipment.trackingNumber}</div>
                          <div className="text-xs text-gray-500">{shipment.status.replace('_', ' ')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{shipment.origin}</span>
                        <span className="text-gray-400">↓</span>
                        <span className="font-medium">{shipment.destination}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(shipment.eta).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {getSlaBadge(shipment.slaStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Temporary icon component since 'Truck' is heavily used
function TruckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5", className)}>
      <path d="M10 17h4V5H2v12h3"/>
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/>
      <path d="M14 17h-4"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  )
}
