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
    <div className="w-full space-y-4">
      <div className="relative grid w-full gap-2 group">
        <Label htmlFor="media" className="sr-only">Upload {mediaType === 'image' ? 'Image' : 'Video'}</Label>
        
        <div className="flex items-center justify-center w-full">
            <label htmlFor="media" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 border-border group-hover:border-primary/50 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-foreground/80"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">
                        {mediaType === 'image' ? 'SVG, PNG, JPG' : 'MP4, WEBM, MOV'}
                    </p>
                </div>
                <Input
                    id="media"
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
        </div> 
      </div>
      
      <div className="text-xs text-center text-muted-foreground bg-secondary/20 p-2 rounded-md">
        {mediaType === 'image' 
          ? 'Clear image showing the gesture.'
          : 'Clear video demonstration.'
        }
      </div>
    </div>
  );
}
