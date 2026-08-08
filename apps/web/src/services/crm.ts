import { api } from '@/services/api';
import { Customer, CustomerFilters, PaginatedCustomers } from '@/types/crm';

export const crmService = {
  getCustomers: async (filters: CustomerFilters): Promise<PaginatedCustomers> => {
    const { data } = await api.get('/customers', { params: filters });
    return data;
  },

  getCustomer: async (id: string): Promise<Customer> => {
    const { data } = await api.get(`/customers/${id}`);
    return data;
  },

  createCustomer: async (customerData: any): Promise<Customer> => {
    const payload = {
      name: customerData.companyName || customerData.name,
      email: customerData.primaryEmail || customerData.email,
      phone: customerData.primaryPhone || customerData.phone,
      billingAddress: customerData.address ? `${customerData.address.street}, ${customerData.address.city}` : customerData.billingAddress,
      taxId: customerData.billing?.taxId || customerData.taxId,
      paymentTerms: customerData.billing?.paymentTerms || customerData.paymentTerms,
      creditLimit: customerData.billing?.creditLimit || customerData.creditLimit,
    };
    const { data } = await api.post('/customers', payload);
    return data;
  },

  updateCustomer: async (id: string, customerData: any): Promise<Customer> => {
    const payload: Record<string, any> = {
      name: customerData.companyName || customerData.name,
      email: customerData.primaryEmail || customerData.email,
      phone: customerData.primaryPhone || customerData.phone,
      billingAddress: customerData.address ? `${customerData.address.street}, ${customerData.address.city}` : customerData.billingAddress,
      taxId: customerData.billing?.taxId || customerData.taxId,
      paymentTerms: customerData.billing?.paymentTerms || customerData.paymentTerms,
      creditLimit: customerData.billing?.creditLimit || customerData.creditLimit,
    };
    // Clean up undefined properties
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    
    const { data } = await api.put(`/customers/${id}`, payload);
    return data;
  },

  updateCustomerStatus: async (id: string, status: string): Promise<Customer> => {
    const { data } = await api.patch(`/customers/${id}/status`, { status });
    return data;
  },

  archiveCustomer: async (id: string, reason: string): Promise<Customer> => {
    const { data } = await api.post(`/customers/${id}/archive`, { reason });
    return data;
  }
};
