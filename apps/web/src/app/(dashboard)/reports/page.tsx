'use client';

import { useState } from 'react';
import { ReportFilters as FilterState } from '@/types/reports';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

import { ReportsDashboard } from '@/components/reports/reports-dashboard';
import { RoleGuard } from '@/components/auth/role-guard';
import { toast } from 'sonner';
import { reportsService } from '@/services/reports';

export default function ReportsPage() {
  const [filters, setFilters] = useState<FilterState>({
    timeframe: '30d',
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setIsExporting(true);
      const blob = await reportsService.exportReport('master-dashboard', filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parilink-report-${new Date().toISOString().slice(0,10)}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE', 'OPERATIONS', 'SALES']}>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass elevation-2 bg-white/50 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-indigo-600" /> Business Intelligence
            </h1>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Executive summary of network performance and financials.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-md border border-slate-200 dark:border-slate-700">
              <Calendar className="h-4 w-4 text-slate-500 ml-2" />
              <Select 
                value={filters.timeframe} 
                onValueChange={(v: any) => setFilters({ ...filters, timeframe: v })}
              >
                <SelectTrigger className="w-[140px] border-none shadow-none bg-transparent">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last Quarter</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="1y">Trailing 12 Mo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={() => handleExport('pdf')} disabled={isExporting}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <ReportsDashboard filters={filters} />
        
      </div>
    </RoleGuard>
  );
}
