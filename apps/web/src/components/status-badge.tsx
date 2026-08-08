'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LoadStatus, TripStatus, InvoiceStatus, DriverStatus, VehicleStatus } from '@/types';

type AnyStatus = LoadStatus | TripStatus | InvoiceStatus | DriverStatus | VehicleStatus | string;

const statusConfig: Record<string, { label: string; className: string }> = {
  // Load statuses
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  ASSIGNED: { label: 'Assigned', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  IN_TRANSIT: { label: 'In Transit', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400' },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  // Trip statuses
  PLANNED: { label: 'Planned', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  DISPATCHED: { label: 'Dispatched', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400' },
  COMPLETED: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  // Invoice statuses
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  PAID: { label: 'Paid', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  OVERDUE: { label: 'Overdue', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  VOIDED: { label: 'Voided', className: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
  // Driver statuses
  AVAILABLE: { label: 'Available', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  ON_DUTY: { label: 'On Duty', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400' },
  OFF_DUTY: { label: 'Off Duty', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  TERMINATED: { label: 'Terminated', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  // Vehicle statuses
  IN_SERVICE: { label: 'In Service', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  MAINTENANCE: { label: 'Maintenance', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  OUT_OF_SERVICE: { label: 'Out of Service', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  // Generic
  ACTIVE: { label: 'Active', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  INACTIVE: { label: 'Inactive', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  CREDIT_HOLD: { label: 'Credit Hold', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <Badge className={cn('border-0 font-medium text-xs', config.className, className)}>
      {config.label}
    </Badge>
  );
}
