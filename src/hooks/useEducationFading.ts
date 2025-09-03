import { useTaoFlowProgress } from './useTaoFlowProgress';

/**
 * Hook to determine if educational content should fade for experienced users
 */
export const useEducationFading = () => {
  const { progress, shouldFadeEducation, getCombinedProgress } = useTaoFlowProgress();
  const combinedProgress = getCombinedProgress();

  /**
   * Check if help text should be shown for a specific module
   */
  const shouldShowHelp = (modulePath: string, defaultShow: boolean = true): boolean => {
    // Always show help for new users
    if (combinedProgress.sessionsCompleted < 3) {
      return defaultShow;
    }

    // Check if education should fade for this specific module
    return !shouldFadeEducation(modulePath) && defaultShow;
  };

  /**
   * Check if detailed instructions should be shown
   */
  const shouldShowInstructions = (level: 'basic' | 'intermediate' | 'advanced' = 'basic'): boolean => {
    const sessionCount = combinedProgress.sessionsCompleted;
    
    switch (level) {
      case 'basic':
        return sessionCount < 5;
      case 'intermediate':
        return sessionCount < 10;
      case 'advanced':
        return sessionCount < 20;
      default:
        return true;
    }
  };

  /**
   * Check if tooltips should be shown
   */
  const shouldShowTooltips = (): boolean => {
    return combinedProgress.sessionsCompleted < 7;
  };

  /**
   * Get the appropriate help level based on user experience
   */
  const getHelpLevel = (): 'full' | 'minimal' | 'none' => {
    const sessionCount = combinedProgress.sessionsCompleted;
    
    if (sessionCount < 3) return 'full';
    if (sessionCount < 10) return 'minimal';
    return 'none';
  };

  /**
   * Check if onboarding hints should be shown
   */
  const shouldShowOnboardingHints = (): boolean => {
    return combinedProgress.sessionsCompleted < 2;
  };

  return {
    shouldShowHelp,
    shouldShowInstructions,
    shouldShowTooltips,
    shouldShowOnboardingHints,
    getHelpLevel,
    userExperience: {
      isNewUser: combinedProgress.sessionsCompleted < 3,
      isIntermediateUser: combinedProgress.sessionsCompleted >= 3 && combinedProgress.sessionsCompleted < 10,
      isAdvancedUser: combinedProgress.sessionsCompleted >= 10,
      sessionCount: combinedProgress.sessionsCompleted
    }
  };
};