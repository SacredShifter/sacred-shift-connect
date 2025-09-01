import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteByPath } from '@/config/routes.sacred';

export interface ConsciousnessThreshold {
  level: number;
  stage: string;
  geometry: string;
  message: string;
  color: string;
}

export interface ConsciousnessTransition {
  from: ConsciousnessThreshold;
  to: ConsciousnessThreshold;
  timestamp: number;
  trigger: 'location_change' | 'time_progression' | 'interaction_threshold' | 'synchronicity_peak';
}

export function useConsciousnessState() {
  const location = useLocation();
  const [currentThreshold, setCurrentThreshold] = useState<ConsciousnessThreshold | null>(null);
  const [lastTransition, setLastTransition] = useState<ConsciousnessTransition | null>(null);
  const [transitionInProgress, setTransitionInProgress] = useState(false);
  
  const previousThreshold = useRef<ConsciousnessThreshold | null>(null);

  // Consciousness thresholds mapping
  const getThresholdData = (route: any): ConsciousnessThreshold => {
    const consciousnessMap: Record<number, Partial<ConsciousnessThreshold>> = {
      1: {
        geometry: 'square',
        message: 'Grounding in material reality',
        color: 'hsl(0, 80%, 50%)'
      },
      2: {
        geometry: 'hexagon', 
        message: 'Embracing creative flow',
        color: 'hsl(30, 90%, 55%)'
      },
      3: {
        geometry: 'triangle',
        message: 'Activating personal power',
        color: 'hsl(60, 85%, 50%)'
      },
      4: {
        geometry: 'circle',
        message: 'Opening heart wisdom',
        color: 'hsl(120, 70%, 45%)'
      },
      5: {
        geometry: 'pentagon',
        message: 'Expressing authentic truth',
        color: 'hsl(240, 80%, 60%)'
      },
      6: {
        geometry: 'star',
        message: 'Witnessing unified awareness',
        color: 'hsl(280, 75%, 55%)'
      },
      7: {
        geometry: 'lotus',
        message: 'Embodying divine consciousness',
        color: 'hsl(300, 85%, 65%)'
      }
    };

    const level = route?.consciousnessLevel || 1;
    const stageMap: Record<string, string> = {
      'entry': 'Threshold Guardian',
      'exploration': 'Seeker of Truth',
      'integration': 'Wisdom Keeper',
      'mastery': 'Sacred Teacher',
      'transcendence': 'Unity Consciousness'
    };

    return {
      level,
      stage: stageMap[route?.journeyStage] || 'Wanderer',
      geometry: consciousnessMap[level]?.geometry || 'circle',
      message: consciousnessMap[level]?.message || 'Consciousness awakening',
      color: consciousnessMap[level]?.color || 'hsl(280, 70%, 50%)'
    };
  };

  // Detect consciousness transitions
  const detectTransition = (newRoute: any) => {
    if (!newRoute) return;

    const newThreshold = getThresholdData(newRoute);
    const prevThreshold = previousThreshold.current;

    if (prevThreshold && 
        (prevThreshold.level !== newThreshold.level || 
         prevThreshold.stage !== newThreshold.stage)) {
      
      setTransitionInProgress(true);
      
      const transition: ConsciousnessTransition = {
        from: prevThreshold,
        to: newThreshold,
        timestamp: Date.now(),
        trigger: 'location_change'
      };

      setLastTransition(transition);
      
      // Animate transition over 2 seconds
      setTimeout(() => {
        setCurrentThreshold(newThreshold);
        setTransitionInProgress(false);
        previousThreshold.current = newThreshold;
      }, 2000);
    } else {
      setCurrentThreshold(newThreshold);
      previousThreshold.current = newThreshold;
    }
  };

  // Trigger consciousness evolution based on synchronicity peaks
  const triggerConsciousnessEvolution = (synchronicityLevel: number) => {
    if (!currentThreshold || synchronicityLevel < 0.9) return;

    const evolved = { ...currentThreshold };
    
    // Temporary consciousness elevation during high synchronicity
    if (evolved.level < 7) {
      evolved.level += 1;
      evolved.message = `Temporarily elevated: ${evolved.message}`;
      evolved.geometry = getThresholdData({ consciousnessLevel: evolved.level }).geometry;
      
      setTransitionInProgress(true);
      
      const transition: ConsciousnessTransition = {
        from: currentThreshold,
        to: evolved,
        timestamp: Date.now(),
        trigger: 'synchronicity_peak'
      };
      
      setLastTransition(transition);
      
      // Temporary evolution for 10 seconds
      setTimeout(() => {
        setCurrentThreshold(evolved);
        setTransitionInProgress(false);
        
        // Revert after synchronicity peak
        setTimeout(() => {
          setCurrentThreshold(currentThreshold);
        }, 10000);
      }, 1000);
    }
  };

  // Get geometric transformation CSS based on consciousness level
  const getGeometricTransform = (): string => {
    if (!currentThreshold) return '';
    
    const transforms: Record<string, string> = {
      'square': 'rotate(0deg) scale(1)',
      'hexagon': 'rotate(30deg) scale(1.1)',
      'triangle': 'rotate(60deg) scale(0.9) skew(5deg)',
      'circle': 'rotate(90deg) scale(1.2)',
      'pentagon': 'rotate(108deg) scale(1.15) perspective(100px) rotateX(10deg)',
      'star': 'rotate(144deg) scale(1.3) perspective(150px) rotateY(15deg)',
      'lotus': 'rotate(180deg) scale(1.4) perspective(200px) rotateX(20deg) rotateY(20deg)'
    };
    
    return transforms[currentThreshold.geometry] || transforms['circle'];
  };

  // Get consciousness-based border radius
  const getGeometricBorderRadius = (): string => {
    if (!currentThreshold) return '0.5rem';
    
    const radiusMap: Record<string, string> = {
      'square': '0.25rem',
      'hexagon': '1rem 0.25rem',
      'triangle': '0.5rem 0.5rem 0 0.5rem',
      'circle': '50%',
      'pentagon': '1.5rem 0.5rem 1.5rem 0.5rem 1rem',
      'star': '0 1rem 0.5rem 1rem 0',
      'lotus': '2rem 0.5rem 2rem 0.5rem'
    };
    
    return radiusMap[currentThreshold.geometry] || '0.5rem';
  };

  // Monitor route changes for consciousness detection
  useEffect(() => {
    const currentRoute = getRouteByPath(location.pathname);
    detectTransition(currentRoute);
  }, [location.pathname]);

  return {
    currentThreshold,
    lastTransition,
    transitionInProgress,
    triggerConsciousnessEvolution,
    getGeometricTransform,
    getGeometricBorderRadius
  };
}