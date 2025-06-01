'use client'

import React from 'react';
import { Label } from "@/components/ui/label";

interface MediaPreviewProps {
  previewUrl: string;
  mediaType: 'image' | 'video';
}

export default function MediaPreview({ previewUrl, mediaType }: MediaPreviewProps) {
  if (!previewUrl) return null;

  return (
    <div className="mt-4">
      <Label>Preview</Label>
      <div className="mt-2">
        {mediaType === 'image' ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto rounded-lg"
          />
        ) : (
          <video
            src={previewUrl}
            controls
            className="max-w-full h-auto rounded-lg"
          />
        )}
      </div>
    </div>
  );
}
