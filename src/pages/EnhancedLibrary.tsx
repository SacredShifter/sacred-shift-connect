import React, { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Enhanced Components
import { SacredGeometryLotus } from '@/components/SacredLibrary/SacredGeometryLotus';
import { SacredPlayer } from '@/components/SacredLibrary/SacredPlayer';
import { CollectiveWisdom } from '@/components/SacredLibrary/CollectiveWisdom';
import { ConsciousnessAnalytics } from '@/components/SacredLibrary/ConsciousnessAnalytics';
import { ContentCreationTools } from '@/components/SacredLibrary/ContentCreationTools';
import { LivingEcosystem } from '@/components/SacredLibrary/LivingEcosystem';

// Hooks and Services
import { useConsciousnessTracking } from '@/hooks/useConsciousnessTracking';
import { useContentSources } from '@/hooks/useContentSources';
import { resonanceEngine } from '@/lib/resonance-engine';
import { sacredTimingEngine } from '@/lib/sacred-timing';
import { ConsciousnessProfile, ResonanceScore } from '@/types/consciousness';
import { ContentItem } from '@/hooks/useContentSources';

const EnhancedLibrary: React.FC = () => {
  // State Management
  const [viewMode, setViewMode] = useState<'lotus' | 'grid' | 'list' | 'resonance' | 'timeline'>('lotus');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    consciousnessLevel: 'all',
    contentType: 'all',
    energyFrequency: 'all',
    resonanceScore: [0, 100],
    duration: 'all'
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'resonance' | 'date' | 'duration'>('relevance');
  const [showCollectiveWisdom, setShowCollectiveWisdom] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCreationTools, setShowCreationTools] = useState(false);
  const [showEcosystem, setShowEcosystem] = useState(false);
  const [resonanceScores, setResonanceScores] = useState<Record<string, ResonanceScore>>({});

  // Hooks
  const { profile, loading: profileLoading, trackContentConsumption } = useConsciousnessTracking();
  const { sources, items, loading: contentLoading } = useContentSources();

  // Sacred Timing
  const [sacredTiming, setSacredTiming] = useState(sacredTimingEngine.getOptimalContentRecommendations());

  // Filter and sort content
  const filteredContent = items
    .filter(item => {
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.contentType !== 'all' && item.content_type !== filters.contentType) {
        return false;
      }
      
      if (filters.duration !== 'all') {
        const durationMinutes = (item.duration_seconds || 0) / 60;
        switch (filters.duration) {
          case 'short': return durationMinutes <= 10;
          case 'medium': return durationMinutes > 10 && durationMinutes <= 30;
          case 'long': return durationMinutes > 30;
          default: return true;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'resonance':
          return (resonanceScores[b.id]?.overall_resonance || 0) - (resonanceScores[a.id]?.overall_resonance || 0);
        case 'date':
          return new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime();
        case 'duration':
          return (b.duration_seconds || 0) - (a.duration_seconds || 0);
        default:
          return 0; // Relevance sorting would be handled by AI
      }
    });

  // Calculate resonance scores for content
  useEffect(() => {
    if (profile && items.length > 0) {
      const calculateResonance = async () => {
        const scores: Record<string, ResonanceScore> = {};
        
        for (const item of items) {
          try {
            const analysis = await resonanceEngine.analyzeContent(item, profile);
            scores[item.id] = analysis;
          } catch (error) {
            console.error('Error calculating resonance for item:', item.id, error);
          }
        }
        
        setResonanceScores(scores);
      };
      
      calculateResonance();
    }
  }, [profile, items]);

  // Update sacred timing periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSacredTiming(sacredTimingEngine.getOptimalContentRecommendations());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleContentSelect = (content: ContentItem) => {
    setSelectedContent(content);
    setIsPlayerOpen(true);
  };

  const handleContentConsumption = async (contentId: string, durationMinutes: number, engagementScore: number) => {
    await trackContentConsumption(contentId, durationMinutes, engagementScore);
  };

  const renderContentCard = (content: ContentItem) => {
    const resonance = resonanceScores[content.id];
    const isHighResonance = resonance && resonance.overall_resonance > 80;
    const isRecommended = sacredTiming.recommendedContent.some(type => 
      content.title.toLowerCase().includes(type) || 
      content.description?.toLowerCase().includes(type)
    );

    return (
      <motion.div
        key={content.id}
        className="group cursor-pointer"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={() => handleContentSelect(content)}
      >
        <Card className={`overflow-hidden transition-all duration-300 ${
          isHighResonance ? 'ring-2 ring-primary' : ''
        } ${isRecommended ? 'bg-gradient-to-br from-primary/5 to-transparent' : ''}`}>
          <div className="relative">
            {content.thumbnail_url && (
              <img
                src={content.thumbnail_url}
                alt={content.title}
                className="w-full h-48 object-cover"
              />
            )}
            
            {/* Resonance Score Badge */}
            {resonance && (
              <Badge 
                className={`absolute top-2 right-2 ${
                  resonance.overall_resonance > 80 ? 'bg-green-500' :
                  resonance.overall_resonance > 60 ? 'bg-yellow-500' : 'bg-gray-500'
                }`}
              >
                {resonance.overall_resonance}% resonance
              </Badge>
            )}
            
            {/* Recommended Badge */}
            {isRecommended && (
              <Badge className="absolute top-2 left-2 bg-purple-500">
                <Sparkles className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button size="lg" className="rounded-full">
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{content.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{content.author_name}</span>
              <span>{Math.floor((content.duration_seconds || 0) / 60)} min</span>
            </div>
            
            {/* AI Insights Preview */}
            {resonance && resonance.ai_insights.key_themes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {resonance.ai_insights.key_themes.slice(0, 3).map(theme => (
                  <Badge key={theme} variant="outline" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderSacredTimingPanel = () => (
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
            <div className="text-2xl mb-2">{sacredTiming.timing.lunar_phase === 'new' ? '🌑' : 
                                          sacredTiming.timing.lunar_phase === 'waxing' ? '🌒' :
                                          sacredTiming.timing.lunar_phase === 'full' ? '🌕' : '🌖'}</div>
            <div className="font-medium capitalize">{sacredTiming.timing.lunar_phase} Moon</div>
            <div className="text-sm text-gray-600">Lunar Phase</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">{sacredTiming.timing.solar_position === 'dawn' ? '🌅' :
                                          sacredTiming.timing.solar_position === 'morning' ? '☀️' :
                                          sacredTiming.timing.solar_position === 'noon' ? '☀️' :
                                          sacredTiming.timing.solar_position === 'afternoon' ? '🌤️' :
                                          sacredTiming.timing.solar_position === 'evening' ? '🌇' : '🌙'}</div>
            <div className="font-medium capitalize">{sacredTiming.timing.solar_position}</div>
            <div className="text-sm text-gray-600">Solar Position</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">🎵</div>
            <div className="font-medium">{sacredTiming.timing.energy_frequency}</div>
            <div className="text-sm text-gray-600">Energy Frequency</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
          <div className="text-sm font-medium mb-1">Meditation Guidance</div>
          <div className="text-sm text-gray-600">{sacredTiming.meditationGuidance}</div>
        </div>
      </CardContent>
    </Card>
  );

  const renderConsciousnessProfile = () => {
    if (!profile) return null;
    
    const currentLevel = profile.current_level;
    const levelConfig = {
      initiate: { color: '#8B4513', symbol: '🌱' },
      seeker: { color: '#FF4500', symbol: '🔍' },
      student: { color: '#FFD700', symbol: '📚' },
      adept: { color: '#32CD32', symbol: '⚡' },
      practitioner: { color: '#00CED1', symbol: '🧘' },
      teacher: { color: '#4169E1', symbol: '👨‍🏫' },
      master: { color: '#8A2BE2', symbol: '🌟' },
      guardian: { color: '#FF69B4', symbol: '🛡️' },
      sage: { color: '#FF1493', symbol: '🧙' },
      enlightened: { color: '#FFD700', symbol: '✨' },
      transcendent: { color: '#FFFFFF', symbol: '🌀' },
      cosmic: { color: '#000000', symbol: '🌌' }
    };
    
    const config = levelConfig[currentLevel] || levelConfig.initiate;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Consciousness Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white"
              style={{ backgroundColor: config.color }}
            >
              {config.symbol}
            </div>
            <div>
              <div className="font-semibold text-lg">{currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</div>
              <div className="text-sm text-gray-600">{profile.total_points} points</div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profile.level_progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (profileLoading || contentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              onClick={() => setShowCollectiveWisdom(!showCollectiveWisdom)}
              variant={showCollectiveWisdom ? "default" : "outline"}
              className="gap-2"
            >
              <Users className="w-4 h-4" />
              Collective Wisdom
            </Button>
            
            <Button
              onClick={() => setShowAnalytics(!showAnalytics)}
              variant={showAnalytics ? "default" : "outline"}
              className="gap-2"
            >
              <Brain className="w-4 h-4" />
              Analytics
            </Button>
            
            <Button
              onClick={() => setShowCreationTools(!showCreationTools)}
              variant={showCreationTools ? "default" : "outline"}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create
            </Button>
            
            <Button
              onClick={() => setShowEcosystem(!showEcosystem)}
              variant={showEcosystem ? "default" : "outline"}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              Ecosystem
            </Button>
            
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Sacred Timing Panel */}
        {renderSacredTimingPanel()}

        {/* Consciousness Profile */}
        {renderConsciousnessProfile()}

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
                      <SelectItem value="long">Long (>30 min)</SelectItem>
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
            {viewMode === 'lotus' ? (
              <SacredGeometryLotus
                sources={sources}
                selectedSourceId={undefined}
                onSourceSelect={() => {}}
                consciousnessLevel={profile?.current_level || 'initiate'}
                userPoints={profile?.total_points || 0}
                className="h-96"
              />
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredContent.map(renderContentCard)}
              </div>
            )}

            {/* Empty State */}
            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">No content found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={() => setFilters({
                  consciousnessLevel: 'all',
                  contentType: 'all',
                  energyFrequency: 'all',
                  resonanceScore: [0, 100],
                  duration: 'all'
                })}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sacred Player */}
        <SacredPlayer
          content={selectedContent}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedContent(null);
          }}
          userProfile={profile}
          onFavorite={(contentId) => console.log('Favorite:', contentId)}
          onBookmark={(contentId) => console.log('Bookmark:', contentId)}
          onShare={(contentId) => console.log('Share:', contentId)}
          onTrackConsumption={handleContentConsumption}
        />

        {/* Collective Wisdom Modal */}
        <AnimatePresence>
          {showCollectiveWisdom && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCollectiveWisdom(false)}
            >
              <motion.div
                className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <CollectiveWisdom
                  content={selectedContent}
                  userProfile={profile}
                  onInsightShare={(insight) => console.log('Insight shared:', insight)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analytics Modal */}
        <AnimatePresence>
          {showAnalytics && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAnalytics(false)}
            >
              <motion.div
                className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <ConsciousnessAnalytics
                    userProfile={profile}
                    onUpdateProfile={(updates) => console.log('Profile updated:', updates)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Creation Tools Modal */}
        <AnimatePresence>
          {showCreationTools && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreationTools(false)}
            >
              <motion.div
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <ContentCreationTools
                    userProfile={profile}
                    onContentCreate={(content) => console.log('Content created:', content)}
                    onAnnotationCreate={(annotation) => console.log('Annotation created:', annotation)}
                    onAnnotationUpdate={(annotation) => console.log('Annotation updated:', annotation)}
                    onAnnotationDelete={(id) => console.log('Annotation deleted:', id)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Living Ecosystem Modal */}
        <AnimatePresence>
          {showEcosystem && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEcosystem(false)}
            >
              <motion.div
                className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <LivingEcosystem
                    userProfile={profile}
                    onNodeClick={(node) => console.log('Node clicked:', node)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedLibrary;
