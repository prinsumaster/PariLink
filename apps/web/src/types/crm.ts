export type CustomerType = 'CORPORATE' | 'SME' | 'INDIVIDUAL' | 'GOVERNMENT';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'LEAD' | 'CHURNED';
export type PaymentTerms = 'NET_15' | 'NET_30' | 'NET_60' | 'PREPAID' | 'COD';

export interface CustomerContact {
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface CustomerBilling {
  taxId?: string; // GST/VAT/EIN
  currency: string;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  outstandingBalance: number;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  companyName: string;
  type: CustomerType;
  status: CustomerStatus;
  primaryEmail: string;
  primaryPhone: string;
  website?: string;
  industry?: string;
  accountManagerId?: string; // ID of the internal user
  address: CustomerAddress;
  billing: CustomerBilling;
  contacts: CustomerContact[];
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilters {
  status?: CustomerStatus[];
  type?: CustomerType[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedCustomers {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}
