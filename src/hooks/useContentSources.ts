import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ContentSource {
  id: string;
  name: string;
  platform: string;
  source_url: string;
  sync_frequency: string;
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
  user_id: string;
}

export interface ContentItem {
  id: string;
  source_id: string;
  external_id: string;
  title: string;
  description: string | null;
  content_url: string;
  thumbnail_url: string | null;
  published_at: string;
  metadata: any;
  created_at: string;
}

// Mock data until database is ready
const MOCK_SOURCES: ContentSource[] = [
  {
    id: '1',
    name: 'Sacred Geometry YouTube',
    platform: 'youtube',
    source_url: 'https://www.youtube.com/@sacredgeometry',
    sync_frequency: 'daily',
    is_active: true,
    last_sync: new Date().toISOString(),
    created_at: new Date().toISOString(),
    user_id: 'mock'
  },
  {
    id: '2', 
    name: 'Consciousness Facebook Page',
    platform: 'facebook',
    source_url: 'https://facebook.com/consciousness',
    sync_frequency: 'hourly',
    is_active: false,
    last_sync: null,
    created_at: new Date().toISOString(),
    user_id: 'mock'
  }
];

export const useContentSources = () => {
  const [sources, setSources] = useState<ContentSource[]>(MOCK_SOURCES);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSources = async () => {
    // TODO: Replace with actual Supabase call when database is ready
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSources(MOCK_SOURCES);
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
    // TODO: Replace with actual Supabase call when database is ready
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setItems([]);
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

  const addSource = async (sourceData: Omit<ContentSource, 'id' | 'created_at' | 'user_id' | 'last_sync'>) => {
    try {
      const newSource: ContentSource = {
        ...sourceData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        user_id: 'mock',
        last_sync: null
      };
      
      setSources(prev => [newSource, ...prev]);
      toast({
        title: "Source added successfully",
        description: `${sourceData.name} has been added to your content sources.`
      });

      return newSource;
    } catch (error: any) {
      toast({
        title: "Error adding source",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleSource = async (id: string, isActive: boolean) => {
    try {
      setSources(prev => prev.map(source => 
        source.id === id ? { ...source, is_active: isActive } : source
      ));

      toast({
        title: isActive ? "Source activated" : "Source deactivated",
        description: `Content source has been ${isActive ? 'activated' : 'deactivated'}.`
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
      setSources(prev => prev.map(source => 
        source.id === id ? { ...source, last_sync: new Date().toISOString() } : source
      ));

      toast({
        title: "Sync initiated",
        description: "Content sync has been started for this source."
      });
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