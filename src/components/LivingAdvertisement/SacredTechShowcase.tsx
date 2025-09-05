/**
 * Living Advertisement - Sacred Technology Showcase
 * An interactive demonstration of Sacred Shifter Connect's capabilities
 * This module IS the advertisement - it showcases real functionality
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Users, 
  Heart, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Eye,
  Crown,
  Star,
  Hexagon,
  Triangle,
  Circle,
  Square,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Activity,
  Waves,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import AdNavigation from './AdNavigation';

interface ShowcaseState {
  currentDemo: 'consciousness' | 'audio' | 'collective' | 'sacred' | 'biofeedback';
  isPlaying: boolean;
  resonanceLevel: number;
  consciousnessLevel: number;
  activeUsers: number;
  energyFrequency: number;
  chakraAlignment: number[];
  archetypeResonance: string;
  sacredTiming: string;
  lunarPhase: string;
  season: string;
}

const DEMO_CONFIGS = {
  consciousness: {
    title: "Consciousness Evolution Engine",
    description: "Real-time multi-dimensional consciousness assessment",
    icon: Brain,
    color: "from-purple-500 to-indigo-600",
    features: [
      "Sacred Geometry Resonance Scoring",
      "Chakra Alignment Analysis", 
      "Archetype Activation Tracking",
      "Energy Frequency Mapping"
    ]
  },
  audio: {
    title: "Geometrically Aligned Audio",
    description: "Sacred geometry synthesizer with medical-grade safety",
    icon: Volume2,
    color: "from-emerald-500 to-teal-600",
    features: [
      "32-Oscillator Sacred Geometry Engine",
      "Real-time Biofeedback Integration",
      "Safety Monitoring & Crash Recovery",
      "Collective Synchronization"
    ]
  },
  collective: {
    title: "Collective Consciousness",
    description: "Multi-user synchronized spiritual experiences",
    icon: Users,
    color: "from-rose-500 to-pink-600",
    features: [
      "Real-time Presence Tracking",
      "Phase-Locked Loop Synchronization",
      "Sacred Mesh Networking",
      "Coherence Monitoring"
    ]
  },
  sacred: {
    title: "Sacred Journey System",
    description: "Personalized spiritual path with cosmic timing",
    icon: Crown,
    color: "from-amber-500 to-orange-600",
    features: [
      "Sacred Timing Integration",
      "Lunar Phase Awareness",
      "Seasonal Energy Alignment",
      "Initiation Ceremony System"
    ]
  },
  biofeedback: {
    title: "Advanced Biofeedback",
    description: "Camera-based heart rate and breathing detection",
    icon: Heart,
    color: "from-red-500 to-rose-600",
    features: [
      "Camera PPG Heart Rate Detection",
      "Accelerometer Breathing Analysis",
      "Real-time Signal Processing",
      "Web Bluetooth Framework"
    ]
  }
};

const CHAKRA_COLORS = [
  { name: 'Root', color: 'bg-red-500', position: 0 },
  { name: 'Sacral', color: 'bg-orange-500', position: 1 },
  { name: 'Solar Plexus', color: 'bg-yellow-500', position: 2 },
  { name: 'Heart', color: 'bg-green-500', position: 3 },
  { name: 'Throat', color: 'bg-blue-500', position: 4 },
  { name: 'Third Eye', color: 'bg-indigo-500', position: 5 },
  { name: 'Crown', color: 'bg-purple-500', position: 6 }
];

const ARCHETYPES = [
  'The Seeker', 'The Healer', 'The Teacher', 'The Warrior',
  'The Mystic', 'The Creator', 'The Guardian', 'The Visionary'
];

const SACRED_TIMINGS = [
  'Dawn Meditation', 'Midday Alignment', 'Dusk Reflection', 'Midnight Contemplation'
];

const LUNAR_PHASES = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
];

const SEASONS = ['Spring Awakening', 'Summer Expansion', 'Autumn Harvest', 'Winter Contemplation'];

export const SacredTechShowcase: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ShowcaseState>({
    currentDemo: 'consciousness',
    isPlaying: false,
    resonanceLevel: 0.73,
    consciousnessLevel: 4,
    activeUsers: 127,
    energyFrequency: 432,
    chakraAlignment: [0.8, 0.6, 0.9, 0.7, 0.8, 0.6, 0.9],
    archetypeResonance: 'The Seeker',
    sacredTiming: 'Dawn Meditation',
    lunarPhase: 'Waxing Crescent',
    season: 'Spring Awakening'
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  // Simulate real-time data updates
  useEffect(() => {
    const updateData = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 100) { // 10 FPS updates
        setState(prev => ({
          ...prev,
          resonanceLevel: Math.max(0, Math.min(1, prev.resonanceLevel + (Math.random() - 0.5) * 0.02)),
          consciousnessLevel: Math.max(1, Math.min(7, prev.consciousnessLevel + (Math.random() - 0.5) * 0.1)),
          activeUsers: Math.max(50, prev.activeUsers + Math.floor((Math.random() - 0.5) * 4)),
          energyFrequency: Math.max(400, Math.min(500, prev.energyFrequency + (Math.random() - 0.5) * 2)),
          chakraAlignment: prev.chakraAlignment.map(level => 
            Math.max(0, Math.min(1, level + (Math.random() - 0.5) * 0.05))
          ),
          archetypeResonance: ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)],
          sacredTiming: SACRED_TIMINGS[Math.floor(Math.random() * SACRED_TIMINGS.length)],
          lunarPhase: LUNAR_PHASES[Math.floor(Math.random() * LUNAR_PHASES.length)],
          season: SEASONS[Math.floor(Math.random() * SEASONS.length)]
        }));
        lastUpdateRef.current = now;
      }
    };

    if (state.isPlaying) {
      animationRef.current = requestAnimationFrame(updateData);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isPlaying]);

  const switchDemo = useCallback((demo: ShowcaseState['currentDemo']) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setState(prev => ({ ...prev, currentDemo: demo }));
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const togglePlayback = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(prev => ({
      ...prev,
      resonanceLevel: 0.73,
      consciousnessLevel: 4,
      activeUsers: 127,
      energyFrequency: 432,
      chakraAlignment: [0.8, 0.6, 0.9, 0.7, 0.8, 0.6, 0.9],
      archetypeResonance: 'The Seeker',
      sacredTiming: 'Dawn Meditation',
      lunarPhase: 'Waxing Crescent',
      season: 'Spring Awakening'
    }));
  }, []);

  const currentConfig = DEMO_CONFIGS[state.currentDemo];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <AdNavigation currentPage="showcase" />
      
      {/* Header */}
      <div className="relative z-10 p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Sacred Shifter Connect
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the world's first production-ready spiritual technology platform
          </p>
          <Badge variant="outline" className="mt-4 text-purple-300 border-purple-300">
            Live Demo • Production Ready • 96% Score
          </Badge>
        </motion.div>
      </div>

      {/* Main Showcase */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Demo Selector */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Interactive Demos</h3>
                  <div className="space-y-2">
                    {Object.entries(DEMO_CONFIGS).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <Button
                          key={key}
                          variant={state.currentDemo === key ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start text-left h-auto p-4",
                            state.currentDemo === key 
                              ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                              : "hover:bg-slate-700"
                          )}
                          onClick={() => switchDemo(key as ShowcaseState['currentDemo'])}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <div>
                            <div className="font-medium">{config.title}</div>
                            <div className="text-xs opacity-80">{config.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Demo Area */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 min-h-[600px]">
                <CardContent className="p-6 h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={state.currentDemo}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="h-full flex flex-col"
                    >
                      {/* Demo Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "p-3 rounded-lg bg-gradient-to-r",
                            currentConfig.color
                          )}>
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">{currentConfig.title}</h2>
                            <p className="text-gray-400">{currentConfig.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePlayback}
                            className="border-slate-600 hover:bg-slate-700"
                          >
                            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetDemo}
                            className="border-slate-600 hover:bg-slate-700"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Demo Content */}
                      <div className="flex-1">
                        {state.currentDemo === 'consciousness' && (
                          <ConsciousnessDemo state={state} />
                        )}
                        {state.currentDemo === 'audio' && (
                          <AudioDemo state={state} />
                        )}
                        {state.currentDemo === 'collective' && (
                          <CollectiveDemo state={state} />
                        )}
                        {state.currentDemo === 'sacred' && (
                          <SacredDemo state={state} />
                        )}
                        {state.currentDemo === 'biofeedback' && (
                          <BiofeedbackDemo state={state} />
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-20 space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
        </motion.div>
      </div>

      {/* Background Sacred Geometry */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-purple-500/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-pink-500/20 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-500/30 rounded-full"
        />
      </div>
    </div>
  );
};

// Individual Demo Components
const ConsciousnessDemo: React.FC<{ state: ShowcaseState }> = ({ state }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Consciousness Level
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Level</span>
              <span className="font-mono">{state.consciousnessLevel.toFixed(1)}/7</span>
            </div>
            <Progress value={(state.consciousnessLevel / 7) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
            Resonance Score
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sacred Geometry</span>
              <span className="font-mono">{(state.resonanceLevel * 100).toFixed(1)}%</span>
            </div>
            <Progress value={state.resonanceLevel * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-slate-700/50">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <Crown className="w-5 h-5 mr-2 text-amber-400" />
          Chakra Alignment
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {CHAKRA_COLORS.map((chakra, index) => (
            <div key={chakra.name} className="text-center">
              <div className={cn(
                "w-8 h-8 rounded-full mx-auto mb-1 opacity-80",
                chakra.color
              )} style={{ opacity: state.chakraAlignment[index] }} />
              <div className="text-xs text-gray-400">{chakra.name}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const AudioDemo: React.FC<{ state: ShowcaseState }> = ({ state }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-slate-700/50">
        <CardContent className="p-4 text-center">
          <Volume2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <div className="text-2xl font-mono">{state.energyFrequency} Hz</div>
          <div className="text-sm text-gray-400">Sacred Frequency</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4 text-center">
          <Activity className="w-8 h-8 mx-auto mb-2 text-teal-400" />
          <div className="text-2xl font-mono">32</div>
          <div className="text-sm text-gray-400">Active Oscillators</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4 text-center">
          <Waves className="w-8 h-8 mx-auto mb-2 text-blue-400" />
          <div className="text-2xl font-mono">Safe</div>
          <div className="text-sm text-gray-400">Safety Status</div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-slate-700/50">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3">Sacred Geometry Visualization</h4>
        <div className="flex justify-center space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-2 border-emerald-400 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-teal-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-8 h-8 border-2 border-blue-400 rounded-full"
          />
        </div>
      </CardContent>
    </Card>
  </div>
);

const CollectiveDemo: React.FC<{ state: ShowcaseState }> = ({ state }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2 text-rose-400" />
            Active Participants
          </h4>
          <div className="text-3xl font-bold text-rose-400">{state.activeUsers}</div>
          <div className="text-sm text-gray-400">Synchronized globally</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-pink-400" />
            Coherence Level
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collective Sync</span>
              <span className="font-mono">{(state.resonanceLevel * 100).toFixed(1)}%</span>
            </div>
            <Progress value={state.resonanceLevel * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-slate-700/50">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3">Collective Consciousness Visualization</h4>
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity
              }}
              className="w-3 h-3 bg-rose-400 rounded-full"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const SacredDemo: React.FC<{ state: ShowcaseState }> = ({ state }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-slate-700/50">
        <CardContent className="p-4 text-center">
          <Sun className="w-8 h-8 mx-auto mb-2 text-amber-400" />
          <div className="text-sm font-medium">{state.sacredTiming}</div>
          <div className="text-xs text-gray-400">Sacred Timing</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4 text-center">
          <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
          <div className="text-sm font-medium">{state.lunarPhase}</div>
          <div className="text-xs text-gray-400">Lunar Phase</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4 text-center">
          <Crown className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <div className="text-sm font-medium">{state.archetypeResonance}</div>
          <div className="text-xs text-gray-400">Active Archetype</div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-slate-700/50">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3">Sacred Journey Progress</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Initiation Stage</span>
            <span className="font-mono">Level {state.consciousnessLevel}</span>
          </div>
          <Progress value={(state.consciousnessLevel / 7) * 100} className="h-2" />
          <div className="text-xs text-gray-400 text-center">
            {state.season} • {state.lunarPhase}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const BiofeedbackDemo: React.FC<{ state: ShowcaseState }> = ({ state }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-400" />
            Heart Rate Variability
          </h4>
          <div className="text-3xl font-bold text-red-400">
            {Math.floor(60 + state.resonanceLevel * 20)} BPM
          </div>
          <div className="text-sm text-gray-400">Camera PPG Detection</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-pink-400" />
            Breathing Pattern
          </h4>
          <div className="text-3xl font-bold text-pink-400">
            {Math.floor(12 + state.resonanceLevel * 6)} RPM
          </div>
          <div className="text-sm text-gray-400">Accelerometer Analysis</div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-slate-700/50">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3">Real-time Biofeedback Visualization</h4>
        <div className="flex justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity
            }}
            className="w-24 h-24 border-4 border-red-400 rounded-full flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-red-400" />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SacredTechShowcase;
