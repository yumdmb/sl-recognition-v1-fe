'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, ExternalLink, Loader2 } from 'lucide-react';
import { extractVideoId } from '@/lib/utils/youtube';

// Progress state type for video tracking
export interface VideoProgressState {
  played: number; // 0 to 1
  playedSeconds: number;
  duration: number;
}

interface YouTubeVideoPreviewProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string | null;
  className?: string;
  autoPlay?: boolean;
  startTime?: number; // Resume position in seconds
  onVideoPlay?: () => void;
  onVideoProgress?: (state: VideoProgressState) => void;
  onVideoEnded?: () => void;
  onVideoPause?: (state: VideoProgressState) => void;
}

const VideoPreview: React.FC<YouTubeVideoPreviewProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  className = '',
  autoPlay = false,
  startTime = 0,
  onVideoPlay,
  onVideoProgress,
  onVideoEnded,
  onVideoPause
}) => {
  const [showVideo, setShowVideo] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const resumePosition = useRef(startTime);
  const latestProgress = useRef<VideoProgressState | null>(null);
  const pauseCallback = useRef(onVideoPause);
  pauseCallback.current = onVideoPause;
  useEffect(() => () => {
    if (latestProgress.current) pauseCallback.current?.(latestProgress.current);
  }, []);
  
  const videoId = extractVideoId(videoUrl);

  // Use onTimeUpdate for tracking progress (native HTML5 video event)
  // Must be defined before early return to follow React hooks rules
  const handleTimeUpdate = useCallback((event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (Number.isFinite(video.duration) && video.duration > 0 && Number.isFinite(video.currentTime)) {
      resumePosition.current = video.currentTime;
      const progress = {
        played: video.currentTime / video.duration,
        playedSeconds: video.currentTime,
        duration: video.duration
      };
      latestProgress.current = progress;
      onVideoProgress?.(progress);
    }
  }, [onVideoProgress]);

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    );
  }

  const handlePlayVideo = () => {
    setHasError(false);
    setHasSeeked(false);
    setIsLoading(true);
    setShowVideo(true);
  };

  const openInYouTube = () => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const getThumbnailUrl = () => {
    if (thumbnailUrl) return thumbnailUrl;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const handleReady = () => {
    setIsLoading(false);
    // Seek to start time if specified and haven't seeked yet
    if (resumePosition.current > 0 && playerRef.current && !hasSeeked) {
      playerRef.current.currentTime = resumePosition.current;
      setHasSeeked(true);
    }
  };

  const handlePlay = () => {
    onVideoPlay?.();
  };

  const handleEnded = () => {
    onVideoEnded?.();
  };

  const handlePause = () => {
    if (latestProgress.current) onVideoPause?.(latestProgress.current);
  };

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 bg-muted p-4 text-center ${className}`}>
        <p role="alert">This video could not be played.</p>
        <button type="button" onClick={handlePlayVideo} className="underline">Try again</button>
        <button type="button" onClick={openInYouTube} className="underline">Open in YouTube</button>
      </div>
    );
  }

  if (showVideo) {
    return (
      <div className={`relative w-full aspect-video ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <ReactPlayer
          ref={playerRef}
          src={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
          height="100%"
          playing={true}
          controls
          onReady={handleReady}
          onPlaying={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() => { setIsLoading(false); setHasError(true); setShowVideo(false); handlePause(); }}
          config={{
            youtube: {
              rel: 0
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0, borderRadius: '0.5rem' }}
        />
        <button
          type="button"
          onClick={() => { handlePause(); setShowVideo(false); }}
          className="absolute top-2 right-2 bg-black/50 text-white px-3 py-2 rounded text-xs hover:bg-black/70 min-h-[44px] flex items-center z-20"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className={`relative group cursor-pointer ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getThumbnailUrl()}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
        onError={(e) => {
          const fallback = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity rounded-lg">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePlayVideo}
            className="bg-red-600 hover:bg-red-700 text-white p-3 md:p-4 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Play video"
          >
            <Play className="h-5 w-5 md:h-6 md:w-6 fill-current" />
          </button>
          <button
            type="button"
            onClick={openInYouTube}
            className="bg-gray-800 hover:bg-gray-900 text-white p-3 md:p-4 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Open in YouTube"
          >
            <ExternalLink className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoPreview(props: YouTubeVideoPreviewProps) {
  return <VideoPreview key={props.videoUrl} {...props} />;
}
