import { useEffect, useRef, useState, useCallback } from 'react';
import { GaaPreset, ShadowEngineState, SimpleBiofeedbackMetrics } from '@/types/gaa';
import { useShadowEngine } from '@/hooks/useShadowEngine';
import { GeometricOscillator, GeometricOscillatorConfig, NormalizedGeometry } from '@/utils/gaa/GeometricOscillator';
import { SafetySystem } from '@/utils/gaa/SafetySystem';
import { CosmicDataStream } from '@/utils/cosmic/CosmicDataStream';

export interface GAAEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentGeometry: NormalizedGeometry[];
  activeOscillators: number;
  breathPhase: number;
  shadowEngineState: ShadowEngineState | null;
  biofeedbackMetrics: SimpleBiofeedbackMetrics | null;
  sessionId: string | null;
  cosmicData: any | null;
  safetyStatus: any;
}

// Default preset
const defaultPreset: GaaPreset = {
  label: "Default",
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

/**
 * GAA (Geometrically Aligned Audio) Engine Hook
 * Simplified implementation using the new architecture
 */
export const useGAAEngine = () => {
  const [preset, setPreset] = useState<GaaPreset>(defaultPreset);
  const [state, setState] = useState<GAAEngineState>({
    isInitialized: false,
    isPlaying: false,
    currentGeometry: [],
    activeOscillators: 0,
    breathPhase: 0,
    shadowEngineState: null,
    biofeedbackMetrics: null,
    sessionId: null,
    cosmicData: null,
    safetyStatus: { level: 'safe', activeAlerts: [], sessionDuration: 0, lastBreak: Date.now(), recommendations: [] }
  });

  const { state: shadowState, biofeedbackManager, layerManager } = useShadowEngine(preset);
  const audioContextRef = useRef<AudioContext | null>(null);
  const geometricOscillatorRef = useRef<GeometricOscillator | null>(null);
  const safetySystemRef = useRef<SafetySystem | null>(null);
  const cosmicStreamRef = useRef<CosmicDataStream | null>(null);

  // Initialize all systems
  useEffect(() => {
    if (!safetySystemRef.current) {
      safetySystemRef.current = new SafetySystem();
      cosmicStreamRef.current = new CosmicDataStream();
    }
    
    setState(prev => ({
      ...prev,
      isInitialized: !!shadowState,
      shadowEngineState: shadowState,
      sessionId: `gaa_${Date.now()}`,
      safetyStatus: safetySystemRef.current?.getSafetyStatus() || prev.safetyStatus
    }));
  }, [shadowState]);

  const initializeGAA = useCallback(async (): Promise<boolean> => {
    try {
      // Initialize Web Audio API
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Initialize geometric oscillator
      const config: GeometricOscillatorConfig = {
        baseFrequency: 220,
        gainLevel: 0.15,
        waveform: 'sine',
        modulationDepth: 0.2,
        spatialPanning: true
      };
      
      geometricOscillatorRef.current = new GeometricOscillator(audioContextRef.current, config);
      
      setState(prev => ({ ...prev, isInitialized: true }));
      return true;
    } catch (error) {
      console.error('Failed to initialize GAA engine:', error);
      return false;
    }
  }, []);

  const startGAA = useCallback(async () => {
    if (!state.isInitialized) {
      const initialized = await initializeGAA();
      if (!initialized) return;
    }

    // Start safety monitoring
    if (safetySystemRef.current) {
      safetySystemRef.current.startMonitoring();
    }

    // Start cosmic data streaming
    if (cosmicStreamRef.current) {
      cosmicStreamRef.current.startStreaming();
    }

    // Generate initial geometry and start oscillators
    if (layerManager && geometricOscillatorRef.current) {
      const geometries = layerManager.generateCompositeGeometry(8);
      
      geometries.forEach((geometry, index) => {
        geometricOscillatorRef.current!.createGeometricOscillator(
          geometry, 
          `gaa-osc-${index}`, 
          4
        );
      });
      
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        activeOscillators: geometries.length,
        currentGeometry: geometries
      }));
    } else {
      setState(prev => ({ ...prev, isPlaying: true, activeOscillators: 8 }));
    }
  }, [state.isInitialized, initializeGAA, layerManager]);

  const stopGAA = useCallback(() => {
    // Stop all oscillators
    if (geometricOscillatorRef.current) {
      geometricOscillatorRef.current.stopAll();
    }

    // Stop safety monitoring
    if (safetySystemRef.current) {
      safetySystemRef.current.stopMonitoring();
    }

    // Stop cosmic streaming
    if (cosmicStreamRef.current) {
      cosmicStreamRef.current.stopStreaming();
    }

    setState(prev => ({ ...prev, isPlaying: false, activeOscillators: 0 }));
  }, []);

  const toggleLayer = useCallback((layerId: string) => {
    // Mock implementation
  }, []);

  const setOscillatorCount = useCallback((count: number) => {
    if (!state.isPlaying || !geometricOscillatorRef.current || !layerManager) {
      setState(prev => ({ ...prev, activeOscillators: count }));
      return;
    }

    // Stop existing oscillators
    geometricOscillatorRef.current.stopAll();

    // Generate new geometry with updated count
    const geometries = layerManager.generateCompositeGeometry(count);
    
    geometries.forEach((geometry, index) => {
      geometricOscillatorRef.current!.createGeometricOscillator(
        geometry, 
        `gaa-osc-${index}`, 
        4
      );
    });

    setState(prev => ({ 
      ...prev, 
      activeOscillators: count,
      currentGeometry: geometries 
    }));
  }, [state.isPlaying, layerManager]);

  const getLayerStates = useCallback(() => {
    if (layerManager) {
      return layerManager.getState();
    }
    
    // Fallback state
    return {
      breathPhase: 0,
      globalCoherence: 0.5,
      energyDistribution: [0.1, 0.15, 0.2, 0.25, 0.2, 0.1],
      layerSyncRatio: 0.8,
      currentLayer: 'cellular' as const,
      layers: {
        atomic: { active: true, weight: 0.8, frequency: 0.001, phase: 0, resonance: 0.95 },
        molecular: { active: false, weight: 0.3, frequency: 0.01, phase: 0, resonance: 0.8 },
        cellular: { active: true, weight: 0.6, frequency: 0.1, phase: 0, resonance: 0.7 },
        tissue: { active: false, weight: 0.2, frequency: 1.0, phase: 0, resonance: 0.6 },
        organ: { active: true, weight: 0.9, frequency: 10.0, phase: 0, resonance: 0.5 },
        organism: { active: false, weight: 0.1, frequency: 100.0, phase: 0, resonance: 0.3 }
      }
    };
  }, [layerManager]);

  const updatePolarityProtocol = useCallback((protocol: any) => {
    // Update preset with new polarity
    setPreset(prev => ({ ...prev, polarity: protocol }));
  }, []);

  const setPolarityBalance = useCallback((balance: number) => {
    // Mock implementation
  }, []);

  const enableManifestInDark = useCallback((enabled: boolean) => {
    // Mock implementation
  }, []);

  const triggerShadowPhase = useCallback(() => {
    // Mock implementation
  }, []);

  return {
    // State
    isInitialized: state.isInitialized,
    isPlaying: state.isPlaying,
    currentGeometry: state.currentGeometry,
    activeOscillators: state.activeOscillators,
    breathPhase: state.breathPhase,
    shadowEngine: state.shadowEngineState, // Note: returning state, not the engine instance
    polarityProtocol: preset.polarity,
    biofeedbackMetrics: state.biofeedbackMetrics,
    sessionId: state.sessionId,
    
    // Actions
    initializeGAA,
    startGAA,
    stopGAA,
    toggleLayer,
    setOscillatorCount,
    
    // Polarity Actions
    updatePolarityProtocol,
    setPolarityBalance,
    enableManifestInDark,
    triggerShadowPhase,
    
    // Data access
    getLayerStates
  };
};