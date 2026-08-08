'use client';

import { Warehouse } from '@/types/wms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Box, User, Clock, Layers } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';

interface WarehouseDetailViewProps {
  warehouse: Warehouse;
}

export function WarehouseDetailView({ warehouse }: WarehouseDetailViewProps) {
  const util = warehouse.capacity.utilizationPercentage;
  const colorClass = util > 90 ? 'text-red-500 bg-red-100 dark:bg-red-900/30' : util > 75 ? 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' : 'text-green-500 bg-green-100 dark:bg-green-900/30';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Top Left: Main Facility Info */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono">{warehouse.code}</Badge>
                <Badge variant={warehouse.status === 'OPERATIONAL' ? 'default' : 'destructive'} 
                       className={warehouse.status === 'OPERATIONAL' ? 'bg-green-100 text-green-800' : ''}>
                  {warehouse.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">{warehouse.name}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">{warehouse.type.replace(/_/g, ' ')}</div>
            </div>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS']}>
              <Link href={`/wms/${warehouse.id}/edit`}>
                <Button variant="outline">Edit Facility</Button>
              </Link>
            </RoleGuard>
          </CardHeader>
          <CardContent>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> Location</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {warehouse.address.street}<br/>
                  {warehouse.address.city}, {warehouse.address.state} {warehouse.address.postalCode}<br/>
                  {warehouse.address.country}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> Site Management</h4>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-gray-900 dark:text-white">{warehouse.managerName}</div>
                  <div><a href={`mailto:${warehouse.managerEmail}`} className="text-blue-600 hover:underline">{warehouse.managerEmail}</a></div>
                  <div className="text-gray-600 dark:text-gray-400">{warehouse.managerPhone}</div>
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <Clock className="h-4 w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Operating Hours:</span> {warehouse.operatingHours}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Zones Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Layers className="h-5 w-5" /> Storage Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {warehouse.zones.map((zone) => {
                const zUtil = zone.capacity > 0 ? Math.round((zone.currentLoad / zone.capacity) * 100) : 0;
                const zColor = zUtil > 90 ? 'bg-red-500' : zUtil > 75 ? 'bg-orange-500' : 'bg-green-500';
                
                return (
                  <div key={zone.id} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-900 dark:text-white">{zone.name}</div>
                      <Badge variant="outline" className="text-[10px] px-1 py-0">{zone.type}</Badge>
                    </div>
                    
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{zone.currentLoad} / {zone.capacity}</span>
                        <span>{zUtil}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${zColor}`} style={{ width: `${zUtil}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Capacity Overview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5" /> Overall Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="text-center p-6 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Utilization</div>
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${colorClass}`}>
                {util}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500">Available Pallets</span>
                <span className="font-medium">{warehouse.capacity.availablePallets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500">Total Pallet Positions</span>
                <span className="font-medium">{warehouse.capacity.totalPallets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm text-gray-500">Footprint (Sq Ft)</span>
                <span className="font-medium">{warehouse.capacity.totalSquareFeet.toLocaleString()}</span>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
