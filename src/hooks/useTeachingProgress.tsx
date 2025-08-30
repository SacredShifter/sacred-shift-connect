import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TeachingProgress {
  sessionsCompleted: number;
  engagedModules: Set<string>;
  preferredLens: 'scientific' | 'metaphysical' | 'esoteric';
  lastEngagement: Date;
}

interface UnlockedTiers {
  scientific: boolean;
  metaphysical: boolean;
  esoteric: boolean;
}

export const useTeachingProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<TeachingProgress>({
    sessionsCompleted: 0,
    engagedModules: new Set(),
    preferredLens: 'scientific',
    lastEngagement: new Date()
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`teaching-progress-${user.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProgress({
            ...parsed,
            engagedModules: new Set(parsed.engagedModules),
            lastEngagement: new Date(parsed.lastEngagement)
          });
        } catch (error) {
          console.warn('Failed to parse teaching progress:', error);
        }
      }
    }
  }, [user?.id]);

  // Save progress to localStorage whenever it changes
  const saveProgress = (newProgress: TeachingProgress) => {
    if (user?.id) {
      const toSave = {
        ...newProgress,
        engagedModules: Array.from(newProgress.engagedModules),
        lastEngagement: newProgress.lastEngagement.toISOString()
      };
      localStorage.setItem(`teaching-progress-${user.id}`, JSON.stringify(toSave));
    }
    setProgress(newProgress);
  };

  // Record when user completes a meditation/practice session
  const recordSession = () => {
    const newProgress = {
      ...progress,
      sessionsCompleted: progress.sessionsCompleted + 1,
      lastEngagement: new Date()
    };
    saveProgress(newProgress);
  };

  // Record when user engages with teaching content
  const recordEngagement = (
    moduleId: string, 
    lens: 'scientific' | 'metaphysical' | 'esoteric'
  ) => {
    const newEngagedModules = new Set(progress.engagedModules);
    newEngagedModules.add(moduleId);
    
    const newProgress = {
      ...progress,
      engagedModules: newEngagedModules,
      preferredLens: lens, // Remember their last choice
      lastEngagement: new Date()
    };
    saveProgress(newProgress);
  };

  // Determine which tiers are unlocked based on progress
  const getUnlockedTiers = (): UnlockedTiers => {
    return {
      scientific: true, // Always available
      metaphysical: progress.sessionsCompleted >= 1, // Unlocked after first session
      esoteric: progress.sessionsCompleted >= 7 // Unlocked after 7+ sessions
    };
  };

  // Get progress towards next unlock
  const getProgressToNextUnlock = () => {
    const unlocked = getUnlockedTiers();
    
    if (!unlocked.metaphysical) {
      return {
        current: progress.sessionsCompleted,
        needed: 1,
        nextTier: 'metaphysical' as const,
        description: 'Complete your first practice to unlock Metaphysical teachings'
      };
    }
    
    if (!unlocked.esoteric) {
      return {
        current: progress.sessionsCompleted,
        needed: 7,
        nextTier: 'esoteric' as const,
        description: 'Complete 7 practices to unlock Esoteric teachings'
      };
    }
    
    return null; // All tiers unlocked
  };

  // Get teaching engagement stats
  const getEngagementStats = () => {
    return {
      totalSessions: progress.sessionsCompleted,
      engagedModules: progress.engagedModules.size,
      preferredLens: progress.preferredLens,
      lastActivity: progress.lastEngagement,
      unlockedTiers: getUnlockedTiers()
    };
  };

  return {
    progress,
    recordSession,
    recordEngagement,
    getUnlockedTiers,
    getProgressToNextUnlock,
    getEngagementStats
  };
};