'use client';

import { MaintenanceRecord } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

interface MaintenanceTimelineProps {
  records: MaintenanceRecord[];
}

export function MaintenanceTimeline({ records }: MaintenanceTimelineProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Maintenance History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No maintenance records found.</p>
          </div>
        ) : (
          <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 space-y-6">
            {records.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()).map(record => (
              <div key={record.id} className="relative pl-6">
                <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-900 
                  ${record.status === 'COMPLETED' ? 'bg-green-500' : 
                    record.status === 'OVERDUE' ? 'bg-red-500' : 'bg-blue-500'}`} 
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {record.title}
                      {record.status === 'COMPLETED' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                      {record.status === 'OVERDUE' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{record.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded inline-block">
                      {record.odometerReading.toLocaleString()} mi
                    </p>
                    {record.cost && (
                      <p className="text-xs text-gray-500 mt-1">${record.cost.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <Calendar className="h-3 w-3" />
                  <span>Sch: {new Date(record.scheduledDate).toLocaleDateString()}</span>
                  {record.completedDate && (
                    <>
                      <span>•</span>
                      <span>Done: {new Date(record.completedDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
