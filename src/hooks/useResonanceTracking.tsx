import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ResonanceState {
  coherenceLevel: number;
  brainwaveState: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  heartRateVariability: number;
  breathingPattern: 'shallow' | 'deep' | 'rhythmic' | 'irregular';
  schumannResonance: number;
  collectiveField: number;
  sessionDuration: number;
}

interface ResonanceMetrics {
  avgCoherence: number;
  peakCoherence: number;
  timeInOptimalState: number;
  brainwaveTransitions: number;
  collectiveContribution: number;
}

export const useResonanceTracking = () => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentState, setCurrentState] = useState<ResonanceState>({
    coherenceLevel: 50,
    brainwaveState: 'beta',
    heartRateVariability: 30,
    breathingPattern: 'shallow',
    schumannResonance: 7.83,
    collectiveField: 65,
    sessionDuration: 0
  });
  
  const [sessionMetrics, setSessionMetrics] = useState<ResonanceMetrics>({
    avgCoherence: 0,
    peakCoherence: 0,
    timeInOptimalState: 0,
    brainwaveTransitions: 0,
    collectiveContribution: 0
  });

  // Simulate real-time resonance tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentState(prev => {
          const newCoherence = Math.max(20, Math.min(100, 
            prev.coherenceLevel + (Math.random() - 0.5) * 15
          ));
          
          const newHRV = Math.max(10, Math.min(80,
            prev.heartRateVariability + (Math.random() - 0.5) * 10
          ));
          
          // Determine brainwave state based on coherence and practice type
          let newBrainwave = prev.brainwaveState;
          if (newCoherence > 80) newBrainwave = 'gamma';
          else if (newCoherence > 65) newBrainwave = 'alpha';
          else if (newCoherence > 45) newBrainwave = 'theta';
          else if (newCoherence < 30) newBrainwave = 'beta';
          
          // Breathing pattern influences coherence
          let breathingPattern: ResonanceState['breathingPattern'] = 'irregular';
          if (newCoherence > 70) breathingPattern = 'rhythmic';
          else if (newCoherence > 50) breathingPattern = 'deep';
          else breathingPattern = 'shallow';
          
          return {
            ...prev,
            coherenceLevel: newCoherence,
            brainwaveState: newBrainwave,
            heartRateVariability: newHRV,
            breathingPattern,
            schumannResonance: 7.83 + (Math.random() - 0.5) * 0.4,
            collectiveField: Math.max(40, Math.min(100, 
              prev.collectiveField + (Math.random() - 0.5) * 8
            )),
            sessionDuration: prev.sessionDuration + 1
          };
        });
        
        // Update metrics
        setSessionMetrics(prev => ({
          ...prev,
          avgCoherence: (prev.avgCoherence + currentState.coherenceLevel) / 2,
          peakCoherence: Math.max(prev.peakCoherence, currentState.coherenceLevel),
          timeInOptimalState: currentState.coherenceLevel > 70 ? prev.timeInOptimalState + 1 : prev.timeInOptimalState,
          brainwaveTransitions: prev.brainwaveTransitions,
          collectiveContribution: Math.min(100, prev.collectiveContribution + 0.1)
        }));
        
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentState.coherenceLevel]);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    setCurrentState(prev => ({ ...prev, sessionDuration: 0 }));
    setSessionMetrics({
      avgCoherence: 0,
      peakCoherence: 0,
      timeInOptimalState: 0,
      brainwaveTransitions: 0,
      collectiveContribution: 0
    });
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    // Could save session data here
    if (user?.id) {
      const sessionData = {
        userId: user.id,
        metrics: sessionMetrics,
        finalState: currentState,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`resonance-session-${Date.now()}`, JSON.stringify(sessionData));
    }
  }, [user?.id, sessionMetrics, currentState]);

  const getOptimalState = useCallback(() => {
    return currentState.coherenceLevel > 70 && 
           (currentState.brainwaveState === 'alpha' || currentState.brainwaveState === 'gamma') &&
           currentState.breathingPattern === 'rhythmic';
  }, [currentState]);

  const getResonanceGuidance = useCallback(() => {
    if (currentState.coherenceLevel < 40) {
      return {
        suggestion: "Focus on slow, deep breathing to increase coherence",
        technique: "4-7-8 breath pattern",
        color: "from-red-500 to-orange-500"
      };
    }
    if (currentState.coherenceLevel < 70) {
      return {
        suggestion: "Maintain steady rhythm to enter flow state",
        technique: "Heart-focused breathing",
        color: "from-yellow-500 to-amber-500"
      };
    }
    return {
      suggestion: "You're in optimal coherence - sustain this state",
      technique: "Natural breath awareness",
      color: "from-green-500 to-emerald-500"
    };
  }, [currentState.coherenceLevel]);

  const getCollectiveImpact = useCallback(() => {
    const impact = Math.min(100, (currentState.coherenceLevel / 100) * sessionMetrics.collectiveContribution);
    return {
      personalContribution: impact,
      connectedSouls: Math.floor(impact * 5), // Simulated
      globalResonance: Math.min(8.5, 7.83 + (impact / 100) * 0.67)
    };
  }, [currentState.coherenceLevel, sessionMetrics.collectiveContribution]);

  return {
    currentState,
    sessionMetrics,
    isTracking,
    startTracking,
    stopTracking,
    getOptimalState,
    getResonanceGuidance,
    getCollectiveImpact
  };
};