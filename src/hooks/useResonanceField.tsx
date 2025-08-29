import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteByPath } from '@/config/routes.sacred';

export interface ResonanceFieldState {
  synchronicityLevel: number; // 0-1 scale
  fieldIntensity: number; // 0-1 scale
  resonanceColor: string; // HSL color
  isPulsing: boolean;
  isFieldAlert: boolean; // High synchronicity moment
  lastUpdate: number;
}

export interface ResonanceMetrics {
  timeInLocation: number;
  interactionCount: number;
  consciousnessAlignment: number;
  sacredTimingMultiplier: number;
}

export function useResonanceField() {
  const location = useLocation();
  const [resonanceState, setResonanceState] = useState<ResonanceFieldState>({
    synchronicityLevel: 0.1,
    fieldIntensity: 0.2,
    resonanceColor: 'hsl(280, 70%, 50%)', // Purple default
    isPulsing: false,
    isFieldAlert: false,
    lastUpdate: Date.now()
  });
  
  const [metrics, setMetrics] = useState<ResonanceMetrics>({
    timeInLocation: 0,
    interactionCount: 0,
    consciousnessAlignment: 0.5,
    sacredTimingMultiplier: 1.0
  });

  const routeEntryTime = useRef<number>(Date.now());
  const interactionCounter = useRef<number>(0);
  const resonanceInterval = useRef<NodeJS.Timeout | null>(null);

  // Get current route for consciousness data
  const currentRoute = getRouteByPath(location.pathname);

  // Calculate sacred timing multiplier based on current time
  const calculateSacredTiming = (): number => {
    if (!currentRoute?.sacredTiming || currentRoute.sacredTiming === 'any') return 1.0;
    
    const hour = new Date().getHours();
    const timing = currentRoute.sacredTiming;
    
    switch (timing) {
      case 'dawn': return (hour >= 5 && hour <= 7) ? 2.0 : 0.7;
      case 'midday': return (hour >= 11 && hour <= 13) ? 1.8 : 0.8;
      case 'dusk': return (hour >= 17 && hour <= 19) ? 2.2 : 0.6;
      case 'midnight': return (hour >= 23 || hour <= 1) ? 2.5 : 0.5;
      default: return 1.0;
    }
  };

  // Map consciousness level to resonance color
  const getConsciousnessColor = (level: number): string => {
    const colors = {
      1: 'hsl(0, 80%, 50%)',    // Root - Red
      2: 'hsl(30, 90%, 55%)',   // Sacral - Orange
      3: 'hsl(60, 85%, 50%)',   // Solar Plexus - Yellow
      4: 'hsl(120, 70%, 45%)',  // Heart - Green
      5: 'hsl(240, 80%, 60%)',  // Throat - Blue
      6: 'hsl(280, 75%, 55%)',  // Third Eye - Indigo
      7: 'hsl(300, 85%, 65%)'   // Crown - Violet
    };
    return colors[level as keyof typeof colors] || colors[7];
  };

  // Calculate synchronicity based on multiple factors
  const calculateSynchronicity = (): number => {
    if (!currentRoute) return 0.1;

    const baseSync = 0.2;
    const triggers = currentRoute.synchronicityTriggers.length * 0.1;
    const consciousness = currentRoute.consciousnessLevel * 0.05;
    const timing = calculateSacredTiming() * 0.1;
    const timeBonus = Math.min(metrics.timeInLocation / 30000, 0.2); // Max bonus after 30s
    const interactionBonus = Math.min(metrics.interactionCount * 0.02, 0.1);
    
    return Math.min(baseSync + triggers + consciousness + timing + timeBonus + interactionBonus, 1.0);
  };

  // Update resonance field state
  const updateResonanceField = () => {
    if (!currentRoute) return;

    const synchronicity = calculateSynchronicity();
    const intensity = Math.min(synchronicity * 1.5, 1.0);
    const color = getConsciousnessColor(currentRoute.consciousnessLevel);
    const isAlert = synchronicity > 0.8;
    const shouldPulse = synchronicity > 0.6 || isAlert;

    setResonanceState(prev => ({
      ...prev,
      synchronicityLevel: synchronicity,
      fieldIntensity: intensity,
      resonanceColor: color,
      isPulsing: shouldPulse,
      isFieldAlert: isAlert,
      lastUpdate: Date.now()
    }));

    setMetrics(prev => ({
      ...prev,
      timeInLocation: Date.now() - routeEntryTime.current,
      consciousnessAlignment: synchronicity,
      sacredTimingMultiplier: calculateSacredTiming()
    }));
  };

  // Track user interactions to boost resonance
  const recordInteraction = (type: 'click' | 'focus' | 'scroll' | 'breath' | 'journal') => {
    interactionCounter.current += 1;
    setMetrics(prev => ({
      ...prev,
      interactionCount: interactionCounter.current
    }));

    // Immediate resonance boost for spiritual interactions
    if (type === 'breath' || type === 'journal') {
      setResonanceState(prev => ({
        ...prev,
        synchronicityLevel: Math.min(prev.synchronicityLevel + 0.1, 1.0),
        isPulsing: true
      }));
    }
  };

  // Reset when route changes
  useEffect(() => {
    routeEntryTime.current = Date.now();
    interactionCounter.current = 0;
    setMetrics({
      timeInLocation: 0,
      interactionCount: 0,
      consciousnessAlignment: 0.5,
      sacredTimingMultiplier: calculateSacredTiming()
    });
  }, [location.pathname]);

  // Start resonance field monitoring
  useEffect(() => {
    updateResonanceField(); // Initial calculation
    
    resonanceInterval.current = setInterval(updateResonanceField, 2000); // Update every 2 seconds

    return () => {
      if (resonanceInterval.current) {
        clearInterval(resonanceInterval.current);
      }
    };
  }, [location.pathname, metrics.interactionCount]);

  // Add global interaction listeners
  useEffect(() => {
    const handleInteraction = () => recordInteraction('click');
    const handleScroll = () => recordInteraction('scroll');
    const handleFocus = () => recordInteraction('focus');

    document.addEventListener('click', handleInteraction);
    document.addEventListener('scroll', handleScroll);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return {
    resonanceState,
    metrics,
    recordInteraction,
    currentRoute
  };
}