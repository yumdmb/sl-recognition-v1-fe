'use client'

import React, { useState } from 'react';
import { Play, ExternalLink, Loader2 } from 'lucide-react';
import { extractVideoId } from '@/lib/utils/youtube';

interface YouTubeVideoPreviewProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string | null;
  className?: string;
  autoPlay?: boolean;
}

const YouTubeVideoPreview: React.FC<YouTubeVideoPreviewProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  className = '',
  autoPlay = false
}) => {
  const [showVideo, setShowVideo] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    );
  }

  const handlePlayVideo = () => {
    setIsLoading(true);
    setShowVideo(true);
  };

  const openInYouTube = () => {
    window.open(videoUrl, '_blank');
  };

  const getThumbnailUrl = () => {
    if (thumbnailUrl) return thumbnailUrl;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  if (showVideo) {
    return (
      <div className={`relative w-full ${className}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
          onLoad={() => setIsLoading(false)}
        />
        <button
          onClick={() => setShowVideo(false)}
          className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className={`relative group cursor-pointer ${className}`}>
      <img
        src={getThumbnailUrl()}
        alt={title}
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          // Fallback to standard YouTube thumbnail if maxres fails
          e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <div className="flex gap-3">
          <button
            onClick={handlePlayVideo}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
            title="Play video"
          >
            <Play className="h-6 w-6 fill-current" />
          </button>
          <button
            onClick={openInYouTube}
            className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition-colors"
            title="Open in YouTube"
          >
            <ExternalLink className="h-6 w-6" />
          </button>
        </div>
      </div>      {/* Duration badge removed */}

      {/* YouTube logo */}
      <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        YouTube
      </div>
    </div>
  );
};

export default YouTubeVideoPreview;
