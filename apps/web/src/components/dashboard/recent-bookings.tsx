'use client';
import { RecentBooking } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { money } from '@/lib/format';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';


interface RecentBookingsProps {
  bookings?: RecentBooking[];
  isLoading: boolean;
}

export function RecentBookings({ bookings, isLoading }: RecentBookingsProps) {
  return (
    <Card className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-md">
              <Package className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Recent Bookings
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-x-auto custom-scrollbar">
        {isLoading || !bookings ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center animate-pulse">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded flex-1"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : Array.isArray(bookings) && bookings.length > 0 ? (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-800/50 uppercase border-b border-slate-100 dark:border-slate-800/60">
              <tr>
                <th className="px-4 py-3 font-medium">LR No</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {booking.lrNumber || 'Pending'}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {booking.originCity} &rarr; {booking.destinationCity}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                    {money(booking.rate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium border',
                      booking.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                      booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    )}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            No recent bookings.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
