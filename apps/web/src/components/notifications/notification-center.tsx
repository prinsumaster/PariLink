'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notifications';
import { NotificationFilters } from '@/types/notifications';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, CheckCircle2, Info, Mail, MessageSquare, Smartphone, Trash2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface NotificationCenterProps {
  filters: NotificationFilters;
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'WARNING': return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case 'SUCCESS': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'INFO':
    default: return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'EMAIL': return <Mail className="h-3 w-3" />;
    case 'SMS': return <Smartphone className="h-3 w-3" />;
    case 'WHATSAPP': return <MessageSquare className="h-3 w-3 text-green-500" />;
    case 'PUSH': return <Bell className="h-3 w-3" />;
    default: return null;
  }
};

export function NotificationCenter({ filters }: NotificationCenterProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationService.getNotifications(filters),
    refetchInterval: 60000, // Poll every minute
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success('Notification deleted');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3,4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-24 bg-gray-50 dark:bg-gray-800/50"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const notifications = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm glass elevation-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-2 py-1">{data?.unreadCount || 0} Unread</Badge>
          <span className="text-sm text-gray-500">Out of {data?.total || 0} total</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => markAllReadMutation.mutate()}
          disabled={!data?.unreadCount || markAllReadMutation.isPending}
        >
          <Check className="mr-2 h-4 w-4" /> Mark All Read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm glass elevation-1">
          <Bell className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">You're all caught up!</h3>
          <p className="mt-1 text-sm text-gray-500">No new notifications in this view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border flex gap-4 transition-all duration-300 ${
                notif.isRead 
                  ? 'bg-white/40 dark:bg-slate-900/20 border-slate-200/40 dark:border-slate-800/40 opacity-70 hover:opacity-100 hover:bg-white/60 dark:hover:bg-slate-900/40' 
                  : 'bg-white/70 dark:bg-slate-900/50 border-blue-200/60 dark:border-blue-900/40 shadow-sm glass elevation-2 hover:elevation-3'
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                {getSeverityIcon(notif.severity)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-semibold truncate pr-4 ${notif.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                    {notif.title}
                  </h4>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <p className={`text-sm mb-3 ${notif.isRead ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  {notif.message}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    {notif.channels.map(ch => (
                      <Badge key={ch} variant="secondary" className="text-[10px] px-1.5 py-0 flex items-center gap-1">
                        {getChannelIcon(ch)} {ch}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                    {notif.link && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => router.push(notif.link!)}>
                        View Action
                      </Button>
                    )}
                    {!notif.isRead && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => markReadMutation.mutate(notif.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => deleteMutation.mutate(notif.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
