'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  mediaType: 'image' | 'video';
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({ mediaType, onFileChange }: FileUploadProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="media">Upload {mediaType === 'image' ? 'Image' : 'Video'}</Label>
      <Input
        id="media"
        type="file"
        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        onChange={onFileChange}
      />
    </div>
  );
}
