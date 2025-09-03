// lib/youtube.ts

// YouTube Player Types
export interface YouTubePlayerOptions {
  onReady?: () => void;
  onError?: (error: number) => void;
  onStateChange?: (state: number) => void;
}

export interface YouTubePlayer {
  play(): void;
  pause(): void;
  stop(): void;
  setVolume(volume: number): void;
  getVolume(): number;
  seekTo(seconds: number): void;
  destroy(): void;
}

// Enhanced YouTube Channel Types
export interface YouTubeChannelInfo {
  channelId: string;
  handle?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  customUrl?: string;
  publishedAt: string;
  country?: string;
  topics?: string[];
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export interface YouTubeChannelStats {
  totalVideos: number;
  totalViews: number;
  averageViewsPerVideo: number;
  uploadFrequency: string;
  engagementRate: number;
  lastUploadDate: string;
}

/**
 * Parses a YouTube URL or handle to extract the channel ID or handle.
 * @param urlOrHandle - The YouTube URL or handle (e.g., @username)
 * @returns An object containing the channelId or handle.
 */
export function parseYouTubeExternalId(urlOrHandle: string): { channelId?: string; handle?: string } {
  if (urlOrHandle.startsWith('@')) {
    return { handle: urlOrHandle.substring(1) };
  }
  
  try {
    const url = new URL(urlOrHandle);
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/channel/')) {
        return { channelId: url.pathname.split('/')[2] };
      }
      if (url.pathname.startsWith('/@')) {
        return { handle: url.pathname.substring(2) };
      }
      if (url.pathname.startsWith('/c/')) {
        return { handle: url.pathname.substring(3) };
      }
      if (url.pathname.startsWith('/user/')) {
        return { handle: url.pathname.substring(6) };
      }
    }
  } catch (error) {
    // Not a valid URL, assume it's a handle if it doesn't start with @
    if (!urlOrHandle.startsWith('@')) {
      return { handle: urlOrHandle };
    }
  }

  return {};
}

/**
 * Fetches comprehensive channel information from YouTube API
 * @param channelId - The YouTube channel ID
 * @returns Detailed channel information
 */
export async function fetchChannelInfo(channelId: string): Promise<YouTubeChannelInfo> {
  const apiKey = process.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const channel = data.items?.[0];

    if (!channel) {
      throw new Error('Channel not found');
    }

    return {
      channelId: channel.id,
      handle: channel.snippet.customUrl ? channel.snippet.customUrl.substring(1) : undefined,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
      videoCount: parseInt(channel.statistics.videoCount || '0'),
      viewCount: parseInt(channel.statistics.viewCount || '0'),
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      country: channel.snippet.country,
      topics: channel.snippet.topicCategories?.map((topic: string) => 
        topic.replace('https://en.wikipedia.org/wiki/', '')
      ),
      statistics: channel.statistics
    };
  } catch (error) {
    console.error('Error fetching channel info:', error);
    throw new Error(`Failed to fetch channel information: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Resolves a YouTube handle to a channel ID using the YouTube API.
 * @param handle - The YouTube handle (e.g., username)
 * @returns The YouTube channel ID (UC...).
 */
export async function resolveHandleToChannelId(handle: string): Promise<string> {
  const apiKey = process.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  try {
    // First try to find by handle
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const channel = data.items?.[0];

    if (channel) {
      return channel.snippet.channelId;
    }

    // If not found, try with @ symbol
    const handleWithAt = handle.startsWith('@') ? handle : `@${handle}`;
    const responseWithAt = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handleWithAt)}&key=${apiKey}`
    );

    if (!responseWithAt.ok) {
      throw new Error(`YouTube API error: ${responseWithAt.status}`);
    }

    const dataWithAt = await responseWithAt.json();
    const channelWithAt = dataWithAt.items?.[0];

    if (channelWithAt) {
      return channelWithAt.snippet.channelId;
    }

    throw new Error(`Could not find YouTube channel for handle: ${handle}`);
  } catch (error) {
    console.error('Error resolving handle to channel ID:', error);
    throw new Error(`Failed to resolve handle: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetches channel statistics and analytics
 * @param channelId - The YouTube channel ID
 * @returns Channel statistics and analytics
 */
export async function fetchChannelStats(channelId: string): Promise<YouTubeChannelStats> {
  const apiKey = process.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  try {
    // Get recent videos to calculate upload frequency and engagement
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=50&type=video&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      throw new Error(`YouTube API error: ${videosResponse.status}`);
    }

    const videosData = await videosResponse.json();
    const videos = videosData.items || [];

    // Calculate upload frequency (last 10 videos)
    const recentVideos = videos.slice(0, 10);
    const uploadDates = recentVideos.map((video: any) => new Date(video.snippet.publishedAt));
    const averageDaysBetweenUploads = uploadDates.length > 1 
      ? uploadDates.reduce((acc, date, i) => {
          if (i === 0) return 0;
          const daysDiff = (uploadDates[i-1].getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
          return acc + daysDiff;
        }, 0) / (uploadDates.length - 1)
      : 0;

    let uploadFrequency = 'Unknown';
    if (averageDaysBetweenUploads > 0) {
      if (averageDaysBetweenUploads < 1) uploadFrequency = 'Daily';
      else if (averageDaysBetweenUploads < 7) uploadFrequency = 'Weekly';
      else if (averageDaysBetweenUploads < 30) uploadFrequency = 'Monthly';
      else uploadFrequency = 'Occasionally';
    }

    return {
      totalVideos: videos.length,
      totalViews: videos.reduce((acc: number, video: any) => acc + (parseInt(video.statistics?.viewCount || '0')), 0),
      averageViewsPerVideo: videos.length > 0 
        ? videos.reduce((acc: number, video: any) => acc + (parseInt(video.statistics?.viewCount || '0')), 0) / videos.length
        : 0,
      uploadFrequency,
      engagementRate: 0, // Would need to fetch like/dislike counts for accurate calculation
      lastUploadDate: videos[0]?.snippet.publishedAt || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching channel stats:', error);
    throw new Error(`Failed to fetch channel statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a YouTube playlist player for background music
 * @param containerId - The ID of the container element
 * @param playlistId - The YouTube playlist ID
 * @param options - Player options including callbacks
 * @returns YouTube player instance
 */
export function createPlaylistPlayer(
  containerId: string,
  playlistId: string,
  options: YouTubePlayerOptions = {}
): YouTubePlayer {
  // Ensure YouTube API is loaded
  if (!(window as any).YT) {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);
    
    // Return a mock player while API loads
    const mockPlayer: YouTubePlayer = {
      play: () => {},
      pause: () => {},
      stop: () => {},
      setVolume: () => {},
      getVolume: () => 0,
      seekTo: () => {},
      destroy: () => {}
    };
    
    // Replace with real player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      const realPlayer = createPlayer();
      Object.assign(mockPlayer, realPlayer);
    };
    
    return mockPlayer;
  }
  
  return createPlayer();
  
  function createPlayer(): YouTubePlayer {
    const ytPlayer = new (window as any).YT.Player(containerId, {
      videoId: playlistId, // For playlists, we'll use the first video
      playerVars: {
        controls: 0,
        autoplay: 0,
        loop: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playlist: playlistId
      },
      events: {
        onReady: (event: { target: any }) => {
          event.target.setVolume(30);
          options.onReady?.();
        },
        onStateChange: (event: { data: number }) => {
          options.onStateChange?.(event.data);
        },
        onError: (event: { data: number }) => {
          options.onError?.(event.data);
        }
      }
    });

    return {
      play: () => ytPlayer.playVideo(),
      pause: () => ytPlayer.pauseVideo(),
      stop: () => ytPlayer.stopVideo(),
      setVolume: (volume: number) => ytPlayer.setVolume(volume),
      getVolume: () => ytPlayer.getVolume(),
      seekTo: (seconds: number) => ytPlayer.seekTo(seconds, true),
      destroy: () => ytPlayer.destroy()
    };
  }
}

/**
 * Fetches the latest videos for a given YouTube channel using the YouTube Data API v3.
 * @param channelId - The ID of the YouTube channel.
 * @param pageToken - The token for the next page of results.
 * @returns A list of video items and a token for the next page.
 */
export async function fetchChannelVideos(channelId: string, pageToken?: string) {
  const apiKey = process.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('[YouTube] API key not configured');
    throw new Error('YouTube API key not configured');
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('order', 'date');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('type', 'video');
    url.searchParams.set('key', apiKey);
    
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid response from YouTube API');
    }

    // Transform the response to match our expected format
    const items = data.items.map((item: any) => ({
      external_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      published_at: item.snippet.publishedAt,
      thumb_url: item.snippet.thumbnails?.high?.url || 
                 item.snippet.thumbnails?.medium?.url || 
                 item.snippet.thumbnails?.default?.url,
      duration_seconds: 0, // YouTube search API doesn't provide duration
      view_count: 0, // YouTube search API doesn't provide view count
      channel_title: item.snippet.channelTitle,
      channel_id: item.snippet.channelId
    }));

    return {
      items,
      nextPageToken: data.nextPageToken,
    };
  } catch (error) {
    console.error('[YouTube] Error fetching channel videos:', error);
    throw new Error(`Failed to fetch channel videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetches detailed video information including view count and duration.
 * This requires a separate API call as the search API doesn't provide these details.
 * @param videoIds - Array of YouTube video IDs
 * @returns Detailed video information
 */
export async function fetchVideoDetails(videoIds: string[]) {
  const apiKey = process.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('[YouTube] API key not configured');
    throw new Error('YouTube API key not configured');
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part', 'snippet,statistics,contentDetails');
    url.searchParams.set('id', videoIds.join(','));
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid response from YouTube API');
    }

    return data.items.map((item: any) => ({
      external_id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      published_at: item.snippet.publishedAt,
      thumb_url: item.snippet.thumbnails?.high?.url || 
                 item.snippet.thumbnails?.medium?.url || 
                 item.snippet.thumbnails?.default?.url,
      duration_seconds: parseDuration(item.contentDetails.duration),
      view_count: parseInt(item.statistics.viewCount || '0'),
      like_count: parseInt(item.statistics.likeCount || '0'),
      comment_count: parseInt(item.statistics.commentCount || '0'),
      channel_title: item.snippet.channelTitle,
      channel_id: item.snippet.channelId
    }));
  } catch (error) {
    console.error('[YouTube] Error fetching video details:', error);
    throw new Error(`Failed to fetch video details: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parses YouTube duration format (PT4M13S) to seconds
 * @param duration - YouTube duration string
 * @returns Duration in seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}