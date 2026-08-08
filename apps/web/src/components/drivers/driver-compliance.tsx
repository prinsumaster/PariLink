'use client';

import { DriverDocument } from '@/types/drivers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, AlertCircle, CheckCircle2, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DriverComplianceProps {
  documents: DriverDocument[];
}

export function DriverCompliance({ documents }: DriverComplianceProps) {
  const expiredCount = documents.filter(d => d.isExpired).length;
  const expiringSoonCount = documents.filter(d => d.isExpiringSoon && !d.isExpired).length;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" /> Compliance & Documents
          </CardTitle>
          {(expiredCount > 0 || expiringSoonCount > 0) && (
            <div className="flex gap-2 mt-2">
              {expiredCount > 0 && <Badge variant="destructive">{expiredCount} Expired</Badge>}
              {expiringSoonCount > 0 && <Badge className="bg-orange-100 text-orange-800">{expiringSoonCount} Expiring Soon</Badge>}
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No documents found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {documents.map(doc => (
              <li key={doc.id} className="py-3 flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {doc.isExpired ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : doc.isExpiringSoon ? (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">#{doc.documentNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Exp: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {doc.fileUrl && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
