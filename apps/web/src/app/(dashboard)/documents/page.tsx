'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/documents';
import { DocumentFilters as FilterState, Document } from '@/types/documents';
import { RoleGuard } from '@/components/auth/role-guard';
import { FolderOpen, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { DocumentLibrary } from '@/components/documents/document-library';
import { DocumentFilters } from '@/components/documents/document-filters';
import { DocumentUploadModal } from '@/components/documents/document-upload-modal';
import { DocumentViewer } from '@/components/documents/document-viewer';

export default function DocumentsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FilterState>({ page: 1, limit: 20 });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Viewer State
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['documents', filters],
    queryFn: () => documentService.getDocuments(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      toast.success('Document deleted securely');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: () => toast.error('Failed to delete document')
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE', 'OPERATIONS', 'SALES', 'DISPATCHER']}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="h-8 w-8 text-blue-600" /> Document Library
            </h1>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400 mt-1">Centralized secure storage for contracts, manifests, and profiles.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'OPERATIONS', 'FINANCE', 'SALES']} fallback={null}>
              <Button onClick={() => setIsUploadOpen(true)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all">
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </Button>
            </RoleGuard>
          </div>
        </div>

        <DocumentFilters filters={filters} onChange={setFilters} />
        
        <div className="glass elevation-2 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30 rounded-xl overflow-hidden transition-all duration-300">
          <DocumentLibrary 
            documents={data?.data || []} 
            total={data?.total || 0}
            isLoading={isLoading || isFetching}
            filters={filters}
            onFiltersChange={setFilters}
            onViewDocument={setViewingDoc}
            onDeleteDocument={handleDelete}
          />
        </div>

      </div>

      <DocumentUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <DocumentViewer document={viewingDoc} isOpen={!!viewingDoc} onClose={() => setViewingDoc(null)} />
      
    </RoleGuard>
  );
}
