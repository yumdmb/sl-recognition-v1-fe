'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GestureFileUploadProps {
  mediaType: 'image' | 'video';
  onFileChange: (file: File) => void;
}

export default function GestureFileUpload({ mediaType, onFileChange }: GestureFileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="media">Upload {mediaType === 'image' ? 'Image' : 'Video'}</Label>
      <Input
        id="media"
        type="file"
        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
        className="min-h-[44px]"
      />
      <p className="text-sm text-muted-foreground">
        {mediaType === 'image' 
          ? 'Upload a clear image showing the gesture. Supported formats: JPG, PNG, GIF.'
          : 'Upload a video demonstrating the gesture. Supported formats: MP4, MOV, AVI.'
        }
      </p>
    </div>
  );
}
