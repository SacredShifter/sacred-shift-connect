import { useState, useEffect, useCallback } from 'react';

export interface BreathingPreset {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

export interface BreathingPhase {
  name: string;
  duration: number;
}

export type PhaseType = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const presets: Record<string, BreathingPreset> = {
  '4-7-8': { name: '4-7-8 Relaxing', inhale: 4000, hold1: 7000, exhale: 8000, hold2: 0 },
  'box': { name: 'Box Breathing', inhale: 4000, hold1: 4000, exhale: 4000, hold2: 4000 },
  'coherence': { name: 'Heart Coherence', inhale: 5000, hold1: 0, exhale: 5000, hold2: 0 },
  'energizing': { name: 'Energizing', inhale: 4000, hold1: 2000, exhale: 6000, hold2: 1000 }
};

export const useBreathingTool = (initialPreset: string = 'coherence') => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<PhaseType>('inhale');
  const [currentPreset, setCurrentPreset] = useState<BreathingPreset>(presets[initialPreset]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [targetCycles, setTargetCycles] = useState(10);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const phases: PhaseType[] = ['inhale', 'hold1', 'exhale', 'hold2'].filter(phase => 
    (currentPreset[phase as keyof BreathingPreset] as number) > 0
  ) as PhaseType[];

  const startBreathing = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setCurrentPhase('inhale');
      setTimeRemaining(currentPreset.inhale);
      setCycleCount(0);
    }
  }, [isActive, currentPreset]);

  const stopBreathing = useCallback(() => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeRemaining(0);
    setCycleCount(0);
  }, []);

  const setCurrentPresetByName = useCallback((presetName: string) => {
    if (presets[presetName]) {
      setCurrentPreset(presets[presetName]);
      if (isActive) {
        setCurrentPhase('inhale');
        setTimeRemaining(presets[presetName].inhale);
      }
    }
  }, [isActive]);

  const getPhaseDuration = useCallback((phase: PhaseType) => {
    return currentPreset[phase];
  }, [currentPreset]);

  const getPhaseLabel = useCallback((phase: PhaseType) => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Rest';
      default: return '';
    }
  }, []);

  const getPhaseMessage = useCallback((phase: PhaseType) => {
    switch (phase) {
      case 'inhale': return 'Expand your chest and belly slowly';
      case 'hold1': return 'Hold with gentle awareness';
      case 'exhale': return 'Release completely and let go';
      case 'hold2': return 'Rest in the natural pause';
      default: return '';
    }
  }, []);

  // Main breathing timer
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          // Move to next phase
          const currentIndex = phases.indexOf(currentPhase);
          const nextIndex = (currentIndex + 1) % phases.length;
          const nextPhase = phases[nextIndex];
          
          setCurrentPhase(nextPhase);
          
          // If we completed a full cycle (back to inhale)
          if (nextPhase === 'inhale') {
            setCycleCount(prev => {
              const newCount = prev + 1;
              if (newCount >= targetCycles) {
                setIsActive(false);
                return newCount;
              }
              return newCount;
            });
          }
          
          return currentPreset[nextPhase];
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining, currentPhase, phases, currentPreset, targetCycles]);

  return {
    isActive,
    currentPhase,
    currentPreset,
    timeRemaining,
    cycleCount,
    targetCycles,
    presets,
    soundEnabled,
    startBreathing,
    stopBreathing,
    setCurrentPreset: setCurrentPresetByName,
    setTargetCycles,
    setSoundEnabled,
    getPhaseLabel,
    getPhaseMessage,
    getPhaseDuration,
  };
};