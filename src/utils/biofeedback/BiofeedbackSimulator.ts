/**
 * Embodied Biofeedback Hook - Advanced bio-signal integration
 * Maps physiological signals to GAA parameters with safety watchdog
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { BiofeedbackMetrics, GAAEngineState, PolarityProtocol } from '@/types/gaa-polarity';

interface EmbodiedBiofeedbackState {
  heartRate: number;
  heartRateVariability: number;
  breathingRate: number;
  skinConductance: number;
  brainwaveAlpha: number;
  brainwaveBeta: number;
  brainwaveTheta: number;
  brainwaveDelta: number;
  muscleTension: number;
  bodyTemperature: number;
}

interface SafetyLimits {
  heartRateMin: number;
  heartRateMax: number;
  breathingRateMin: number;
  breathingRateMax: number;
  stressThreshold: number;
  maxSessionDuration: number;
}

interface BiofeedbackMapping {
  heartRateToFrequency: (hr: number) => number;
  hrvToPhase: (hrv: number) => number;
  breathingToAmplitude: (br: number) => number;
  brainwavesToGeometry: (alpha: number, beta: number, theta: number, delta: number) => any;
  skinConductanceToResonance: (sc: number) => number;
}

export const useEmbodiedBiofeedback = (
  initialSafetyLimits?: Partial<SafetyLimits>
) => {
  const [biofeedbackState, setBiofeedbackState] = useState<EmbodiedBiofeedbackState>({
    heartRate: 72,
    heartRateVariability: 50,
    breathingRate: 16,
    skinConductance: 0.5,
    brainwaveAlpha: 0.3,
    brainwaveBeta: 0.4,
    brainwaveTheta: 0.2,
    brainwaveDelta: 0.1,
    muscleTension: 0.3,
    bodyTemperature: 98.6
  });

  const [isConnected, setIsConnected] = useState(false);
  const [safetyAlerts, setSafetyAlerts] = useState<string[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationBaseline, setCalibrationBaseline] = useState<Partial<EmbodiedBiofeedbackState>>({});
  
  const sessionStartRef = useRef<number>(0);
  const safetyCheckRef = useRef<NodeJS.Timeout>();
  const simulationRef = useRef<NodeJS.Timeout>();

  const safetyLimits: SafetyLimits = {
    heartRateMin: 50,
    heartRateMax: 180,
    breathingRateMin: 8,
    breathingRateMax: 40,
    stressThreshold: 0.8,
    maxSessionDuration: 3600000, // 1 hour
    ...initialSafetyLimits
  };

  // Biofeedback to GAA parameter mapping
  const biofeedbackMapping: BiofeedbackMapping = {
    heartRateToFrequency: (hr: number) => {
      // Map heart rate (50-180 BPM) to frequency range (40-800 Hz)
      const normalized = (hr - 50) / 130;
      return 40 + normalized * 760;
    },
    
    hrvToPhase: (hrv: number) => {
      // Map HRV (0-100) to phase shift (0-2π)
      return (hrv / 100) * Math.PI * 2;
    },
    
    breathingToAmplitude: (br: number) => {
      // Map breathing rate to amplitude modulation
      const normalized = Math.max(0, Math.min(1, (br - 8) / 32));
      return 0.3 + normalized * 0.7;
    },
    
    brainwavesToGeometry: (alpha: number, beta: number, theta: number, delta: number) => {
      // Map brainwaves to geometric parameters
      return {
        R: 1 + alpha * 2, // Alpha influences outer radius
        r: 0.3 + beta * 0.7, // Beta influences inner radius  
        n: Math.round(3 + theta * 9), // Theta influences complexity
        phi0: delta * Math.PI * 2 // Delta influences phase
      };
    },
    
    skinConductanceToResonance: (sc: number) => {
      // Map skin conductance to resonance factor
      return Math.max(0.1, Math.min(2.0, sc * 2));
    }
  };

  // Safety watchdog
  const checkSafety = useCallback(() => {
    const alerts: string[] = [];
    const state = biofeedbackState;

    // Heart rate safety
    if (state.heartRate < safetyLimits.heartRateMin) {
      alerts.push('Heart rate too low - consider stopping session');
    } else if (state.heartRate > safetyLimits.heartRateMax) {
      alerts.push('Heart rate too high - session will pause');
    }

    // Breathing safety
    if (state.breathingRate < safetyLimits.breathingRateMin) {
      alerts.push('Breathing rate too slow - check consciousness');
    } else if (state.breathingRate > safetyLimits.breathingRateMax) {
      alerts.push('Breathing rate too fast - practice calming breath');
    }

    // Stress level calculation
    const stressLevel = (
      (state.heartRate > 100 ? 0.3 : 0) +
      (state.skinConductance > 1.0 ? 0.3 : 0) +
      (state.muscleTension > 0.7 ? 0.2 : 0) +
      (state.brainwaveBeta > 0.6 ? 0.2 : 0)
    );

    if (stressLevel > safetyLimits.stressThreshold) {
      alerts.push('High stress detected - consider gentler settings');
    }

    // Session duration
    const currentDuration = Date.now() - sessionStartRef.current;
    if (currentDuration > safetyLimits.maxSessionDuration) {
      alerts.push('Maximum session duration reached - please take a break');
    }

    setSafetyAlerts(alerts);
    setSessionDuration(currentDuration);
  }, [biofeedbackState, safetyLimits]);

  // Calibration process
  const startCalibration = useCallback(async () => {
    setIsCalibrating(true);
    
    // Collect baseline for 30 seconds
    setTimeout(() => {
      setCalibrationBaseline({ ...biofeedbackState });
      setIsCalibrating(false);
    }, 30000);
  }, [biofeedbackState]);

  // Generate GAA parameters from biofeedback
  const generateGAAParameters = useCallback(() => {
    const state = biofeedbackState;
    const mapping = biofeedbackMapping;

    return {
      frequency: mapping.heartRateToFrequency(state.heartRate),
      phase: mapping.hrvToPhase(state.heartRateVariability),
      amplitude: mapping.breathingToAmplitude(state.breathingRate),
      geometry: mapping.brainwavesToGeometry(
        state.brainwaveAlpha,
        state.brainwaveBeta, 
        state.brainwaveTheta,
        state.brainwaveDelta
      ),
      resonance: mapping.skinConductanceToResonance(state.skinConductance),
      timestamp: Date.now()
    };
  }, [biofeedbackState, biofeedbackMapping]);

  // Start biofeedback session
  const startSession = useCallback(() => {
    sessionStartRef.current = Date.now();
    setIsConnected(true);
    
    // Start safety monitoring
    safetyCheckRef.current = setInterval(checkSafety, 5000);
    
    // Simulate biofeedback data (replace with real sensor integration)
    simulationRef.current = setInterval(() => {
      setBiofeedbackState(prev => ({
        ...prev,
        heartRate: 60 + Math.sin(Date.now() / 10000) * 20 + Math.random() * 10,
        heartRateVariability: 30 + Math.sin(Date.now() / 15000) * 30 + Math.random() * 20,
        breathingRate: 12 + Math.sin(Date.now() / 8000) * 4 + Math.random() * 2,
        skinConductance: 0.3 + Math.sin(Date.now() / 12000) * 0.4 + Math.random() * 0.1,
        brainwaveAlpha: 0.2 + Math.sin(Date.now() / 7000) * 0.3 + Math.random() * 0.1,
        brainwaveBeta: 0.3 + Math.sin(Date.now() / 9000) * 0.3 + Math.random() * 0.1,
        brainwaveTheta: 0.1 + Math.sin(Date.now() / 11000) * 0.2 + Math.random() * 0.05,
        brainwaveDelta: 0.05 + Math.sin(Date.now() / 13000) * 0.1 + Math.random() * 0.02,
        muscleTension: 0.2 + Math.sin(Date.now() / 6000) * 0.3 + Math.random() * 0.1,
        bodyTemperature: 98.6 + Math.sin(Date.now() / 20000) * 1 + Math.random() * 0.2
      }));
    }, 1000);
  }, [checkSafety]);

  // Stop biofeedback session
  const stopSession = useCallback(() => {
    setIsConnected(false);
    if (safetyCheckRef.current) clearInterval(safetyCheckRef.current);
    if (simulationRef.current) clearInterval(simulationRef.current);
    setSafetyAlerts([]);
    setSessionDuration(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (safetyCheckRef.current) clearInterval(safetyCheckRef.current);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  return {
    biofeedbackState,
    isConnected,
    safetyAlerts,
    sessionDuration,
    isCalibrating,
    calibrationBaseline,
    startSession,
    stopSession,
    startCalibration,
    generateGAAParameters,
    safetyLimits,
    biofeedbackMapping
  };
};