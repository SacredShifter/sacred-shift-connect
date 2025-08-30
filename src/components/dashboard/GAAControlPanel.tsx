import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Waves, 
  Layers,
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { GAAGeometryVisualizer } from './GAAGeometryVisualizer';

export const GAAControlPanel = () => {
  const {
    isInitialized,
    isPlaying,
    currentGeometry,
    activeOscillators,
    breathPhase,
    initializeGAA,
    startGAA,
    stopGAA,
    toggleLayer,
    setOscillatorCount,
    getLayerStates
  } = useGAAEngine();
  
  const [volume, setVolume] = useState([50]);
  const [oscillatorCount, setOscillatorCountLocal] = useState([8]);
  const [showVisualization, setShowVisualization] = useState(false);
  
  // Layer visibility states
  const layerStates = getLayerStates();
  
  useEffect(() => {
    if (!isInitialized) {
      initializeGAA();
    }
  }, [isInitialized, initializeGAA]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stopGAA();
    } else {
      startGAA();
    }
  };

  const handleOscillatorChange = (value: number[]) => {
    const count = value[0];
    setOscillatorCountLocal([count]);
    setOscillatorCount(count);
  };

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'breath': return '◉';
      case 'body': return '◎';
      case 'earth': return '⊕';
      case 'solar': return '☉';
      case 'galactic': return '✦';
      default: return '◦';
    }
  };

  const getLayerColor = (layerId: string) => {
    switch (layerId) {
      case 'breath': return 'text-emerald-400';
      case 'body': return 'text-teal-400';
      case 'earth': return 'text-blue-400';
      case 'solar': return 'text-amber-400';
      case 'galactic': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border-violet-500/20 relative overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Waves className="w-4 h-4 text-violet-400" />
          GAA Engine
          <Badge 
            variant={isInitialized ? "default" : "secondary"} 
            className={`ml-auto text-xs ${
              isInitialized 
                ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' 
                : 'bg-muted/20'
            }`}
          >
            {isInitialized ? 'Ready' : 'Initializing'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handlePlayPause}
            disabled={!isInitialized}
            size="sm"
            variant={isPlaying ? "secondary" : "default"}
            className="flex-1"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? 'Pause' : 'Start'} GAA
          </Button>
          
          <Button
            onClick={() => setShowVisualization(!showVisualization)}
            variant="outline"
            size="sm"
            className="border-violet-500/30"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Breath Phase Indicator */}
        {isPlaying && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-violet-500/5 border border-violet-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-violet-300">Breath Phase</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-violet-400"
              >
                ◉
              </motion.div>
            </div>
            <Progress 
              value={(Math.sin(breathPhase) + 1) * 50} 
              className="h-2" 
            />
            <div className="text-xs text-muted-foreground mt-1">
              Phase: {(breathPhase % (2 * Math.PI)).toFixed(2)}
            </div>
          </div>
        )}

        {/* Oscillator Count Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Oscillators</span>
            <span className="text-sm text-violet-400">{oscillatorCount[0]}</span>
          </div>
          <Slider
            value={oscillatorCount}
            onValueChange={handleOscillatorChange}
            max={16}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Layer Controls */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium">Scale Layers</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(layerStates || {}).map(([layerId, layer]) => (
              <button
                key={layerId}
                onClick={() => toggleLayer(layerId as any)}
                className={`p-2 rounded text-xs border transition-all ${
                  layer.active
                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                    : 'bg-muted/10 border-muted/20 text-muted-foreground hover:border-violet-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={getLayerColor(layerId)}>
                    {getLayerIcon(layerId)}
                  </span>
                  <span className="capitalize">{layerId}</span>
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {layer.weight?.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Geometry Stats */}
        {currentGeometry && currentGeometry.length > 0 && (
          <div className="p-2 rounded bg-violet-500/5 border border-violet-500/20">
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Geometry Points:</span>
                <span className="text-violet-400">{currentGeometry.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Oscillators:</span>
                <span className="text-violet-400">{activeOscillators}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3D Visualization */}
        <AnimatePresence>
          {showVisualization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 200 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg overflow-hidden border border-violet-500/20"
            >
              <GAAGeometryVisualizer 
                geometry={currentGeometry || []}
                breathPhase={breathPhase}
                isPlaying={isPlaying}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};