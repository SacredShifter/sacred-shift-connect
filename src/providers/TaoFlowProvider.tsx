import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProgressTracker } from '@/hooks/useProgressTracker';
import { getUnlockedModules, isModuleUnlocked } from '@/config/TaoFlowController';
import { TaoModule, TaoStage } from '@/config/taoFlowConfig';

interface TaoProgress {
  // Core milestones from database events
  breathSessions: number;
  journalEntries: number;
  meditationMinutes: number;
  circleParticipation: number;
  codeEntries: number;
  
  // Derived states
  currentStage: TaoStage;
  completedModules: Set<string>;
  lastEngagement: Date;
}

interface TaoFlowContextType {
  progress: TaoProgress;
  isModuleUnlocked: (modulePath: string) => boolean;
  getUnlockedModulesForStage: (stage: TaoStage) => TaoModule[];
  getAllUnlockedModules: () => TaoModule[];
  updateProgress: (updates: Partial<TaoProgress>) => void;
  getCurrentStage: () => TaoStage;
  loading: boolean;
}

const TaoFlowContext = createContext<TaoFlowContextType | undefined>(undefined);

interface TaoFlowProviderProps {
  children: ReactNode;
}

export const TaoFlowProvider: React.FC<TaoFlowProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [progress, setProgress] = useState<TaoProgress>({
    breathSessions: 0,
    journalEntries: 0,
    meditationMinutes: 0,
    circleParticipation: 0,
    codeEntries: 0,
    currentStage: 'wuWei',
    completedModules: new Set(),
    lastEngagement: new Date()
  });

  // Load initial progress from localStorage
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`tao-flow-progress-${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProgress({
            ...parsed,
            completedModules: new Set(parsed.completedModules),
            lastEngagement: new Date(parsed.lastEngagement)
          });
        } catch (error) {
          console.warn('Failed to parse Tao Flow progress:', error);
        }
      }
      setLoading(false);
    }
  }, [user?.id]);

  // Save progress to localStorage whenever it changes
  const saveProgress = (newProgress: TaoProgress) => {
    if (user?.id) {
      const toSave = {
        ...newProgress,
        completedModules: Array.from(newProgress.completedModules),
        lastEngagement: newProgress.lastEngagement.toISOString()
      };
      localStorage.setItem(`tao-flow-progress-${user.id}`, JSON.stringify(toSave));
    }
    setProgress(newProgress);
  };

  // Progress tracker integration
  useProgressTracker((progressUpdates) => {
    const newProgress = {
      ...progress,
      ...progressUpdates,
      lastEngagement: new Date()
    };
    
    // Determine current stage based on progress
    newProgress.currentStage = getCurrentStageFromProgress(newProgress);
    
    saveProgress(newProgress);
  });

  // Helper to determine current stage based on progress
  const getCurrentStageFromProgress = (prog: TaoProgress): TaoStage => {
    if (prog.breathSessions >= 21 || prog.circleParticipation >= 3) {
      return 'returnToSilence';
    } else if (prog.journalEntries >= 7 || prog.meditationMinutes >= 300) {
      return 'advancedCeremony';
    } else if (prog.breathSessions >= 3 || prog.journalEntries >= 3) {
      return 'yinYang';
    }
    return 'wuWei';
  };

  // API methods - EVERYTHING IS UNLOCKED NOW
  const isUnlocked = (modulePath: string): boolean => {
    return true; // No more restrictions!
  };

  const getUnlockedModulesForStage = (stage: TaoStage): TaoModule[] => {
    // Return ALL modules for the stage - no restrictions
    return getUnlockedModules(stage, { ...progress, breathSessions: 999, journalEntries: 999, meditationMinutes: 999, circleParticipation: 999, codeEntries: 999 });
  };

  const getAllUnlockedModules = (): TaoModule[] => {
    const stages: TaoStage[] = ['wuWei', 'yinYang', 'advancedCeremony', 'returnToSilence'];
    // Return ALL modules from all stages - complete freedom
    return stages.flatMap(stage => getUnlockedModules(stage, { ...progress, breathSessions: 999, journalEntries: 999, meditationMinutes: 999, circleParticipation: 999, codeEntries: 999 }));
  };

  const updateProgress = (updates: Partial<TaoProgress>) => {
    const newProgress = { ...progress, ...updates, lastEngagement: new Date() };
    newProgress.currentStage = getCurrentStageFromProgress(newProgress);
    saveProgress(newProgress);
  };

  const getCurrentStage = (): TaoStage => {
    return progress.currentStage;
  };

  const value: TaoFlowContextType = {
    progress,
    isModuleUnlocked: isUnlocked,
    getUnlockedModulesForStage,
    getAllUnlockedModules,
    updateProgress,
    getCurrentStage,
    loading
  };

  return (
    <TaoFlowContext.Provider value={value}>
      {children}
    </TaoFlowContext.Provider>
  );
};

export const useTaoFlow = (): TaoFlowContextType => {
  const context = useContext(TaoFlowContext);
  if (!context) {
    throw new Error('useTaoFlow must be used within a TaoFlowProvider');
  }
  return context;
};