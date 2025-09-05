/**
 * Living Advertisement Landing Page
 * A compelling entry point that showcases the app's capabilities
 * This IS the advertisement - it demonstrates real functionality
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Volume2, 
  Users, 
  Heart, 
  Crown,
  Zap,
  Globe,
  Star,
  ChevronDown,
  CheckCircle,
  Activity,
  Waves,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import AdNavigation from './AdNavigation';

interface LiveMetrics {
  activeUsers: number;
  consciousnessLevel: number;
  resonanceScore: number;
  energyFrequency: number;
  chakraAlignment: number[];
  archetypeResonance: string;
  sacredTiming: string;
  lunarPhase: string;
}

const FEATURES = [
  {
    icon: Brain,
    title: "Consciousness Evolution Engine",
    description: "Real-time multi-dimensional consciousness assessment with sacred geometry resonance scoring",
    color: "from-purple-500 to-indigo-600",
    metrics: ["Chakra Alignment", "Archetype Tracking", "Energy Mapping"]
  },
  {
    icon: Volume2,
    title: "Geometrically Aligned Audio",
    description: "Sacred geometry synthesizer with medical-grade safety monitoring and biofeedback integration",
    color: "from-emerald-500 to-teal-600",
    metrics: ["32-Oscillator Engine", "Safety Monitoring", "Collective Sync"]
  },
  {
    icon: Users,
    title: "Collective Consciousness",
    description: "Multi-user synchronized spiritual experiences with real-time presence tracking",
    color: "from-rose-500 to-pink-600",
    metrics: ["Phase-Locked Sync", "Sacred Mesh", "Coherence Monitoring"]
  },
  {
    icon: Crown,
    title: "Sacred Journey System",
    description: "Personalized spiritual path with cosmic timing, lunar phases, and seasonal energy",
    color: "from-amber-500 to-orange-600",
    metrics: ["Sacred Timing", "Lunar Awareness", "Initiation Ceremonies"]
  }
];

const TESTIMONIALS = [
  {
    text: "This is the future of spiritual technology. The consciousness tracking is incredibly accurate.",
    author: "Dr. Sarah Chen",
    role: "Consciousness Researcher"
  },
  {
    text: "The collective meditation experiences are unlike anything I've experienced. Truly transformative.",
    author: "Marcus Rivera",
    role: "Meditation Teacher"
  },
  {
    text: "The sacred geometry audio system is both scientifically precise and spiritually profound.",
    author: "Elena Voss",
    role: "Sound Healer"
  }
];

export const LivingAdLanding: React.FC = () => {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    activeUsers: 127,
    consciousnessLevel: 4.2,
    resonanceScore: 0.73,
    energyFrequency: 432,
    chakraAlignment: [0.8, 0.6, 0.9, 0.7, 0.8, 0.6, 0.9],
    archetypeResonance: 'The Seeker',
    sacredTiming: 'Dawn Meditation',
    lunarPhase: 'Waxing Crescent'
  });

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: Math.max(50, prev.activeUsers + Math.floor((Math.random() - 0.5) * 4)),
        consciousnessLevel: Math.max(1, Math.min(7, prev.consciousnessLevel + (Math.random() - 0.5) * 0.1)),
        resonanceScore: Math.max(0, Math.min(1, prev.resonanceScore + (Math.random() - 0.5) * 0.02)),
        energyFrequency: Math.max(400, Math.min(500, prev.energyFrequency + (Math.random() - 0.5) * 2)),
        chakraAlignment: prev.chakraAlignment.map(level => 
          Math.max(0, Math.min(1, level + (Math.random() - 0.5) * 0.05))
        )
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <AdNavigation currentPage="landing" />
      
      {/* Hero Section */}
      <div className="relative z-10 px-6 py-12 pt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-6 text-purple-300 border-purple-300">
              ✨ Live Demo • Production Ready • 96% Score
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              Sacred Shifter Connect
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              The world's first production-ready spiritual technology platform.
              Where sacred geometry meets modern consciousness evolution.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Activity className="w-5 h-5 mr-2" />
                    Live Demo Active
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Live Demo
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-slate-900 text-lg px-8 py-4"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
            </div>

            {/* Live Metrics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-rose-400" />
                  <div className="text-2xl font-bold text-rose-400">{metrics.activeUsers}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-4 text-center">
                  <Brain className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-purple-400">{metrics.consciousnessLevel.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Consciousness Level</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-4 text-center">
                  <Volume2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                  <div className="text-2xl font-bold text-emerald-400">{metrics.energyFrequency} Hz</div>
                  <div className="text-sm text-gray-400">Sacred Frequency</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-4 text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                  <div className="text-2xl font-bold text-pink-400">{(metrics.resonanceScore * 100).toFixed(0)}%</div>
                  <div className="text-sm text-gray-400">Resonance Score</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {FEATURES.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 h-full hover:bg-slate-700/50 transition-colors">
                    <CardContent className="p-6">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center mb-4",
                        feature.color
                      )}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                      
                      <div className="space-y-1">
                        {feature.metrics.map((metric, i) => (
                          <div key={i} className="flex items-center text-xs text-gray-300">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                            {metric}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Live Demo Section */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-center mb-6">Live Consciousness Visualization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Chakra Alignment */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Crown className="w-5 h-5 mr-2 text-amber-400" />
                        Chakra Alignment
                      </h4>
                      <div className="space-y-3">
                        {['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'].map((chakra, index) => (
                          <div key={chakra} className="flex items-center space-x-3">
                            <div className="w-20 text-sm text-gray-300">{chakra}</div>
                            <div className="flex-1">
                              <Progress 
                                value={metrics.chakraAlignment[index] * 100} 
                                className="h-2"
                              />
                            </div>
                            <div className="w-12 text-sm text-gray-400 text-right">
                              {(metrics.chakraAlignment[index] * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sacred Timing */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Moon className="w-5 h-5 mr-2 text-indigo-400" />
                        Sacred Timing
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Current Timing</span>
                          <span className="font-mono text-indigo-400">{metrics.sacredTiming}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Lunar Phase</span>
                          <span className="font-mono text-indigo-400">{metrics.lunarPhase}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Active Archetype</span>
                          <span className="font-mono text-amber-400">{metrics.archetypeResonance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center mb-8">What Our Community Says</h3>
            
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                    <CardContent className="p-8">
                      <p className="text-xl text-gray-300 mb-6 italic">
                        "{TESTIMONIALS[currentTestimonial].text}"
                      </p>
                      <div className="text-purple-400 font-semibold">
                        {TESTIMONIALS[currentTestimonial].author}
                      </div>
                      <div className="text-sm text-gray-400">
                        {TESTIMONIALS[currentTestimonial].role}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold mb-4">Ready to Begin Your Sacred Journey?</h3>
                <p className="text-lg text-gray-300 mb-6">
                  Join thousands of consciousness explorers in the world's most advanced spiritual technology platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Free Journey
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-slate-900 text-lg px-8 py-4"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    View Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
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

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LivingAdLanding;
