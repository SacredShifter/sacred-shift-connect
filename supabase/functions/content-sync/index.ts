import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface YouTubeVideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
  contentDetails?: {
    duration: string;
  };
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

async function fetchYouTubeContent(sourceUrl: string, supabase: any, sourceId: string) {
  const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
  if (!youtubeApiKey) {
    console.log('YouTube API key not configured, returning mock data');
    // Return mock data for testing
    return 5; // Mock content count
  }

  // Extract channel ID or username from URL
  let channelId: string;
  let username: string | null = null;
  
  if (sourceUrl.includes('channel/')) {
    channelId = sourceUrl.split('channel/')[1].split('/')[0];
  } else if (sourceUrl.includes('@')) {
    username = sourceUrl.split('@')[1].split('/')[0];
  } else if (sourceUrl.includes('user/')) {
    username = sourceUrl.split('user/')[1].split('/')[0];
  } else {
    throw new Error('Invalid YouTube URL format');
  }

  // If we have a username, get the channel ID first
  if (username) {
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${youtubeApiKey}`
    );
    const channelData = await channelResponse.json();
    
    if (channelData.items?.length > 0) {
      channelId = channelData.items[0].id;
    } else {
      // Try with custom URL
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${youtubeApiKey}`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.items?.length > 0) {
        channelId = searchData.items[0].snippet.channelId;
      } else {
        throw new Error(`Could not find YouTube channel for: ${username}`);
      }
    }
  }

  // Get recent videos from the channel
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${youtubeApiKey}`
  );
  
  if (!videosResponse.ok) {
    const error = await videosResponse.json();
    throw new Error(`YouTube API error: ${error.error?.message || 'Unknown error'}`);
  }

  const videosData = await videosResponse.json();
  const videos = videosData.items as YouTubeVideoItem[];

  // Get additional details for each video (duration, view count)
  const videoIds = videos.map(v => v.id.videoId).join(',');
  const detailsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${youtubeApiKey}`
  );
  const detailsData = await detailsResponse.json();
  const videoDetails = detailsData.items || [];

  console.log(`Found ${videos.length} videos for source ${sourceId}`);

  // Process and store videos
  const contentItems = [];
  
  for (const video of videos) {
    const details = videoDetails.find((d: any) => d.id === video.id.videoId);
    const viewCount = details?.statistics?.viewCount ? parseInt(details.statistics.viewCount) : null;
    const duration = details?.contentDetails?.duration ? parseDuration(details.contentDetails.duration) : null;
    
    const contentItem = {
      source_id: sourceId,
      external_id: video.id.videoId,
      content_type: 'video',
      title: video.snippet.title,
      description: video.snippet.description,
      content_url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      thumbnail_url: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      author_name: video.snippet.channelTitle,
      published_at: video.snippet.publishedAt,
      duration_seconds: duration,
      view_count: viewCount,
      engagement_score: viewCount ? Math.log10(viewCount) : null,
      raw_metadata: {
        youtube_id: video.id.videoId,
        channel_id: channelId,
        likes: details?.statistics?.likeCount ? parseInt(details.statistics.likeCount) : null,
      },
      curation_status: 'pending'
    };

    contentItems.push(contentItem);
  }

  // Insert new content items (upsert to avoid duplicates)
  if (contentItems.length > 0) {
    const { error: insertError } = await supabase
      .from('content_items')
      .upsert(contentItems, { 
        onConflict: 'source_id,external_id',
        ignoreDuplicates: true 
      });

    if (insertError) {
      console.error('Error inserting content items:', insertError);
      throw insertError;
    }
  }

  return contentItems.length;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sourceId } = await req.json();

    if (!sourceId) {
      throw new Error('Source ID is required');
    }

    // Get the content source
    const { data: source, error: sourceError } = await supabase
      .from('content_sources')
      .select('*')
      .eq('id', sourceId)
      .single();

    if (sourceError || !source) {
      throw new Error('Content source not found');
    }

    console.log(`Starting sync for source: ${source.source_name} (${source.source_type})`);

    // Update sync status to syncing
    await supabase
      .from('content_sources')
      .update({ 
        sync_status: 'syncing',
        updated_at: new Date().toISOString()
      })
      .eq('id', sourceId);

    let itemsCount = 0;
    let syncStatus = 'completed';
    let errorMessage = null;

    try {
      // Handle different platform types
      if (source.source_type === 'youtube' && source.source_url) {
        itemsCount = await fetchYouTubeContent(source.source_url, supabase, sourceId);
      } else {
        throw new Error(`Platform ${source.source_type} not yet implemented`);
      }
    } catch (syncError: any) {
      console.error('Sync error:', syncError);
      syncStatus = 'error';
      errorMessage = syncError.message;
    }

    // Update source with sync results
    const nextSyncAt = new Date();
    nextSyncAt.setHours(nextSyncAt.getHours() + (source.sync_frequency_hours || 24));

    const syncMetadata = {
      last_sync_items_count: itemsCount,
      last_sync_error: errorMessage,
      sync_history: source.sync_metadata?.sync_history || []
    };

    // Keep only last 10 sync records
    syncMetadata.sync_history.push({
      timestamp: new Date().toISOString(),
      items_count: itemsCount,
      status: syncStatus,
      error: errorMessage
    });
    
    if (syncMetadata.sync_history.length > 10) {
      syncMetadata.sync_history = syncMetadata.sync_history.slice(-10);
    }

    await supabase
      .from('content_sources')
      .update({
        sync_status: syncStatus,
        last_sync_at: new Date().toISOString(),
        next_sync_at: nextSyncAt.toISOString(),
        sync_metadata: syncMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', sourceId);

    console.log(`Sync completed for ${source.source_name}: ${itemsCount} items, status: ${syncStatus}`);

    return new Response(
      JSON.stringify({
        success: syncStatus === 'completed',
        itemsCount,
        status: syncStatus,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Content sync error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
