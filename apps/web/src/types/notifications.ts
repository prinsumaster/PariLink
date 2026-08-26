export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';

export interface Notification {
  id: string;
  title: string;
  body: string;
  priority: string;
  type: string;
  isRead: boolean;
  actionUrl?: string; // Optional URL to navigate to when clicked
  createdAt: string;
  metadata?: Record<string, any>; // e.g. { orderId: '123' }
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  notifyOnOrderUpdate: boolean;
  notifyOnShipmentDelay: boolean;
  notifyOnBilling: boolean;
  notifyOnSystemAlerts: boolean;
}

export interface NotificationFilters {
  isRead?: boolean;
  severity?: NotificationSeverity[];
  page?: number;
  limit?: number;
}

export interface PaginatedNotifications {
  data: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}
