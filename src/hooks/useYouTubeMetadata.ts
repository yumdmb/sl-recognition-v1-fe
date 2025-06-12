import { useState, useEffect } from 'react';
import { isValidYouTubeUrl } from '@/lib/utils/youtube';

export interface YouTubeMetadata {
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  originalUrl: string;
}

export const useYouTubeMetadata = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async (url: string): Promise<YouTubeMetadata | null> => {
    if (!isValidYouTubeUrl(url)) {
      setError('Invalid YouTube URL');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/youtube-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video metadata');
      }

      const data = await response.json();
      setMetadata(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setMetadata(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    metadata,
    error,
    fetchMetadata,
    reset
  };
};
