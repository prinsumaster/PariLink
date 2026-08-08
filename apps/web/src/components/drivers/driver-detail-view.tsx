'use client';

import { Driver } from '@/types/drivers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Hash, Truck, Map, Activity } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DriverCompliance } from './driver-compliance';
import { DriverSafetyAnalytics } from './driver-safety-analytics';

interface DriverDetailViewProps {
  driver: Driver;
}

export function DriverDetailView({ driver }: DriverDetailViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Top Left: Profile */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 shadow-sm border border-gray-100 dark:border-gray-800">
                <AvatarImage src={driver.photoUrl} alt={driver.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                  {driver.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{driver.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500 font-medium">#{driver.employeeCode}</span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <Badge variant={
                    driver.status === 'ONLINE' || driver.status === 'AVAILABLE' ? 'default' :
                    driver.status === 'DRIVING' || driver.status === 'IN_TRIP' ? 'secondary' : 'outline'
                  }>
                    {driver.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS']}>
              <Link href={`/drivers/${driver.id}/edit`}>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </RoleGuard>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{driver.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Nat ID: {driver.nationalIdMasked}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Emergency</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{driver.emergencyContact.name} ({driver.emergencyContact.relation})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-red-400" />
                    <span className="text-gray-600 dark:text-gray-400">{driver.emergencyContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Activity className="h-4 w-4 text-red-500" />
                    <span className="text-gray-600 dark:text-gray-400">Blood Group: <strong className="text-red-500">{driver.bloodGroup}</strong></span>
                  </div>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex items-center gap-4">
                <Truck className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-500">Current Asset</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {driver.currentVehicleId || 'Unassigned'}
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg flex items-center gap-4">
                <Map className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-sm text-gray-500">Current Trip</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {driver.currentTripId || 'None'}
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Lower Left: Safety */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <DriverSafetyAnalytics analytics={driver.safetyAnalytics} />
          </div>
        </div>
      </div>

      {/* Right Column: Compliance */}
      <div className="space-y-6">
        <Card className="bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium">License No.</p>
              <p className="font-bold text-lg uppercase font-mono">{driver.licenseNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Class</p>
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200">{driver.licenseCategory}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <DriverCompliance documents={driver.documents || []} />
      </div>

    </div>
  );
}
