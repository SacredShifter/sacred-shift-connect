// Placeholder for actions/listContent.ts
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from '@/hooks/useContentSources';

export async function listContent(opts: { sourceId?: string, limit?: number, cursor?: string }): Promise<{ items: ContentItem[], nextCursor?: string }> {
  console.log('Listing content with options', opts);
  let query = supabase.from('content_items').select('*');

  if (opts.sourceId) {
    query = query.eq('source_id', opts.sourceId);
  }

  const limit = opts.limit || 20;
  query = query.limit(limit);

  if (opts.cursor) {
    // This is a simplified cursor implementation based on created_at.
    // A more robust implementation would use a proper cursor field.
    query = query.lt('created_at', opts.cursor);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to list content', error);
    return { items: [], nextCursor: undefined };
  }

  const nextCursor = data && data.length === limit ? data[data.length - 1].created_at : undefined;

  return { items: data || [], nextCursor };
}
