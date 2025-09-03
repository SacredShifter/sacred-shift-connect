import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PetalGlyph } from './PetalGlyph';
import { CurationHub } from './CurationHub';
import { ContentSource } from '@/hooks/useContentSources';
import { listChannels } from '@/actions/listChannels';
import { supabase } from '@/integrations/supabase/client';
import { AddSourceDialog } from '@/components/ContentManager/AddSourceDialog';
import ResonanceSearch from '@/components/ContentDiscovery/ResonanceSearch';
import SacredGeometryGrid from '@/components/ContentGrid/SacredGeometryGrid';
import ResonanceTimeline from '@/components/ContentTimeline/ResonanceTimeline';
import { Plus, RefreshCw, Filter, Globe, BarChart3, Settings, Brain, Monitor, Search, Sparkles, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPlatformConfig, getSourceIcon, getSourceColor } from '@/lib/content-sources';
import { Button } from '@/components/ui/button';
import { Thumbnail } from '@/components/ui/ImageWithFallback';

export type ContentPlatform = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'podcast' | 'blog' | 'newsletter' | 'rss' | 'custom';

interface PetalLotusProps {
  className?: string;
}

const GOLDEN_RATIO = 1.618;

export const PetalLotus: React.FC<PetalLotusProps> = ({ className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'lotus' | 'grid' | 'list' | 'resonance' | 'sacred-geometry' | 'timeline'>('lotus');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const channelData = await listChannels();
        setSources(channelData);
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
  }, [toast]);

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
      contentCount: metadata?.contentCount || 0,
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
    <>
      <div className={`relative w-full h-96 flex flex-col ${className}`}>
        {/* Header Bar with View Mode Toggle and Content Count */}
        <div className="flex justify-between items-center p-4 border-b border-border/30 bg-background/80 backdrop-blur-sm z-20">
          {/* Content Sources Count */}
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">{filteredSources.length} Content Sources</div>
            <div className="text-xs text-muted-foreground">
              {filteredSources.filter(s => s.sync_status === 'active').length} Active
            </div>
            {filterStatus !== 'all' && (
              <div className="text-xs text-primary">
                Filter: {filterStatus === 'active' ? 'Active Only' : 'Inactive Only'}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-background border rounded-lg p-1">
            {[
              { mode: 'lotus', icon: Globe, label: 'Lotus' },
              { mode: 'grid', icon: BarChart3, label: 'Grid' },
              { mode: 'list', icon: Settings, label: 'List' },
              { mode: 'resonance', icon: Search, label: 'Resonance' },
              { mode: 'sacred-geometry', icon: Sparkles, label: 'Sacred' },
              { mode: 'timeline', icon: Clock, label: 'Timeline' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === mode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-1" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Now properly spaced below header */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === 'lotus' && renderLotusView()}
          {viewMode === 'grid' && renderGridView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'resonance' && <ResonanceSearch />}
          {viewMode === 'sacred-geometry' && <SacredGeometryGrid content={filteredSources.map(transformToContentItem)} />}
          {viewMode === 'timeline' && <ResonanceTimeline content={filteredSources.map(transformToTimelineItem)} />}
        </div>

        {/* Empty State */}
        {filteredSources.length === 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-medium mb-2">
              {sources.length === 0 ? 'No Content Sources Yet' : 'No Sources Match Filter'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {sources.length === 0 
                ? 'Add your first content source to start building your lotus'
                : `No sources match the "${filterStatus}" filter. Try changing the filter or add new sources.`
              }
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Source
            </Button>
          </motion.div>
        )}
      </div>
      
      <AddSourceDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        defaultPlatform="youtube"
      />
    </>
  );
};