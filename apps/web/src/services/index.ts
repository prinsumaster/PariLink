import { api } from './api';
import type {
  Load, CreateLoadDto, PaginatedResponse,
  Trip, CreateTripDto,
  Driver, Vehicle, Customer, Vendor,
  Invoice, Payment,
} from '@/types';

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  [key: string]: any;
}

// ─── Loads ────────────────────────────────────────────────────────────────────

export const loadsService = {
  list: (params?: Record<string, any>) =>
    api.get<PaginatedResponse<Load>>('/loads', { 
      params,
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    }).then(r => r.data),

  get: (id: string) =>
    api.get<Load>(`/loads/${id}`).then(r => r.data),

  create: (dto: CreateLoadDto) =>
    api.post<Load>('/loads', dto).then(r => r.data),

  update: (id: string, dto: Partial<CreateLoadDto> & { status?: string; tripId?: string; driverId?: string; vehicleId?: string }) =>
    api.patch<Load>(`/loads/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/loads/${id}`),
};

// ─── Trips ────────────────────────────────────────────────────────────────────

export const tripsService = {
  list: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Trip>>('/trips', { params }).then(r => r.data),

  get: (id: string) =>
    api.get<Trip>(`/trips/${id}`).then(r => r.data),

  create: (dto: CreateTripDto) =>
    api.post<Trip>('/trips', dto).then(r => r.data),

  update: (id: string, dto: Partial<CreateTripDto> & { status?: string }) =>
    api.patch<Trip>(`/trips/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/trips/${id}`),
};

// ─── Drivers ─────────────────────────────────────────────────────────────────

export const driversService = {
  list: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Driver>>('/drivers', { params }).then(r => r.data),

  get: (id: string) =>
    api.get<Driver>(`/drivers/${id}`).then(r => r.data),

  create: (dto: Partial<Driver>) =>
    api.post<Driver>('/drivers', dto).then(r => r.data),

  update: (id: string, dto: Partial<Driver>) =>
    api.patch<Driver>(`/drivers/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/drivers/${id}`),
};

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const vehiclesService = {
  list: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Vehicle>>('/vehicles', { params }).then(r => r.data),

  get: (id: string) =>
    api.get<Vehicle>(`/vehicles/${id}`).then(r => r.data),

  create: (dto: Partial<Vehicle>) =>
    api.post<Vehicle>('/vehicles', dto).then(r => r.data),

  update: (id: string, dto: Partial<Vehicle>) =>
    api.patch<Vehicle>(`/vehicles/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/vehicles/${id}`),
};

// ─── Customers ────────────────────────────────────────────────────────────────

export const customersService = {
  list: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Customer>>('/customers', { params }).then(r => r.data),

  get: (id: string) =>
    api.get<Customer>(`/customers/${id}`).then(r => r.data),

  create: (dto: Partial<Customer>) =>
    api.post<Customer>('/customers', dto).then(r => r.data),

  update: (id: string, dto: Partial<Customer>) =>
    api.patch<Customer>(`/customers/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/customers/${id}`),
};

// ─── Vendors ──────────────────────────────────────────────────────────────────

export const vendorsService = {
  list: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Vendor>>('/vendors', { params }).then(r => r.data),

  get: (id: string) =>
    api.get<Vendor>(`/vendors/${id}`).then(r => r.data),

  create: (dto: Partial<Vendor>) =>
    api.post<Vendor>('/vendors', dto).then(r => r.data),

  update: (id: string, dto: Partial<Vendor>) =>
    api.patch<Vendor>(`/vendors/${id}`, dto).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/vendors/${id}`),
};

// ─── Billing / Invoices ───────────────────────────────────────────────────────

export const billingService = {
  listInvoices: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Invoice>>('/invoices', { params }).then(r => r.data),

  getInvoice: (id: string) =>
    api.get<Invoice>(`/invoices/${id}`).then(r => r.data),

  generateInvoice: (dto: { loadId: string }) =>
    api.post<Invoice>('/billing/invoices', dto).then(r => r.data),

  approveInvoice: (id: string) =>
    api.patch<Invoice>(`/billing/invoices/${id}/approve`).then(r => r.data),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const paymentsService = {
  list: (params: ListParams = {}) =>
    api.get<PaginatedResponse<Payment>>('/payments', { params }).then(r => r.data),

  create: (dto: { invoiceId: string; amount: number; method: string; paymentDate: string; referenceNumber?: string }) =>
    api.post<Payment>('/payments', dto).then(r => r.data),
};
