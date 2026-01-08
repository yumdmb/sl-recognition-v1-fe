'use client';

import { FileText, FileSpreadsheet, File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileAttachmentProps {
  fileName: string;
  fileUrl: string;
  fileType: string;
  className?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType === 'application/pdf') {
    return <FileText className="h-8 w-8 text-red-500" />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <FileText className="h-8 w-8 text-blue-500" />;
  }
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
    return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
  }
  if (fileType === 'text/plain') {
    return <FileText className="h-8 w-8 text-gray-500" />;
  }
  return <File className="h-8 w-8 text-muted-foreground" />;
};

const getFileTypeLabel = (fileType: string): string => {
  if (fileType === 'application/pdf') return 'PDF';
  if (fileType.includes('word') || fileType.includes('document')) return 'Word';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Excel';
  if (fileType === 'text/plain') return 'Text';
  return 'File';
};

export function FileAttachment({ fileName, fileUrl, fileType, className }: FileAttachmentProps) {
  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors',
        className
      )}
    >
      {getFileIcon(fileType)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={fileName}>
          {fileName}
        </p>
        <p className="text-xs text-muted-foreground">
          {getFileTypeLabel(fileType)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="flex-shrink-0"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
