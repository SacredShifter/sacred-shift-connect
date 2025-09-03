'use server';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { parseYouTubeExternalId } from '@/lib/youtube';

const Input = z.object({
  platform: z.literal('youtube'),
  urlOrHandle: z.string().min(2),
  title: z.string().optional()
});

async function getAuthenticatedUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized: User not authenticated.');
  return user;
}

export async function addChannel(inputRaw: unknown) {
  const input = Input.parse(inputRaw);
  const user = await getAuthenticatedUser();

  try {
    // Parse the YouTube URL or handle
    const parsed = parseYouTubeExternalId(input.urlOrHandle);
    
    if (!parsed.channelId && !parsed.handle) {
      throw new Error('Invalid YouTube URL or handle format');
    }

    // Resolve handle to channel ID if needed
    let channelId: string;
    if (parsed.channelId) {
      channelId = parsed.channelId;
    } else if (parsed.handle) {
      // Use the Edge Function to resolve handle to channel ID
      const { data: channelData, error: channelError } = await supabase.functions.invoke('youtube-api', {
        body: {
          endpoint: 'search',
          params: {
            part: 'snippet',
            q: parsed.handle,
            type: 'channel',
            maxResults: 1
          }
        }
      });

      if (channelError || !channelData?.items?.[0]) {
        throw new Error('Could not resolve YouTube handle to channel ID');
      }

      channelId = channelData.items[0].snippet.channelId;
    } else {
      throw new Error('Could not determine channel ID');
    }

    // Check if channel already exists for this user
    const { data: existingSource } = await supabase
      .from('content_sources')
      .select('id, source_name, sync_status')
      .eq('user_id', user.id)
      .eq('source_type', 'youtube')
      .eq('external_id', channelId)
      .maybeSingle();

    if (existingSource) {
      // Update existing source with new information
      const { data: updatedSource, error: updateError } = await supabase
        .from('content_sources')
        .update({
          source_name: input.title || existingSource.source_name,
          source_url: input.urlOrHandle,
          sync_metadata: {
            handle: parsed.handle,
            lastValidated: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSource.id)
        .select('*')
        .single();

      if (updateError) {
        throw new Error(`Failed to update existing channel: ${updateError.message}`);
      }

      return {
        ...updatedSource,
        action: 'updated',
        message: 'Channel information updated successfully'
      };
    }

    // Create new channel source
    const payload = {
      user_id: user.id,
      source_type: 'youtube' as const,
      source_name: input.title || parsed.handle || channelId,
      source_url: input.urlOrHandle,
      external_id: channelId,
      sync_status: 'active' as const,
      sync_frequency_hours: 24, // Default to daily sync
      sync_metadata: {
        handle: parsed.handle,
        lastValidated: new Date().toISOString(),
        initialSetup: true
      },
      visual_config: {
        petal_position: Math.floor(Math.random() * 8) + 1,
        color_scheme: 'auto',
        display_name: input.title || parsed.handle || channelId
      }
    };

    const { data, error } = await supabase
      .from('content_sources')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('addChannel Supabase error:', {
        message: error.message,
        details: (error as any).details,
        hint: (error as any).hint,
        code: (error as any).code,
        payload
      });
      throw new Error(`Failed to add channel: ${error.message}`);
    }

    // Trigger initial content sync
    try {
      await supabase.functions.invoke('content-sync', {
        body: { sourceId: data.id }
      });
    } catch (syncError) {
      console.warn('Initial sync failed, but channel was added:', syncError);
      // Don't fail the entire operation if sync fails
    }

    return {
      ...data,
      action: 'created',
      message: 'Channel added successfully and initial sync initiated'
    };

  } catch (error) {
    console.error('addChannel error:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('YouTube API error: 403')) {
        throw new Error('YouTube API quota exceeded. Please try again later.');
      }
      if (error.message.includes('Channel not found')) {
        throw new Error('YouTube channel not found. Please check the URL or handle.');
      }
      if (error.message.includes('Invalid YouTube URL')) {
        throw new Error('Please provide a valid YouTube channel URL or handle.');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred while adding the channel.');
  }
}
