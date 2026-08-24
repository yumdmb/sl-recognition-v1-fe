'use client'

import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X } from 'lucide-react';

interface GestureMediaPreviewProps {
  previewUrl: string | null;
  mediaType: 'image' | 'video';
  onClearMedia?: () => void;
}

export default function GestureMediaPreview({ previewUrl, mediaType, onClearMedia }: GestureMediaPreviewProps) {
  if (!previewUrl) return null;

  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          <Eye className="size-3.5 text-primary" />
          Preview
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{mediaType}</Badge>
          {onClearMedia && (
            <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={onClearMedia} aria-label="Clear media">
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        {mediaType === 'image' ? (
          <img
            src={previewUrl}
            alt="Gesture preview"
            className="h-auto max-w-full"
          />
        ) : (
          <video
            src={previewUrl}
            controls
            className="h-auto max-w-full"
          />
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        This {mediaType} will be included with your gesture contribution.
      </p>
    </div>
  );
}
