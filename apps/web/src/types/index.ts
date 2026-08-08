// ─── Core / Shared ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ─── Load ─────────────────────────────────────────────────────────────────────

export type LoadStatus = 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export type EquipmentType = 'DRY_VAN' | 'REEFER' | 'FLATBED' | 'STEP_DECK' | 'TANKER';

export interface Load {
  id: string;
  companyId: string;
  customerId: string;
  tripId?: string;
  referenceNumber: string;
  consignor?: string;
  consignee?: string;
  originAddress: string;
  originCity: string;
  originState: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  pickupDate: string;
  deliveryDate: string;
  weight?: number;
  volume?: number;
  equipmentType: EquipmentType;
  vehicleRequirement?: string;
  trailerRequirement?: string;
  status: LoadStatus;
  rate: number;
  cost?: number;
  notes?: string;
  customer?: Customer;
  trip?: Trip;
  documents?: Document[];
  invoices?: Invoice[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateLoadDto {
  customerId: string;
  referenceNumber: string;
  consignor?: string;
  consignee?: string;
  originAddress: string;
  originCity: string;
  originState: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  pickupDate: string;
  deliveryDate: string;
  weight?: number;
  volume?: number;
  equipmentType?: EquipmentType;
  vehicleRequirement?: string;
  trailerRequirement?: string;
  rate: number;
  cost?: number;
  notes?: string;
}

// ─── Trip ─────────────────────────────────────────────────────────────────────

export type TripStatus = 'PLANNED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  companyId: string;
  tripNumber: string;
  driverId?: string;
  vehicleId?: string;
  trailerId?: string;
  status: TripStatus;
  startDate?: string;
  endDate?: string;
  eta?: string;
  startOdometer?: number;
  endOdometer?: number;
  estimatedDistance?: number;
  actualDistance?: number;
  fuelExpenses?: number;
  otherExpenses?: number;
  notes?: string;
  driver?: Driver;
  vehicle?: Vehicle;
  trailer?: Vehicle;
  loads?: Load[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripDto {
  tripNumber: string;
  driverId?: string;
  vehicleId?: string;
  trailerId?: string;
  status?: TripStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

// ─── Driver ───────────────────────────────────────────────────────────────────

export type DriverStatus = 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY' | 'TERMINATED';

export interface Driver {
  id: string;
  companyId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  licenseState?: string;
  licenseExpiry?: string;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────

export type VehicleStatus = 'IN_SERVICE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
export type VehicleType = 'TRUCK' | 'TRAILER' | 'VAN';

export interface Vehicle {
  id: string;
  companyId: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  type: VehicleType;
  status: VehicleStatus;
  capacityWeight?: number;
  capacityVolume?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'CREDIT_HOLD';
export type PaymentTerms = 'NET_15' | 'NET_30' | 'NET_60' | 'DUE_ON_RECEIPT';

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  billingAddress?: string;
  taxId?: string;
  paymentTerms: PaymentTerms;
  creditLimit?: number;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOIDED';

export interface Invoice {
  id: string;
  companyId: string;
  customerId: string;
  loadId?: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  dueDate?: string;
  notes?: string;
  customer?: Customer;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentMethod = 'CHECK' | 'ACH' | 'WIRE' | 'CREDIT_CARD' | 'CASH';

export interface Payment {
  id: string;
  companyId: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  referenceNumber?: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
}

// ─── Vendor ───────────────────────────────────────────────────────────────────

export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'HOLD';
export type VendorType = 'CARRIER' | 'MAINTENANCE' | 'FUEL' | 'OTHER';

export interface Vendor {
  id: string;
  companyId: string;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  billingAddress?: string;
  taxId?: string;
  type: VendorType;
  paymentTerms: string;
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Document ─────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  companyId: string;
  loadId?: string;
  type: string;
  fileUrl: string;
  fileName: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedById?: string;
  status: string;
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  status: string;
  roleId?: string;
  companyId: string;
  createdAt: string;
}
