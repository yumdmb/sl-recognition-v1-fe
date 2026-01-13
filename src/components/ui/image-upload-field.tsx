'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploadService } from '@/lib/services/imageUploadService';
import { Upload, Link, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  disabled?: boolean;
}

/**
 * Reusable image upload component that supports both file upload and URL input.
 * Automatically handles Supabase Storage uploads for file inputs.
 */
export function ImageUploadField({
  value,
  onChange,
  folder = 'general',
  label = 'Image',
  disabled = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>(value ? 'url' : 'upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    try {
      const url = await ImageUploadService.uploadImage(file, folder);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Upload className="h-4 w-4" /> {label} (optional)
      </Label>

      {value ? (
        // Show preview when image is set
        <div className="relative inline-block">
          <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border bg-muted">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        // Show upload options when no image
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'url')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-1">
              <Upload className="h-3 w-3" /> Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-1">
              <Link className="h-3 w-3" /> URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-3">
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                disabled={disabled || uploading}
                className="flex-1"
              />
              {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, GIF, or WebP. Max 5MB.
            </p>
          </TabsContent>

          <TabsContent value="url" className="mt-3">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a direct URL to an image.
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
