import { useTaoFlow } from '@/providers/TaoFlowProvider';
import { useTeachingProgress } from './useTeachingProgress';

/**
 * Combined hook that provides both Tao Flow progress and Teaching progress
 * This bridges the existing teaching system with the new Tao Flow system
 */
export const useTaoFlowProgress = () => {
  const taoFlow = useTaoFlow();
  const teaching = useTeachingProgress();

  // Mark a module as completed in both systems
  const markModuleCompleted = (modulePath: string) => {
    // Update Tao Flow system
    const updatedModules = new Set(taoFlow.progress.completedModules);
    updatedModules.add(modulePath);
    taoFlow.updateProgress({ completedModules: updatedModules });

    // Update teaching system
    const moduleId = modulePath.replace('/', ''); // Convert path to module ID
    teaching.recordEngagement(moduleId, teaching.progress.preferredLens);
  };

  // Record a practice session in both systems
  const recordPracticeSession = (sessionType: 'breath' | 'meditation' | 'journal') => {
    // Update teaching system
    teaching.recordSession();

    // Update Tao Flow system based on session type
    switch (sessionType) {
      case 'breath':
        taoFlow.updateProgress({ 
          breathSessions: taoFlow.progress.breathSessions + 1 
        });
        break;
      case 'meditation':
        // Meditation sessions are tracked via database, so this will be updated by useProgressTracker
        break;
      case 'journal':
        // Journal entries are tracked via database, so this will be updated by useProgressTracker
        break;
    }
  };

  // Get combined progress overview
  const getCombinedProgress = () => {
    const taoStage = taoFlow.getCurrentStage();
    const teachingStage = teaching.getInitiationStage();
    const unlockedModules = taoFlow.getAllUnlockedModules();

    return {
      // Tao Flow progress
      taoStage,
      unlockedModulesCount: unlockedModules.length,
      completedModulesCount: taoFlow.progress.completedModules.size,
      
      // Teaching progress
      teachingLevel: teachingStage.level,
      teachingTitle: teachingStage.title,
      sessionsCompleted: teaching.progress.sessionsCompleted,
      
      // Combined metrics
      totalPractices: taoFlow.progress.breathSessions + 
                     Math.floor(taoFlow.progress.meditationMinutes / 10) + // Convert minutes to session equivalents
                     taoFlow.progress.journalEntries,
      
      // Progress indicators
      nextUnlock: teaching.getProgressToNextUnlock(),
      suggestedModules: unlockedModules.slice(0, 3) // Next 3 available modules
    };
  };

  // Check if education should fade for a module
  const shouldFadeEducation = (modulePath: string): boolean => {
    const module = taoFlow.getAllUnlockedModules().find(m => m.path === modulePath);
    if (!module || !module.fadeEducation) return false;

    // Fade education after user has engaged multiple times
    const engagementCount = taoFlow.progress.completedModules.has(modulePath) ? 1 : 0;
    const totalSessions = teaching.progress.sessionsCompleted;
    
    // Fade when user is experienced (7+ sessions) and has used this module
    return totalSessions >= 7 && engagementCount > 0;
  };

  return {
    // Tao Flow methods
    ...taoFlow,
    
    // Teaching methods
    teaching,
    
    // Combined methods
    markModuleCompleted,
    recordPracticeSession,
    getCombinedProgress,
    shouldFadeEducation,
    
    // Quick access to key states
    currentStage: taoFlow.getCurrentStage(),
    teachingStage: teaching.getInitiationStage(),
    isLoading: taoFlow.loading
  };
};