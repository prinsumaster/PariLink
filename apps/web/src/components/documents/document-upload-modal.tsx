'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/documents';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentUploadModal({ isOpen, onClose }: DocumentUploadModalProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('OTHER');
  const [entityId, setEntityId] = useState('');
  const [tags, setTags] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('No file selected');
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      return documentService.uploadDocument(file, category, entityId, tagsArray);
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      resetAndClose();
    },
    onError: () => toast.error('Failed to upload document')
  });

  const resetAndClose = () => {
    setFile(null);
    setCategory('OTHER');
    setEntityId('');
    setTags('');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Securely upload PDFs, images, or Office files to the DMS.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          
          <div className="space-y-2">
            <Label>Select File</Label>
            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${file ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}>
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">{file.name}</p>
                  <p className="text-xs text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button size="sm" variant="outline" onClick={() => setFile(null)}>
                    <X className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click to browse or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG, DOCX up to 50MB</p>
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VEHICLE">Vehicle Record</SelectItem>
                <SelectItem value="DRIVER">Driver Profile</SelectItem>
                <SelectItem value="SHIPMENT">Shipment Manifest</SelectItem>
                <SelectItem value="CUSTOMER">Customer Contract</SelectItem>
                <SelectItem value="LEGAL">Legal & Compliance</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Linked Entity ID (Optional)</Label>
            <Input 
              placeholder="e.g. Driver ID, Order ID" 
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (Optional, comma separated)</Label>
            <Input 
              placeholder="invoice, signed, 2026" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={!file || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
