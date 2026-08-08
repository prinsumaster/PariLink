'use client';

import { VehicleDocument } from '@/types/fleet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentManagerProps {
  documents: VehicleDocument[];
}

export function DocumentManager({ documents }: DocumentManagerProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Compliance Documents
        </CardTitle>
        <Button variant="outline" size="sm">Upload</Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No documents uploaded.</p>
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
                      {doc.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500">#{doc.documentNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">Exp: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                      {doc.isExpired && <Badge variant="destructive" className="text-[10px] h-4 px-1 py-0">Expired</Badge>}
                      {doc.isExpiringSoon && !doc.isExpired && <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-[10px] h-4 px-1 py-0">Expiring Soon</Badge>}
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
