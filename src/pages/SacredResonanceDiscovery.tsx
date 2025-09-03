import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ResonanceSearch from '@/components/ContentDiscovery/ResonanceSearch';
import SacredGeometryGrid from '@/components/ContentGrid/SacredGeometryGrid';
import ResonanceTimeline from '@/components/ContentTimeline/ResonanceTimeline';
import { Search, Sparkles, Clock, Brain, Heart, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const SacredResonanceDiscovery: React.FC = () => {
  const [activeView, setActiveView] = useState<'search' | 'grid' | 'timeline'>('search');

  // Mock content data for demonstration
  const mockContent = [
    {
      id: '1',
      title: 'Sacred Geometry Meditation',
      description: 'Deep meditation using the Flower of Life pattern',
      consciousness_level: 'advanced',
      energy_frequency: '528Hz',
      archetype: 'sage',
      thumbnail_url: undefined,
      resonance_score: 95
    },
    {
      id: '2',
      title: 'Consciousness Expansion',
      description: 'Guided journey through higher dimensions',
      consciousness_level: 'intermediate',
      energy_frequency: '432Hz',
      archetype: 'healer',
      thumbnail_url: undefined,
      resonance_score: 87
    },
    {
      id: '3',
      title: 'Quantum Healing Session',
      description: 'Energy healing using quantum principles',
      consciousness_level: 'beginner',
      energy_frequency: '639Hz',
      archetype: 'warrior',
      thumbnail_url: undefined,
      resonance_score: 92
    }
  ];

  const mockTimelineContent = mockContent.map(item => ({
    ...item,
    timestamp: new Date(Date.now() - Math.random() * 10000000000),
    content_type: 'meditation',
    lunar_phase: 'waxing',
    solar_position: 'morning'
  }));

  const views = [
    { id: 'search', label: 'Resonance Search', icon: Search, description: 'AI-powered content discovery through consciousness resonance' },
    { id: 'grid', label: 'Sacred Geometry', icon: Sparkles, description: 'Content organized in sacred geometric patterns' },
    { id: 'timeline', label: 'Resonance Timeline', icon: Clock, description: 'Sacred spiral showing consciousness evolution' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.div
        className="text-center py-12 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Sacred Resonance Discovery
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience content discovery through consciousness resonance, sacred geometry, and the flow of universal wisdom
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-background/50 backdrop-blur-xl border border-primary/20 rounded-lg p-1">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                onClick={() => setActiveView(view.id as any)}
                className="px-6 py-2"
              >
                <Icon className="w-4 h-4 mr-2" />
                {view.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* View Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {activeView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ResonanceSearch />
            </motion.div>
          )}

          {activeView === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-[600px]"
            >
              <SacredGeometryGrid content={mockContent} />
            </motion.div>
          )}

          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-[600px]"
            >
              <ResonanceTimeline content={mockTimelineContent} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sacred Features Overview */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Card className="bg-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-500" />
                </div>
                <CardTitle>Consciousness Resonance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content finds you through vibrational alignment with your current consciousness state
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle>Sacred Geometry</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content organized in sacred patterns reflecting cosmic order and divine proportion
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-xl border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-emerald-500" />
                </div>
                <CardTitle>Resonance Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sacred spiral timeline showing your consciousness evolution and content resonance
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SacredResonanceDiscovery;
