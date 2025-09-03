/**
 * Sacred Resonance Waves Component
 * Animated consciousness energy fields and resonance visualization
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Heart, 
  Brain, 
  Zap, 
  Star, 
  Circle,
  Waves,
  Radio,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ResonanceWavesProps {
  consciousnessLevel: number; // 0-100
  energyFrequency: string; // '432Hz' | '528Hz' | '852Hz' | '963Hz'
  archetype: string;
  isActive: boolean;
  onToggle?: (active: boolean) => void;
  className?: string;
}

interface Wave {
  id: string;
  amplitude: number;
  frequency: number;
  phase: number;
  color: string;
  opacity: number;
}

export const ResonanceWaves: React.FC<ResonanceWavesProps> = ({
  consciousnessLevel,
  energyFrequency,
  archetype,
  isActive,
  onToggle,
  className = ""
}) => {
  const [waves, setWaves] = useState<Wave[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate waves based on consciousness level and frequency
  useEffect(() => {
    const frequencyValue = parseInt(energyFrequency.replace('Hz', ''));
    const baseAmplitude = consciousnessLevel / 100;
    
    const newWaves: Wave[] = [
      {
        id: 'primary',
        amplitude: baseAmplitude * 50,
        frequency: frequencyValue / 1000,
        phase: 0,
        color: '#8B5CF6', // Purple
        opacity: 0.8
      },
      {
        id: 'secondary',
        amplitude: baseAmplitude * 30,
        frequency: frequencyValue / 1500,
        phase: Math.PI / 2,
        color: '#06B6D4', // Cyan
        opacity: 0.6
      },
      {
        id: 'tertiary',
        amplitude: baseAmplitude * 20,
        frequency: frequencyValue / 2000,
        phase: Math.PI,
        color: '#10B981', // Emerald
        opacity: 0.4
      }
    ];
    
    setWaves(newWaves);
  }, [consciousnessLevel, energyFrequency]);

  // Animate waves
  useEffect(() => {
    if (!isAnimating || !isActive) return;

    const interval = setInterval(() => {
      setWaves(prev => prev.map(wave => ({
        ...wave,
        phase: wave.phase + 0.1,
        opacity: Math.max(0.2, Math.min(0.8, wave.opacity + (Math.random() - 0.5) * 0.1))
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating, isActive]);

  const getArchetypeColor = (archetype: string) => {
    switch (archetype.toLowerCase()) {
      case 'warrior': return 'from-red-500 to-orange-500';
      case 'healer': return 'from-green-500 to-emerald-500';
      case 'sage': return 'from-blue-500 to-indigo-500';
      case 'creator': return 'from-purple-500 to-pink-500';
      case 'mystic': return 'from-violet-500 to-purple-500';
      case 'guardian': return 'from-yellow-500 to-amber-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case '432Hz': return '#10B981'; // Green - Heart chakra
      case '528Hz': return '#06B6D4'; // Cyan - Throat chakra
      case '852Hz': return '#8B5CF6'; // Purple - Third eye
      case '963Hz': return '#F59E0B'; // Gold - Crown chakra
      default: return '#6B7280'; // Gray
    }
  };

  const generateWavePath = (wave: Wave, time: number) => {
    const points = [];
    const width = 400;
    const height = 200;
    const samples = 100;
    
    for (let i = 0; i <= samples; i++) {
      const x = (i / samples) * width;
      const y = height / 2 + 
        wave.amplitude * Math.sin((x / width) * Math.PI * 2 * wave.frequency + wave.phase + time) * 
        Math.sin((i / samples) * Math.PI); // Envelope
      points.push(`${x},${y}`);
    }
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex gap-2">
          <Button
            variant={isAnimating ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center gap-1"
          >
            <Waves className="w-3 h-3" />
            {isAnimating ? 'Stop' : 'Animate'}
          </Button>
          
          <Button
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggle?.(!isActive)}
            className="flex items-center gap-1"
          >
            {isActive ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            {isActive ? 'On' : 'Off'}
          </Button>
        </div>
      </div>

      {/* Consciousness Level Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`bg-gradient-to-r ${getArchetypeColor(archetype)} text-white border-0`}
          >
            {archetype}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {consciousnessLevel}% Consciousness
          </Badge>
        </div>
      </div>

      {/* Resonance Visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 400 200"
          className="absolute inset-0"
        >
          {/* Background Grid */}
          <defs>
            <pattern id="resonanceGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={getFrequencyColor(energyFrequency)} stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#resonanceGrid)" />
          
          {/* Resonance Waves */}
          {isActive && waves.map((wave, index) => (
            <motion.path
              key={wave.id}
              d={generateWavePath(wave, 0)}
              fill="none"
              stroke="url(#waveGradient)"
              strokeWidth="3"
              opacity={wave.opacity}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: wave.opacity,
                d: generateWavePath(wave, isAnimating ? Date.now() / 1000 : 0)
              }}
              transition={{
                pathLength: { duration: 2, ease: "easeInOut" },
                opacity: { duration: 0.5 },
                d: { duration: 0.1, repeat: isAnimating ? Infinity : 0 }
              }}
            />
          ))}

          {/* Central Consciousness Point */}
          <motion.circle
            cx="200"
            cy="100"
            r="8"
            fill={getFrequencyColor(energyFrequency)}
            opacity="0.8"
            animate={{
              r: [8, 12, 8],
              opacity: [0.8, 0.4, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Frequency Label */}
          <text
            x="200"
            y="120"
            textAnchor="middle"
            className="text-sm font-medium fill-current text-muted-foreground"
          >
            {energyFrequency}
          </text>
        </svg>

        {/* Consciousness Metrics */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <Card className="bg-background/95 backdrop-blur-sm border-primary/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {consciousnessLevel}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Consciousness Level
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {energyFrequency}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Energy Frequency
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {archetype}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sacred Archetype
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
