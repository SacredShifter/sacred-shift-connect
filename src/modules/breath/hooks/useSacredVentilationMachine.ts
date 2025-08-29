import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export type VentilationState = 
  | 'idle' 
  | 'active_breathing' 
  | 'rest_recover' 
  | 'completed' 
  | 'journal_prompted';

export type VentilationCadence = 'moderate' | 'intense';

export interface VentilationContext {
  roundsPlanned: number;
  currentRound: number;
  cyclesInRound: number;
  cadence: VentilationCadence;
  intensity: number; // 0-100
  musicEnabled: boolean;
  safetyAcknowledged: boolean;
  startedAt?: string;
  endedAt?: string;
}

export type VentilationEvent = 
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'END' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_CADENCE'; cadence: VentilationCadence }
  | { type: 'SET_INTENSITY'; intensity: number }
  | { type: 'SET_ROUNDS'; rounds: number }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'ACK_SAFETY' }
  | { type: 'CYCLE_COMPLETE' }
  | { type: 'RETURN_TO_BASELINE' };

const initialContext: VentilationContext = {
  roundsPlanned: 2,
  currentRound: 0,
  cyclesInRound: 0,
  cadence: 'moderate',
  intensity: 60,
  musicEnabled: true,
  safetyAcknowledged: false,
};

// Cadence timing in milliseconds
const CADENCE_TIMINGS = {
  moderate: { inhale: 1750, exhale: 1750 }, // ~17 breaths/min
  intense: { inhale: 1250, exhale: 1250 },  // ~24 breaths/min
};

export function useSacredVentilationMachine() {
  const [state, setState] = useState<VentilationState>('idle');
  const [context, setContext] = useState<VentilationContext>(initialContext);
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'exhale'>('inhale');
  
  const breathIntervalRef = useRef<NodeJS.Timeout>();
  const phaseTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate breath timing based on cadence and intensity
  const getBreathTiming = useCallback(() => {
    const base = CADENCE_TIMINGS[context.cadence];
    const intensityFactor = 1 - (context.intensity / 200); // Higher intensity = faster
    return {
      inhale: Math.max(800, base.inhale * intensityFactor),
      exhale: Math.max(800, base.exhale * intensityFactor),
    };
  }, [context.cadence, context.intensity]);

  // Start breath cycle automation
  const startBreathCycle = useCallback(() => {
    if (state !== 'active_breathing') return;
    
    const timing = getBreathTiming();
    let currentCycles = context.cyclesInRound;
    
    const nextPhase = () => {
      if (state !== 'active_breathing') return;
      
      setCurrentPhase(prev => {
        const newPhase = prev === 'inhale' ? 'exhale' : 'inhale';
        
        if (newPhase === 'inhale') {
          currentCycles++;
          setContext(prev => ({ ...prev, cyclesInRound: currentCycles }));
          
          // Emit cycle complete event for audio cues
          window.dispatchEvent(new CustomEvent('breath:cycle', { 
            detail: { cycles: currentCycles, phase: newPhase } 
          }));
        }
        
        window.dispatchEvent(new CustomEvent('breath:phase', { 
          detail: { phase: newPhase, intensity: context.intensity } 
        }));
        
        return newPhase;
      });
      
      const nextTiming = currentPhase === 'inhale' ? timing.exhale : timing.inhale;
      phaseTimeoutRef.current = setTimeout(nextPhase, nextTiming);
    };
    
    // Start first phase
    nextPhase();
    setIsBreathing(true);
  }, [state, context.cadence, context.intensity, context.cyclesInRound, currentPhase]);

  // Stop breath cycle
  const stopBreathCycle = useCallback(() => {
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = undefined;
    }
    setIsBreathing(false);
  }, []);

  // Event handler
  const send = useCallback((event: VentilationEvent) => {
    setContext(prev => {
      const newContext = { ...prev };
      
      switch (event.type) {
        case 'START':
          if (!prev.safetyAcknowledged) {
            toast.error('Please acknowledge the safety notice first');
            return prev;
          }
          setState('active_breathing');
          newContext.currentRound = 1;
          newContext.cyclesInRound = 0;
          newContext.startedAt = new Date().toISOString();
          setTimeout(startBreathCycle, 100);
          break;
          
        case 'PAUSE':
          setState('idle');
          stopBreathCycle();
          break;
          
        case 'RESUME':
          setState('active_breathing');
          setTimeout(startBreathCycle, 100);
          break;
          
        case 'END':
          setState('completed');
          stopBreathCycle();
          newContext.endedAt = new Date().toISOString();
          break;
          
        case 'NEXT_ROUND':
          if (prev.currentRound < prev.roundsPlanned) {
            setState('rest_recover');
            stopBreathCycle();
            newContext.currentRound = prev.currentRound + 1;
            newContext.cyclesInRound = 0;
            
            // Auto-advance after 60 seconds
            setTimeout(() => {
              setState('active_breathing');
              setTimeout(startBreathCycle, 100);
            }, 60000);
          } else {
            setState('completed');
            stopBreathCycle();
            newContext.endedAt = new Date().toISOString();
          }
          break;
          
        case 'RETURN_TO_BASELINE':
          setState('rest_recover');
          stopBreathCycle();
          // Emit baseline breathing event
          window.dispatchEvent(new CustomEvent('breath:baseline', { 
            detail: { duration: 60000 } 
          }));
          break;
          
        case 'SET_CADENCE':
          newContext.cadence = event.cadence;
          break;
          
        case 'SET_INTENSITY':
          newContext.intensity = Math.max(0, Math.min(100, event.intensity));
          break;
          
        case 'SET_ROUNDS':
          newContext.roundsPlanned = Math.max(1, Math.min(4, event.rounds));
          break;
          
        case 'TOGGLE_MUSIC':
          newContext.musicEnabled = !prev.musicEnabled;
          break;
          
        case 'ACK_SAFETY':
          newContext.safetyAcknowledged = true;
          break;
      }
      
      return newContext;
    });
  }, [startBreathCycle, stopBreathCycle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBreathCycle();
    };
  }, [stopBreathCycle]);

  // Calculate session progress
  const progress = context.roundsPlanned > 0 
    ? (context.currentRound - 1) / context.roundsPlanned 
    : 0;

  const totalCycles = context.cyclesInRound + (context.currentRound - 1) * 20; // Estimate 20 cycles per round

  return {
    state,
    context,
    send,
    isBreathing,
    currentPhase,
    progress,
    totalCycles,
    canStart: context.safetyAcknowledged && state === 'idle',
    canPause: state === 'active_breathing',
    canResume: state === 'idle' && context.currentRound > 0,
    canNextRound: state === 'active_breathing' && context.cyclesInRound >= 15, // Min cycles per round
    isCompleted: state === 'completed',
    isResting: state === 'rest_recover',
  };
}