'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Users, Truck, Building, FileSpreadsheet } from 'lucide-react';

export function OnboardingKit() {
  const templates = [
    { name: 'Vehicle Import Template', file: '/templates/vehicle_import.csv', icon: <Truck className="h-5 w-5" />, desc: 'CSV format for bulk uploading your fleet.' },
    { name: 'Driver Import Template', file: '/templates/driver_import.csv', icon: <Users className="h-5 w-5" />, desc: 'CSV format for bulk uploading driver profiles.' },
    { name: 'Customer Import Template', file: '/templates/customer_import.csv', icon: <Building className="h-5 w-5" />, desc: 'CSV format for bulk uploading client details.' },
    { name: 'Vendor Import Template', file: '/templates/vendor_import.csv', icon: <FileSpreadsheet className="h-5 w-5" />, desc: 'CSV format for bulk uploading supplier details.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Customer Onboarding Kit</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Download the necessary templates to quickly import your existing master data into PariLink.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <Card key={tpl.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {tpl.icon}
                {tpl.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{tpl.desc}</CardDescription>
              <Button variant="outline" size="sm">
                <a href={tpl.file} download className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <FileText className="h-5 w-5" />
              Go-Live Implementation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4 text-blue-600 dark:text-blue-400">PDF guide for a successful rollout and team training.</CardDescription>
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
