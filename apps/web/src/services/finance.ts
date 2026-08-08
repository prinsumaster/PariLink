import { api } from '@/services/api';
import { Invoice, FinanceFilters, PaginatedInvoices } from '@/types/finance';

export const financeService = {
  getInvoices: async (filters: FinanceFilters): Promise<PaginatedInvoices> => {
    const { data } = await api.get('/finance/invoices', { params: filters });
    return data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const { data } = await api.get(`/finance/invoices/${id}`);
    return data;
  },

  createInvoice: async (invoiceData: Partial<Invoice>): Promise<Invoice> => {
    const { data } = await api.post('/finance/invoices', invoiceData);
    return data;
  },

  updateInvoice: async (id: string, invoiceData: Partial<Invoice>): Promise<Invoice> => {
    const { data } = await api.put(`/finance/invoices/${id}`, invoiceData);
    return data;
  },

  updateInvoiceStatus: async (id: string, status: string): Promise<Invoice> => {
    const { data } = await api.patch(`/finance/invoices/${id}/status`, { status });
    return data;
  },

  recordPayment: async (id: string, amount: number, method: string): Promise<Invoice> => {
    const { data } = await api.post(`/finance/invoices/${id}/payments`, { amount, method });
    return data;
  }
};
