'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/services/trips';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';

interface TripDesksPanelProps {
  tripId: string;
}

export function TripDesksPanel({ tripId }: TripDesksPanelProps) {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const { data: desks = [], isLoading } = useQuery({
    queryKey: ['trips', tripId, 'desks'],
    queryFn: () => tripService.getTripDesks(tripId),
  });

  const completeMutation = useMutation({
    mutationFn: (desk: string) => tripService.completeDesk(tripId, desk),
    onSuccess: () => {
      toast.success('Desk marked as complete');
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'desks'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to complete desk');
    },
  });

  const isRoleAuthorized = (desk: string) => {
    if (!user) return false;
    const roles: string[] = [user.role];
    if (roles.includes('SUPER_ADMIN') || roles.includes('ORG_ADMIN')) return true;

    switch (desk) {
      case 'DISPATCH':
      case 'DOCS':
        return roles.includes('DISPATCHER');
      case 'DIESEL':
      case 'FASTAG':
        return roles.includes('OPERATIONS');
      case 'WORKSHOP':
        return roles.includes('WORKSHOP_MANAGER');
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Trip Desks</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
          <div className="h-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Trip Desks</span>
          <Badge variant="outline" className="ml-2">
            {desks.filter((d: any) => d.status === 'DONE').length} / {desks.length} Done
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {desks.map((desk: any) => {
            const isDone = desk.status === 'DONE';
            return (
              <div key={desk.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-md">
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{desk.desk}</p>
                    {isDone && (
                      <p className="text-xs text-slate-500">
                        By {desk.completedBy}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {isDone ? (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">DONE</Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-amber-600 border-amber-200">PENDING</Badge>
                      {isRoleAuthorized(desk.desk) && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => completeMutation.mutate(desk.desk)}
                          disabled={completeMutation.isPending}
                        >
                          Mark Done
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {desks.length === 0 && (
            <div className="text-sm text-slate-500 text-center py-4">No desks generated for this trip.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
