import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsService, customersService, driversService, vehiclesService, vendorsService, billingService, paymentsService, type ListParams } from '@/services';
import type { CreateTripDto } from '@/types';

// ─── Trips ────────────────────────────────────────────────────────────────────
export const tripKeys = {
  all: ['trips'] as const,
  lists: () => [...tripKeys.all, 'list'] as const,
  list: (p: ListParams) => [...tripKeys.lists(), p] as const,
  detail: (id: string) => [...tripKeys.all, 'detail', id] as const,
};

export function useTrips(params: ListParams = {}) {
  return useQuery({ queryKey: tripKeys.list(params), queryFn: () => tripsService.list(params), placeholderData: (p) => p });
}
export function useTrip(id: string) {
  return useQuery({ queryKey: tripKeys.detail(id), queryFn: () => tripsService.get(id), enabled: !!id });
}
export function useCreateTrip() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (dto: CreateTripDto) => tripsService.create(dto), onSuccess: () => qc.invalidateQueries({ queryKey: tripKeys.all }) });
}
export function useUpdateTrip(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateTripDto> & { status?: string }) => tripsService.update(id, dto),
    onSuccess: (updated) => { qc.invalidateQueries({ queryKey: tripKeys.all }); qc.setQueryData(tripKeys.detail(id), updated); },
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (p: ListParams) => [...customerKeys.lists(), p] as const,
  detail: (id: string) => [...customerKeys.all, 'detail', id] as const,
};
export function useCustomers(params: ListParams = {}) {
  return useQuery({ queryKey: customerKeys.list(params), queryFn: () => customersService.list(params), placeholderData: (p) => p });
}
export function useCustomer(id: string) {
  return useQuery({ queryKey: customerKeys.detail(id), queryFn: () => customersService.get(id), enabled: !!id });
}
export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: customersService.create, onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.all }) });
}
export function useUpdateCustomer(id: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (dto: any) => customersService.update(id, dto), onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.all }) });
}

// ─── Drivers ─────────────────────────────────────────────────────────────────
export const driverKeys = {
  all: ['drivers'] as const,
  lists: () => [...driverKeys.all, 'list'] as const,
  list: (p: ListParams) => [...driverKeys.lists(), p] as const,
  detail: (id: string) => [...driverKeys.all, 'detail', id] as const,
};
export function useDrivers(params: ListParams = {}) {
  return useQuery({ queryKey: driverKeys.list(params), queryFn: () => driversService.list(params), placeholderData: (p) => p });
}
export function useCreateDriver() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: driversService.create, onSuccess: () => qc.invalidateQueries({ queryKey: driverKeys.all }) });
}

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (p: ListParams) => [...vehicleKeys.lists(), p] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
};
export function useVehicles(params: ListParams = {}) {
  return useQuery({ queryKey: vehicleKeys.list(params), queryFn: () => vehiclesService.list(params), placeholderData: (p) => p });
}
export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: vehiclesService.create, onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }) });
}

// ─── Vendors ──────────────────────────────────────────────────────────────────
export const vendorKeys = {
  all: ['vendors'] as const,
  lists: () => [...vendorKeys.all, 'list'] as const,
  list: (p: ListParams) => [...vendorKeys.lists(), p] as const,
  detail: (id: string) => [...vendorKeys.all, 'detail', id] as const,
};
export function useVendors(params: ListParams = {}) {
  return useQuery({ queryKey: vendorKeys.list(params), queryFn: () => vendorsService.list(params), placeholderData: (p) => p });
}
export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: vendorsService.create, onSuccess: () => qc.invalidateQueries({ queryKey: vendorKeys.all }) });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (p: ListParams) => [...invoiceKeys.lists(), p] as const,
  detail: (id: string) => [...invoiceKeys.all, 'detail', id] as const,
};
export function useInvoices(params: ListParams = {}) {
  return useQuery({ queryKey: invoiceKeys.list(params), queryFn: () => billingService.listInvoices(params), placeholderData: (p) => p });
}
export function useInvoice(id: string) {
  return useQuery({ queryKey: invoiceKeys.detail(id), queryFn: () => billingService.getInvoice(id), enabled: !!id });
}
export function useApproveInvoice() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: billingService.approveInvoice, onSuccess: () => qc.invalidateQueries({ queryKey: invoiceKeys.all }) });
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (p: ListParams) => [...paymentKeys.lists(), p] as const,
};
export function usePayments(params: ListParams = {}) {
  return useQuery({ queryKey: paymentKeys.list(params), queryFn: () => paymentsService.list(params), placeholderData: (p) => p });
}
export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: paymentsService.create, onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }) });
}
