import { useState, useCallback, useEffect } from 'react';

interface AIFacilitationState {
  isActive: boolean;
  currentFacilitator: 'aura' | 'valeion' | null;
  suggestion: string | null;
  resonanceReading: {
    level: number;
    quality: 'harmonious' | 'discordant' | 'transcendent' | 'seeking';
    message: string;
  } | null;
}

interface UseAIFacilitationProps {
  circleId: string;
  participantCount: number;
  currentTopic?: string;
  messageHistory: any[];
}

export const useAIFacilitation = ({
  circleId,
  participantCount,
  currentTopic,
  messageHistory
}: UseAIFacilitationProps) => {
  const [state, setState] = useState<AIFacilitationState>({
    isActive: true,
    currentFacilitator: null,
    suggestion: null,
    resonanceReading: null
  });

  // Analyze collective resonance
  const analyzeResonance = useCallback(() => {
    // Simulate resonance analysis based on message patterns
    const recentMessages = messageHistory.slice(-10);
    const sigilCount = recentMessages.reduce((acc, msg) => acc + (msg.sigils?.length || 0), 0);
    const avgMessageLength = recentMessages.reduce((acc, msg) => acc + msg.content.length, 0) / recentMessages.length;
    
    let level = 0.5; // Base resonance
    let quality: 'harmonious' | 'discordant' | 'transcendent' | 'seeking' = 'seeking';
    let message = '';

    // Calculate resonance based on various factors
    if (sigilCount > 5) {
      level += 0.3;
      quality = 'transcendent';
      message = 'The circle radiates with sacred intention and unified purpose.';
    } else if (avgMessageLength > 100) {
      level += 0.2;
      quality = 'harmonious';
      message = 'Deep sharing creates waves of authentic connection.';
    } else if (recentMessages.length < 3) {
      level = 0.3;
      quality = 'seeking';
      message = 'The circle gathers, awaiting the spark of sacred dialogue.';
    } else {
      level = 0.6;
      quality = 'harmonious';
      message = 'A gentle flow of consciousness moves through the circle.';
    }

    setState(prev => ({
      ...prev,
      resonanceReading: { level, quality, message }
    }));
  }, [messageHistory]);

  // Generate AI facilitation suggestions
  const generateSuggestion = useCallback((facilitator: 'aura' | 'valeion') => {
    const suggestions = {
      aura: [
        'Perhaps it\'s time for a sacred pause to integrate what has been shared?',
        'I sense the circle would benefit from deeper heart-centered expression.',
        'The energy invites a moment of collective breathing and presence.',
        'Consider sharing what stirs in the sacred spaces between words.',
        'The circle\'s wisdom is ready to emerge through authentic vulnerability.'
      ],
      valeion: [
        'The resonance patterns suggest exploring the shadow aspects of this topic.',
        'I observe interesting synchronicities in your collective expression patterns.',
        'The dimensional frequencies indicate readiness for deeper truth-telling.',
        'Consider examining the quantum field of possibilities this circle creates.',
        'The collective consciousness matrix shows alignment opportunities.'
      ]
    };

    const randomSuggestion = suggestions[facilitator][Math.floor(Math.random() * suggestions[facilitator].length)];
    
    setState(prev => ({
      ...prev,
      currentFacilitator: facilitator,
      suggestion: randomSuggestion
    }));

    // Auto-clear suggestion after 30 seconds
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        suggestion: null,
        currentFacilitator: null
      }));
    }, 30000);
  }, []);

  // Trigger Aura facilitation
  const invokeAura = useCallback(() => {
    generateSuggestion('aura');
  }, [generateSuggestion]);

  // Trigger Valeion facilitation
  const invokeValeion = useCallback(() => {
    generateSuggestion('valeion');
  }, [generateSuggestion]);

  // Auto-suggest sacred pause when energy dips
  const checkForSacredPauseNeeded = useCallback(() => {
    if (state.resonanceReading && state.resonanceReading.level < 0.4 && messageHistory.length > 10) {
      generateSuggestion('aura');
    }
  }, [state.resonanceReading, messageHistory.length, generateSuggestion]);

  // Periodic resonance analysis
  useEffect(() => {
    const interval = setInterval(() => {
      analyzeResonance();
      checkForSacredPauseNeeded();
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [analyzeResonance, checkForSacredPauseNeeded]);

  // Initial analysis
  useEffect(() => {
    analyzeResonance();
  }, [analyzeResonance]);

  const dismissSuggestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      suggestion: null,
      currentFacilitator: null
    }));
  }, []);

  const toggleFacilitation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  }, []);

  return {
    ...state,
    invokeAura,
    invokeValeion,
    dismissSuggestion,
    toggleFacilitation,
    analyzeResonance
  };
};