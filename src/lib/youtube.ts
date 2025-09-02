// lib/youtube.ts

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
 * Resolves a YouTube handle to a channel ID using the YouTube API.
 * This is a placeholder and would require a real API call.
 * @param handle - The YouTube handle (e.g., username)
 * @returns The YouTube channel ID (UC...).
 */
export async function resolveHandleToChannelId(handle: string): Promise<string> {
  // In a real implementation, you would use the YouTube Data API v3.
  // This would require an API key and fetching from:
  // https://www.googleapis.com/youtube/v3/channels?forUsername={handle}&key={API_KEY}
  // For now, we'll return a mock ID.
  console.warn(`[YouTube] Mock resolving handle: @${handle}. Using mock ID.`);
  return `UC_mock_${handle}_ID`;
}

/**
 * Fetches the latest videos for a given YouTube channel.
 * This is a placeholder and would require a real API call.
 * @param channelId - The ID of the YouTube channel.
 * @param pageToken - The token for the next page of results.
 * @returns A list of video items and a token for the next page.
 */
export async function fetchChannelVideos(channelId: string, pageToken?: string) {
  // In a real implementation, you would use the YouTube Data API v3.
  // This would require an API key and fetching from:
  // https://www.googleapis.com/youtube/v3/search?channelId={channelId}&part=snippet,id&order=date&maxResults=50&key={API_KEY}
  console.warn(`[YouTube] Mock fetching videos for channel: ${channelId}.`);

  return {
    items: [
      { external_id: 'mock_video_1', title: 'Mock Video 1', description: 'This is a mock video.', published_at: new Date().toISOString(), thumb_url: 'https://placehold.co/320x180', duration_seconds: 120 },
      { external_id: 'mock_video_2', title: 'Mock Video 2', description: 'This is another mock video.', published_at: new Date().toISOString(), thumb_url: 'https://placehold.co/320x180', duration_seconds: 240 },
    ],
    nextPageToken: undefined,
  };
}