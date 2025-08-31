import { useEffect, useRef, useState, useCallback } from 'react';
import { MultiScaleLayerManager, LayerHierarchy } from '@/utils/gaa/MultiScaleLayerManager';
import { GeometricOscillator } from '@/utils/gaa/GeometricOscillator';
import { NormalizedGeometry } from '@/utils/gaa/GeometricNormalizer';
import { ShadowEngine } from '@/utils/gaa/ShadowEngine';
import { 
  PolarityProtocol, 
  ShadowEngineState, 
  BiofeedbackMetrics,
  GAASessionExtended 
} from '@/types/gaa-polarity';

export interface GAAEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentGeometry: NormalizedGeometry[];
  activeOscillators: number;
  breathPhase: number;
  // Shadow Engine integration
  shadowEngine: ShadowEngineState | null;
  polarityProtocol: PolarityProtocol | null;
  biofeedbackMetrics: BiofeedbackMetrics | null;
  // Session management
  currentSession: GAASessionExtended | null;
  sessionId: string | null;
}

/**
 * GAA (Geometrically Aligned Audio) Engine Hook
 * Integrates multi-scale layer management with 3D geometric audio synthesis
 */
export const useGAAEngine = () => {
  const [state, setState] = useState<GAAEngineState>({
    isInitialized: false,
    isPlaying: false,
    currentGeometry: [],
    activeOscillators: 0,
    breathPhase: 0,
    shadowEngine: null,
    polarityProtocol: null,
    biofeedbackMetrics: null,
    currentSession: null,
    sessionId: null
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const layerManagerRef = useRef<MultiScaleLayerManager | null>(null);
  const geometricOscillatorRef = useRef<GeometricOscillator | null>(null);
  const shadowEngineRef = useRef<ShadowEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(performance.now());

  /**
   * Initialize GAA engine components
   */
  const initializeGAA = useCallback(async (): Promise<boolean> => {
    try {
      // Initialize Web Audio API
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Initialize GAA components
      layerManagerRef.current = new MultiScaleLayerManager();
      geometricOscillatorRef.current = new GeometricOscillator(audioContextRef.current, {
        baseFrequency: 220, // Lower base frequency for cosmic resonance
        gainLevel: 0.15,
        waveform: 'sine',
        modulationDepth: 0.2,
        spatialPanning: true
      });

      // Initialize Shadow Engine
      shadowEngineRef.current = new ShadowEngine(audioContextRef.current);
      
      // Generate session ID
      const sessionId = `gaa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setState(prev => ({ 
        ...prev, 
        isInitialized: true,
        sessionId,
        shadowEngine: shadowEngineRef.current.getState(),
        polarityProtocol: {
          lightChannel: {
            enabled: true,
            amplitude: 0.5,
            phase: 0,
            subharmonicDepth: 0.3,
            texturalComplexity: 0.5,
            resonanceMode: 'constructive'
          },
          darkChannel: {
            enabled: true,
            amplitude: 0.5,
            phase: Math.PI,
            subharmonicDepth: 0.3,
            texturalComplexity: 0.5,
            resonanceMode: 'destructive'
          },
          polarityBalance: 0,
          manifestInDark: false,
          crossPolarizationEnabled: true,
          darkEnergyDrift: {
            driftRate: 0.001,
            expansionFactor: 1.0,
            voidResonance: false,
            quantumFluctuation: 0.1,
            darkMatterDensity: 0.85
          }
        }
      }));
      return true;
    } catch (error) {
      console.error('Failed to initialize GAA engine:', error);
      return false;
    }
  }, []);

  /**
   * Start GAA audio synthesis
   */
  const startGAA = useCallback(async () => {
    if (!state.isInitialized) {
      const initialized = await initializeGAA();
      if (!initialized) return;
    }

    if (!layerManagerRef.current || !geometricOscillatorRef.current || !shadowEngineRef.current || state.isPlaying) {
      return;
    }

    // Generate initial geometry
    const geometry = layerManagerRef.current.generateCompositeGeometry(8); // Start with 8 oscillators
    
    // Create geometric oscillators for each point
    geometry.forEach((geo, index) => {
      geometricOscillatorRef.current!.createGeometricOscillator(geo, `gaa-osc-${index}`, 4);
    });

    // Start Shadow Engine with current polarity protocol
    if (state.polarityProtocol) {
      shadowEngineRef.current.updatePolarityProtocol(state.polarityProtocol);
      shadowEngineRef.current.start();
    }

    setState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      currentGeometry: geometry,
      activeOscillators: geometry.length,
      shadowEngine: shadowEngineRef.current!.getState()
    }));

    startAnimation();
  }, [state.isInitialized, state.isPlaying, initializeGAA]);

  /**
   * Stop GAA audio synthesis
   */
  const stopGAA = useCallback(() => {
    if (geometricOscillatorRef.current) {
      geometricOscillatorRef.current.stopAll();
    }

    if (shadowEngineRef.current) {
      shadowEngineRef.current.stop();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      isPlaying: false,
      activeOscillators: 0,
      shadowEngine: shadowEngineRef.current?.getState() || null
    }));
  }, []);

  /**
   * Animation loop for real-time geometry updates
   */
  const startAnimation = useCallback(() => {
    const animate = (currentTime: number) => {
      if (!layerManagerRef.current || !geometricOscillatorRef.current || !state.isPlaying) {
        return;
      }

      const deltaTime = (currentTime - lastUpdateTime.current) / 1000; // Convert to seconds
      lastUpdateTime.current = currentTime;

      // Get current state first
      const gaaState = layerManagerRef.current.getState();

      // Update breath phase and layer timing
      layerManagerRef.current.updateBreathPhase(deltaTime * 0.5); // Slower breath for deep states
      
      // Generate new composite geometry
      const newGeometry = layerManagerRef.current.generateCompositeGeometry(state.activeOscillators);
      
      // Update existing oscillators with new geometry
      newGeometry.forEach((geo, index) => {
        geometricOscillatorRef.current!.updateGeometricOscillator(`gaa-osc-${index}`, geo, 4);
      });

      // Update state
      setState(prev => ({ 
        ...prev, 
        currentGeometry: newGeometry,
        breathPhase: gaaState.breathPhase,
        shadowEngine: shadowEngineRef.current?.getState() || null,
        biofeedbackMetrics: shadowEngineRef.current ? {
          heartRateVariability: {
            rmssd: 40 + Math.sin(currentTime * 0.001) * 10,
            pnn50: 30 + Math.cos(currentTime * 0.0007) * 15,
            coherenceRatio: 0.7 + Math.sin(currentTime * 0.0003) * 0.2,
            timestamp: currentTime
          },
          brainwaveActivity: {
            alpha: 0.3 + Math.sin(gaaState.breathPhase) * 0.1,
            beta: 0.2,
            theta: 0.4 + Math.cos(gaaState.breathPhase * 0.7) * 0.15,
            delta: 0.1,
            gamma: 0.05,
            coherence: shadowEngineRef.current.getState().neuralEntrainment,
            timestamp: currentTime
          },
          breathingPattern: {
            rate: 6 + Math.sin(gaaState.breathPhase) * 2,
            depth: 0.8 + Math.cos(gaaState.breathPhase) * 0.2,
            coherence: shadowEngineRef.current.getState().breathCoherence,
            phase: Math.sin(gaaState.breathPhase) > 0 ? 'inhale' : 'exhale',
            timestamp: currentTime
          },
          autonomicBalance: {
            sympathetic: 0.4 + shadowEngineRef.current.getState().lightDominance * 0.3,
            parasympathetic: 0.6 + shadowEngineRef.current.getState().darkDominance * 0.3,
            balance: shadowEngineRef.current.getState().polarityBalance,
            timestamp: currentTime
          }
        } : null
      }));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state.isPlaying, state.activeOscillators]);

  /**
   * Toggle specific scale layer
   */
  const toggleLayer = useCallback((layerId: keyof LayerHierarchy) => {
    if (layerManagerRef.current) {
      layerManagerRef.current.toggleLayer(layerId);
    }
  }, []);

  /**
   * Update oscillator count (complexity)
   */
  const setOscillatorCount = useCallback((count: number) => {
    if (!state.isPlaying || !geometricOscillatorRef.current) return;

    // Stop existing oscillators
    geometricOscillatorRef.current.stopAll();

    // Generate new geometry with updated count
    if (layerManagerRef.current) {
      const geometry = layerManagerRef.current.generateCompositeGeometry(count);
      
      // Create new oscillators
      geometry.forEach((geo, index) => {
        geometricOscillatorRef.current!.createGeometricOscillator(geo, `gaa-osc-${index}`, 4);
      });

      setState(prev => ({ 
        ...prev, 
        activeOscillators: count,
        currentGeometry: geometry 
      }));
    }
  }, [state.isPlaying]);

  /**
   * Get current layer states
   */
  const getLayerStates = useCallback(() => {
    if (!layerManagerRef.current) return null;
    return layerManagerRef.current.getState();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopGAA();
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopGAA]);

  // Polarity control functions
  const updatePolarityProtocol = useCallback((protocol: PolarityProtocol) => {
    if (shadowEngineRef.current) {
      shadowEngineRef.current.updatePolarityProtocol(protocol);
      setState(prev => ({ 
        ...prev, 
        polarityProtocol: protocol,
        shadowEngine: shadowEngineRef.current!.getState()
      }));
    }
  }, []);

  const setPolarityBalance = useCallback((balance: number) => {
    if (shadowEngineRef.current) {
      shadowEngineRef.current.setPolarityBalance(balance);
      setState(prev => ({ 
        ...prev, 
        shadowEngine: shadowEngineRef.current!.getState()
      }));
    }
  }, []);

  const enableManifestInDark = useCallback((enabled: boolean) => {
    if (shadowEngineRef.current) {
      shadowEngineRef.current.enableManifestInDark(enabled);
      setState(prev => ({ 
        ...prev, 
        shadowEngine: shadowEngineRef.current!.getState()
      }));
    }
  }, []);

  const triggerShadowPhase = useCallback(() => {
    if (shadowEngineRef.current) {
      shadowEngineRef.current.triggerShadowPhase();
      setState(prev => ({ 
        ...prev, 
        shadowEngine: shadowEngineRef.current!.getState()
      }));
    }
  }, []);

  return {
    // State
    ...state,
    
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
    getLayerStates,
    
    // Direct manager access for advanced users
    layerManager: layerManagerRef.current,
    geometricOscillator: geometricOscillatorRef.current,
    shadowEngine: shadowEngineRef.current
  };
};