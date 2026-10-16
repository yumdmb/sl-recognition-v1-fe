import { useState, useCallback, useRef, useEffect } from 'react';
import { isValidYouTubeUrl } from '@/lib/utils/youtube';

export interface YouTubeMetadata {
  title: string;
  description: string;
  duration?: string; // Now optional since we don't use it anymore
  thumbnail: string;
  videoId: string;
  originalUrl: string;
}

export const useYouTubeMetadata = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);
  useEffect(() => () => { requestRef.current++; }, []);

  const fetchMetadata = useCallback(async (url: string): Promise<YouTubeMetadata | null> => {
    const request = ++requestRef.current;
    setMetadata(null);
    if (!isValidYouTubeUrl(url)) {
      setError('Invalid YouTube URL');
      setIsLoading(false);
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
      if (request !== requestRef.current) return null;
      setMetadata(data);
      return data;
    } catch (err) {
      if (request !== requestRef.current) return null;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      if (request === requestRef.current) setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    requestRef.current++;
    setMetadata(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    metadata,
    error,
    fetchMetadata,
    reset
  };
};
