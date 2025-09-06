import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PetalGlyph } from './PetalGlyph';
import { CurationHub } from './CurationHub';
import { ContentSource, ContentItem } from '@/hooks/useContentSources';
import { listChannels } from '@/actions/listChannels';
import { listContent } from '@/actions/listContent';
import { supabase } from '@/integrations/supabase/client';
import { AddSourceDialog } from '@/components/ContentManager/AddSourceDialog';
import ResonanceSearch from '@/components/ContentDiscovery/ResonanceSearch';
import SacredGeometryGrid from '@/components/ContentGrid/SacredGeometryGrid';
import ResonanceTimeline from '@/components/ContentTimeline/ResonanceTimeline';
import { SacredGeometryVisualizer } from '@/components/SacredGeometryVisualizer';
import { SeedOfLife } from '@/components/ContentGrid/SeedOfLife';
import { Plus, RefreshCw, Filter, Globe, BarChart3, Settings, Brain, Monitor, Search, Sparkles, Clock, Users, Heart, Waves, Zap, Crown, Star, Eye, ThumbsUp, Calendar, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getPlatformConfig, getSourceIcon, getSourceColor } from '@/lib/content-sources';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Thumbnail } from '@/components/ui/ImageWithFallback';
import { YouTubeVideo } from '@/types/youtube';
import { mapContentItemToYouTubeVideo } from '@/utils/videoMapping';

export type ContentPlatform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'podcast' | 'blog' | 'newsletter' | 'rss' | 'custom';

interface PetalLotusProps {
  className?: string;
}

const GOLDEN_RATIO = 1.618;

export const PetalLotus: React.FC<PetalLotusProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Existing state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'lotus' | 'grid' | 'list' | 'resonance' | 'sacred-geometry' | 'timeline'>('lotus');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Sacred Library state
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [filters, setFilters] = useState({
    consciousnessLevel: 'all',
    contentType: 'all',
    energyFrequency: 'all',
    resonanceScore: [0, 100],
    duration: 'all'
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'resonance' | 'date' | 'duration'>('resonance');
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  // Sacred geometry state
  const [sacredGeometry, setSacredGeometry] = useState<'flower-of-life' | 'seed-of-life' | 'merkaba' | 'torus'>('flower-of-life');
  const [coherenceLevel, setCoherenceLevel] = useState(0.5);
  const [isResonanceActive, setIsResonanceActive] = useState(false);
  
  // Modal states for sacred features
  const [showCollectiveWisdom, setShowCollectiveWisdom] = useState(false);
  const [showConsciousnessAnalytics, setShowConsciousnessAnalytics] = useState(false);
  const [showCreationTools, setShowCreationTools] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [showSacredSettings, setShowSacredSettings] = useState(false);

  // Calculate mock consciousness resonance for content
  const calculateMockResonance = (item: ContentItem): number => {
    const title = item.title.toLowerCase();
    const description = (item.description || '').toLowerCase();
    const text = `${title} ${description}`;
    
    // Sacred keywords and their resonance values
    const sacredKeywords = {
      'meditation': 0.9, 'consciousness': 0.9, 'spiritual': 0.8, 'sacred': 0.8,
      'wisdom': 0.8, 'enlightenment': 0.9, 'awakening': 0.9, 'mindfulness': 0.8,
      'healing': 0.7, 'transformation': 0.7, 'energy': 0.6, 'frequency': 0.7,
      'vibration': 0.7, 'resonance': 0.8, 'love': 0.8, 'peace': 0.7,
      'truth': 0.9, 'divine': 0.8, 'transcendence': 0.8, 'presence': 0.8,
      'awareness': 0.8, 'compassion': 0.8, 'light': 0.6, 'breath': 0.6
    };
    
    let resonance = 0.3; // Base resonance
    let keywordCount = 0;
    
    for (const [keyword, value] of Object.entries(sacredKeywords)) {
      if (text.includes(keyword)) {
        resonance += value * 0.1; // Add 10% of keyword value
        keywordCount++;
      }
    }
    
    // Normalize and add some randomness for demonstration
    resonance = Math.min(1, resonance + Math.random() * 0.2);
    return Math.round(resonance * 100) / 100;
  };

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const channelData = await listChannels();
        setSources(channelData);
        
        // Update coherence based on source diversity
        const diversityScore = channelData.length / 10; // Normalize to 0-1
        setCoherenceLevel(Math.min(1, diversityScore));
      } catch (error) {
        console.error('Error fetching sources:', error);
        toast({
          title: "Error loading sources",
          description: "Failed to load your content sources",
          variant: "destructive"
        });
      }
    };
    fetchSources();
    
    // Set up periodic refresh to check for sync updates
    const refreshInterval = setInterval(fetchSources, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  // Load content with consciousness resonance scoring
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setContentItems([]);
        setNextCursor(undefined);
        
        const { items, nextCursor: newCursor } = await listContent({
          sourceId: selectedSource === 'all' ? undefined : selectedSource
        });
        
        // Calculate consciousness resonance for each item
        const itemsWithResonance = items.map((item) => {
          const resonanceScore = calculateMockResonance(item);
          return { ...item, consciousnessResonance: resonanceScore };
        });
        
        setContentItems(itemsWithResonance);
        setNextCursor(newCursor);
      } catch (error) {
        toast({
          title: "Error loading content",
          description: error instanceof Error ? error.message : "Failed to load content",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [selectedSource, toast]);

  // Convert ContentItems to YouTubeVideos for display
  useEffect(() => {
    const mappedVideos = contentItems.map(mapContentItemToYouTubeVideo);
    setYoutubeVideos(mappedVideos);
  }, [contentItems]);

  // Filter sources based on current filter status
  const filteredSources = useMemo(() => {
    switch (filterStatus) {
      case 'active':
        return sources.filter(s => s.sync_status === 'active');
      case 'inactive':
        return sources.filter(s => s.sync_status !== 'active');
      default:
        return sources;
    }
  }, [sources, filterStatus]);

  // Filter and sort content by consciousness resonance
  const filteredContent = useMemo(() => {
    return contentItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDuration = filters.duration === 'all' || 
        (filters.duration === 'short' && item.duration_seconds && item.duration_seconds <= 600) ||
        (filters.duration === 'medium' && item.duration_seconds && item.duration_seconds > 600 && item.duration_seconds <= 1800) ||
        (filters.duration === 'long' && item.duration_seconds && item.duration_seconds > 1800);
      
      const resonance = (item as any).consciousnessResonance || 0.5;
      const matchesResonance = resonance >= filters.resonanceScore[0] / 100 &&
                              resonance <= filters.resonanceScore[1] / 100;
      
      return matchesSearch && matchesDuration && matchesResonance;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'resonance':
          return ((b as any).consciousnessResonance || 0) - ((a as any).consciousnessResonance || 0);
        case 'date':
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
        case 'duration':
          return (b.duration_seconds || 0) - (a.duration_seconds || 0);
        case 'relevance':
          return (b.engagement_score || 0) - (a.engagement_score || 0);
        default:
          return 0;
      }
    });
  }, [contentItems, searchQuery, filters, sortBy]);

  const petalPositions = useMemo(() => {
    return filteredSources.map((_, index) => {
      const angle = (index * (360 / filteredSources.length));
      const radius = 120 * GOLDEN_RATIO;
      return {
        x: Math.cos(angle * (Math.PI / 180)) * radius,
        y: Math.sin(angle * (Math.PI / 180)) * radius,
      };
    });
  }, [filteredSources.length]);

  // Helper functions for content display
  const handlePlayVideo = (video: ContentItem) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number | null) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getResonanceColor = (resonance: number) => {
    if (resonance >= 0.8) return 'text-green-500';
    if (resonance >= 0.6) return 'text-yellow-500';
    if (resonance >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getResonanceLabel = (resonance: number) => {
    if (resonance >= 0.9) return 'Divine Resonance';
    if (resonance >= 0.8) return 'High Resonance';
    if (resonance >= 0.6) return 'Good Resonance';
    if (resonance >= 0.4) return 'Low Resonance';
    return 'No Resonance';
  };

  const hubActions = [
    {
      icon: Plus,
      label: 'Add Source',
      onClick: () => setIsAddDialogOpen(true),
    },
    {
      icon: RefreshCw,
      label: isSyncing ? 'Syncing...' : 'Sync All',
      onClick: async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        try {
          // Trigger sync for all active sources
          const activeSources = sources.filter(s => s.sync_status === 'active');
          for (const source of activeSources) {
            try {
              await supabase.functions.invoke('content-sync', {
                body: { sourceId: source.id }
              });
            } catch (error) {
              console.warn(`Failed to sync source ${source.source_name}:`, error);
            }
          }
          
          toast({ 
            title: 'Sync Complete', 
            description: `Synced ${activeSources.length} content sources` 
          });
          
          // Refresh sources to get updated sync status
          const channelData = await listChannels();
          setSources(channelData);
        } catch (error) {
          toast({
            title: 'Sync Failed',
            description: 'Some sources failed to sync. Check console for details.',
            variant: 'destructive'
          });
        } finally {
          setIsSyncing(false);
        }
      },
    },
    {
      icon: Filter,
      label: 'Filter',
      onClick: () => {
        // Cycle through filter options
        const filterOptions: Array<'all' | 'active' | 'inactive'> = ['all', 'active', 'inactive'];
        const currentIndex = filterOptions.indexOf(filterStatus);
        const nextFilter = filterOptions[(currentIndex + 1) % filterOptions.length];
        setFilterStatus(nextFilter);
        
        const filterLabels = {
          all: 'All Sources',
          active: 'Active Sources Only',
          inactive: 'Inactive Sources Only'
        };
        
        toast({ 
          title: 'Filter Applied', 
          description: `Showing ${filterLabels[nextFilter]}` 
        });
      },
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      onClick: () => {
        setShowAnalytics(!showAnalytics);
        toast({ 
          title: showAnalytics ? 'Analytics Hidden' : 'Analytics Shown', 
          description: showAnalytics ? 'Analytics panel closed' : 'Analytics panel opened' 
        });
      },
    },
    {
      icon: Search,
      label: 'Resonance Search',
      onClick: () => setViewMode('resonance'),
    },
    {
      icon: Sparkles,
      label: 'Sacred Geometry',
      onClick: () => setViewMode('sacred-geometry'),
    },
    {
      icon: Clock,
      label: 'Resonance Timeline',
      onClick: () => setViewMode('timeline'),
    },
  ];

  const getSourceStats = (source: ContentSource) => {
    const metadata = (source as any).sync_metadata;
    return {
      contentCount: metadata?.last_sync_items_count || 0,
      lastSync: source.last_sync_at ? new Date(source.last_sync_at).toLocaleDateString() : 'Never',
      syncStatus: source.sync_status || 'inactive',
      platform: source.source_type as ContentPlatform
    };
  };

  // Transform ContentSource to ContentItem for sacred geometry grid
  const transformToContentItem = (source: ContentSource) => ({
    id: source.id,
    title: source.source_name,
    description: `Content from ${source.source_name}`,
    consciousness_level: 'intermediate',
    energy_frequency: '528Hz',
    archetype: 'healer',
    thumbnail_url: undefined,
    resonance_score: Math.floor(Math.random() * 40) + 60 // Random score 60-100
  });

  // Transform ContentSource to TimelineItem for resonance timeline
  const transformToTimelineItem = (source: ContentSource) => ({
    id: source.id,
    title: source.source_name,
    description: `Content from ${source.source_name}`,
    consciousness_level: 'intermediate',
    energy_frequency: '528Hz',
    archetype: 'healer',
    timestamp: new Date(source.created_at || Date.now()),
    resonance_score: Math.floor(Math.random() * 40) + 60,
    content_type: 'video',
    lunar_phase: 'waxing',
    solar_position: 'afternoon'
  });

  const renderLotusView = () => (
    <motion.div
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Central Hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CurationHub
          isExpanded={isExpanded}
          hasSelection={!!selectedSourceId}
          actions={hubActions}
        />
      </motion.div>

             {/* Platform Petals */}
       {filteredSources.map((source, index) => {
         const position = petalPositions[index];
        const isSelected = selectedSourceId === source.id;
        const stats = getSourceStats(source);
        const platformConfig = getPlatformConfig(stats.platform);
        
        return (
          <motion.div
            key={source.id}
            className="absolute top-1/2 left-1/2 cursor-pointer group"
            style={{
              transform: `translate(${position.x - 50}px, ${position.y - 50}px)`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isSelected ? 1.2 : 1,
              opacity: 1
            }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              type: "spring"
            }}
            whileHover={{ scale: isSelected ? 1.3 : 1.1 }}
            onClick={() => setSelectedSourceId(isSelected ? undefined : source.id)}
          >
            <PetalGlyph
              platform={stats.platform}
              isSelected={isSelected}
              isActive={stats.syncStatus === 'active'}
              syncHealth={0.85}
              contentCount={stats.contentCount}
            />
            
            {/* Hover Info */}
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
            >
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                <div className="font-medium">{source.source_name}</div>
                <div className="text-gray-300">{stats.contentCount} items</div>
                <div className="text-gray-300">Last sync: {stats.lastSync}</div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filteredSources.map((source) => {
        const stats = getSourceStats(source);
        const platformConfig = getPlatformConfig(stats.platform);
        
        return (
          <motion.div
            key={source.id}
            className="bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ y: -2 }}
            onClick={() => setSelectedSourceId(selectedSourceId === source.id ? undefined : source.id)}
          >
            <div className="flex items-center gap-3 mb-3">
                             <Thumbnail
                 src={(source as any).sync_metadata?.channelInfo?.thumbnailUrl}
                 alt={source.source_name}
                 size="md"
                 fallbackIcon={platformConfig.icon}
                 className="flex-shrink-0"
               />
              <div className="flex-1">
                <h3 className="font-medium">{source.source_name}</h3>
                <p className="text-sm text-muted-foreground">{platformConfig.name}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                stats.syncStatus === 'active' ? 'bg-green-500' : 
                stats.syncStatus === 'syncing' ? 'bg-blue-500' : 'bg-gray-400'
              }`} />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Content:</span>
                <span className="font-medium">{stats.contentCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Sync:</span>
                <span className="text-muted-foreground">{stats.lastSync}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`capitalize ${
                  stats.syncStatus === 'active' ? 'text-green-600' : 
                  stats.syncStatus === 'syncing' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {stats.syncStatus}
                </span>
              </div>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await supabase.functions.invoke('content-sync', {
                        body: { sourceId: source.id }
                      });
                      toast({
                        title: 'Sync Started',
                        description: `Syncing ${source.source_name}...`
                      });
                      // Refresh sources after a short delay
                      setTimeout(async () => {
                        const channelData = await listChannels();
                        setSources(channelData);
                      }, 2000);
                    } catch (error) {
                      toast({
                        title: 'Sync Failed',
                        description: `Failed to sync ${source.source_name}`,
                        variant: 'destructive'
                      });
                    }
                  }}
                  disabled={stats.syncStatus === 'syncing'}
                  className="w-full"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${stats.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  {stats.syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2 p-4">
      {filteredSources.map((source) => {
        const stats = getSourceStats(source);
        const platformConfig = getPlatformConfig(stats.platform);
        
        return (
          <motion.div
            key={source.id}
            className="bg-card border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
            whileHover={{ x: 4 }}
            onClick={() => setSelectedSourceId(selectedSourceId === source.id ? undefined : source.id)}
          >
            <div className="flex items-center gap-3">
                             <Thumbnail
                 src={(source as any).sync_metadata?.channelInfo?.thumbnailUrl}
                 alt={source.source_name}
                 size="sm"
                 fallbackIcon={platformConfig.icon}
                 className="flex-shrink-0"
               />
              <div className="flex-1">
                <h3 className="font-medium">{source.source_name}</h3>
                <p className="text-sm text-muted-foreground">{platformConfig.name}</p>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{stats.contentCount} items</div>
                <div className="text-muted-foreground">{stats.lastSync}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                stats.syncStatus === 'active' ? 'bg-green-500' : 
                stats.syncStatus === 'syncing' ? 'bg-blue-500' : 'bg-gray-400'
              }`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sacred Geometry Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <SacredGeometryVisualizer 
          isActive={isResonanceActive}
          coherenceLevel={coherenceLevel}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Sacred Header */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Sacred Library
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              Living Temple of Consciousness and Wisdom
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Resonance Field Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-primary" />
                <span>{Math.round(coherenceLevel * 100)}% Coherence</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant={showCollectiveWisdom ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowCollectiveWisdom(!showCollectiveWisdom)}
            >
              <Users className="w-4 h-4" />
              Collective Wisdom
            </Button>
            
            <Button 
              variant={showConsciousnessAnalytics ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowConsciousnessAnalytics(!showConsciousnessAnalytics)}
            >
              <Brain className="w-4 h-4" />
              Analytics
            </Button>
            
            <Button 
              variant={showCreationTools ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowCreationTools(!showCreationTools)}
            >
              <Plus className="w-4 h-4" />
              Create
            </Button>
            
            <Button 
              variant={showEcosystem ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowEcosystem(!showEcosystem)}
            >
              <Globe className="w-4 h-4" />
              Ecosystem
            </Button>
            
            <Button 
              variant={showSacredSettings ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowSacredSettings(!showSacredSettings)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Consciousness Resonance Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-primary" />
                Consciousness Resonance Field
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌙</div>
                  <div className="font-medium capitalize">Waxing Moon</div>
                  <div className="text-sm text-muted-foreground">Lunar Phase</div>
                  <div className="text-xs text-primary">Optimal for learning</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">☀️</div>
                  <div className="font-medium capitalize">Morning</div>
                  <div className="text-sm text-muted-foreground">Solar Position</div>
                  <div className="text-xs text-primary">High energy time</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="font-medium">528Hz</div>
                  <div className="text-sm text-muted-foreground">Energy Frequency</div>
                  <div className="text-xs text-primary">Love frequency active</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="font-medium">{Math.round(coherenceLevel * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Coherence Level</div>
                  <div className="text-xs text-primary">Field stability</div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Resonance Guidance
                </div>
                <div className="text-sm text-muted-foreground">
                  Channel the growing energy into your goals and aspirations. 
                  Focus on learning and building momentum during this waxing phase.
                  Your consciousness field is {coherenceLevel > 0.7 ? 'highly coherent' : 'developing coherence'}.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sacred Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-gradient-to-b from-background to-muted/20 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Sacred Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Source Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Source</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {sources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.source_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Resonance Score */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Consciousness Resonance: {filters.resonanceScore[0]}-{filters.resonanceScore[1]}%
                  </label>
                  <Slider
                    value={filters.resonanceScore}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, resonanceScore: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resonance">Consciousness Resonance</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sacred Geometry Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sacred Geometry</label>
                  <Select value={sacredGeometry} onValueChange={(value: any) => setSacredGeometry(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flower-of-life">Flower of Life</SelectItem>
                      <SelectItem value="seed-of-life">Seed of Life</SelectItem>
                      <SelectItem value="merkaba">Merkaba</SelectItem>
                      <SelectItem value="torus">Torus Energy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {[
                  { mode: 'lotus', icon: Sparkles, label: 'Sacred Lotus' },
                  { mode: 'grid', icon: BarChart3, label: 'Grid' },
                  { mode: 'list', icon: Settings, label: 'List' },
                  { mode: 'resonance', icon: Heart, label: 'Resonance' },
                  { mode: 'sacred-geometry', icon: Sparkles, label: 'Sacred Geometry' },
                  { mode: 'timeline', icon: Clock, label: 'Timeline' }
                ].map(({ mode, icon: Icon, label }) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode(mode as any)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {filteredContent.length} content items
              </div>
            </div>

            {/* Content Display */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 w-full bg-muted animate-pulse" />
                    <CardContent className="p-4">
                      <div className="h-4 w-3/4 bg-muted animate-pulse mb-2" />
                      <div className="h-3 w-1/2 bg-muted animate-pulse mb-2" />
                      <div className="h-3 w-1/4 bg-muted animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === 'lotus' ? (
              <div className="h-96 flex items-center justify-center">
                <SeedOfLife 
                  content={filteredContent.slice(0, 7)}
                  onContentSelect={handlePlayVideo}
                />
              </div>
            ) : viewMode === 'sacred-geometry' ? (
              <SacredGeometryGrid content={filteredContent} />
            ) : viewMode === 'resonance' ? (
              <ResonanceSearch />
            ) : viewMode === 'timeline' ? (
              <ResonanceTimeline content={filteredContent} />
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    consciousnessLevel: 'all',
                    contentType: 'all',
                    energyFrequency: 'all',
                    resonanceScore: [0, 100],
                    duration: 'all'
                  });
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredContent.map((item) => {
                  const resonance = (item as any).consciousnessResonance || 0.5;
                  return (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-primary/20 hover:border-primary/40"
                          onClick={() => handlePlayVideo(item)}>
                      <div className="relative">
                        {item.thumbnail_url ? (
                          <img 
                            src={item.thumbnail_url} 
                            alt={item.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Play className="w-12 h-12 text-primary" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="lg" className="rounded-full">
                              <Play className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>
                        {item.duration_seconds && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(item.duration_seconds)}
                          </div>
                        )}
                        {/* Resonance Indicator */}
                        <div className="absolute top-2 left-2">
                          <Badge className={`${getResonanceColor(resonance)} bg-background/90`}>
                            {Math.round(resonance * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-4">
                            {item.author_name && (
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {item.author_name}
                              </span>
                            )}
                            {item.view_count && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {formatViewCount(item.view_count)}
                              </span>
                            )}
                          </div>
                          {item.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(item.published_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {getResonanceLabel(resonance)}
                          </div>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {isPlayerOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsPlayerOpen(false)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              {selectedVideo.content_url ? (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={selectedVideo.content_url}
                    className="w-full h-full"
                    allowFullScreen
                    title={selectedVideo.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video not available</p>
                </div>
              )}
              {selectedVideo.description && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedVideo.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sacred Feature Modals */}
      <AnimatePresence>
        {showCollectiveWisdom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCollectiveWisdom(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Collective Wisdom</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🧠</div>
                  <h3 className="text-xl font-medium mb-2">Community Consciousness</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with the collective wisdom of fellow seekers and share your insights
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="p-4">
                      <div className="text-2xl mb-2">🌟</div>
                      <div className="font-medium">Wisdom Circles</div>
                      <div className="text-sm text-muted-foreground">Join sacred circles of learning</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl mb-2">💫</div>
                      <div className="font-medium">Collective Insights</div>
                      <div className="text-sm text-muted-foreground">Share and receive wisdom</div>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showConsciousnessAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConsciousnessAnalytics(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Consciousness Analytics</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-medium mb-2">Your Consciousness Journey</h3>
                  <p className="text-muted-foreground mb-4">
                    Track your spiritual growth and consciousness development
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="p-4">
                      <div className="text-2xl mb-2">📈</div>
                      <div className="font-medium">Growth Metrics</div>
                      <div className="text-sm text-muted-foreground">Track your progress</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="font-medium">Resonance Patterns</div>
                      <div className="text-sm text-muted-foreground">Understand your preferences</div>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCreationTools && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreationTools(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Content Creation Tools</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-medium mb-2">Create Sacred Content</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your wisdom and create content that resonates with consciousness
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="p-4">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="font-medium">Sacred Annotations</div>
                      <div className="text-sm text-muted-foreground">Add your insights</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl mb-2">🎥</div>
                      <div className="font-medium">Video Creation</div>
                      <div className="text-sm text-muted-foreground">Create sacred videos</div>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEcosystem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEcosystem(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Living Ecosystem</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-xl font-medium mb-2">Sacred Network</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with the living ecosystem of consciousness and wisdom
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="p-4">
                      <div className="text-2xl mb-2">🌐</div>
                      <div className="font-medium">Global Network</div>
                      <div className="text-sm text-muted-foreground">Connect worldwide</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl mb-2">🔄</div>
                      <div className="font-medium">Living System</div>
                      <div className="text-sm text-muted-foreground">Evolving consciousness</div>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSacredSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSacredSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Sacred Library Settings</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default View Mode</label>
                    <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lotus">Sacred Lotus</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="resonance">Resonance</SelectItem>
                        <SelectItem value="sacred-geometry">Sacred Geometry</SelectItem>
                        <SelectItem value="timeline">Timeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default Sort</label>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resonance">Consciousness Resonance</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="relevance">Relevance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Items Per Page</label>
                    <Select value="12" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 items</SelectItem>
                        <SelectItem value="12">12 items</SelectItem>
                        <SelectItem value="24">24 items</SelectItem>
                        <SelectItem value="48">48 items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AddSourceDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        defaultPlatform="youtube"
      />
    </div>
  );
};