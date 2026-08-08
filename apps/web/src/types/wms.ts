export type WarehouseType = 'DISTRIBUTION_CENTER' | 'FULFILLMENT_CENTER' | 'CROSS_DOCK' | 'COLD_STORAGE' | 'BONDED';
export type WarehouseStatus = 'OPERATIONAL' | 'MAINTENANCE' | 'CLOSED' | 'AT_CAPACITY';

export interface WarehouseCapacity {
  totalPallets: number;
  availablePallets: number;
  totalSquareFeet: number;
  utilizationPercentage: number;
}

export interface Zone {
  id: string;
  name: string;
  type: 'RACK' | 'FLOOR' | 'COLD' | 'HAZMAT';
  capacity: number;
  currentLoad: number;
}

export interface WarehouseAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Warehouse {
  id: string;
  code: string; // e.g. WH-JFK-01
  name: string;
  type: WarehouseType;
  status: WarehouseStatus;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  operatingHours: string;
  address: WarehouseAddress;
  capacity: WarehouseCapacity;
  zones: Zone[];
  createdAt: string;
  updatedAt: string;
}

export interface WMSFilters {
  status?: WarehouseStatus[];
  type?: WarehouseType[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedWarehouses {
  data: Warehouse[];
  total: number;
  page: number;
  limit: number;
}
