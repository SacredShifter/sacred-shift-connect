import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { OnboardingChecker } from '@/components/OnboardingChecker';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePreReleaseAccess } from '@/hooks/usePreReleaseAccess';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAccess, loading: preReleaseLoading, portalOpen } = usePreReleaseAccess();
  
  const loading = authLoading || preReleaseLoading;
  
  logger.debug('ProtectedRoute state check', {
    component: 'ProtectedRoute',
    userId: user?.id,
    metadata: { loading, hasUser: !!user, hasAccess, portalOpen }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  // Check pre-release access unless portal is open
  if (!portalOpen && !hasAccess) {
    return <Navigate to="/portal" replace />;
  }

  // Wrap authenticated routes with onboarding checker
  return (
    <OnboardingChecker>
      {children}
    </OnboardingChecker>
  );
};

export default ProtectedRoute;