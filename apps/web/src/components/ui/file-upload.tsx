import * as React from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud, File, X, FileText, Image as ImageIcon, FileArchive, Loader2 } from 'lucide-react';

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
}

export function FileUpload({
  onFilesSelected,
  accept,
  multiple = true,
  maxSize = 10,
  className,
  ...props
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        // Add size validation if needed
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      {...props}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Click to upload <span className="font-normal text-muted-foreground">or drag and drop</span>
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          SVG, PNG, JPG, PDF or ZIP (max. {maxSize}MB)
        </p>
      </div>
    </div>
  );
}

export interface FilePreviewItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  progress?: number;
  error?: string;
}

interface FilePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  files: FilePreviewItem[];
  onRemove?: (id: string) => void;
}

export function FilePreview({ files, onRemove, className, ...props }: FilePreviewProps) {
  if (!files.length) return null;

  const getFileIcon = (type: string) => {
    if (type.includes('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('zip') || type.includes('compressed')) return <FileArchive className="h-5 w-5 text-amber-500" />;
    return <File className="h-5 w-5 text-slate-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)} {...props}>
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            'group relative flex items-center gap-3 p-3 rounded-lg border bg-card transition-all',
            file.error ? 'border-destructive/50 bg-destructive/5' : 'border-border'
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            {getFileIcon(file.type)}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-foreground truncate" title={file.name}>
              {file.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
              
              {file.progress !== undefined && file.progress < 100 && !file.error && (
                <div className="flex items-center gap-2 flex-1 max-w-[100px]">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums leading-none">
                    {file.progress}%
                  </span>
                </div>
              )}
            </div>
            
            {file.error && (
              <span className="text-xs text-destructive mt-0.5 line-clamp-1">{file.error}</span>
            )}
          </div>

          {onRemove && (
            <button
              onClick={() => onRemove(file.id)}
              className="absolute right-2 top-2 p-1 rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {file.progress !== undefined && file.progress < 100 && !file.error && (
             <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}
