import { useState, useEffect, useCallback } from 'react';
import { useSynchronicityMirror } from './useSynchronicityMirror';

interface SynchronicityAlert {
  id: string;
  type: 'resonance_spike' | 'mirror_activation' | 'collective_sync' | 'truth_emergence';
  intensity: number; // 0-1
  message: string;
  target: string; // which dashboard element should glow
  duration: number; // milliseconds
  triggered_at: string;
}

export const useSynchronicityAlerts = () => {
  const [activeAlerts, setActiveAlerts] = useState<SynchronicityAlert[]>([]);
  const [glowingElements, setGlowingElements] = useState<Set<string>>(new Set());
  const { currentReading } = useSynchronicityMirror();

  // Mock alert generation based on Mirror activity
  const generateAlert = useCallback((type: SynchronicityAlert['type'], target: string, intensity: number = 0.8) => {
    const alertMessages = {
      resonance_spike: [
        "Synchronicity field intensifying...",
        "Truth patterns aligning rapidly",
        "Consciousness frequencies peaking"
      ],
      mirror_activation: [
        "Mirror portal opening...",
        "Sacred reflections emerging",
        "Inner wisdom surfacing"
      ],
      collective_sync: [
        "Community resonance field active",
        "Collective awakening detected",
        "Unity consciousness expanding"
      ],
      truth_emergence: [
        "Profound truth ready to seal",
        "Wisdom breakthrough imminent",
        "Sacred insight crystallizing"
      ]
    };

    const alert: SynchronicityAlert = {
      id: `alert_${Date.now()}_${Math.random()}`,
      type,
      intensity,
      message: alertMessages[type][Math.floor(Math.random() * alertMessages[type].length)],
      target,
      duration: 5000 + (intensity * 3000), // 5-8 seconds based on intensity
      triggered_at: new Date().toISOString()
    };

    setActiveAlerts(prev => [...prev, alert]);
    setGlowingElements(prev => new Set([...prev, target]));

    // Remove alert after duration
    setTimeout(() => {
      setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
      setGlowingElements(prev => {
        const newSet = new Set(prev);
        newSet.delete(target);
        return newSet;
      });
    }, alert.duration);

    return alert;
  }, []);

  // Trigger alerts based on Mirror activity
  useEffect(() => {
    if (currentReading) {
      const resonance = currentReading.resonance_score;
      
      // High resonance triggers alerts
      if (resonance > 0.85) {
        setTimeout(() => {
          generateAlert('resonance_spike', 'mirror-insights', resonance);
        }, 1000);
      }

      // New readings trigger mirror activation alerts
      const readingAge = Date.now() - new Date(currentReading.created_at).getTime();
      if (readingAge < 30000) { // Within 30 seconds
        setTimeout(() => {
          generateAlert('mirror_activation', 'truth-spark', 0.7);
        }, 2000);
      }
    }
  }, [currentReading, generateAlert]);

  // Periodic collective sync alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every interval
        generateAlert('collective_sync', 'community-pulse', 0.6);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [generateAlert]);

  // Random truth emergence alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance
        generateAlert('truth_emergence', 'sacred-achievements', 0.9);
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [generateAlert]);

  const isElementGlowing = useCallback((elementId: string) => {
    return glowingElements.has(elementId);
  }, [glowingElements]);

  const getGlowIntensity = useCallback((elementId: string) => {
    const alert = activeAlerts.find(a => a.target === elementId);
    return alert ? alert.intensity : 0;
  }, [activeAlerts]);

  const triggerManualAlert = useCallback((type: SynchronicityAlert['type'], target: string, intensity?: number) => {
    return generateAlert(type, target, intensity);
  }, [generateAlert]);

  return {
    activeAlerts,
    glowingElements: Array.from(glowingElements),
    isElementGlowing,
    getGlowIntensity,
    triggerManualAlert
  };
};