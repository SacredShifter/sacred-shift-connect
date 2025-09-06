import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
  sensorFlow?: boolean; // Indicates if this step has biometric sensor integration
  component?: string; // Component to render for this step
}

export interface DailyFlow {
  id: string;
  name: string;
  description: string;
  currentStepIndex: number;
  steps: DailyStep[];
}

export interface DailyRoutineState {
  mode: 'guided' | 'free';
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
  getTodaysStep: () => DailyStep | null;
  completeStep: (stepId: string, reflection?: string) => void;
  setMode: (mode: 'guided' | 'free') => void;
  resetFlow: () => void;
  getProgress: () => { completed: number; total: number; percentage: number };
  getStreakData: () => { current: number; longest: number; days: number[] };
}

const DailyRoutineContext = createContext<DailyRoutineContextType | undefined>(undefined);

// Sacred Flow Data - Evidence-Based, Awakening-Safe Daily Rituals
const SACRED_FLOW: DailyFlow = {
  id: 'sacred-awakening-flow',
  name: 'Sacred Awakening Flow',
  description: 'Science-backed daily rituals for safe consciousness evolution with measurable results',
  currentStepIndex: 0,
  steps: [
    {
      id: 'baseline-scan',
      title: 'Baseline Scan',
      description: 'Data-driven self-awareness check',
      why: 'Awakening destabilizes the nervous system. A baseline scan shows you where you actually are (stress, calm, scattered). Tracking state over time helps you see your evolution in hard data. No guesswork, just measurable reality.',
      practice: 'Rate your current state 1-10 across: Mood, Energy, Clarity, Stress. Optional: Let the app capture HRV/breath rate if hardware available. Takes 30 seconds. Data auto-saved to your evolution timeline.',
      timeOfDay: 'morning',
      estimatedMinutes: 1,
      completed: false,
      sensorFlow: true,
      component: 'BaselineScanFlow'
    },
    {
      id: 'micro-reset',
      title: 'Micro-Reset',
      description: '60-second nervous system safety switch',
      why: 'Awakening often comes with overwhelm. Micro-resets train your nervous system to return to balance fast. Based on polyvagal theory - you can literally shift from fight/flight to rest/digest in under a minute with proper breathing.',
      practice: 'Guided 4-4-4-4 breath cycle. App runs timer with visual cues. Inhale 4, hold 4, exhale 4, hold 4. Repeat for 60 seconds. Notice heart rate drop, clearer head. No belief required - it\'s physiology.',
      timeOfDay: 'anytime',
      estimatedMinutes: 1,
      completed: false
    },
    {
      id: 'resonance-drop',
      title: 'Resonance Drop',
      description: 'Instant state shift through frequency entrainment',
      why: 'Frequencies + fractals can shift brainwave states and give real-time "proof of shift." 432Hz activates parasympathetic nervous system. 528Hz increases cellular coherence. Fractals reduce stress by 60% in studies. No spirituality needed - it\'s neuroscience.',
      practice: 'Press play → app delivers 1-3 min tone (432Hz, 528Hz) or fractal visual sequence. Focus on the pattern. Notice slight change in perception (relaxation, clarity, energy). This is brainwave entrainment, not belief.',
      timeOfDay: 'anytime',
      estimatedMinutes: 3,
      completed: false
    },
    {
      id: 'fragment-capture',
      title: 'Fragment Capture',
      description: 'Capture insights before they slip away',
      why: 'Awakening produces floods of insights. Capturing even a single word/image prevents them from slipping away and builds a timeline of your evolution. Memory consolidation requires active encoding - insights without capture are lost forever.',
      practice: 'Type one word, speak one sentence, or snap one photo. That\'s it. Stored in Mirror Journal + linked into collective mesh. No pressure to be profound - just capture what\'s real right now.',
      timeOfDay: 'anytime',
      estimatedMinutes: 1,
      completed: false
    },
    {
      id: 'seal-close',
      title: 'Seal / Close',
      description: 'Daily safety anchor for better sleep',
      why: 'Completion signals safety to the brain. Without closure, awakening can feel endless and raw. The brain needs clear boundaries between active processing and rest. This ritual creates a neurobiological "day is done" signal.',
      practice: 'One swipe or tap to "seal field." Aura verifies completion. Visual confirmation that today\'s processing is complete. Brain recognizes the day is closed → better sleep, less looping thoughts.',
      timeOfDay: 'evening',
      estimatedMinutes: 1,
      completed: false
    }
  ]
};

export const DailyRoutineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<DailyRoutineState>({
    mode: 'guided',
    currentFlow: SACRED_FLOW,
    todaysStep: null,
    streak: 0,
    longestStreak: 0,
    completedToday: false,
    morningPrompt: null,
    eveningReflection: null,
    badges: []
  });

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
            currentFlow: SACRED_FLOW // Always use fresh flow data
          }));
          console.log('Loaded SACRED_FLOW:', SACRED_FLOW.steps[0]);
        } catch (error) {
          console.warn('Failed to parse daily routine state:', error);
        }
      }
    }
  }, [user?.id]);

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

  // Get today's step based on mode and progress
  const getTodaysStep = (): DailyStep | null => {
    if (!state.currentFlow) return null;
    
    if (state.mode === 'guided') {
      const step = state.currentFlow.steps[state.currentFlow.currentStepIndex] || null;
      console.log('Guided mode - current step:', step, 'sensorFlow:', step?.sensorFlow);
      return step;
    } else {
      // Free mode: suggest next incomplete step or first step
      const incompleteStep = state.currentFlow.steps.find(step => !step.completed);
      const step = incompleteStep || state.currentFlow.steps[0];
      console.log('Free mode - current step:', step, 'sensorFlow:', step?.sensorFlow);
      return step;
    }
  };

  // Complete a step
  const completeStep = (stepId: string, reflection?: string) => {
    if (!state.currentFlow) return;

    const updatedSteps = state.currentFlow.steps.map(step => 
      step.id === stepId 
        ? { ...step, completed: true, completedAt: new Date() }
        : step
    );

    const updatedFlow = {
      ...state.currentFlow,
      steps: updatedSteps,
      currentStepIndex: state.mode === 'guided' 
        ? Math.min(state.currentFlow.currentStepIndex + 1, updatedSteps.length - 1)
        : state.currentFlow.currentStepIndex
    };

    const newState = {
      ...state,
      currentFlow: updatedFlow,
      todaysStep: getTodaysStep(),
      completedToday: true,
      streak: state.streak + 1,
      longestStreak: Math.max(state.longestStreak, state.streak + 1),
      eveningReflection: reflection || state.eveningReflection
    };

    saveState(newState);
  };

  // Set mode
  const setMode = (mode: 'guided' | 'free') => {
    const newState = { ...state, mode };
    saveState(newState);
  };

  // Reset flow
  const resetFlow = () => {
    const resetFlow = {
      ...SACRED_FLOW,
      steps: SACRED_FLOW.steps.map(step => ({ ...step, completed: false, completedAt: undefined }))
    };

    const newState = {
      ...state,
      currentFlow: resetFlow,
      currentStepIndex: 0,
      todaysStep: resetFlow.steps[0],
      streak: 0,
      completedToday: false,
      morningPrompt: null,
      eveningReflection: null,
      badges: []
    };

    saveState(newState);
  };

  // Get progress
  const getProgress = () => {
    if (!state.currentFlow) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = state.currentFlow.steps.filter(step => step.completed).length;
    const total = state.currentFlow.steps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Get streak data
  const getStreakData = () => {
    return {
      current: state.streak,
      longest: state.longestStreak,
      days: [] // TODO: Implement day tracking
    };
  };

  // Update todaysStep when state changes
  useEffect(() => {
    const todaysStep = getTodaysStep();
    if (todaysStep !== state.todaysStep) {
      setState(prev => ({ ...prev, todaysStep }));
    }
  }, [state.currentFlow, state.mode]);

  const value: DailyRoutineContextType = {
    state,
    getTodaysStep,
    completeStep,
    setMode,
    resetFlow,
    getProgress,
    getStreakData
  };

  return (
    <DailyRoutineContext.Provider value={value}>
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