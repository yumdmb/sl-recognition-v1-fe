"use client";

import React, { useRef } from 'react';
import { Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FileUploadAreaProps {
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  previewUrl,
  onFileChange,
  onRemoveFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`rounded-3xl border-2 border-dashed p-6 text-center transition-colors ${
        previewUrl
          ? 'border-border bg-card'
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
      }`}
    >
      {previewUrl ? (
        <div className="flex flex-col items-center">
          <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
            <img
              src={previewUrl}
              alt="Selected gesture"
              className="max-h-40 max-w-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            className="mt-4 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" /> Remove image
          </Button>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center px-6 py-8"
          onClick={handleClickFileInput}
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <UploadCloud className="size-6" />
          </span>
          <p className="mt-5 text-sm font-semibold">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or GIF (max. 5MB)</p>
          <span className="mt-5 inline-flex items-center justify-center rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-primary">
            <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
            Browse files
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};
