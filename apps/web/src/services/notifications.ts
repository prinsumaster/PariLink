import { api } from '@/services/api';
import { Notification, NotificationPreferences, NotificationFilters, PaginatedNotifications } from '@/types/notifications';

export const notificationService = {
  getNotifications: async (filters: NotificationFilters): Promise<PaginatedNotifications> => {
    const { data } = await api.get('/notifications', { params: filters });
    return data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/mark-all-read');
  },

  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    const { data } = await api.get('/notifications/preferences');
    return data;
  },

  updatePreferences: async (prefs: NotificationPreferences): Promise<NotificationPreferences> => {
    const { data } = await api.put('/notifications/preferences', prefs);
    return data;
  }
};
