import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MediaHeroBanner } from './MediaHeroBanner';
import { CategoryCarousel } from './CategoryCarousel';
import { UnifiedSearch } from './UnifiedSearch';
import { MediaModal } from './MediaModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MediaCategory {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  color_scheme: string;
  sacred_geometry: string;
  display_order: number;
}

interface MediaItem {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  source_platform: string;
  source_url: string;
  category_name?: string;
  category_id?: string;
  featured_priority: number;
  energy_level: number;
  consciousness_level: string;
  genre_tags: string[];
  mood_tags: string[];
  teaching_notes?: string;
  created_at: string;
}

export const UnifiedMediaLibrary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [featuredContent, setFeaturedContent] = useState<MediaItem[]>([]);
  const [categoryContent, setCategoryContent] = useState<{[key: string]: MediaItem[]}>({});
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load categories and content
  useEffect(() => {
    loadCategories();
    loadFeaturedContent();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('media_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
      
      // Load content for each category
      if (data) {
        loadCategoryContent(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        variant: "destructive",
        title: "Error loading categories",
        description: "Failed to load media categories. Please try again."
      });
    }
  };

  const loadFeaturedContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          media_categories!content_items_category_id_fkey(name)
        `)
        .gt('featured_priority', 0)
        .order('featured_priority', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const formattedData = data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        thumbnail_url: item.thumbnail_url || '',
        source_platform: item.source_platform || 'unknown',
        source_url: item.source_url || '',
        category_name: item.media_categories?.name,
        category_id: item.category_id,
        featured_priority: item.featured_priority || 0,
        energy_level: item.energy_level || 0,
        consciousness_level: item.consciousness_level || 'beginner',
        genre_tags: item.genre_tags || [],
        mood_tags: item.mood_tags || [],
        teaching_notes: item.teaching_notes,
        created_at: item.created_at
      })) || [];
      
      setFeaturedContent(formattedData);
    } catch (error) {
      console.error('Error loading featured content:', error);
    }
  };

  const loadCategoryContent = async (categoriesList: MediaCategory[]) => {
    try {
      const contentPromises = categoriesList.map(async (category) => {
        const { data, error } = await supabase
          .from('content_items')
          .select(`
            *,
            media_categories!content_items_category_id_fkey(name)
          `)
          .eq('category_id', category.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;
        
        return {
          categoryId: category.id,
          content: data?.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            thumbnail_url: item.thumbnail_url || '',
            source_platform: item.source_platform || 'unknown',
            source_url: item.source_url || '',
            category_name: item.media_categories?.name,
            category_id: item.category_id,
            featured_priority: item.featured_priority || 0,
            energy_level: item.energy_level || 0,
            consciousness_level: item.consciousness_level || 'beginner',
            genre_tags: item.genre_tags || [],
            mood_tags: item.mood_tags || [],
            teaching_notes: item.teaching_notes,
            created_at: item.created_at
          })) || []
        };
      });

      const results = await Promise.all(contentPromises);
      const contentByCategory: {[key: string]: MediaItem[]} = {};
      
      results.forEach(({ categoryId, content }) => {
        contentByCategory[categoryId] = content;
      });
      
      setCategoryContent(contentByCategory);
      setLoading(false);
    } catch (error) {
      console.error('Error loading category content:', error);
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase
        .rpc('search_unified_media', {
          search_query: query,
          limit_count: 50
        });

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching content:', error);
      toast({
        variant: "destructive",
        title: "Search error",
        description: "Failed to search content. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsPlayerOpen(true);
  };

  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedMedia(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      {/* Search */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20">
        <div className="max-w-7xl mx-auto p-4">
          <UnifiedSearch
            onSearch={handleSearch}
            isSearching={isSearching}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Search Results for "{searchQuery}"
            </h2>
            <CategoryCarousel
              title=""
              items={searchResults}
              onPlayMedia={handlePlayMedia}
              colorScheme="#8A2BE2"
            />
          </motion.div>
        </div>
      )}

      {/* Hero Banner */}
      {!searchQuery && featuredContent.length > 0 && (
        <MediaHeroBanner
          featuredContent={featuredContent.slice(0, 5)}
          onPlayMedia={handlePlayMedia}
        />
      )}

      {/* Category Carousels */}
      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          {categories.map((category) => {
            const categoryItems = categoryContent[category.id] || [];
            if (categoryItems.length === 0) return null;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: category.display_order * 0.1 }}
              >
                <CategoryCarousel
                  title={category.name}
                  description={category.description}
                  items={categoryItems}
                  onPlayMedia={handlePlayMedia}
                  colorScheme={category.color_scheme}
                  iconName={category.icon_name}
                  sacredGeometry={category.sacred_geometry}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-96 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Content Available</h3>
            <p className="text-muted-foreground">
              Check back soon for sacred content curated for your consciousness journey.
            </p>
          </motion.div>
        </div>
      )}

      {/* Media Player Modal */}
      <MediaModal
        media={selectedMedia}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
      />
    </div>
  );
};