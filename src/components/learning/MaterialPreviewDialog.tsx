'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, FileWarning } from 'lucide-react';
import { Material } from '@/types/database';

interface MaterialPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
}

// Helper function to determine preview type from MIME type or file extension
const getPreviewType = (material: Material): 'pdf' | 'image' | 'video' | 'office' | 'unsupported' => {
  const type = material.type?.toLowerCase() || '';
  const filePath = material.file_path?.toLowerCase() || '';
  
  // Check MIME types
  if (type.includes('pdf') || filePath.endsWith('.pdf')) {
    return 'pdf';
  }
  
  if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(filePath)) {
    return 'image';
  }
  
  if (type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/.test(filePath)) {
    return 'video';
  }
  
  // Office documents
  if (
    type.includes('powerpoint') ||
    type.includes('presentation') ||
    type.includes('msword') ||
    type.includes('document') ||
    type.includes('excel') ||
    type.includes('spreadsheet') ||
    /\.(ppt|pptx|doc|docx|xls|xlsx)$/.test(filePath)
  ) {
    return 'office';
  }
  
  return 'unsupported';
};

const MaterialPreviewDialog: React.FC<MaterialPreviewDialogProps> = ({
  open,
  onOpenChange,
  material
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!material) return null;

  const previewType = getPreviewType(material);
  const fileUrl = material.download_url;


  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Reset state when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setIsLoading(true);
      setHasError(false);
    }
    onOpenChange(newOpen);
  };

  const renderPreview = () => {
    if (hasError || previewType === 'unsupported') {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <FileWarning className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {hasError ? 'Preview failed to load' : 'Preview not available'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {hasError 
              ? 'There was an error loading the preview. Please try downloading the file instead.'
              : 'This file type cannot be previewed in the browser. Please download to view.'}
          </p>
          <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
            <Button>
              <FileDown className="mr-2 h-4 w-4" /> Download File
            </Button>
          </a>
        </div>
      );
    }

    switch (previewType) {
      case 'pdf':
        return (
          <div className="relative w-full h-[70vh]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full rounded-md border"
              onLoad={handleLoad}
              onError={handleError}
              title={material.title}
            />
          </div>
        );

      case 'image':
        return (
          <div className="relative flex items-center justify-center min-h-[300px] max-h-[70vh]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <img
              src={fileUrl}
              alt={material.title}
              className="max-w-full max-h-[70vh] object-contain rounded-md"
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        );

      case 'video':
        return (
          <div className="relative w-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <video
              src={fileUrl}
              controls
              className="w-full max-h-[70vh] rounded-md"
              onLoadedData={handleLoad}
              onError={handleError}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'office':
        // Use Microsoft Office Online Viewer
        const encodedUrl = encodeURIComponent(fileUrl);
        const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
        
        return (
          <div className="relative w-full h-[70vh]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading Office Viewer...</span>
              </div>
            )}
            <iframe
              src={officeViewerUrl}
              className="w-full h-full rounded-md border"
              onLoad={handleLoad}
              onError={handleError}
              title={material.title}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 pr-10">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-semibold flex-1">{material.title}</DialogTitle>
            <a href={fileUrl} download target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" /> Download
              </Button>
            </a>
          </div>
        </DialogHeader>
        
        {renderPreview()}
      </DialogContent>
    </Dialog>
  );
};

export default MaterialPreviewDialog;

