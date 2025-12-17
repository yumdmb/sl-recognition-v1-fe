'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageThumbnailProps {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

// Fixed thumbnail dimensions as per design spec
const THUMBNAIL_MAX_WIDTH = 300;
const THUMBNAIL_MAX_HEIGHT = 200;

export function ImageThumbnail({ src, alt, onClick, className }: ImageThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          'bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm',
          className
        )}
        style={{ width: THUMBNAIL_MAX_WIDTH, height: THUMBNAIL_MAX_HEIGHT }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity',
        className
      )}
      style={{
        maxWidth: THUMBNAIL_MAX_WIDTH,
        maxHeight: THUMBNAIL_MAX_HEIGHT
      }}
      onClick={onClick}
    >
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse rounded-lg"
          style={{ width: THUMBNAIL_MAX_WIDTH, height: THUMBNAIL_MAX_HEIGHT }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-cover rounded-lg transition-opacity',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        style={{
          maxWidth: THUMBNAIL_MAX_WIDTH,
          maxHeight: THUMBNAIL_MAX_HEIGHT,
          objectFit: 'cover'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
