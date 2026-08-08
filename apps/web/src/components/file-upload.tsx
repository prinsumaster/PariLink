'use client';

import { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'done' | 'error';
  preview?: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
  label?: string;
  hint?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  accept = 'image/*,application/pdf',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  onUpload,
  className,
  label = 'Drag & drop files here',
  hint = 'PDF, PNG, JPG up to 10MB',
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const processFiles = useCallback(
    async (rawFiles: FileList | null) => {
      if (!rawFiles) return;
      const arr = Array.from(rawFiles).filter((f) => f.size <= maxSize);
      const mapped: UploadedFile[] = arr.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        status: 'uploading' as const,
      }));
      setFiles((prev) => [...prev, ...mapped]);

      if (onUpload) {
        await onUpload(arr);
        setFiles((prev) =>
          prev.map((f) =>
            mapped.find((m) => m.name === f.name) ? { ...f, status: 'done' } : f
          )
        );
      } else {
        // Simulate upload
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              mapped.find((m) => m.name === f.name) ? { ...f, status: 'done' } : f
            )
          );
        }, 1500);
      }
    },
    [maxSize, onUpload]
  );

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); }}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer',
          dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900/30'
        )}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className={cn('h-8 w-8', dragOver ? 'text-blue-500' : 'text-gray-400')} />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        </div>
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900"
            >
              <File className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              {file.status === 'uploading' && (
                <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              )}
              {file.status === 'done' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
              {file.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFiles((prev) => prev.filter((_, idx) => idx !== i));
                }}
                className="ml-1 h-5 w-5 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
