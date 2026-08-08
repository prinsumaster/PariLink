'use client';

import { useLoad, useUpdateLoad, useDeleteLoad } from '@/hooks/use-loads';
import { useCustomers, useDrivers, useVehicles } from '@/hooks';
import { StatusBadge } from '@/components/status-badge';
import { ActivityTimeline } from '@/components/activity-timeline';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProofOfDeliveryDialog } from '@/components/forms/proof-of-delivery-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft, Package, MapPin, Calendar, DollarSign,
  Truck, User, FileText, MoreHorizontal, Edit, AlertTriangle, ClipboardCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import type { LoadStatus } from '@/types';

const LOAD_STATUS_FLOW: LoadStatus[] = ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED'];

const statusTransitions: Record<LoadStatus, LoadStatus[]> = {
  PENDING: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_TRANSIT', 'PENDING', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

interface LoadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LoadDetailPage({ params }: LoadDetailPageProps) {
  const { id } = use(params);
  const [podOpen, setPodOpen] = useState(false);
  const router = useRouter();
  const { data: load, isLoading, isError } = useLoad(id);
  const { mutate: updateLoad, isPending: isUpdating } = useUpdateLoad(id);
  const { mutate: deleteLoad } = useDeleteLoad();
  const { data: driversData } = useDrivers({ limit: 100, status: 'AVAILABLE' });

  const handleStatusChange = (newStatus: string) => {
    updateLoad(
      { status: newStatus },
      {
        onSuccess: () => toast.success(`Load status updated to ${newStatus.replace('_', ' ')}`),
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const handleDelete = () => {
    if (!confirm('Delete this load permanently?')) return;
    deleteLoad(id, {
      onSuccess: () => {
        toast.success('Load deleted');
        router.push('/loads');
      },
      onError: () => toast.error('Failed to delete load'),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !load) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <AlertDescription>Load not found or you don&apos;t have permission to view it.</AlertDescription>
      </Alert>
    );
  }

  const allowedTransitions = statusTransitions[load.status] ?? [];

  // Build timeline from status
  const timelineEvents = LOAD_STATUS_FLOW.map((s) => {
    const idx = LOAD_STATUS_FLOW.indexOf(load.status);
    const thisIdx = LOAD_STATUS_FLOW.indexOf(s);
    return {
      id: s,
      title: s.replace('_', ' '),
      description: thisIdx < idx
        ? 'Completed'
        : thisIdx === idx
        ? 'Current Status'
        : 'Pending',
      timestamp: thisIdx <= idx ? format(new Date(load.updatedAt), 'MMM d, h:mm a') : '—',
      status: (thisIdx < idx ? 'completed' : thisIdx === idx ? 'current' : 'pending') as any,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/loads">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight font-mono text-blue-600 dark:text-blue-400">
                {load.referenceNumber}
              </h1>
              <StatusBadge status={load.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Created {format(new Date(load.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {allowedTransitions.length > 0 && (
          <select
            className="w-40 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
            onChange={(e) => e.target.value && handleStatusChange(e.target.value)}
            defaultValue=""
            disabled={isUpdating}
          >
            <option value="" disabled>Change Status</option>
            {allowedTransitions.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          )}
          {load.status === 'IN_TRANSIT' && (
            <Button onClick={() => setPodOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-9" size="sm">
              <ClipboardCheck className="h-4 w-4" />
              Submit POD
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-600 hover:text-red-600 border-red-200"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Route Card */}
              <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Route
                </h3>
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 border-2 border-white shadow" />
                    <div className="w-px h-12 bg-gray-200 dark:bg-gray-700 my-1" />
                    <div className="h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pickup</p>
                      <p className="font-medium">{load.originAddress}</p>
                      <p className="text-sm text-muted-foreground">{load.originCity}, {load.originState}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {format(new Date(load.pickupDate), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Delivery</p>
                      <p className="font-medium">{load.destinationAddress}</p>
                      <p className="text-sm text-muted-foreground">{load.destinationCity}, {load.destinationState}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {format(new Date(load.deliveryDate), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  Cargo Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { label: 'Equipment', value: load.equipmentType.replace(/_/g, ' ') },
                    { label: 'Weight', value: load.weight ? `${load.weight.toLocaleString()} lbs` : '—' },
                    { label: 'Volume', value: load.volume ? `${load.volume} cu ft` : '—' },
                    { label: 'Consignor', value: load.consignor || '—' },
                    { label: 'Consignee', value: load.consignee || '—' },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="text-sm font-medium mt-0.5">{item.value}</dd>
                    </div>
                  ))}
                </dl>
                {load.notes && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{load.notes}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Assignment */}
              <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-500" />
                  Assignment
                </h3>
                <div className="space-y-3">
                  {load.trip ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <div>
                        <p className="text-xs text-muted-foreground">Trip</p>
                        <Link href={`/trips/${load.tripId}`} className="text-sm font-mono font-medium text-blue-600 hover:underline">
                          {load.trip.tripNumber}
                        </Link>
                      </div>
                      <StatusBadge status={load.trip.status} />
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-dashed text-center">
                      <p className="text-sm text-muted-foreground">Not assigned to a trip yet</p>
                      <Button variant="outline" size="sm" className="mt-2 gap-1">
                        <Truck className="h-3 w-3" />
                        Assign to Trip
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="mt-4">
              <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Documents
                  </h3>
                  <Badge variant="outline">{load.documents?.length ?? 0} files</Badge>
                </div>

                <FileUpload
                  accept="image/*,application/pdf"
                  multiple
                  label="Upload POD, BOL, or other documents"
                  hint="PDF, PNG, JPG up to 10MB"
                />

                {(!load.documents || load.documents.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Timeline */}
            <TabsContent value="timeline" className="mt-4">
              <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Status Timeline
                </h3>
                <ActivityTimeline events={timelineEvents} />
              </div>
            </TabsContent>

            {/* Financial */}
            <TabsContent value="financial" className="mt-4">
              <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Financial Summary
                </h3>
                <dl className="divide-y dark:divide-gray-800">
                  {[
                    { label: 'Rate', value: `$${load.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, bold: true },
                    { label: 'Cost', value: load.cost ? `$${load.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—' },
                    {
                      label: 'Margin',
                      value: load.cost
                        ? `$${(load.rate - load.cost).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : '—',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5">
                      <dt className="text-sm text-muted-foreground">{item.label}</dt>
                      <dd className={`text-sm ${item.bold ? 'font-bold text-slate-900 dark:text-gray-50' : ''}`}>{item.value}</dd>
                    </div>
                  ))}
                </dl>

                {load.invoices && load.invoices.length > 0 ? (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Invoices</p>
                    <div className="space-y-2">
                      {load.invoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <span className="text-sm font-mono text-blue-600">{inv.invoiceNumber}</span>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={inv.status} />
                            <span className="text-sm font-medium">${inv.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-dashed text-center">
                    <p className="text-sm text-muted-foreground">No invoices generated yet</p>
                    {load.status === 'DELIVERED' && (
                      <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 gap-1">
                        Generate Invoice
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer card */}
          <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Customer</h3>
            {load.customer ? (
              <div>
                <p className="font-semibold text-slate-900 dark:text-gray-50">{load.customer.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{load.customer.email}</p>
                <p className="text-sm text-muted-foreground">{load.customer.phone}</p>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Terms</span>
                  <span className="font-medium">{load.customer.paymentTerms.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm mt-1.5">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={load.customer.status} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No customer assigned</p>
            )}
          </div>

          {/* Rate card */}
          <div className="rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800 p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Load Rate</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              ${load.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Driver assignment */}
          <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Quick Assign Driver</h3>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">Select available driver</option>
              {driversData?.data.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.firstName} {d.lastName} ({d.status})
                </option>
              ))}
            </select>
          </div>

          {/* Metadata */}
          <div className="rounded-xl border bg-white dark:bg-gray-950 p-5 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Record Info</h3>
            <dl className="space-y-2">
              {[
                { label: 'Load ID', value: id.slice(0, 8) + '…' },
                { label: 'Created', value: format(new Date(load.createdAt), 'MMM d, yyyy h:mm a') },
                { label: 'Updated', value: format(new Date(load.updatedAt), 'MMM d, yyyy h:mm a') },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-xs text-muted-foreground">{item.label}</dt>
                  <dd className="text-xs font-medium font-mono">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <ProofOfDeliveryDialog load={load} open={podOpen} onOpenChange={setPodOpen} />
    </div>
  );
}
