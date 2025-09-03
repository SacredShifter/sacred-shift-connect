import { ContentItem } from '@/hooks/useContentSources';
import { YouTubeVideo } from '@/types/youtube';

// Helper function to convert ContentItem to YouTubeVideo format
export const mapContentItemToYouTubeVideo = (item: ContentItem): YouTubeVideo => {
  return {
    id: item.external_id,
    title: item.title,
    description: item.description || '',
    thumbnail: item.thumbnail_url || '/placeholder-thumbnail.jpg', // Fallback thumbnail
    publishedAt: item.published_at || new Date().toISOString(),
    duration: item.duration_seconds ? formatDuration(item.duration_seconds) : '0:00',
    viewCount: item.view_count?.toString() || '0',
    channelId: item.source_id,
    channelTitle: item.author_name || 'Unknown Channel'
  };
};

// Helper function to format duration from seconds to MM:SS or HH:MM:SS
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Helper function to convert YouTubeVideo back to ContentItem format if needed
export const mapYouTubeVideoToContentItem = (video: YouTubeVideo, sourceId: string): Partial<ContentItem> => {
  return {
    external_id: video.id,
    source_id: sourceId,
    title: video.title,
    description: video.description,
    thumbnail_url: video.thumbnail,
    published_at: video.publishedAt,
    duration_seconds: parseDuration(video.duration),
    view_count: parseInt(video.viewCount) || 0,
    author_name: video.channelTitle,
    content_type: 'video'
  };
};

// Helper function to parse duration string back to seconds
export const parseDuration = (duration: string): number => {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};
