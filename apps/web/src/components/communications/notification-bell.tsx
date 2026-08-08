'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/services/api';
import Link from 'next/link';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications?status=unread');
        setNotifications(res.data.slice(0, 5));
        setUnreadCount(res.data.length);
      } catch (e) {
        console.error(e);
      }
    };

    // Initial fetch
    fetchNotifications();

    // SSE connection
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/communications/realtime/stream?token=${token}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_NOTIFICATION') {
        setUnreadCount(prev => prev + 1);
        setNotifications(prev => [data.notification, ...prev].slice(0, 5));
      } else if (data.type === 'NOTIFICATION_READ') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    };

    eventSource.onerror = () => {
      console.warn('[NotificationBell] SSE connection failed or token expired. Closing stream to prevent retry storm.');
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-slate-900 h-9 w-9">
        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            You are all caught up!
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer flex flex-col items-start gap-1 focus:bg-slate-50 dark:focus:bg-slate-900" onClick={() => markAsRead(notif.id)}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-semibold text-sm">{notif.title}</span>
                  <span className="text-[10px] text-slate-400">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="text-xs text-slate-500 line-clamp-2">{notif.body}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Link href="/notifications" className="w-full text-center text-xs font-semibold text-indigo-600 p-2 block">
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
