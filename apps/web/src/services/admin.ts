import { api } from '@/services/api';
import { User, AdminFilters, PaginatedUsers } from '@/types/admin';

export const adminService = {
  getUsers: async (filters: AdminFilters): Promise<PaginatedUsers> => {
    const { data } = await api.get('/admin/users', { params: filters });
    return data;
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.post('/admin/users', userData);
    return data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await api.patch(`/admin/users/${id}`, userData);
    return data;
  },

  lockUserAccount: async (id: string): Promise<void> => {
    await api.post(`/admin/users/${id}/lock`);
  },

  resetUserPassword: async (id: string): Promise<void> => {
    await api.post(`/admin/users/${id}/reset-password`);
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  }
};
