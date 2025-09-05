import React, { useState } from 'react';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { OnboardingFlow } from '@/components/Onboarding/OnboardingFlow';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface OnboardingCheckerProps {
  children: React.ReactNode;
}

export const OnboardingChecker: React.FC<OnboardingCheckerProps> = ({ children }) => {
  const { data: onboardingStatus, isLoading } = useOnboardingStatus();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show loading while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show onboarding if not completed
  if (onboardingStatus && !onboardingStatus.completed) {
    return (
      <OnboardingFlow
        isVisible={true}
        onComplete={() => {
          setShowOnboarding(false);
          // Invalidate queries to refresh data instead of page reload
          // This will be handled by React Query's invalidation
        }}
      />
    );
  }

  // Show main app
  return <>{children}</>;
};