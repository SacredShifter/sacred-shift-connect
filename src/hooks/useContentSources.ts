import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ContentSource {
  id: string;
  user_id: string;
  source_type: string;
  source_name: string;
  source_url: string | null;
  sync_status: string | null;
  sync_frequency_hours: number | null;
  last_sync_at: string | null;
  next_sync_at: string | null;
  petal_position: number | null;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  source_id: string;
  external_id: string;
  content_type: string;
  title: string;
  description: string | null;
  content_url: string;
  thumbnail_url: string | null;
  author_name: string | null;
  published_at: string | null;
  duration_seconds: number | null;
  view_count: number | null;
  engagement_score: number | null;
  tags: string[] | null;
  curation_status: string | null;
  created_at: string;
  updated_at: string;
}

export const useContentSources = () => {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSources = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('content_sources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSources(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading sources",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (sourceId?: string) => {
    try {
      setLoading(true);
      let query = (supabase as any)
        .from('content_items')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (sourceId) {
        query = query.eq('source_id', sourceId);
      }
      
      const { data, error } = await query.limit(50);
      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading content",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSource = async (sourceData: {
    source_name: string;
    source_type: string;
    source_url?: string;
    sync_frequency_hours?: number;
  }) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User must be authenticated to add content sources');
      }

      const nextSync = new Date();
      nextSync.setHours(nextSync.getHours() + (sourceData.sync_frequency_hours || 24));

      const { data, error } = await (supabase as any)
        .from('content_sources')
        .insert({
          source_name: sourceData.source_name,
          source_type: sourceData.source_type,
          source_url: sourceData.source_url,
          sync_frequency_hours: sourceData.sync_frequency_hours,
          user_id: user.id,
          sync_status: 'pending',
          petal_position: Math.floor(Math.random() * 8) + 1,
          next_sync_at: nextSync.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      setSources(prev => [data, ...prev]);
      toast({
        title: "Source added successfully",
        description: `${sourceData.source_name} has been added to your content sources.`
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error adding source",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleSource = async (id: string, active: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('content_sources')
        .update({ 
          sync_status: active ? 'active' : 'paused',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setSources(prev => prev.map(source => 
        source.id === id ? { 
          ...source, 
          sync_status: active ? 'active' : 'paused',
          updated_at: new Date().toISOString()
        } : source
      ));

      toast({
        title: active ? "Source activated" : "Source paused",
        description: `Content source has been ${active ? 'activated' : 'paused'}.`
      });
    } catch (error: any) {
      toast({
        title: "Error updating source",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const syncSource = async (id: string) => {
    try {
      // Call the content sync edge function
      const { data, error } = await supabase.functions.invoke('content-sync', {
        body: { sourceId: id }
      });

      if (error) throw error;

      // Update local state to show sync initiated
      setSources(prev => prev.map(source => 
        source.id === id ? { 
          ...source, 
          sync_status: 'syncing',
          updated_at: new Date().toISOString()
        } : source
      ));

      toast({
        title: "Sync initiated",
        description: "Content sync has been started for this source."
      });

      // Refresh sources to get updated sync status
      setTimeout(() => fetchSources(), 2000);
    } catch (error: any) {
      toast({
        title: "Error syncing source",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  return {
    sources,
    items,
    loading,
    addSource,
    toggleSource,
    syncSource,
    fetchItems,
    fetchSources
  };
};