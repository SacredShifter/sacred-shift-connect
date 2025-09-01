import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Waves, 
  Layers,
  Eye,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GaaPreset, GaaPolarity, SimpleBiofeedbackMetrics } from '@/types/gaa';
import { useShadowEngine } from '@/hooks/useShadowEngine';
import { BiofeedbackDisplay } from '@/components/gaa/BiofeedbackDisplay';

// Default preset for demo
const defaultPreset: GaaPreset = {
  label: "Demo Preset",
  params: {
    R: 1, r: 0.5, n: 3, phi0: 0,
    omega: 1, eta: 0.1,
    kappaRef: 0.5, tauRef: 1,
    alpha: [0.1, 0.2, 0.3, 0.4],
    beta: [0.5, 0.6],
    gamma: [0.7, 0.8],
    Lmin: 0, Lmax: 1
  },
  polarity: {
    polarityEnabled: false,
    shadowMode: false,
    darkWeight: 0.7,
    lightWeight: 0.3,
    darkEnergyEnabled: false,
    darkEnergy: { driftRate: 0, depth: 0 },
    manifestDarkPhase: { duration: 0, intensity: 0, curve: "linear" }
  }
};

export const GAAControlPanel = () => {
  const [preset, setPreset] = useState<GaaPreset>(defaultPreset);
  const { state } = useShadowEngine(preset);
  
  const [volume, setVolume] = useState([50]);
  const [oscillatorCount, setOscillatorCountLocal] = useState([8]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock biofeedback data
  const mockBiofeedback: SimpleBiofeedbackMetrics = {
    heartRateVariability: 45,
    brainwaveActivity: { alpha: 30, beta: 25, theta: 20, delta: 15, gamma: 10 },
    breathingPattern: { rate: 12, depth: 0.8, coherence: 0.75 },
    autonomicBalance: { sympathetic: 0.4, parasympathetic: 0.6 }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const onPolarityChange = (polarity: GaaPolarity) => {
    setPreset({ ...preset, polarity });
  };

  const handleOscillatorChange = (value: number[]) => {
    setOscillatorCountLocal(value);
  };

  // Simple demo layer states
  const layerStates = {
    atomic: { active: true, weight: 0.8 },
    molecular: { active: false, weight: 0.3 }, 
    cellular: { active: true, weight: 0.6 },
    tissue: { active: false, weight: 0.2 }, 
    organ: { active: true, weight: 0.9 }, 
    organism: { active: false, weight: 0.1 }
  };

  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case 'atomic': return '◉';
      case 'molecular': return '◎';
      case 'cellular': return '⊕';
      case 'tissue': return '☉';
      case 'organ': return '✦';
      default: return '◦';
    }
  };

  const getLayerColor = (layerId: string) => {
    switch (layerId) {
      case 'atomic': return 'text-purple-400';
      case 'molecular': return 'text-blue-400';
      case 'cellular': return 'text-green-400';
      case 'tissue': return 'text-yellow-400';
      case 'organ': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Safety Status Alert */}
      <Alert variant="default">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          System Status: {state ? 'Active' : 'Inactive'}
        </AlertDescription>
      </Alert>

      <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border-violet-500/20 relative overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Waves className="w-4 h-4 text-violet-400" />
            GAA Engine
            <Badge variant="default">
              <Shield className="h-3 w-3 mr-1" />
              Safe
            </Badge>
            <Badge 
              variant={state ? "default" : "secondary"} 
              className="ml-auto text-xs"
            >
              {state ? 'Ready' : 'Initializing'}
            </Badge>
          </CardTitle>
        </CardHeader>
      
        <CardContent className="space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePlayPause}
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
          {isPlaying && state && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-violet-500/5 border border-violet-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-violet-300">Shadow Engine Active</span>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-violet-400"
                >
                  ◉
                </motion.div>
              </div>
              <Progress 
                value={(state.t % 10) * 10} 
                className="h-2" 
              />
              <div className="text-xs text-muted-foreground mt-1">
                Time: {state.t.toFixed(1)}s | Dark Phase: {state.darkPhaseActive ? 'Active' : 'Inactive'}
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
              {Object.entries(layerStates).map(([layerId, layer]) => (
                <button
                  key={layerId}
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
                    {layer.weight.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Geometry Stats */}
          {state && (
            <div className="p-2 rounded bg-violet-500/5 border border-violet-500/20">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engine Status:</span>
                  <span className="text-violet-400">{state.darkPhaseActive ? 'Dark Phase' : 'Light Phase'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dark Weight:</span>
                  <span className="text-violet-400">{Math.round(state.weights.dark * 100)}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Polarity Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Polarity Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Shadow Mode</span>
            <Button
              variant={preset.polarity.shadowMode ? "default" : "outline"}
              size="sm"
              onClick={() => onPolarityChange({ 
                ...preset.polarity, 
                shadowMode: !preset.polarity.shadowMode 
              })}
            >
              {preset.polarity.shadowMode ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Dark Weight</span>
              <span className="text-sm">{Math.round(preset.polarity.darkWeight * 100)}%</span>
            </div>
            <Slider
              value={[preset.polarity.darkWeight * 100]}
              onValueChange={(value) => onPolarityChange({
                ...preset.polarity,
                darkWeight: value[0] / 100,
                lightWeight: 1 - (value[0] / 100)
              })}
              max={100}
              min={0}
              step={1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Biofeedback Display */}
      <BiofeedbackDisplay
        metrics={mockBiofeedback}
        isConnected={isPlaying}
      />
    </div>
  );
};