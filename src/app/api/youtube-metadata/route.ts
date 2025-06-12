import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeMetadataOEmbed, extractVideoId, getYouTubeThumbnail, formatDuration } from '@/lib/utils/youtube';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Try to fetch metadata using oEmbed first (no API key required)
    const metadata = await fetchYouTubeMetadataOEmbed(url);

    if (!metadata) {
      return NextResponse.json(
        { error: 'Failed to fetch video metadata' },
        { status: 404 }
      );
    }

    // Enhance the metadata with our own logic
    const enhancedMetadata = {
      title: metadata.title || 'YouTube Video',
      description: '', // oEmbed doesn't provide description
      duration: metadata.duration || '0:00',
      thumbnail: getYouTubeThumbnail(videoId),
      videoId: videoId,
      originalUrl: url
    };

    return NextResponse.json(enhancedMetadata);

  } catch (error) {
    console.error('Error in YouTube metadata API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
