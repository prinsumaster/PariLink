import { api } from '@/services/api';
import { Order, OrderFilters, PaginatedOrders } from '@/types/orders';

export const orderService = {
  getOrders: async (filters: OrderFilters): Promise<PaginatedOrders> => {
    const { data } = await api.get('/orders', { params: filters });
    return data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  updateOrder: async (id: string, orderData: Partial<Order>): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}`, orderData);
    return data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}`, { status });
    return data;
  },

  archiveOrder: async (id: string, reason: string): Promise<Order> => {
    const { data } = await api.post(`/orders/${id}/archive`, { reason });
    return data;
  }
};
