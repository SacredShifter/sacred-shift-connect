import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Brain, 
  Target, 
  Activity, 
  Radio, 
  Waves,
  Atom,
  Sparkles,
  Eye,
  Heart,
  Shield,
  Lightbulb
} from 'lucide-react';
import { QuantumResonanceEngine, QuantumConsciousnessState, QuantumState, QuantumManifestation } from '@/types/quantum';

interface QuantumResonanceEngineProps {
  userId: string;
  onManifestationCreated?: (manifestation: QuantumManifestation) => void;
  onQuantumStateChanged?: (state: QuantumState) => void;
}

export const QuantumResonanceEngine: React.FC<QuantumResonanceEngineProps> = ({
  userId,
  onManifestationCreated,
  onQuantumStateChanged
}) => {
  const [engineState, setEngineState] = useState<QuantumResonanceEngine['engineState']>({
    isActive: false,
    powerLevel: 0,
    frequency: 432,
    coherence: 0,
    quantumTunneling: 0
  });
  
  const [currentQuantumState, setCurrentQuantumState] = useState<QuantumConsciousnessState | null>(null);
  const [targetQuantumState, setTargetQuantumState] = useState<QuantumConsciousnessState | null>(null);
  const [superposition, setSuperposition] = useState(false);
  const [entanglement, setEntanglement] = useState<string[]>([]);
  const [quantumManifestations, setQuantumManifestations] = useState<QuantumManifestation[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  
  const engineIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const quantumFieldRef = useRef<HTMLDivElement>(null);

  // Initialize quantum states
  useEffect(() => {
    const initialCurrentState: QuantumConsciousnessState = {
      id: 'current-state',
      archetype: 'Quantum Explorer',
      energyFrequency: '432Hz',
      consciousnessLevel: 'quantum-seed',
      resonance: {
        frequency: 432,
        amplitude: 50,
        phase: 0,
        coherence: 0
      },
      quantumField: {
        intensity: 0,
        radius: 100,
        color: '#00ff88',
        geometry: 'quantum-flower'
      },
      probability: 1.0,
      potential: {
        manifestation: 0,
        transformation: 0,
        transcendence: 0
      }
    };

    const initialTargetState: QuantumConsciousnessState = {
      id: 'target-state',
      archetype: 'Quantum Sage',
      energyFrequency: '852Hz',
      consciousnessLevel: 'quantum-transcend',
      resonance: {
        frequency: 852,
        amplitude: 100,
        phase: 180,
        coherence: 100
      },
      quantumField: {
        intensity: 100,
        radius: 1000,
        color: '#ff00ff',
        geometry: 'quantum-matrix'
      },
      probability: 0.0,
      potential: {
        manifestation: 100,
        transformation: 100,
        transcendence: 100
      }
    };

    setCurrentQuantumState(initialCurrentState);
    setTargetQuantumState(initialTargetState);
  }, []);

  // Quantum engine simulation
  useEffect(() => {
    if (!engineState.isActive) return;

    engineIntervalRef.current = setInterval(() => {
      // Simulate quantum field evolution
      updateQuantumField();
      
      // Simulate coherence building
      if (engineState.coherence < 100) {
        setEngineState(prev => ({
          ...prev,
          coherence: Math.min(100, prev.coherence + Math.random() * 2),
          quantumTunneling: Math.min(100, prev.quantumTunneling + Math.random() * 1.5)
        }));
      }

      // Simulate quantum state transitions
      if (currentQuantumState && targetQuantumState) {
        simulateQuantumTransition();
      }
    }, 100);

    return () => {
      if (engineIntervalRef.current) {
        clearInterval(engineIntervalRef.current);
      }
    };
  }, [engineState.isActive, currentQuantumState, targetQuantumState]);

  const updateQuantumField = useCallback(() => {
    if (!currentQuantumState) return;

    setCurrentQuantumState(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        resonance: {
          ...prev.resonance,
          phase: (prev.resonance.phase + 2) % 360,
          amplitude: Math.min(100, prev.resonance.amplitude + Math.random() * 0.5),
          coherence: Math.min(100, prev.resonance.coherence + Math.random() * 0.3)
        },
        quantumField: {
          ...prev.quantumField,
          intensity: Math.min(100, prev.quantumField.intensity + Math.random() * 0.2)
        }
      };
    });
  }, [currentQuantumState]);

  const simulateQuantumTransition = useCallback(() => {
    if (!currentQuantumState || !targetQuantumState) return;

    const transitionProbability = calculateTransitionProbability();
    
    if (Math.random() < transitionProbability) {
      // Quantum state transition occurs
      setCurrentQuantumState(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          consciousnessLevel: targetQuantumState.consciousnessLevel,
          archetype: targetQuantumState.archetype,
          energyFrequency: targetQuantumState.energyFrequency,
          resonance: {
            ...prev.resonance,
            frequency: targetQuantumState.resonance.frequency,
            amplitude: Math.min(100, prev.resonance.amplitude + 5),
            coherence: Math.min(100, prev.resonance.coherence + 10)
          },
          quantumField: {
            ...prev.quantumField,
            intensity: Math.min(100, prev.quantumField.intensity + 5),
            geometry: targetQuantumState.quantumField.geometry
          },
          potential: {
            manifestation: Math.min(100, prev.potential.manifestation + 5),
            transformation: Math.min(100, prev.potential.transformation + 5),
            transcendence: Math.min(100, prev.potential.transcendence + 5)
          }
        };
      });
    }
  }, [currentQuantumState, targetQuantumState]);

  const calculateTransitionProbability = useCallback(() => {
    if (!currentQuantumState || !targetQuantumState) return 0;

    const coherenceFactor = engineState.coherence / 100;
    const frequencyAlignment = 1 - Math.abs(currentQuantumState.resonance.frequency - targetQuantumState.resonance.frequency) / 1000;
    const powerFactor = engineState.powerLevel / 100;
    
    return coherenceFactor * frequencyAlignment * powerFactor * 0.01;
  }, [currentQuantumState, targetQuantumState, engineState]);

  const startEngine = useCallback(() => {
    setIsCalibrating(true);
    setCalibrationProgress(0);

    // Simulate calibration process
    const calibrationInterval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(calibrationInterval);
          setIsCalibrating(false);
          setEngineState(prev => ({ ...prev, isActive: true }));
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  }, []);

  const stopEngine = useCallback(() => {
    setEngineState(prev => ({ ...prev, isActive: false }));
    if (engineIntervalRef.current) {
      clearInterval(engineIntervalRef.current);
      engineIntervalRef.current = null;
    }
  }, []);

  const createQuantumManifestation = useCallback(() => {
    if (!currentQuantumState) return;

    const manifestation: QuantumManifestation = {
      id: `manifestation-${Date.now()}`,
      userId,
      intention: 'Quantum consciousness expansion',
      quantumState: currentQuantumState,
      manifestation: {
        type: 'consciousness-expansion',
        target: 'Self',
        probability: currentQuantumState.potential.manifestation / 100,
        timeline: 7,
        energy: currentQuantumState.quantumField.intensity
      },
      quantumProcess: {
        superposition: true,
        entanglement: entanglement,
        measurement: {
          collapsed: false
        },
        coherence: currentQuantumState.resonance.coherence
      },
      status: 'superposition',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setQuantumManifestations(prev => [manifestation, ...prev.slice(0, 4)]);
    onManifestationCreated?.(manifestation);
  }, [currentQuantumState, userId, entanglement, onManifestationCreated]);

  const getConsciousnessLevelColor = (level: string) => {
    const colors = {
      'quantum-seed': 'text-yellow-400',
      'quantum-bloom': 'text-green-400',
      'quantum-transcend': 'text-purple-400',
      'quantum-unity': 'text-pink-400'
    };
    return colors[level as keyof typeof colors] || 'text-yellow-400';
  };

  const getArchetypeColor = (archetype: string) => {
    const colors = {
      'Quantum Explorer': 'bg-blue-500/20 text-blue-400',
      'Quantum Sage': 'bg-purple-500/20 text-purple-400',
      'Quantum Healer': 'bg-green-500/20 text-green-400',
      'Quantum Warrior': 'bg-red-500/20 text-red-400'
    };
    return colors[archetype as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Engine Controls */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Atom className="h-5 w-5" />
            Quantum Resonance Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Power Level Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">
                Power Level: {engineState.powerLevel}%
              </label>
              <Slider
                value={[engineState.powerLevel]}
                onValueChange={(value) => setEngineState(prev => ({ ...prev, powerLevel: value[0] }))}
                min={0}
                max={100}
                step={1}
                className="w-full"
                disabled={engineState.isActive}
              />
            </div>

            {/* Frequency Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-purple-300">
                Frequency: {engineState.frequency}Hz
              </label>
              <Slider
                value={[engineState.frequency]}
                onValueChange={(value) => setEngineState(prev => ({ ...prev, frequency: value[0] }))}
                min={1}
                max={1000}
                step={1}
                className="w-full"
                disabled={engineState.isActive}
              />
            </div>

            {/* Engine Controls */}
            <div className="flex gap-2">
              {!engineState.isActive ? (
                <Button
                  onClick={startEngine}
                  disabled={isCalibrating}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                >
                  {isCalibrating ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Calibrating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Engine
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={stopEngine}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 flex-1"
                >
                  <Radio className="h-4 w-4 mr-2" />
                  Stop Engine
                </Button>
              )}
            </div>

            {/* Calibration Progress */}
            {isCalibrating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quantum Calibration</span>
                  <span>{calibrationProgress}%</span>
                </div>
                <Progress value={calibrationProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {engineState.isActive && currentQuantumState && (
        <>
          {/* Engine Status */}
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Activity className="h-5 w-5" />
                Engine Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{engineState.powerLevel}%</div>
                  <div className="text-xs text-gray-400">Power</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{engineState.coherence.toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Coherence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{engineState.quantumTunneling.toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Tunneling</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{engineState.frequency}Hz</div>
                  <div className="text-xs text-gray-400">Frequency</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Quantum State */}
          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Brain className="h-5 w-5" />
                Current Quantum State
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-300">{currentQuantumState.archetype}</h4>
                    <p className="text-sm text-gray-300">{currentQuantumState.energyFrequency}</p>
                  </div>
                  <Badge className={getArchetypeColor(currentQuantumState.archetype)}>
                    {currentQuantumState.archetype}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resonance Amplitude</span>
                      <span>{currentQuantumState.resonance.amplitude.toFixed(0)}%</span>
                    </div>
                    <Progress value={currentQuantumState.resonance.amplitude} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quantum Coherence</span>
                      <span>{currentQuantumState.resonance.coherence.toFixed(0)}%</span>
                    </div>
                    <Progress value={currentQuantumState.resonance.coherence} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Field Intensity</span>
                    <span>{currentQuantumState.quantumField.intensity.toFixed(0)}%</span>
                  </div>
                  <Progress value={currentQuantumState.quantumField.intensity} className="h-2" />
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400">{currentQuantumState.resonance.frequency}Hz</div>
                    <div className="text-xs text-gray-400">Frequency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400">{currentQuantumState.resonance.phase.toFixed(0)}°</div>
                    <div className="text-xs text-gray-400">Phase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400">{currentQuantumState.quantumField.radius}m</div>
                    <div className="text-xs text-gray-400">Radius</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quantum Manifestations */}
          <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Sparkles className="h-5 w-5" />
                Quantum Manifestations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={createQuantumManifestation}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Create Quantum Manifestation
                </Button>

                {quantumManifestations.map((manifestation) => (
                  <motion.div
                    key={manifestation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-black/20 rounded-lg border border-yellow-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-yellow-300">{manifestation.intention}</h4>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {manifestation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-yellow-400">
                        Probability: {(manifestation.manifestation.probability * 100).toFixed(0)}%
                      </span>
                      <span className="text-green-400">
                        Energy: {manifestation.manifestation.energy.toFixed(0)}%
                      </span>
                      <span className="text-blue-400">
                        Timeline: {manifestation.manifestation.timeline} days
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quantum Field Visualization */}
          <Card className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-pink-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-300">
                <Waves className="h-5 w-5" />
                Quantum Field Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={quantumFieldRef}
                className="relative h-64 bg-black/20 rounded-lg overflow-hidden border border-pink-500/30"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-radial from-purple-400/20 to-transparent"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400 mb-2">
                      {currentQuantumState.quantumField.geometry.replace('quantum-', '').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-300">
                      Quantum Field Active
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default QuantumResonanceEngine;
