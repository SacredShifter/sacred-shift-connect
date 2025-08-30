import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Waves, 
  Layers,
  RotateCcw,
  Sparkles,
  Eye,
  Shield,
  Award,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGAAEngine } from '@/hooks/useGAAEngine';
import { GAAGeometryVisualizer } from './GAAGeometryVisualizer';
import { PresetManager } from '@/utils/gaa/PresetManager';
import { SafetySystem } from '@/utils/gaa/SafetySystem';
import { COSMIC_STRUCTURE_PRESETS } from '@/utils/gaa/CosmicStructurePresets';

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
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [presetManager] = useState(() => new PresetManager());
  const [safetySystem] = useState(() => new SafetySystem());
  const [safetyStatus, setSafetyStatus] = useState(safetySystem.getSafetyStatus());
  
  // Layer visibility states
  const layerStates = getLayerStates();
  
  useEffect(() => {
    if (!isInitialized) {
      initializeGAA();
    }
  }, [isInitialized, initializeGAA]);

  // Initialize safety monitoring
  useEffect(() => {
    if (isPlaying) {
      safetySystem.startMonitoring();
    } else {
      safetySystem.stopMonitoring();
    }

    // Safety alert handler
    const handleSafetyAlert = (alert: any) => {
      setSafetyStatus(safetySystem.getSafetyStatus());
      
      if (alert.action === 'stop' || alert.action === 'pause') {
        stopGAA();
      }
    };

    safetySystem.onAlert(handleSafetyAlert);

    // Update safety status every second
    const interval = setInterval(() => {
      setSafetyStatus(safetySystem.getSafetyStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, safetySystem, stopGAA]);

  // Handle preset loading
  const handlePresetChange = async (presetId: string) => {
    setSelectedPreset(presetId);
    
    if (presetId) {
      const result = await presetManager.loadPreset(presetId);
      if (result.success && result.geometry) {
        // Update GAA engine with new geometry parameters
        // This would require extending the useGAAEngine hook
        console.log('Loaded preset:', result.preset?.name);
        console.log('Geometry:', result.geometry);
      }
    }
  };

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
    <div className="space-y-6">
      {/* Safety Status Alert */}
      {safetyStatus.level !== 'safe' && (
        <Alert variant={safetyStatus.level === 'critical' ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {safetyStatus.level === 'critical' ? 'Critical safety alert: ' : 'Safety warning: '}
            {safetyStatus.activeAlerts[0]?.message}
          </AlertDescription>
        </Alert>
      )}

      <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border-violet-500/20 relative overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Waves className="w-4 h-4 text-violet-400" />
            GAA Engine
            <Badge variant={safetyStatus.level === 'safe' ? 'default' : safetyStatus.level === 'warning' ? 'secondary' : 'destructive'}>
              <Shield className="h-3 w-3 mr-1" />
              {safetyStatus.level}
            </Badge>
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
          
          {/* Cosmic Structure Preset Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cosmic Structure Preset</label>
            <div className="flex gap-2">
              <Select value={selectedPreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a cosmic structure..." />
                </SelectTrigger>
                <SelectContent>
                  {COSMIC_STRUCTURE_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex items-center gap-2">
                        <span>{preset.name}</span>
                        {preset.evidence.confidence === 'confirmed' && (
                          <Award className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPreset && (
              <div className="text-xs text-muted-foreground">
                {COSMIC_STRUCTURE_PRESETS.find(p => p.id === selectedPreset)?.description}
              </div>
            )}
          </div>
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
    </div>
  );
};