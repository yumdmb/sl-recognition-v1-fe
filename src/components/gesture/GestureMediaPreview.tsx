'use client'

import React from 'react';
import { Label } from "@/components/ui/label";

interface GestureMediaPreviewProps {
  previewUrl: string | null;
  mediaType: 'image' | 'video';
}

export default function GestureMediaPreview({ previewUrl, mediaType }: GestureMediaPreviewProps) {
  if (!previewUrl) return null;

  return (
    <div className="mt-4">
      <Label>Preview</Label>
      <div className="mt-2 space-y-2">
        {mediaType === 'image' ? (
          <img
            src={previewUrl}
            alt="Gesture preview"
            className="max-w-full h-auto rounded-lg border"
          />
        ) : (
          <video
            src={previewUrl}
            controls
            className="max-w-full h-auto rounded-lg border"
          />
        )}
        <p className="text-sm text-muted-foreground">
          This {mediaType} will be included with your gesture contribution.
        </p>
      </div>
    </div>
  );
}
