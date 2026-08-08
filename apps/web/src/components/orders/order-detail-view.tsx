'use client';

import { Order } from '@/types/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Calendar, CreditCard, Box, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';

interface OrderDetailViewProps {
  order: Order;
}

export function OrderDetailView({ order }: OrderDetailViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Top Left: Main Order Info & Route */}
      <div className="xl:col-span-2 space-y-6">
        <Card className="glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-500" />
                {order.orderNumber}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{order.status.replace(/_/g, ' ')}</Badge>
                <Badge variant={order.paymentStatus === 'PAID' ? 'outline' : 'secondary'} 
                       className={order.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'DISPATCHER']}>
              <Link href={`/orders/${order.id}/edit`}>
                <Button variant="outline">Edit Order</Button>
              </Link>
            </RoleGuard>
          </CardHeader>
          <CardContent>
            
            {/* Route Map Visual (Text Based) */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 my-4 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
              <div className="text-center md:text-left flex-1">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Origin</div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">{order.origin.city}, {order.origin.state}</div>
                <div className="text-sm text-slate-500 mt-1">{order.origin.street}<br/>{order.origin.postalCode}</div>
                <div className="text-sm text-blue-600 mt-3 font-medium flex items-center gap-1 justify-center md:justify-start">
                  <Calendar className="h-4 w-4"/> 
                  {new Date(order.estimatedPickupDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex flex-col items-center flex-1">
                <ArrowRight className="h-8 w-8 text-gray-300 dark:text-gray-600 hidden md:block" />
                <Badge variant="secondary" className="mt-2">{order.totalWeight.toLocaleString()} kg</Badge>
              </div>

              <div className="text-center md:text-right flex-1">
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Destination</div>
                <div className="font-bold text-lg text-slate-900 dark:text-slate-100">{order.destination.city}, {order.destination.state}</div>
                <div className="text-sm text-slate-500 mt-1">{order.destination.street}<br/>{order.destination.postalCode}</div>
                <div className="text-sm text-green-600 mt-3 font-medium flex items-center gap-1 justify-center md:justify-end">
                  <Calendar className="h-4 w-4"/> 
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Freight Items */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Box className="h-5 w-5" /> Freight Manifest</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100/50 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Weight</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/60 bg-white/30 dark:bg-slate-900/20">
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium">{item.description}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3">{item.weight} kg</td>
                        <td className="px-4 py-3">${item.value.toLocaleString()}</td>
                        <td className="px-4 py-3 flex gap-1">
                          {item.isHazardous && <Badge variant="destructive" className="text-[10px] px-1 py-0">HAZMAT</Badge>}
                          {item.temperatureControlled && <Badge className="bg-blue-100 text-blue-800 text-[10px] px-1 py-0">REEFER</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Customer & Financials */}
      <div className="space-y-6">
        <Card className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" /> Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="font-medium">{order.customer.name}</div>
            </div>
            {order.customer.companyName && (
              <div>
                <div className="text-sm text-gray-500">Company</div>
                <div className="font-medium">{order.customer.companyName}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium"><a href={`mailto:${order.customer.email}`} className="text-blue-600 hover:underline">{order.customer.email}</a></div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">{order.customer.phone}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" /> Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Declared Value</span>
              <span className="font-medium">${order.totalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Status</span>
              <span className={order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-500'}>
                {order.paymentStatus}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
