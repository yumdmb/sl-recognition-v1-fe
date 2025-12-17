'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForumService } from '@/lib/services/forumService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageAttachmentUploadProps {
  onUploadComplete: (attachment: { id: string; file_url: string; file_name: string }) => void;
  postId?: string;
  commentId?: string;
  disabled?: boolean;
}

export function ImageAttachmentUpload({
  onUploadComplete,
  postId,
  commentId,
  disabled = false
}: ImageAttachmentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = useCallback((file: File) => {
    const validation = ForumService.validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return false;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
    return true;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, [disabled, validateAndSetFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }, [validateAndSetFile]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const attachment = await ForumService.uploadAttachment(selectedFile, postId, commentId);
      onUploadComplete({
        id: attachment.id,
        file_url: attachment.file_url,
        file_name: attachment.file_name
      });
      // Clear state after successful upload
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag and drop an image, or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg object-contain mx-auto"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleClear}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {selectedFile && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
