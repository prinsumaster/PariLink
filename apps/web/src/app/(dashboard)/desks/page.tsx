'use client';

import { useQuery } from '@tanstack/react-query';
import { tripService } from '@/services/trips';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyDesksPage() {
  const { data: desks = [], isLoading } = useQuery({
    queryKey: ['desks', 'my'],
    queryFn: () => tripService.getMyDesks(),
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" /> My Trip Desks Queue
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Trips waiting for your operational clearance.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
          <div className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
        </div>
      ) : desks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircleIcon className="h-12 w-12 text-emerald-500 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">All caught up!</h3>
            <p className="text-slate-500 mt-2">There are no pending trip desks assigned to your role.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {desks.map((deskRow: any) => (
            <Card key={deskRow.id} className="relative group overflow-hidden transition-all hover:shadow-md border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {deskRow.desk}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> Pending
                  </span>
                </div>
                <CardTitle className="text-lg mt-3">
                  <Link href={`/trips/${deskRow.tripId}`} className="hover:text-blue-600 transition-colors before:absolute before:inset-0">
                    {deskRow.trip?.tripNumber || deskRow.tripId.slice(0, 8)}
                  </Link>
                </CardTitle>
                <div className="text-sm text-slate-500 mt-1 flex flex-col gap-1">
                  <span>Driver: {deskRow.trip?.driver?.firstName || 'Unknown'}</span>
                  <span>Vehicle: {deskRow.trip?.vehicle?.licensePlate || 'Unknown'}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:translate-x-1 transition-transform">
                    Action <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
