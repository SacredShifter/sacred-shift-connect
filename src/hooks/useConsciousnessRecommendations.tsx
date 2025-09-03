import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ConsciousnessState, 
  ConsciousnessRecommendation, 
  BiofeedbackData, 
  ConsciousnessMetrics,
  ConsciousnessEvolution,
  SacredPattern,
  Vector3D
} from '@/types/consciousness';

interface UserResonanceProfile {
  preferred_frequencies: string[];
  consciousness_evolution: 'ascending' | 'stable' | 'descending';
  archetype_balance: string;
  learning_pattern: 'visual' | 'auditory' | 'kinesthetic' | 'intuitive';
  meditation_experience: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

export const useConsciousnessRecommendations = () => {
  const [userState, setUserState] = useState<ConsciousnessState>({
    brainwave_state: 'beta',
    emotional_state: 'focused',
    spiritual_awakening_level: 3,
    preferred_content_archetypes: ['healing', 'wisdom', 'transformation'],
    current_energy_frequency: '528Hz',
    time_of_day: new Date().getHours(),
    lunar_phase: 'waxing'
  });

  const [userProfile, setUserProfile] = useState<UserResonanceProfile>({
    preferred_frequencies: ['432Hz', '528Hz'],
    consciousness_evolution: 'ascending',
    archetype_balance: 'healer-dominant',
    learning_pattern: 'intuitive',
    meditation_experience: 'intermediate'
  });

  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Detect brainwave state (placeholder for real implementation)
  const detectBrainwaveState = useCallback(async (): Promise<{ dominant_frequency: string }> => {
    // This would integrate with actual brainwave detection hardware
    // For now, simulate based on user activity patterns
    
    const hour = new Date().getHours();
    let frequency = 'beta';
    
    if (hour < 6 || hour > 22) frequency = 'theta'; // Night time
    else if (hour < 9) frequency = 'alpha'; // Morning meditation
    else if (hour > 18) frequency = 'alpha'; // Evening wind-down
    
    return { dominant_frequency: frequency };
  }, []);

  // Analyze emotional resonance (placeholder for real implementation)
  const analyzeEmotionalResonance = useCallback(async (): Promise<{ primary_emotion: string }> => {
    // This would integrate with heart rate variability, facial recognition, etc.
    // For now, use time-based patterns
    
    const hour = new Date().getHours();
    let emotion = 'focused';
    
    if (hour < 6) emotion = 'contemplative';
    else if (hour < 9) emotion = 'excited';
    else if (hour > 18) emotion = 'calm';
    
    return { primary_emotion: emotion };
  }, []);

  // Get lunar phase
  const getLunarPhase = useCallback((): string => {
    // Simplified lunar phase calculation
    const now = new Date();
    const start = new Date(2000, 0, 6); // Known new moon
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const phase = days % 29.53;
    
    if (phase < 7.38) return 'new';
    if (phase < 14.77) return 'waxing';
    if (phase < 22.15) return 'full';
    return 'waning';
  }, []);

  // Get consciousness-based content recommendations
  const getRecommendations = useCallback(async (): Promise<ContentRecommendation[]> => {
    setIsLoading(true);
    
    try {
      // Update user state with real-time data
      const brainwaveData = await detectBrainwaveState();
      const emotionalState = await analyzeEmotionalResonance();
      const lunarPhase = getLunarPhase();
      
      const updatedState: ConsciousnessState = {
        ...userState,
        brainwave_state: brainwaveData.dominant_frequency as any,
        emotional_state: emotionalState.primary_emotion as any,
        time_of_day: new Date().getHours(),
        lunar_phase: lunarPhase as any
      };
      
      setUserState(updatedState);

      // Call consciousness recommendations edge function
      const { data, error } = await supabase.functions.invoke('consciousness-recommendations', {
        body: {
          brainwave_state: brainwaveData.dominant_frequency,
          emotional_state: emotionalState.primary_emotion,
          user_archetype: userProfile.preferred_content_archetypes,
          time_of_day: updatedState.time_of_day,
          lunar_phase: lunarPhase,
          spiritual_level: userProfile.meditation_experience,
          learning_pattern: userProfile.learning_pattern
        }
      });

      if (error) {
        console.warn('Consciousness recommendations failed, using fallback:', error);
        return await getFallbackRecommendations(updatedState);
      }

      const recommendations = data || [];
      setRecommendations(recommendations);
      setLastUpdated(new Date());
      
      return recommendations;
    } catch (error) {
      console.error('Failed to get consciousness recommendations:', error);
      return await getFallbackRecommendations(userState);
    } finally {
      setIsLoading(false);
    }
  }, [userState, userProfile]);

  // Fallback recommendations using local content
  const getFallbackRecommendations = useCallback(async (state: ConsciousnessState): Promise<ContentRecommendation[]> => {
    try {
      const { data: contentItems } = await supabase
        .from('content_items')
        .select('*')
        .limit(20);

      if (!contentItems) return [];

      // Score content based on consciousness state alignment
      const scoredRecommendations = contentItems.map(item => {
        const score = calculateConsciousnessAlignment(item, state, userProfile);
        return {
          ...item,
          resonance_score: score,
          why_recommended: generateRecommendationReason(item, state, score),
          consciousness_alignment: getConsciousnessAlignment(score)
        };
      }).sort((a, b) => b.resonance_score - a.resonance_score);

      setRecommendations(scoredRecommendations);
      return scoredRecommendations;
    } catch (error) {
      console.error('Fallback recommendations failed:', error);
      return [];
    }
  }, [userProfile]);

  // Calculate consciousness alignment score
  const calculateConsciousnessAlignment = useCallback((
    content: any, 
    state: ConsciousnessState, 
    profile: UserResonanceProfile
  ): number => {
    let score = 0;
    
    // Brainwave state alignment
    const brainwaveAlignment = {
      delta: { meditation: 30, sleep: 25, deep_healing: 20 },
      theta: { meditation: 25, creativity: 30, healing: 25 },
      alpha: { learning: 30, relaxation: 25, creativity: 20 },
      beta: { focus: 30, productivity: 25, learning: 20 },
      gamma: { insight: 30, transcendence: 25, awakening: 20 }
    };
    
    if (content.content_type && brainwaveAlignment[state.brainwave_state]) {
      const typeScore = brainwaveAlignment[state.brainwave_state][content.content_type] || 0;
      score += typeScore;
    }
    
    // Emotional state resonance
    if (content.emotional_tone === state.emotional_state) score += 20;
    
    // Archetype matching
    if (profile.preferred_content_archetypes.includes(content.archetype)) score += 25;
    
    // Time of day alignment
    const timeAlignment = {
      morning: ['meditation', 'motivation', 'learning'],
      afternoon: ['focus', 'productivity', 'creativity'],
      evening: ['relaxation', 'healing', 'reflection'],
      night: ['meditation', 'dreams', 'transcendence']
    };
    
    const timeOfDay = state.time_of_day < 12 ? 'morning' : 
                     state.time_of_day < 17 ? 'afternoon' : 
                     state.time_of_day < 21 ? 'evening' : 'night';
    
    if (timeAlignment[timeOfDay]?.includes(content.content_type)) score += 15;
    
    // Lunar phase resonance
    const lunarResonance = {
      new: ['beginnings', 'intention', 'planning'],
      waxing: ['growth', 'action', 'manifestation'],
      full: ['illumination', 'completion', 'celebration'],
      waning: ['release', 'reflection', 'integration']
    };
    
    if (lunarResonance[state.lunar_phase]?.includes(content.content_theme)) score += 10;
    
    return Math.min(score, 100);
  }, []);

  // Generate recommendation reason
  const generateRecommendationReason = useCallback((
    content: any, 
    state: ConsciousnessState, 
    score: number
  ): string => {
    if (score > 80) return `Perfect alignment with your current ${state.brainwave_state} brainwave state`;
    if (score > 60) return `Strong resonance with your ${state.emotional_state} emotional state`;
    if (score > 40) return `Good match for your ${state.lunar_phase} lunar phase`;
    return 'General recommendation based on your profile';
  }, []);

  // Get consciousness alignment description
  const getConsciousnessAlignment = useCallback((score: number): string => {
    if (score > 80) return 'Perfect Resonance';
    if (score > 60) return 'Strong Alignment';
    if (score > 40) return 'Good Match';
    if (score > 20) return 'Moderate Connection';
    return 'Basic Alignment';
  }, []);

  // Update user profile
  const updateUserProfile = useCallback((updates: Partial<UserResonanceProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);

  // Auto-refresh recommendations every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      getRecommendations();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [getRecommendations]);

  // Initial recommendations
  useEffect(() => {
    getRecommendations();
  }, []);

  return {
    recommendations,
    userState,
    userProfile,
    isLoading,
    lastUpdated,
    getRecommendations,
    updateUserProfile,
    refreshRecommendations: getRecommendations
  };
};
