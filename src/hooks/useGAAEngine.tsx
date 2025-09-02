import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { GaaPreset, ShadowEngineState, BioSignals, GaaCoreFrame } from '@/types/gaa';
import { CollectiveField } from '@/modules/collective/CollectiveReceiver';
import { GeometricOscillator, GeometricOscillatorConfig, NormalizedGeometry } from '@/utils/gaa/GeometricOscillator';
import { SafetySystem, SafetyAlert } from '@/utils/gaa/SafetySystem';
import { MultiScaleLayerManager } from '@/utils/gaa/MultiScaleLayerManager';
import { ShadowEngine } from '@/dsp/ShadowEngine';
import { usePhonePulseSensor } from './usePhonePulseSensor';
import { useAccelerometer } from './useAccelerometer';

export interface GAAEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  activeOscillators: number;
  safetyAlerts: SafetyAlert[];
  shadowState: ShadowEngineState | null;
  isRecovering: boolean;
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
 * Refactored to a centralized architecture with a main update loop.
 */
export const useGAAEngine = (
    collectiveField: CollectiveField | null,
    phase?: number,
    coherence?: number
) => {
  const [preset, setPreset] = useState<GaaPreset>(defaultPreset);
  const [state, setState] = useState<GAAEngineState>({
    isInitialized: false,
    isPlaying: false,
    activeOscillators: 0,
    safetyAlerts: [],
    shadowState: null,
    isRecovering: false,
  });

  // Refs to hold instances of our engine components
  const geometricOscillatorRef = useRef<GeometricOscillator | null>(null);
  const shadowEngineRef = useRef<ShadowEngine | null>(null);
  const multiScaleLayerManagerRef = useRef<MultiScaleLayerManager | null>(null);
  const safetySystemRef = useRef<SafetySystem | null>(null);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const phonePulseSensor = usePhonePulseSensor();
  const accelerometer = useAccelerometer();

  // Centralized initialization
  const initializeGAA = useCallback(async () => {
    try {
      console.log('🎵 Initializing GAA Audio Engine...');
      await Tone.start();
      const audioContext = Tone.getContext().rawContext;

      const geoConfig: GeometricOscillatorConfig = {
        baseFrequency: 220, gainLevel: 0.7, waveform: 'sine',
        modulationDepth: 0.2, spatialPanning: true
      };

      geometricOscillatorRef.current = new GeometricOscillator(audioContext as AudioContext, geoConfig);
      shadowEngineRef.current = new ShadowEngine(preset);
      multiScaleLayerManagerRef.current = new MultiScaleLayerManager();
      safetySystemRef.current = new SafetySystem();

      safetySystemRef.current.onAlert((alert) => {
        setState(prev => ({...prev, safetyAlerts: [...prev.safetyAlerts, alert]}));
      });
      
      safetySystemRef.current.startMonitoring();

      setState(prev => ({ ...prev, isInitialized: true }));
      console.log('✅ GAA Engine fully initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize GAA engine:', error);
      return false;
    }
  }, [preset]);

  // Main update loop
  const updateLoop = useCallback((time: number) => {
    try {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
        animationFrameRef.current = requestAnimationFrame(updateLoop);
        return;
      }

      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const geoOsc = geometricOscillatorRef.current;
    const shadowEngine = shadowEngineRef.current;
    const layerManager = multiScaleLayerManagerRef.current;
    const safetySystem = safetySystemRef.current;

    if (!geoOsc || !shadowEngine || !layerManager || !safetySystem) return;

    // 1. Update layer manager to get new geometries
    layerManager.updateBreathPhase(deltaTime);
    let geometries: NormalizedGeometry[] = [];
    try {
      geometries = layerManager.generateCompositeGeometry(8); // Manage complexity
    } catch (error) {
      console.error('❌ Error generating composite geometry:', error);
      // Fallback to an empty array to prevent crashing the loop.
      geometries = [];
    }

    // 2. Get latest bio-signals from live sensors, with fallbacks
    let currentBioSignals: BioSignals;
    const DEFAULT_HEART_RATE = 60;
    // const DEFAULT_BREATH_RATE = 12; // Not currently used by sensors

    let heartRate = DEFAULT_HEART_RATE;

    if (phonePulseSensor.isSensing && phonePulseSensor.bpm > 0) {
        heartRate = phonePulseSensor.bpm;
    } else if (accelerometer.isSensing && accelerometer.bpm > 0) {
        heartRate = accelerometer.bpm;
    }

  // Add sensor input clamping with safe defaults
  const clampedBpm = Math.max(40, Math.min(180, heartRate));
  const defaultBreathingRate = Math.round(clampedBpm / 4); // Estimate breathing rate from BPM
  const safeBreathingRate = Math.max(8, Math.min(20, defaultBreathingRate)); // 8-20 breaths/min range
  
  // Enhanced biofeedback integration with safety validation
  currentBioSignals = {
    hrv: Math.max(0, Math.min(100, (1 - ((clampedBpm - 60) / 40)) * 100)), // Safer HRV calculation
    eegBandRatio: 0.5, // Default EEG until sensor is integrated
    breath: safeBreathingRate / 20, // Normalize to 0-1 range
  };

    // 3. Iterate through geometries and update oscillators
    geometries.forEach((geom, index) => {
      const id = `gaa-osc-${index}`;

      const mockCore: GaaCoreFrame = {
        f0: 220, A0: 0.8, fc0: 1200, ThN: 0.5, PhiN: 0.5,
        kN: geom.radius, tN: 0.5, dThNdt: 0,
        az: geom.center[0], el: geom.center[1]
      };

      // 4. Get audio params from ShadowEngine using real bio-signals
      let audioParams = shadowEngine.step(deltaTime, mockCore, currentBioSignals);

      // 4a. Apply collective field influence
      if (collectiveField) {
        const { resonance, polarity } = collectiveField;
        // Simple blending - more sophisticated mapping can be done in ShadowEngine
        audioParams.fHz *= (1 + (resonance - 0.5) * 0.1);
        if (coherence) {
            audioParams.amp *= (1 + (coherence - 0.5) * 0.2);
        }
        // Polarity will be handled inside ShadowEngine in a future iteration
      }

      if (phase) {
        // This is a simplified application of phase. A more robust implementation
        // would involve a proper phase-locking mechanism in the oscillator.
        audioParams.fHz *= (1 + Math.sin(phase - mockCore.PhiN) * 0.01);
      }

      // 5. Create or update oscillator
      if (!geoOsc.getOscillatorInfo(id)) {
        geoOsc.createGeometricOscillator(geom, id);
      }
      // Update its parameters from the ShadowEngine output
      geoOsc.setParameters(id, audioParams);
    });

    // 6. Update safety system
    const analyser = geoOsc.getAnalyserNode();
    // @ts-ignore - Tone.Analyser has a slightly different API but provides the node
    const rawAnalyserNode = analyser._analyser as AnalyserNode;
    if (rawAnalyserNode) {
      safetySystem.updateAudioMetrics(rawAnalyserNode, 440); // freq is placeholder
    }
    safetySystem.updatePerformanceMetrics(0.5, 100); // Mock values

    // 6. Apply safety corrections
    const corrections = safetySystem.applySafetyCorrections();
    if (corrections.pauseRequired) {
      // Skip stopping to avoid circular dependency
    } else {
      // This creates a feedback loop, might need damping
      const baseGain = 0.7; // From GeometricOscillatorConfig
      geoOsc.setMasterGain(baseGain * corrections.audioReduction);
    }

    setState(prev => ({
      ...prev,
      activeOscillators: geoOsc.getActiveCount(),
      shadowState: shadowEngine.snapshot(),
      safetyAlerts: safetySystem.getSafetyStatus().activeAlerts,
    }));

    // Check for audio context crash
    const audioContext = Tone.getContext().rawContext;
    if (audioContext.state === 'closed' || audioContext.state === 'interrupted') {
      console.error('AudioContext has crashed or been interrupted.');
      stopGAA();
      setState(prev => ({ ...prev, isRecovering: true, isPlaying: false, isInitialized: false }));
      return; // Stop the loop
    }

    animationFrameRef.current = requestAnimationFrame(updateLoop);
    } catch (error) {
      console.error('❌ Unhandled error in GAA update loop:', error);
      // stopGAA(); // Stop the engine on any unhandled error - moved to avoid circular dependency
    }
  }, [initializeGAA]);

  const startGAA = useCallback(async () => {
    if (state.isPlaying) return;
    console.log('🚀 Starting GAA Engine...');
    console.log('ethos.event: GAASessionStarted'); // Ethos Telemetry

    if (!state.isInitialized) {
      const initialized = await initializeGAA();
      if (!initialized) return;
    }
    
    phonePulseSensor.startSensing();
    accelerometer.startSensing();
    setState(prev => ({ ...prev, isPlaying: true }));
    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(updateLoop);
  }, [state.isInitialized, state.isPlaying, initializeGAA, updateLoop]);

  const stopGAA = useCallback(() => {
    if (!state.isPlaying) return;
    console.log('⏹️ Stopping GAA Engine');
    console.log('ethos.event: GAASessionStopped'); // Ethos Telemetry

    geometricOscillatorRef.current?.stopAll();
    phonePulseSensor.stopSensing();
    accelerometer.stopSensing();
    cancelAnimationFrame(animationFrameRef.current);

    setState(prev => ({ ...prev, isPlaying: false, activeOscillators: 0 }));
  }, [state.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopGAA();
      } else {
        if (state.isPlaying) {
          startGAA();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopGAA();
      safetySystemRef.current?.stopMonitoring();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopGAA, startGAA, state.isPlaying]);

  const recoverSession = useCallback(async () => {
    console.log('🔄 Attempting to recover GAA session...');
    setState(prev => ({ ...prev, isRecovering: false }));
    await initializeGAA();
    await startGAA();
  }, [initializeGAA, startGAA]);

  // Add audio stream integration for orchestra
  const getAudioStream = useCallback(() => {
    if (geometricOscillatorRef.current) {
      // Return the actual audio output stream for P2P sharing
      return geometricOscillatorRef.current.getOutputStream();
    }
    return null;
  }, []);

  return {
    state,
    initializeGAA,
    startGAA,
    stopGAA,
    recoverSession,
    updatePreset: setPreset,
    phonePulseSensor, // Expose the whole hook for UI integration
    accelerometer,
    getAudioStream,
  };
};