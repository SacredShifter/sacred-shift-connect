import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Sparkles, 
  Brain, 
  Heart, 
  Users, 
  Clock, 
  Settings,
  Play,
  Pause,
  Volume2,
  Maximize,
  BookOpen,
  Lightbulb,
  Crown,
  Star,
  Plus,
  Globe,
  Eye,
  ThumbsUp,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useContentSources, ContentSource, ContentItem } from '@/hooks/useContentSources';
import { listChannels } from '@/actions/listChannels';
import { listContent } from '@/actions/listContent';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { YouTubeVideo } from '@/types/youtube';
import { mapContentItemToYouTubeVideo } from '@/utils/videoMapping';
import { Skeleton } from '@/components/ui/skeleton';

// Enhanced Sacred Library with real data integration
const EnhancedLibrarySimple: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Real data state
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // UI state
  const [viewMode, setViewMode] = useState<'lotus' | 'grid' | 'list' | 'resonance' | 'timeline'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [filters, setFilters] = useState({
    consciousnessLevel: 'all',
    contentType: 'all',
    energyFrequency: 'all',
    resonanceScore: [0, 100],
    duration: 'all'
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'resonance' | 'date' | 'duration'>('date');
  const [selectedVideo, setSelectedVideo] = useState<ContentItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  
  // Modal states for header buttons
  const [showCollectiveWisdom, setShowCollectiveWisdom] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCreationTools, setShowCreationTools] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load sources on mount
  useEffect(() => {
    const loadSources = async () => {
      try {
        setLoading(true);
        const sourcesData = await listChannels();
        setSources(sourcesData);
      } catch (error) {
        toast({
          title: "Error loading sources",
          description: error instanceof Error ? error.message : "Failed to load content sources",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSources();
  }, [toast]);

  // Load content when source changes
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setContentItems([]);
        setNextCursor(undefined);
        
        const { items, nextCursor: newCursor } = await listContent({
          sourceId: selectedSource === 'all' ? undefined : selectedSource
        });
        
        setContentItems(items);
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

  // Filter and sort content
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDuration = filters.duration === 'all' || 
      (filters.duration === 'short' && item.duration_seconds && item.duration_seconds <= 600) ||
      (filters.duration === 'medium' && item.duration_seconds && item.duration_seconds > 600 && item.duration_seconds <= 1800) ||
      (filters.duration === 'long' && item.duration_seconds && item.duration_seconds > 1800);
    
    return matchesSearch && matchesDuration;
  }).sort((a, b) => {
    switch (sortBy) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Sacred Library</h1>
            <p className="text-lg text-muted-foreground">
              Your personal temple of consciousness and wisdom
            </p>
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
              variant={showAnalytics ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
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
              variant={showSettings ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Sacred Timing Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Sacred Timing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🌒</div>
                <div className="font-medium capitalize">Waxing Moon</div>
                <div className="text-sm text-gray-600">Lunar Phase</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl mb-2">☀️</div>
                <div className="font-medium capitalize">Morning</div>
                <div className="text-sm text-gray-600">Solar Position</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl mb-2">🎵</div>
                <div className="font-medium">528Hz</div>
                <div className="text-sm text-gray-600">Energy Frequency</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <div className="text-sm font-medium mb-1">Meditation Guidance</div>
              <div className="text-sm text-gray-600">
                Channel the growing energy into your goals and aspirations. 
                Focus on learning and building momentum during this waxing phase.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consciousness Profile */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Consciousness Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white bg-purple-600">
                🌱
              </div>
              <div>
                <div className="font-semibold text-lg">Sacred Initiate</div>
                <div className="text-sm text-gray-600">0 points</div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full w-0" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Filters & Settings</CardTitle>
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

                {/* Content Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select value={filters.contentType} onValueChange={(value) => setFilters(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Select value={filters.duration} onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Duration</SelectItem>
                      <SelectItem value="short">Short (≤10 min)</SelectItem>
                      <SelectItem value="medium">Medium (10-30 min)</SelectItem>
                      <SelectItem value="long">Long (&gt;30 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resonance Score */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Resonance Score: {filters.resonanceScore[0]}-{filters.resonanceScore[1]}%
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
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="resonance">Resonance</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
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
                  { mode: 'grid', icon: Grid, label: 'Grid' },
                  { mode: 'list', icon: List, label: 'List' },
                  { mode: 'resonance', icon: Heart, label: 'Resonance' },
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
              
              <div className="text-sm text-gray-600">
                {filteredContent.length} content items
              </div>
            </div>

            {/* Content Display */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-3 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === 'lotus' ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🪷</div>
                  <h3 className="text-xl font-medium mb-2">Sacred Lotus View</h3>
                  <p className="text-gray-600">Sacred geometry navigation coming soon</p>
                </div>
              </Card>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No content found</h3>
                <p className="text-gray-600 mb-4">
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
                {filteredContent.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => handlePlayVideo(item)}>
                    <div className="relative">
                      {item.thumbnail_url ? (
                        <img 
                          src={item.thumbnail_url} 
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
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
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
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
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
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

      {/* Feature Modals */}
      <AnimatePresence>
        {/* Collective Wisdom Modal */}
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
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Collective Wisdom
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCollectiveWisdom(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🧠</div>
                  <h4 className="text-lg font-medium mb-2">Collective Wisdom Hub</h4>
                  <p className="text-gray-600 mb-4">
                    Connect with fellow seekers, share insights, and discover wisdom from the community.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="p-4 text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                      <h5 className="font-medium">Wisdom Circles</h5>
                      <p className="text-sm text-gray-600">Join consciousness circles</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <h5 className="font-medium">Insights</h5>
                      <p className="text-sm text-gray-600">Share your discoveries</p>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Analytics Modal */}
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnalytics(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Consciousness Analytics
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAnalytics(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-4 text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <h4 className="font-medium mb-1">Progress Tracking</h4>
                    <p className="text-sm text-gray-600">Monitor your consciousness journey</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <h4 className="font-medium mb-1">Energy Patterns</h4>
                    <p className="text-sm text-gray-600">Analyze your learning patterns</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <h4 className="font-medium mb-1">Learning Style</h4>
                    <p className="text-sm text-gray-600">Discover your optimal learning path</p>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Creation Tools Modal */}
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
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Content Creation Tools
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCreationTools(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✨</div>
                  <h4 className="text-lg font-medium mb-2">Create & Annotate</h4>
                  <p className="text-gray-600 mb-4">
                    Add your own insights, create sacred annotations, and build your personal wisdom library.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Card className="p-4 text-center">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <h5 className="font-medium">Sacred Journal</h5>
                      <p className="text-sm text-gray-600">Document your journey</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <h5 className="font-medium">Annotations</h5>
                      <p className="text-sm text-gray-600">Add insights to content</p>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Ecosystem Modal */}
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
              className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Living Ecosystem
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowEcosystem(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌐</div>
                  <h4 className="text-lg font-medium mb-2">Living Library Network</h4>
                  <p className="text-gray-600 mb-4">
                    Experience the self-evolving consciousness network that connects all seekers.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Card className="p-4 text-center">
                      <div className="text-2xl mb-2">🔄</div>
                      <h5 className="font-medium">Sync</h5>
                      <p className="text-sm text-gray-600">Cross-platform sync</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl mb-2">🧬</div>
                      <h5 className="font-medium">Evolve</h5>
                      <p className="text-sm text-gray-600">Self-evolving content</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl mb-2">🔗</div>
                      <h5 className="font-medium">Connect</h5>
                      <p className="text-sm text-gray-600">API integrations</p>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Sacred Library Settings
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSettings(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default View Mode</label>
                    <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid View</SelectItem>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="lotus">Sacred Lotus</SelectItem>
                        <SelectItem value="resonance">Resonance View</SelectItem>
                        <SelectItem value="timeline">Timeline View</SelectItem>
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
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="resonance">Resonance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Items Per Page</label>
                    <Select defaultValue="12">
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
    </div>
  );
};

export default EnhancedLibrarySimple;
