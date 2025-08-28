import { useState, useEffect, useRef, useCallback } from 'react';
import { useBreathingTool } from '@/hooks/useBreathingTool';
import { useToast } from '@/hooks/use-toast';

export type UnifiedBreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
export type BreathPreset = 'basic' | 'liberation' | 'sovereignty';

export interface UnifiedBreathingState {
  // Core state
  isActive: boolean;
  currentPhase: UnifiedBreathPhase;
  cycleCount: number;
  timeRemaining: number;
  sessionDuration: number;
  
  // Settings
  currentPreset: BreathPreset;
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  soundEnabled: boolean;
  
  // Visual state
  orbScale: number;
  orbOpacity: number;
  phaseColor: string;
  
  // Actions
  startBreathing: (preset?: BreathPreset) => void;
  stopBreathing: () => void;
  pauseBreathing: () => void;
  resumeBreathing: () => void;
  setPreset: (preset: BreathPreset) => void;
  setTrustSpeed: (speed: 'gentle' | 'balanced' | 'bold') => void;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Helpers
  getPhaseLabel: () => string;
  getPhaseMessage: () => string;
  getPhaseDuration: () => number;
  getPresetConfig: () => { inhale: number; hold1: number; exhale: number; hold2: number };
}

const BREATH_PRESETS = {
  basic: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  liberation: { inhale: 6, hold1: 6, exhale: 8, hold2: 4 },
  sovereignty: { inhale: 5, hold1: 5, exhale: 8, hold2: 5 }
};

const TRUST_SPEED_MULTIPLIERS = {
  gentle: 1.5,
  balanced: 1.0,
  bold: 0.7
};

export function useUnifiedBreathing(): UnifiedBreathingState {
  const { toast } = useToast();
  
  // State management
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<UnifiedBreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentPreset, setCurrentPreset] = useState<BreathPreset>('basic');
  const [trustSpeed, setTrustSpeed] = useState<'gentle' | 'balanced' | 'bold'>('balanced');
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  // Refs for timers and audio
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentToneRef = useRef<{ oscillator: OscillatorNode; gainNode: GainNode } | null>(null);
  
  // Visual state calculations
  const orbScale = (() => {
    if (!isActive) return 1;
    switch (currentPhase) {
      case 'inhale': return 1.4;
      case 'hold1': return 1.4;
      case 'exhale': return 0.6;
      case 'hold2': return 0.6;
      default: return 1;
    }
  })();
  
  const orbOpacity = (() => {
    if (!isActive) return 0.6;
    switch (currentPhase) {
      case 'inhale': return 0.9;
      case 'hold1': return 0.9;
      case 'exhale': return 0.4;
      case 'hold2': return 0.4;
      default: return 0.6;
    }
  })();
  
  const phaseColor = (() => {
    switch (currentPhase) {
      case 'inhale': return 'emerald';
      case 'hold1': return 'blue';
      case 'exhale': return 'orange';
      case 'hold2': return 'gray';
      default: return 'emerald';
    }
  })();
  
  // Audio functions
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);
  
  const playBreathingTone = useCallback((phase: UnifiedBreathPhase) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = initializeAudio();
      
      // Stop any current tone
      if (currentToneRef.current) {
        currentToneRef.current.gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        currentToneRef.current.oscillator.stop(audioContext.currentTime + 0.1);
        currentToneRef.current = null;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set frequency based on phase
      let frequency: number;
      switch (phase) {
        case 'inhale': frequency = 220; break;
        case 'hold1': frequency = 294; break;
        case 'exhale': frequency = 174; break;
        case 'hold2': frequency = 196; break;
        default: frequency = 220;
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Gentle volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.3);
      
      const duration = getPhaseDuration() / 1000;
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration - 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      currentToneRef.current = { oscillator, gainNode };
      
    } catch (error) {
      console.log('Audio playback not available:', error);
    }
  }, [soundEnabled, initializeAudio]);
  
  const stopAudio = useCallback(() => {
    if (currentToneRef.current && audioContextRef.current) {
      try {
        currentToneRef.current.gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.1);
        currentToneRef.current.oscillator.stop(audioContextRef.current.currentTime + 0.1);
      } catch (error) {
        // Oscillator might already be stopped
      }
      currentToneRef.current = null;
    }
  }, []);
  
  // Helper functions
  const getPresetConfig = useCallback(() => BREATH_PRESETS[currentPreset], [currentPreset]);
  
  const getNextPhase = useCallback((phase: UnifiedBreathPhase): UnifiedBreathPhase => {
    const phases: UnifiedBreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const currentIndex = phases.indexOf(phase);
    return phases[(currentIndex + 1) % phases.length];
  }, []);
  
  const getPhaseDuration = useCallback((): number => {
    const config = getPresetConfig();
    const multiplier = TRUST_SPEED_MULTIPLIERS[trustSpeed];
    
    switch (currentPhase) {
      case 'inhale': return config.inhale * 1000 * multiplier;
      case 'hold1': return config.hold1 * 1000 * multiplier;
      case 'exhale': return config.exhale * 1000 * multiplier;
      case 'hold2': return config.hold2 * 1000 * multiplier;
      default: return 0;
    }
  }, [currentPhase, currentPreset, trustSpeed, getPresetConfig]);
  
  const getPhaseLabel = useCallback((): string => {
    switch (currentPhase) {
      case 'inhale': return 'Inhale (Life)';
      case 'hold1': return 'Hold (Integration)';
      case 'exhale': return 'Exhale (Death)';
      case 'hold2': return 'Rest (Return to Source)';
      default: return '';
    }
  }, [currentPhase]);
  
  const getPhaseMessage = useCallback((): string => {
    switch (currentPhase) {
      case 'inhale': return 'The chosen experience';
      case 'hold1': return 'Embracing what comes';
      case 'exhale': return 'The return to Source';
      case 'hold2': return 'Rest in the void';
      default: return '';
    }
  }, [currentPhase]);
  
  // Main breathing cycle logic
  const runBreathingCycle = useCallback(() => {
    const startPhase = (phase: UnifiedBreathPhase) => {
      setCurrentPhase(phase);
      const duration = BREATH_PRESETS[currentPreset][phase] * 1000 * TRUST_SPEED_MULTIPLIERS[trustSpeed];
      
      // Skip phases with 0 duration
      if (duration === 0) {
        const nextPhase = getNextPhase(phase);
        startPhase(nextPhase);
        return;
      }
      
      setTimeRemaining(duration);
      playBreathingTone(phase);
      
      // Countdown timer
      let remainingTime = duration;
      const countdownInterval = setInterval(() => {
        if (isPaused) {
          clearInterval(countdownInterval);
          return;
        }
        
        remainingTime -= 100;
        setTimeRemaining(remainingTime);
        
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          const nextPhase = getNextPhase(phase);
          
          // Increment cycle count when completing exhale
          if (phase === 'exhale' || (phase === 'hold2' && BREATH_PRESETS[currentPreset].hold2 > 0)) {
            setCycleCount(prev => prev + 1);
          }
          
          if (isActive && !isPaused) {
            startPhase(nextPhase);
          }
        }
      }, 100);
      
      timerRef.current = countdownInterval;
    };
    
    if (isActive && !isPaused) {
      startPhase('inhale');
    }
  }, [isActive, isPaused, currentPreset, trustSpeed, getNextPhase, playBreathingTone]);
  
  // Main actions
  const startBreathing = useCallback((preset?: BreathPreset) => {
    if (preset && preset !== currentPreset) {
      setCurrentPreset(preset);
    }
    
    setIsActive(true);
    setIsPaused(false);
    setCurrentPhase('inhale');
    setCycleCount(0);
    sessionStartRef.current = Date.now();
    setSessionDuration(0);
    
    toast({
      title: "Breathing Practice Started",
      description: `Beginning ${preset || currentPreset} breathing pattern`,
    });
  }, [currentPreset, toast]);
  
  const stopBreathing = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    stopAudio();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calculate session duration
    if (sessionStartRef.current) {
      const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);
      setSessionDuration(duration);
      
      if (cycleCount > 0) {
        toast({
          title: "Sovereignty practice complete",
          description: `${cycleCount} cycles of life-death rhythm embraced. Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
        });
      }
    }
  }, [cycleCount, stopAudio, toast]);
  
  const pauseBreathing = useCallback(() => {
    setIsPaused(true);
    stopAudio();
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Breathing Paused",
      description: "Take a moment to rest",
    });
  }, [stopAudio, toast]);
  
  const resumeBreathing = useCallback(() => {
    setIsPaused(false);
    
    toast({
      title: "Breathing Resumed",
      description: "Continue with the rhythm",
    });
  }, [toast]);
  
  // Effects
  useEffect(() => {
    if (isActive && !isPaused) {
      runBreathingCycle();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused, runBreathingCycle]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopAudio]);
  
  return {
    // Core state
    isActive,
    currentPhase,
    cycleCount,
    timeRemaining,
    sessionDuration,
    
    // Settings
    currentPreset,
    trustSpeed,
    soundEnabled,
    
    // Visual state
    orbScale,
    orbOpacity,
    phaseColor,
    
    // Actions
    startBreathing,
    stopBreathing,
    pauseBreathing,
    resumeBreathing,
    setPreset: setCurrentPreset,
    setTrustSpeed,
    setSoundEnabled,
    
    // Helpers
    getPhaseLabel,
    getPhaseMessage,
    getPhaseDuration,
    getPresetConfig,
  };
}