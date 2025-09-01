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

  // Determine which tiers are unlocked based on sacred initiation progress
  const getUnlockedTiers = (): UnlockedTiers => {
    return {
      scientific: true, // Always available - The Seeker's foundation
      metaphysical: progress.sessionsCompleted >= 1, // The Experiencer - After first sacred practice
      esoteric: progress.sessionsCompleted >= 7 // The Initiate - After proving dedication through practice
    };
  };

  // Get initiation stage based on progress
  const getInitiationStage = () => {
    const sessions = progress.sessionsCompleted;
    if (sessions >= 21) return { name: 'The Adept', level: 4, title: 'Master of Sacred Arts' };
    if (sessions >= 7) return { name: 'The Initiate', level: 3, title: 'Keeper of Sacred Mysteries' };
    if (sessions >= 1) return { name: 'The Experiencer', level: 2, title: 'Awakening to Energy' };
    return { name: 'The Seeker', level: 1, title: 'Foundation of Understanding' };
  };

  // Get progress towards next sacred initiation
  const getProgressToNextUnlock = () => {
    const unlocked = getUnlockedTiers();
    const sessions = progress.sessionsCompleted;
    
    if (!unlocked.metaphysical) {
      return {
        current: sessions,
        needed: 1,
        nextTier: 'metaphysical' as const,
        description: 'Begin your first sacred practice to awaken as The Experiencer'
      };
    }
    
    if (!unlocked.esoteric) {
      return {
        current: sessions,
        needed: 7,
        nextTier: 'esoteric' as const,
        description: 'Complete 7 practices to be initiated as Keeper of Sacred Mysteries'
      };
    }

    if (sessions < 21) {
      return {
        current: sessions,
        needed: 21,
        nextTier: 'adept' as const,
        description: 'Master 21 practices to achieve Adepthood - Master of Sacred Arts'
      };
    }
    
    return null; // All initiations completed
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
    getEngagementStats,
    getInitiationStage
  };
};