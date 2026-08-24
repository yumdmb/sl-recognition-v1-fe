'use client'

import React from 'react';
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, Video, UploadCloud } from 'lucide-react';

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
    <div className="w-full">
      <label
        htmlFor="media"
        className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-accent/50"
      >
        <span className={`grid size-14 place-items-center rounded-2xl ${mediaType === 'image' ? 'bg-primary-soft text-primary' : 'bg-sky/10 text-sky'}`}>
          {mediaType === 'image' ? <ImageIcon className="size-6" /> : <Video className="size-6" />}
        </span>
        <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold">
          <UploadCloud className="size-4 text-primary" />
          Upload {mediaType === 'image' ? 'Image' : 'Video'}
        </span>
        <span className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {mediaType === 'image'
            ? 'Click to browse ΓÇö a clear image showing the gesture. Supported formats: JPG, PNG, GIF.'
            : 'Click to browse ΓÇö a video demonstrating the gesture. Supported formats: MP4, MOV, AVI.'
          }
        </span>
        <span className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white">
          Browse files
        </span>
      </label>
      <Input
        id="media"
        type="file"
        className="hidden"
        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileChange}
      />
    </div>
  );
}
