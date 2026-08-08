export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';

export interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  weight: number; // in kg
  volume?: number; // in cbm
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  isHazardous: boolean;
  temperatureControlled: boolean;
}

export interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  origin: Address;
  destination: Address;
  items: OrderItem[];
  totalWeight: number;
  totalVolume?: number;
  totalValue: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  estimatedPickupDate: string;
  estimatedDeliveryDate: string;
  actualPickupDate?: string;
  actualDeliveryDate?: string;
  assignedTripId?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  search?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}
