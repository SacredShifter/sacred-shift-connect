import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Brain, Heart, Sparkles, Zap, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ResonanceQuery {
  consciousness_level: 'beginner' | 'intermediate' | 'advanced';
  energy_frequency: 'grounding' | 'activating' | 'transcendent';
  archetype: 'warrior' | 'healer' | 'sage' | 'creator';
  duration: 'quick' | 'deep' | 'immersion';
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  consciousness_level: string;
  energy_frequency: string;
  archetype: string;
  duration: string;
  resonance_score: number;
  thumbnail_url?: string;
}

const ResonanceSearch: React.FC = () => {
  const [query, setQuery] = useState<ResonanceQuery>({
    consciousness_level: 'beginner',
    energy_frequency: 'grounding',
    archetype: 'healer',
    duration: 'quick'
  });
  
  const [results, setResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userConsciousness, setUserConsciousness] = useState('intermediate');

  // Consciousness level options with sacred geometry colors
  const consciousnessLevels = [
    { id: 'beginner', label: 'Seed', color: 'bg-green-500', icon: Brain },
    { id: 'intermediate', label: 'Bloom', color: 'bg-blue-500', icon: Heart },
    { id: 'advanced', label: 'Transcend', color: 'bg-purple-500', icon: Sparkles }
  ];

  // Energy frequency options with resonance mapping
  const energyFrequencies = [
    { id: 'grounding', label: '432Hz', color: 'bg-amber-500', icon: Moon },
    { id: 'activating', label: '528Hz', color: 'bg-emerald-500', icon: Sun },
    { id: 'transcendent', label: '852Hz', color: 'bg-violet-500', icon: Zap }
  ];

  // Archetype options with sacred symbols
  const archetypes = [
    { id: 'warrior', label: 'Warrior', color: 'bg-red-500', icon: Zap },
    { id: 'healer', label: 'Healer', color: 'bg-green-500', icon: Heart },
    { id: 'sage', label: 'Sage', color: 'bg-blue-500', icon: Brain },
    { id: 'creator', label: 'Creator', color: 'bg-purple-500', icon: Sparkles }
  ];

  // Duration options with time consciousness
  const durations = [
    { id: 'quick', label: 'Quick', color: 'bg-cyan-500' },
    { id: 'deep', label: 'Deep', color: 'bg-indigo-500' },
    { id: 'immersion', label: 'Immersion', color: 'bg-violet-500' }
  ];

  // Search content based on resonance query
  const searchContent = async (query: ResonanceQuery) => {
    setIsSearching(true);
    try {
      // Skip Edge Function for now - go directly to local search
      // TODO: Implement consciousness-search Edge Function
      await performLocalResonanceSearch(query);
    } catch (error) {
      console.error('Resonance search failed:', error);
      // Fallback to mock data
      setResults(generateMockResults(query));
    } finally {
      setIsSearching(false);
    }
  };

  // Fallback local search with resonance scoring
  const performLocalResonanceSearch = async (query: ResonanceQuery) => {
    const { data: contentItems } = await supabase
      .from('content_items')
      .select('*')
      .limit(20);

    if (contentItems) {
      const scoredResults = contentItems.map(item => ({
        ...item,
        resonance_score: calculateResonanceScore(item, query)
      })).sort((a, b) => b.resonance_score - a.resonance_score);

      setResults(scoredResults);
    }
  };

  // Calculate resonance score based on query alignment
  const calculateResonanceScore = (item: any, query: ResonanceQuery): number => {
    let score = 0;
    
    // Consciousness level alignment
    if (item.consciousness_level === query.consciousness_level) score += 30;
    
    // Energy frequency resonance
    if (item.energy_frequency === query.energy_frequency) score += 25;
    
    // Archetype matching
    if (item.archetype === query.archetype) score += 25;
    
    // Duration preference
    if (item.duration === query.duration) score += 20;
    
    return score;
  };

  // Get user resonance profile
  const getUserResonanceProfile = async () => {
    // This would integrate with user consciousness tracking
    return {
      preferred_frequencies: ['432Hz', '528Hz'],
      consciousness_evolution: 'ascending',
      archetype_balance: 'healer-dominant'
    };
  };

  // Handle query changes
  const updateQuery = (field: keyof ResonanceQuery, value: string) => {
    setQuery(prev => ({ ...prev, [field]: value }));
  };

  // Auto-search when query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchContent(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Sacred Search Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Resonance Discovery
        </div>
        <p className="text-muted-foreground text-lg">
          Let content find you through consciousness resonance
        </p>
      </motion.div>

      {/* Resonance Query Builder */}
      <Card className="bg-background/50 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Tune Your Resonance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Consciousness Level */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Consciousness Level</label>
            <div className="flex gap-3">
              {consciousnessLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <Button
                    key={level.id}
                    variant={query.consciousness_level === level.id ? "default" : "outline"}
                    className={`${query.consciousness_level === level.id ? level.color : ''} transition-all duration-300`}
                    onClick={() => updateQuery('consciousness_level', level.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {level.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Energy Frequency */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Energy Frequency</label>
            <div className="flex gap-3">
              {energyFrequencies.map((freq) => {
                const Icon = freq.icon;
                return (
                  <Button
                    key={freq.id}
                    variant={query.energy_frequency === freq.id ? "default" : "outline"}
                    className={`${query.energy_frequency === freq.id ? freq.color : ''} transition-all duration-300`}
                    onClick={() => updateQuery('energy_frequency', freq.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {freq.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Archetype Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Sacred Archetype</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {archetypes.map((archetype) => {
                const Icon = archetype.icon;
                return (
                  <Button
                    key={archetype.id}
                    variant={query.archetype === archetype.id ? "default" : "outline"}
                    className={`${query.archetype === archetype.id ? archetype.color : ''} transition-all duration-300`}
                    onClick={() => updateQuery('archetype', archetype.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {archetype.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Duration Preference */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Time Consciousness</label>
            <div className="flex gap-3">
              {durations.map((duration) => (
                <Button
                  key={duration.id}
                  variant={query.duration === duration.id ? "default" : "outline"}
                  className={`${query.duration === duration.id ? duration.color : ''} transition-all duration-300`}
                  onClick={() => updateQuery('duration', duration.id)}
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <AnimatePresence>
        {isSearching ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Tuning into resonance fields...</p>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {results.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/20">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {item.resonance_score}%
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.consciousness_level}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.energy_frequency}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.archetype}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ResonanceSearch;
