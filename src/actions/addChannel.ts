'use server';
import { z } from 'zod';
// This assumes you have a server-side Supabase client setup
// For now, let's use the public client, but in a real app this would be different
import { supabase } from '@/integrations/supabase/client';
import { parseYouTubeExternalId, resolveHandleToChannelId } from '@/lib/youtube';
import { revalidatePath } from 'next/cache';

const Input = z.object({
  platform: z.literal('youtube'),
  urlOrHandle: z.string().min(2),
  title: z.string().optional()
});

// This is a placeholder for a real user session check
async function getAuthenticatedUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized: User not authenticated.');
  return user;
}

export async function addChannel(inputRaw: unknown) {
  const input = Input.parse(inputRaw);
  const user = await getAuthenticatedUser();

  const parsed = parseYouTubeExternalId(input.urlOrHandle);

  // In a real app, you would get the channelId from the YouTube API
  // For now, we'll use a mock one based on the handle or a hash
  const channelId = parsed.channelId ?? await resolveHandleToChannelId(parsed.handle ?? input.urlOrHandle);

  const payload = {
    user_id: user.id,
    source_type: 'youtube' as const,
    source_name: input.title ?? parsed.handle ?? channelId,
    source_url: input.urlOrHandle,
    external_id: channelId,
    sync_status: 'active' as const,
    sync_metadata: { handle: parsed.handle ?? null }
  };

  const { data, error } = await supabase
    .from('content_sources')
    .upsert(payload, { onConflict: 'user_id,source_type,external_id' })
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

  // Revalidate the library page to show the new channel
  // This assumes Next.js with app router. Adjust if using pages router.
  revalidatePath('/library');

  return data;
}
