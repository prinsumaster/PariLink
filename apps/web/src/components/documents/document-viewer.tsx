'use client';

import { Document } from '@/types/documents';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Tag } from 'lucide-react';
import Image from 'next/image';

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  if (!document) return null;

  const isImage = document.mimeType.startsWith('image/');
  const isPdf = document.mimeType === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[85vh] flex flex-col p-0 overflow-hidden">
        
        <DialogHeader className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg flex items-center gap-2">
                {document.filename}
                <Badge variant="outline" className="text-xs">{document.category}</Badge>
              </DialogTitle>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
                <span>Version {document.version}</span>
                <span>•</span>
                <span>Uploaded by {document.uploadedBy} on {new Date(document.createdAt).toLocaleDateString()}</span>
                {document.entityId && (
                  <>
                    <span>•</span>
                    <span className="text-blue-500 font-mono">Linked: {document.entityId}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <a href={document.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> Open
                </a>
              </Button>
              <Button size="sm">
                <a href={document.url} download>
                  <Download className="h-4 w-4 mr-2" /> Download
                </a>
              </Button>
            </div>
          </div>
          
          {document.tags.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Tag className="h-3 w-3 text-gray-400" />
              {document.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
              ))}
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-black p-4 flex items-center justify-center">
          {isImage ? (
            <div className="relative w-full h-full min-h-[400px]">
              <Image 
                src={document.url} 
                alt={document.filename}
                fill
                className="object-contain"
                unoptimized // Bypassing Next.js image optimization for external user-uploaded docs
              />
            </div>
          ) : isPdf ? (
            <iframe 
              src={`${document.url}#toolbar=0`} 
              className="w-full h-full rounded border border-gray-300 dark:border-gray-700 bg-white"
              title={document.filename}
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">No preview available for this file type.</p>
              <Button>
                <a href={document.url} download>Download to view</a>
              </Button>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
