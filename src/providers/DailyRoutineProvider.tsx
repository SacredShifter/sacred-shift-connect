import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type DailyMode = 'guided' | 'free';
export type TimeOfDay = 'morning' | 'evening' | 'anytime';

export interface DailyStep {
  id: string;
  title: string;
  description: string;
  why: string;
  practice: string;
  timeOfDay: TimeOfDay;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: Date;
}

export interface DailyFlow {
  id: string;
  name: string;
  description: string;
  steps: DailyStep[];
  currentStepIndex: number;
}

export interface DailyRoutineState {
  mode: DailyMode;
  currentFlow: DailyFlow | null;
  todaysStep: DailyStep | null;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  morningPrompt: string | null;
  eveningReflection: string | null;
  badges: string[];
}

interface DailyRoutineContextType {
  state: DailyRoutineState;
  setMode: (mode: DailyMode) => void;
  completeStep: (stepId: string, reflection?: string) => void;
  getTodaysStep: () => DailyStep | null;
  getProgressToNextBadge: () => { current: number; needed: number; badgeName: string } | null;
  setMorningPrompt: (prompt: string) => void;
  setEveningReflection: (reflection: string) => void;
  resetDaily: () => void;
}

const DailyRoutineContext = createContext<DailyRoutineContextType | undefined>(undefined);

// Sacred Flow Data - The knowledge + why's we built yesterday
const SACRED_FLOW: DailyFlow = {
  id: 'sacred-awakening-flow',
  name: 'Sacred Awakening Flow',
  description: 'A 21-day journey to consciousness evolution and truth alignment',
  currentStepIndex: 0,
  steps: [
    {
      id: 'nervous-system-clearing',
      title: 'Nervous System Clearing',
      description: 'Begin with breath and presence to clear energetic debris',
      why: 'Your nervous system is the hardware through which consciousness flows. When it\'s clogged with stress, trauma, and overstimulation, you can\'t access your deeper knowing. This practice creates the clear channel needed for authentic awakening.',
      practice: 'Start with 5 minutes of conscious breathing. Focus on lengthening your exhale to activate your parasympathetic nervous system. Notice any tension and breathe into those areas.',
      timeOfDay: 'morning',
      estimatedMinutes: 10,
      completed: false
    },
    {
      id: 'truth-orientation',
      title: 'Truth Orientation',
      description: 'Set your compass toward what is real and authentic',
      why: 'Most people live in layers of conditioning, stories, and borrowed beliefs. Truth orientation means aligning with what is actually real in your direct experience, not what you\'ve been told is real. This becomes your North Star.',
      practice: 'Ask yourself: "What is most true for me right now?" Sit with this question without rushing to answer. Let truth emerge naturally from your body and heart.',
      timeOfDay: 'morning',
      estimatedMinutes: 15,
      completed: false
    },
    {
      id: 'sovereignty-anchoring',
      title: 'Sovereignty Anchoring',
      description: 'Reclaim your power and inner authority',
      why: 'True awakening requires sovereignty - the ability to trust your own inner guidance over external authorities. This isn\'t rebellion; it\'s maturity. You cannot awaken while constantly outsourcing your power to others.',
      practice: 'Place your hand on your heart and declare: "I am the author of my own experience." Feel the truth of this in your body. Notice any resistance and breathe through it.',
      timeOfDay: 'anytime',
      estimatedMinutes: 10,
      completed: false
    },
    {
      id: 'energy-literacy',
      title: 'Energy Literacy',
      description: 'Learn to read the subtle energetic information around you',
      why: 'Everything is energy and information. When you can read energy directly, you bypass mental confusion and access direct knowing. This is your natural birthright as a conscious being.',
      practice: 'Spend 10 minutes simply feeling the energy of your environment. Notice what feels expansive vs. contracting. Trust these subtle sensations over mental analysis.',
      timeOfDay: 'anytime',
      estimatedMinutes: 15,
      completed: false
    },
    {
      id: 'integration-practices',
      title: 'Integration Practices',
      description: 'Embody insights through conscious action',
      why: 'Awakening without integration is just spiritual bypassing. Real transformation happens when insights become lived reality through conscious practice and embodiment.',
      practice: 'Choose one insight from today and commit to one specific action that embodies it. Take that action mindfully and notice the effects.',
      timeOfDay: 'evening',
      estimatedMinutes: 20,
      completed: false
    }
  ]
};

export const DailyRoutineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Fetch user profile for personalization
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, bio')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // Generate synthetic personalization based on existing data
      return {
        consciousness_level: 'intermediate', // Default level
        aura_signature: 'balanced', // Default aura
        streak_days: 0 // Will be updated from actual tracking
      };
    },
    enabled: !!user
  });

  // Generate personalized flow based on user profile
  const getPersonalizedFlow = (): DailyFlow => {
    const baseFlow = { ...SACRED_FLOW };
    
    if (!userProfile) return baseFlow;

    // Stagger practices based on consciousness level
    const level = userProfile.consciousness_level || 'beginner';
    const aura = userProfile.aura_signature || 'neutral';
    
    // Adjust practices based on user level and aura
    const personalizedSteps = baseFlow.steps.map((step, index) => {
      let estimatedMinutes = step.estimatedMinutes;
      let description = step.description;
      
      // Advanced users get longer, more intense practices
      if (level === 'advanced') {
        estimatedMinutes = Math.round(estimatedMinutes * 1.5);
        description += ' (Advanced variation: deepen your awareness and extend the practice)';
      } else if (level === 'beginner') {
        estimatedMinutes = Math.max(5, Math.round(estimatedMinutes * 0.7));
        description += ' (Gentle approach: start small and build gradually)';
      }
      
      // Aura-based customization
      if (aura === 'fiery' && step.id === 'nervous-system-clearing') {
        description += ' Focus on cooling breath techniques to balance your natural intensity.';
      } else if (aura === 'grounded' && step.id === 'energy-literacy') {
        description += ' Trust your earthy intuition and physical sensations as guides.';
      } else if (aura === 'ethereal' && step.id === 'sovereignty-anchoring') {
        description += ' Ground this practice through physical movement or touch.';
      }
      
      return {
        ...step,
        estimatedMinutes,
        description
      };
    });

    return {
      ...baseFlow,
      steps: personalizedSteps
    };
  };

  const [state, setState] = useState<DailyRoutineState>({
    mode: 'guided',
    currentFlow: getPersonalizedFlow(),
    todaysStep: null,
    streak: 0, // Will be calculated from actual meditation/breath sessions
    longestStreak: 0,
    completedToday: false,
    morningPrompt: null,
    eveningReflection: null,
    badges: []
  });

  // Update flow when profile loads
  useEffect(() => {
    if (userProfile) {
      setState(prev => ({
        ...prev,
        currentFlow: getPersonalizedFlow(),
        streak: 0 // Static for now, could be enhanced with real streak calculation
      }));
    }
  }, [userProfile]);

  // Load state from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`daily-routine-${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState(prev => ({
            ...prev,
            ...parsed,
            currentFlow: getPersonalizedFlow() // Always use personalized flow
          }));
        } catch (error) {
          console.warn('Failed to parse daily routine state:', error);
        }
      }
    }
  }, [user?.id, userProfile]);

  // Save state to localStorage
  const saveState = (newState: DailyRoutineState) => {
    if (user?.id) {
      const toSave = {
        ...newState,
        currentFlow: null // Don't save flow data, always use fresh
      };
      localStorage.setItem(`daily-routine-${user.id}`, JSON.stringify(toSave));
    }
    setState(newState);
  };

  // Get today's step based on mode and progress (staggered approach)
  const getTodaysStep = (): DailyStep | null => {
    if (!state.currentFlow) return null;
    
    // Staggered approach: only show one practice at a time based on time of day
    const now = new Date();
    const hour = now.getHours();
    
    // Morning practices (6 AM - 12 PM)
    if (hour >= 6 && hour < 12) {
      const morningStep = state.currentFlow.steps.find(step => 
        step.timeOfDay === 'morning' && !step.completed
      );
      if (morningStep) return morningStep;
    }
    
    // Afternoon/anytime practices (12 PM - 6 PM) 
    if (hour >= 12 && hour < 18) {
      const anytimeStep = state.currentFlow.steps.find(step => 
        step.timeOfDay === 'anytime' && !step.completed
      );
      if (anytimeStep) return anytimeStep;
    }
    
    // Evening practices (6 PM - 11 PM)
    if (hour >= 18 && hour < 23) {
      const eveningStep = state.currentFlow.steps.find(step => 
        step.timeOfDay === 'evening' && !step.completed
      );
      if (eveningStep) return eveningStep;
    }
    
    // Fallback: guided mode shows current step, free mode shows next incomplete
    if (state.mode === 'guided') {
      return state.currentFlow.steps[state.currentFlow.currentStepIndex] || null;
    } else {
      const incompleteStep = state.currentFlow.steps.find(step => !step.completed);
      return incompleteStep || state.currentFlow.steps[0];
    }
  };

  // Complete a step
  const completeStep = (stepId: string, reflection?: string) => {
    if (!state.currentFlow) return;

    const updatedFlow = {
      ...state.currentFlow,
      steps: state.currentFlow.steps.map(step =>
        step.id === stepId
          ? { ...step, completed: true, completedAt: new Date() }
          : step
      )
    };

    // Calculate new streak
    const newStreak = state.completedToday ? state.streak : state.streak + 1;
    const newLongestStreak = Math.max(newStreak, state.longestStreak);

    // Check for new badges
    const newBadges = [...state.badges];
    if (newStreak >= 7 && !newBadges.includes('week-warrior')) {
      newBadges.push('week-warrior');
    }
    if (newStreak >= 21 && !newBadges.includes('truth-seeker')) {
      newBadges.push('truth-seeker');
    }

    const newState = {
      ...state,
      currentFlow: {
        ...updatedFlow,
        currentStepIndex: state.mode === 'guided' 
          ? Math.min(updatedFlow.currentStepIndex + 1, updatedFlow.steps.length - 1)
          : updatedFlow.currentStepIndex
      },
      streak: newStreak,
      longestStreak: newLongestStreak,
      completedToday: true,
      badges: newBadges,
      eveningReflection: reflection || state.eveningReflection
    };

    saveState(newState);
  };

  // Get progress to next badge
  const getProgressToNextBadge = () => {
    const { streak } = state;
    
    if (streak < 7) {
      return { current: streak, needed: 7, badgeName: 'Week Warrior' };
    } else if (streak < 21) {
      return { current: streak, needed: 21, badgeName: 'Truth Seeker' };
    } else if (streak < 100) {
      return { current: streak, needed: 100, badgeName: 'Awakening Master' };
    }
    
    return null;
  };

  const setMode = (mode: DailyMode) => {
    saveState({ ...state, mode });
  };

  const setMorningPrompt = (prompt: string) => {
    saveState({ ...state, morningPrompt: prompt });
  };

  const setEveningReflection = (reflection: string) => {
    saveState({ ...state, eveningReflection: reflection });
  };

  const resetDaily = () => {
    saveState({
      ...state,
      completedToday: false,
      morningPrompt: null,
      eveningReflection: null
    });
  };

  // Update today's step when state changes
  useEffect(() => {
    const todaysStep = getTodaysStep();
    if (todaysStep !== state.todaysStep) {
      setState(prev => ({ ...prev, todaysStep }));
    }
  }, [state.currentFlow, state.mode]);

  return (
    <DailyRoutineContext.Provider value={{
      state,
      setMode,
      completeStep,
      getTodaysStep,
      getProgressToNextBadge,
      setMorningPrompt,
      setEveningReflection,
      resetDaily
    }}>
      {children}
    </DailyRoutineContext.Provider>
  );
};

export const useDailyRoutine = () => {
  const context = useContext(DailyRoutineContext);
  if (context === undefined) {
    throw new Error('useDailyRoutine must be used within a DailyRoutineProvider');
  }
  return context;
};