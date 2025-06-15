// YouTube utilities for extracting metadata from YouTube videos

export interface YouTubeVideoInfo {
  title: string;
  description: string;
  duration?: string; // Now optional since we don't use it anymore
  thumbnail: string;
  videoId: string;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:youtube\.com\/.*[?&]v=)([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Formats duration from seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Gets the best quality thumbnail URL for a YouTube video
 */
export function getYouTubeThumbnail(videoId: string): string {
  // Try to get high quality thumbnail first
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * Validates if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Fetches YouTube video metadata using YouTube Data API v3
 * Note: This requires an API key and should be called from a server endpoint
 */
export async function fetchYouTubeMetadata(videoId: string, apiKey: string): Promise<YouTubeVideoInfo | null> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video data');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;

    // Parse ISO 8601 duration (PT4M13S) to seconds
    const duration = parseISO8601Duration(contentDetails.duration);

    return {
      title: snippet.title,
      description: snippet.description,
      duration: formatDuration(duration),
      thumbnail: getYouTubeThumbnail(videoId),
      videoId: videoId
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

/**
 * Parses ISO 8601 duration string to seconds
 * Example: PT4M13S = 253 seconds
 */
function parseISO8601Duration(duration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    return 0;
  }

  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Alternative method using oEmbed API (doesn't require API key but has limited info)
 */
export async function fetchYouTubeMetadataOEmbed(url: string): Promise<Partial<YouTubeVideoInfo> | null> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      return null;
    }

    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch video data');
    }

    const data = await response.json();

    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      videoId: videoId,
      // Note: oEmbed doesn't provide duration, so we'll use a placeholder
      duration: "0:00"
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata via oEmbed:', error);
    return null;
  }
}
