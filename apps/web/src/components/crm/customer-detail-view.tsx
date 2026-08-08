'use client';

import { Customer } from '@/types/crm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, CreditCard, Users, Briefcase, Globe, Mail, Phone, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { RoleGuard } from '@/components/auth/role-guard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomerDetailViewProps {
  customer: Customer;
}

export function CustomerDetailView({ customer }: CustomerDetailViewProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Top Left: Main Customer Info */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                <AvatarFallback className="bg-blue-50 text-blue-700 text-2xl font-bold rounded-md">
                  {((customer as any).name || customer.companyName || '??').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">{(customer as any).name || customer.companyName}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{customer.type}</Badge>
                  <Badge variant={customer.status === 'ACTIVE' ? 'default' : 'secondary'} 
                         className={customer.status === 'ACTIVE' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                    {customer.status}
                  </Badge>
                  {customer.industry && <span className="text-sm text-gray-500 font-medium ml-2">{customer.industry}</span>}
                </div>
              </div>
            </div>
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'SALES', 'FINANCE']}>
              <Link href={`/customers/${customer.id}/edit`}>
                <Button variant="outline">Edit Account</Button>
              </Link>
            </RoleGuard>
          </CardHeader>
          <CardContent>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> Billing Address</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {customer.address ? (
                    <>
                      {customer.address.street}<br/>
                      {customer.address.city}, {customer.address.state} {customer.address.postalCode}<br/>
                      {customer.address.country}
                    </>
                  ) : (
                    // Fallback to flat billingAddress from backend
                    <>{(customer as any).billingAddress || 'No address provided'}</>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Briefcase className="h-4 w-4 text-gray-400" /> Digital Presence</h4>
                <div className="space-y-2">
                  {customer.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={customer.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{customer.website}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${customer.primaryEmail}`} className="text-blue-600 hover:underline">{customer.primaryEmail}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{customer.primaryPhone}</span>
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" /> Authorized Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customer.contacts?.length > 0 ? (
                customer.contacts.map((contact, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-gray-900 dark:text-white">{contact.name}</div>
                      {contact.isPrimary && <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">PRIMARY</Badge>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 mb-2">{contact.role}</div>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <a href={`mailto:${contact.email}`} className="text-gray-600 dark:text-gray-300 hover:underline">{contact.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-sm text-gray-500">No contacts available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Financials & Metrics */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" /> Billing Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">Payment Terms</span>
              <Badge variant="outline" className="font-mono">{customer.billing?.paymentTerms || 'NET_30'}</Badge>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-500">Credit Limit</span>
              <span className="font-medium">${(customer.billing?.creditLimit || 0).toLocaleString()} {customer.billing?.currency || 'USD'}</span>
            </div>
            <div className="pt-2">
              <div className="text-sm text-gray-500 mb-1">Outstanding Balance</div>
              <div className={`text-2xl font-bold ${(customer.billing?.outstandingBalance || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${(customer.billing?.outstandingBalance || 0).toLocaleString()} <span className="text-sm font-normal">{customer.billing?.currency || 'USD'}</span>
              </div>
            </div>
            {customer.billing?.taxId && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-xs text-gray-500">Tax ID / EIN</div>
                <div className="font-mono text-sm">{customer.billing.taxId}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" /> Account Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{customer.metrics?.totalOrders || 0}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Total Orders</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">${((customer.metrics?.totalRevenue || 0) / 1000).toFixed(1)}k</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Lifetime Rev</div>
              </div>
            </div>
            {customer.metrics?.lastOrderDate && (
              <div className="text-center text-sm text-gray-500 pt-2">
                Last order placed on {new Date(customer.metrics.lastOrderDate).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
