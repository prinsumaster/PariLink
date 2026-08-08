'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FleetUtilizationPoint } from '@/types/reports';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface FleetUtilizationChartProps {
  data: FleetUtilizationPoint[];
  isLoading?: boolean;
}

export function FleetUtilizationChart({ data, isLoading }: FleetUtilizationChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Fleet Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md w-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle>Fleet Utilization (7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="active" name="Active (On Trip)" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="idle" name="Idle (Yard)" stackId="a" fill="#9ca3af" />
              <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
