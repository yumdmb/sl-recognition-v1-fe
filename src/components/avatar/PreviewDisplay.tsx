'use client';

import React from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewDisplayProps {
  image?: string | null;
  video?: string | null;
  alt?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Media preview panel following the botanical-ink patterns:
 * rounded media surface with a friendly empty placeholder.
 */
const PreviewDisplay: React.FC<PreviewDisplayProps> = ({
  image,
  video,
  alt = 'Preview',
  emptyMessage = 'No preview available',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-muted',
        className
      )}
    >
      {image ? (
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      ) : video ? (
        <video src={video} controls className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="grid size-12 place-items-center rounded-2xl bg-background text-muted-foreground/70">
            <ImageIcon className="size-6" />
          </span>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PreviewDisplay;
