import { useEffect, useRef, useState, useCallback } from 'react';
import { GaaPreset, ShadowEngineState, SimpleBiofeedbackMetrics } from '@/types/gaa';
import { useShadowEngine } from '@/hooks/useShadowEngine';

export interface GAAEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentGeometry: any[];
  activeOscillators: number;
  breathPhase: number;
  shadowEngineState: ShadowEngineState | null;
  biofeedbackMetrics: SimpleBiofeedbackMetrics | null;
  sessionId: string | null;
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
    sessionId: null
  });

  const { state: shadowState } = useShadowEngine(preset);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      isInitialized: !!shadowState,
      shadowEngineState: shadowState,
      sessionId: `gaa_${Date.now()}`
    }));
  }, [shadowState]);

  const initializeGAA = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isInitialized: true }));
    return true;
  }, []);

  const startGAA = useCallback(async () => {
    setState(prev => ({ ...prev, isPlaying: true, activeOscillators: 8 }));
  }, []);

  const stopGAA = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, activeOscillators: 0 }));
  }, []);

  const toggleLayer = useCallback((layerId: string) => {
    // Mock implementation
  }, []);

  const setOscillatorCount = useCallback((count: number) => {
    setState(prev => ({ ...prev, activeOscillators: count }));
  }, []);

  const getLayerStates = useCallback(() => {
    return {
      atomic: { active: true, weight: 0.8 },
      molecular: { active: false, weight: 0.3 },
      cellular: { active: true, weight: 0.6 },
      tissue: { active: false, weight: 0.2 },
      organ: { active: true, weight: 0.9 },
      organism: { active: false, weight: 0.1 }
    };
  }, []);

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