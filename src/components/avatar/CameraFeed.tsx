'use client';

import React from 'react';
import { VideoOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming?: boolean;
  isActive?: boolean;
  label?: string;
  className?: string;
}

/**
 * Botanical-ink camera frame: dark forest panel with soft shadow and a
 * placeholder overlay when the camera is not streaming.
 */
const CameraFeed: React.FC<CameraFeedProps> = ({
  videoRef,
  isStreaming = false,
  isActive,
  label,
  className,
}) => {
  const active = isActive ?? isStreaming;

  return (
    <div
      className={cn(
        'relative aspect-video overflow-hidden rounded-2xl bg-ink shadow-lift',
        className
      )}
    >
      <div className="bg-dots absolute inset-0 opacity-20" aria-hidden />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="relative h-full w-full object-cover"
      />

      {!active && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-mint-soft">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <VideoOff className="size-6" />
          </span>
          {label && <p className="text-sm font-medium">{label}</p>}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
