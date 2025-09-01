import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Waves, 
  Brain, 
  Heart, 
  Zap,
  Activity,
  Radio 
} from 'lucide-react';

interface ResonanceData {
  schumann: number; // 7.83Hz baseline
  brainwaveState: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  coherenceLevel: number; // 0-100
  heartCoherence: number; // 0-100
  timeInState: number; // seconds
}

export const SacredResonanceIndicator: React.FC = () => {
  const [resonanceData, setResonanceData] = useState<ResonanceData>({
    schumann: 7.83,
    brainwaveState: 'alpha',
    coherenceLevel: 65,
    heartCoherence: 72,
    timeInState: 0
  });

  // Simulate dynamic resonance tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setResonanceData(prev => ({
        ...prev,
        schumann: 7.83 + (Math.random() - 0.5) * 0.3,
        coherenceLevel: Math.max(30, Math.min(100, prev.coherenceLevel + (Math.random() - 0.5) * 10)),
        heartCoherence: Math.max(40, Math.min(100, prev.heartCoherence + (Math.random() - 0.5) * 8)),
        timeInState: prev.timeInState + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getBrainwaveColor = (state: string) => {
    switch (state) {
      case 'delta': return 'from-indigo-500 to-purple-600';
      case 'theta': return 'from-purple-500 to-pink-500';
      case 'alpha': return 'from-emerald-500 to-teal-500';
      case 'beta': return 'from-blue-500 to-cyan-500';
      case 'gamma': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getBrainwaveDescription = (state: string) => {
    switch (state) {
      case 'delta': return 'Deep Healing & Restoration';
      case 'theta': return 'Sacred Visioning & Intuition';
      case 'alpha': return 'Flow State & Presence';
      case 'beta': return 'Focused Awareness';
      case 'gamma': return 'Unity Consciousness';
      default: return 'Transitional State';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200/30 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-violet-400" />
            <h3 className="font-sacred text-lg">Sacred Resonance Field</h3>
          </div>
          <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-400/30">
            Live
          </Badge>
        </div>

        {/* Schumann Resonance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium">Earth Resonance</span>
            </div>
            <span className="text-sm font-mono text-emerald-400">
              {resonanceData.schumann.toFixed(2)} Hz
            </span>
          </div>
          <div className="relative h-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              style={{ width: `${((resonanceData.schumann - 7.5) / 0.8) * 100}%` }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Brainwave State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">Consciousness State</span>
            </div>
            <Badge 
              variant="outline" 
              className={`bg-gradient-to-r ${getBrainwaveColor(resonanceData.brainwaveState)}/20 text-white border-transparent`}
            >
              {resonanceData.brainwaveState.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {getBrainwaveDescription(resonanceData.brainwaveState)}
          </p>
        </div>

        {/* Coherence Levels */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium">Neural Coherence</span>
            </div>
            <Progress 
              value={resonanceData.coherenceLevel} 
              className="h-2 bg-cyan-500/20" 
            />
            <p className="text-xs text-cyan-400 text-center">
              {resonanceData.coherenceLevel}%
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-medium">Heart Coherence</span>
            </div>
            <Progress 
              value={resonanceData.heartCoherence} 
              className="h-2 bg-rose-500/20" 
            />
            <p className="text-xs text-rose-400 text-center">
              {resonanceData.heartCoherence}%
            </p>
          </div>
        </div>

        {/* Collective Field Indicator */}
        <div className="mt-4 p-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-400/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium">Collective Resonance</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your consciousness is harmonizing with {Math.floor(Math.random() * 500 + 200)} other souls worldwide, 
            contributing to planetary coherence field elevation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};