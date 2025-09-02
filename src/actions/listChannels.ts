// Placeholder for actions/listChannels.ts
import { supabase } from '@/integrations/supabase/client';
import { ContentSource } from '@/hooks/useContentSources';

export async function listChannels(): Promise<ContentSource[]> {
  console.log('Listing channels');
  const { data, error } = await supabase.from('content_sources').select('*');
  if (error) {
    console.error('Failed to list channels', error);
    return [];
  }
  return data || [];
}
