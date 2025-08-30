import { useEffect, useRef, useState, useCallback } from 'react';
import { MultiScaleLayerManager, LayerHierarchy } from '@/utils/gaa/MultiScaleLayerManager';
import { GeometricOscillator } from '@/utils/gaa/GeometricOscillator';
import { NormalizedGeometry } from '@/utils/gaa/GeometricNormalizer';

export interface GAAEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentGeometry: NormalizedGeometry[];
  activeOscillators: number;
  breathPhase: number;
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
    breathPhase: 0
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const layerManagerRef = useRef<MultiScaleLayerManager | null>(null);
  const geometricOscillatorRef = useRef<GeometricOscillator | null>(null);
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

      setState(prev => ({ ...prev, isInitialized: true }));
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

    if (!layerManagerRef.current || !geometricOscillatorRef.current || state.isPlaying) {
      return;
    }

    // Generate initial geometry
    const geometry = layerManagerRef.current.generateCompositeGeometry(8); // Start with 8 oscillators
    
    // Create geometric oscillators for each point
    geometry.forEach((geo, index) => {
      geometricOscillatorRef.current!.createGeometricOscillator(geo, `gaa-osc-${index}`, 4);
    });

    setState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      currentGeometry: geometry,
      activeOscillators: geometry.length 
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

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      isPlaying: false,
      activeOscillators: 0 
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

      // Update breath phase and layer timing
      layerManagerRef.current.updateBreathPhase(deltaTime * 0.5); // Slower breath for deep states
      
      // Generate new composite geometry
      const newGeometry = layerManagerRef.current.generateCompositeGeometry(state.activeOscillators);
      
      // Update existing oscillators with new geometry
      newGeometry.forEach((geo, index) => {
        geometricOscillatorRef.current!.updateGeometricOscillator(`gaa-osc-${index}`, geo, 4);
      });

      // Update state
      const gaaState = layerManagerRef.current.getState();
      setState(prev => ({ 
        ...prev, 
        currentGeometry: newGeometry,
        breathPhase: gaaState.breathPhase
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

  return {
    // State
    ...state,
    
    // Actions
    initializeGAA,
    startGAA,
    stopGAA,
    toggleLayer,
    setOscillatorCount,
    
    // Data access
    getLayerStates,
    
    // Direct manager access for advanced users
    layerManager: layerManagerRef.current,
    geometricOscillator: geometricOscillatorRef.current
  };
};